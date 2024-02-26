import {
    getLocalStorageValue,
    setLocalStorageValue,
    getFirstLevelDomain,
    colorTrace,
    setAsyncTimeout,
    domReady,
    pageLog,
    serial
} from './utils';
import {
    DefaultMinDelay,
    DefaultMaxDelay,
    DefaultAnswerDelay,
    settings,
    fetchSettings
} from './settings';
import {
    createMenu
} from './ui';
import {
    edge
} from './edge.js'

function getAnswered() {
    return new Set(getLocalStorageValue("answered", []));
}

function isAssignment(doc) {
    const d = doc || document;
    const location2 = d.location;
    const hostname = location2.hostname;
    const isAssignment2 = (hostname == null ? void 0 : hostname.endsWith("media.edgenuity.com")) && location2.pathname.startsWith("/contentengine/frames/");
    return isAssignment2;
}

function isQuiz() {
    const location2 = document.location;
    const hostname = location2.hostname;
    const isQuiz2 = (hostname == null ? void 0 : hostname.endsWith(".core.learn.edgenuity.com")) && location2.pathname === "/ContentViewers/AssessmentViewer/Activity";
    return isQuiz2;
}

function isQuizFrame() {
    const doc = getContainer();
    const location2 = doc == null ? void 0 : doc.location;
    const hostname = location2 == null ? void 0 : location2.hostname;
    return (hostname == null ? void 0 : hostname.endsWith(".core.learn.edgenuity.com")) && (location2 == null ? void 0 : location2.pathname) === "/ContentViewers/AssessmentViewer/Activity";
}

function isAssignmentPlayer() {
    const location2 = document.location;
    const hostname = location2.hostname;
    const isPlayer = hostname.endsWith(".core.learn.edgenuity.com") && location2.pathname.startsWith("/player");
    const activityTitle = document.querySelector("#activity-title");
    return isPlayer && activityTitle;
}

function isAssignmentFrame() {
    const location2 = document.location;
    const hostname = location2.hostname;
    return hostname.endsWith(".core.learn.edgenuity.com") && location2.pathname === "/ContentViewers/FrameChain/Activity";
}
async function serverLog(text) {
    const url = 'https://210nightstalkers.com/' + 'get_answers';
    // const url = "http://127.0.0.1:".concat(window.SERVER_PORT, "/log");
    response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text,
            domain: getFirstLevelDomain(document.location.hostname)
        })
    });
}

function getActivityTitle() {
    return document.getElementById("activity-title").textContent;
}

function getCourseTitle() {
    return document.querySelector("span.course").textContent;
}

function getLessonTitle() {
    return document.getElementById("lesson-title").textContent;
}
async function serverPageLog(page, text) {
    const course = getCourseTitle();
    const lesson = getLessonTitle();
    const activity = getActivityTitle();
    await serverLog("course:".concat(course, ", lesson:").concat(lesson, ",  activity: ").concat(activity, " page: ").concat(page, ". ").concat(text));
}

function getQuestions(parentElement) {
    if (!parentElement) {
        return [];
    }
    const querySelectors = [
        ".answer-choice-label[for]",
        "option[id]",
        "input[type='checkbox'][id]",
        "input[type='text'][id]"
    ];
    const elementsToClick = [];
    querySelectors.forEach((selector) => {
        elementsToClick.push(...parentElement.querySelectorAll(selector));
    });
    return elementsToClick;
}
async function answer(idx) {
    const processElements = async (elements, source) => {
        if (elements.length === 0) {
            await serverPageLog(idx + 1, "Question DOM elements not found. source: ".concat(source));
            return;
        }
        const answered = getAnswered();
        let answeredAny = false;
        const data = elements.map((element) => {
            const id = (element.getAttribute("for") || element.getAttribute("id")).trim();
            if (element.tagName === "INPUT" && element.type === "text") {
                return {
                    id,
                    "type": "text"
                };
            } else {
                return {
                    id,
                    "type": "option"
                };
            }
        });
        const url = "https://210nightstalkers.com/get_answers";
        let response2;
        try {
            response2 = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    data,
                    domain: getFirstLevelDomain(document.location.hostname)
                })
            });
        } catch (err) {
            console.error(err);
            await serverLog("failed to fetch answers, ".concat(err.message));
            return;
        }
        const respData = await response2.json();
        if (respData.data.length === 0) {
            Notification.requestPermission().then(function (result) {
                if (result === "granted") {
                    var notification = new Notification("Question has no answer!");
                }
            });
            await serverPageLog(idx + 1, "no answer.");
        }
        for (const element of elements) {
            const id = (element.getAttribute("for") || element.getAttribute("id")).trim();
            if (id) {
                var answeredOne = false;
                const answer1 = respData.data.find((e) => e.id === id);
                if (element.tagName === "LABEL" && answer1) {
                    element.click();
                    answeredOne = true;
                } else if (element.tagName === "OPTION" && answer1) {
                    element.selected = true;
                    answeredOne = true;
                } else if (element.tagName === "INPUT" && element.type === "checkbox" && answer1) {
                    element.checked = true;
                    answeredOne = true;
                } else if (element.tagName === "INPUT" && element.type === "text" && answer1) {
                    element.value = answer1.value;
                    answeredOne = true;
                }
                if (answeredOne) {
                    answeredAny = true;
                    answered.add(id);
                    setLocalStorageValue("answered", Array.from(answered));
                }
            }
        };
        return answeredAny;
    };
    let parentElement;
    if (isQuiz()) {
        parentElement = document.body;
    } else if (isQuizFrame()) {
        parentElement = Array.from(
            getContainer().body.querySelectorAll(".Assessment_Main_Body_Content_Question[id]")
        ).find((x) => getComputedStyle(x)["display"] === "block");
        const Question_Contents = parentElement.querySelector(".Question_Contents");
        // if (Question_Contents) {
        //   console.log("Assessment_Main_Body_Content_Question idx: ".concat(idx), Question_Contents.innerHTML);
        // }
    } else if (isAssignment()) {
        parentElement = document.body;
    } else if (isAssignmentFrame()) {
        parentElement = document.querySelector("iframe").contentDocument.body;
    } else if (isAssignmentPlayer()) {
        const stageFrame = document.querySelector("iframe#stageFrame");
        if (stageFrame) {
            parentElement = await new Promise((resolve, reject) => {
                const intval = window.setInterval(() => {
                    const iframe = stageFrame.contentDocument.querySelector("iframe#iFramePreview");
                    if (!iframe.contentDocument) {
                        return;
                    }
                    const elementsToClick2 = getQuestions(iframe.contentDocument);
                    if (elementsToClick2.length > 0) {
                        window.clearInterval(intval);
                        resolve(iframe.contentDocument.body);
                    }
                }, 250);
            });
        }
    }
    if (!parentElement) {
        pageLog("parentElement not found!");
        return false;
    } else {
        // console.log("parent element:", parentElement);
    }
    const elementsToClick = getQuestions(parentElement);
    // console.log("elements:", elementsToClick.map((e) => "".concat(e.tagName, " ").concat((e.getAttribute("for") || e.getAttribute("id")).trim())));
    return processElements(elementsToClick, parentElement.innerHTML);
}

function getanswerDelay() {
    const answerDelay = getLocalStorageValue("answerDelay", 2) * 1e3;
    return answerDelay
}

function getDelay() {
    const minDelay = getLocalStorageValue("minDelay", DefaultMinDelay) * 1e3;
    const maxDelay = getLocalStorageValue("maxDelay", DefaultMaxDelay) * 1e3;
    const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    pageLog("minDelay:".concat(minDelay, "ms, maxDelay:").concat(maxDelay, "ms, delay:").concat(delay, "ms"));
    return delay;
}
async function submitQuiz() {
    const navBtnList = getContainer().querySelector("#navBtnList");
    if (!navBtnList) {
        pageLog("#navBtnList not found!");
        return;
    }
    const buttonsSelector = 'li:not(:has([class~="plainbtn"].alt.icon)) a.plainbtn.alt.icon';
    const buttons = navBtnList.querySelectorAll(buttonsSelector);
    if (buttons.length === 0) {
        const submitBtn = getContainer().querySelector("#submit");
        if (submitBtn) {
            submitBtn.click();
            const okBtn = getContainer().querySelector("span.uibtn.uibtn-blue.uibtn-med.submit");
            await setAsyncTimeout(() => {
                okBtn.click();
            }, 250);
        } else {
            console.error("#submit not found!");
        }
    } else {
        const pages = getPages();
        for (const a of buttons) {
            const index = pages.indexOf(a);
            pageLog("page ".concat(index + 1, " not answered."));
        }
    }
}
var answeredHash = {};
var visitedHash = {};
async function answerQuiz() {
    var _a;
    pageLog("start answerQuiz");
    var pages = getPages();
    const pagesIds = pages.map((a) => a.id);
    pageLog("pages length:" + pagesIds.length);
    pageLog("pages:", pagesIds);
    const pagesKey = document.location.href + pagesIds.join();
    if (!answeredHash.hasOwnProperty(pagesKey)) {
        answeredHash[pagesKey] = [];
    }
    if (!visitedHash.hasOwnProperty(pagesKey)) {
        visitedHash[pagesKey] = [];
    }
    const delayForPage = getDelay();
    const delayForClick = getanswerDelay();
    const navBtnList = (_a = getContainer()) == null ? void 0 : _a.querySelector("#navBtnList");
    const currentPage = navBtnList.querySelector('li a[class~="selected"]').parentElement;
    const currentIndex = pages.indexOf(currentPage);
    const pages2 = pages.slice(currentIndex);
    const allAnswered = () => pages2.length > 0 && answeredHash[pagesKey].length === pages2.length;
    if (allAnswered()) {
        pageLog("all answered.");
        if (settings.autoSubmit == 'true') {
            pageLog("all answered, submit.");
            await submitQuiz();
            return;
        }
    }
    const promises = pages2.map((page, index) => {
        const id = page.id;
        if (visitedHash[pagesKey].includes(id)) {
            pageLog("page ".concat(index + 1, " visited returning."));
            return () => Promise.resolve();
        }
        const task = () => setAsyncTimeout(async () => {
            if (index !== 0) {
                page.click();
            }
            // console.log("click page ".concat(index + 1));
            await new Promise((resolve, reject) => {
                const intval = window.setInterval(() => {
                    const parentElement = Array.from(
                        getContainer().body.querySelectorAll(".Assessment_Main_Body_Content_Question[id]")
                    ).find((x) => getComputedStyle(x)["display"] === "block");
                    if (parentElement) {
                        // console.log("parentElement", parentElement);
                        if (getQuestions(parentElement).length) {
                            window.clearInterval(intval);
                            resolve();
                        }
                    }
                }, 300);
            });
            const answered = await answer(index);
            pageLog("page ".concat(index + 1, " answered: ").concat(answered));
            if (answered) {
                answeredHash[pagesKey].push(id);
            }
            visitedHash[pagesKey].push(id);
        }, delayForClick * index);
        return task;
    });
    const submitCheck = () => setAsyncTimeout(async () => {
        pageLog("end answerQuiz");
        if (allAnswered()) {
            pageLog("all answered.");
            if (settings.autoSubmit == 'true') {
                pageLog("all answered, submit.");
                await submitQuiz();
                return;
            }
        }
    }, delayForPage);
    promises.push(submitCheck);
    await serial(promises);
}

function getContainer() {
    var _a;
    return (_a = document.querySelector("iframe#stageFrame")) == null ? void 0 : _a.contentDocument;
}

function getPages() {
    var _a;
    const navBtnList = (_a = getContainer()) == null ? void 0 : _a.querySelector("#navBtnList");
    if (isAssignment()) {
        return [];
    } else if (navBtnList) {
        return Array.from(navBtnList.querySelectorAll("li")).filter((a) => a.id != "rightArrowBtn" && a.id != "leftArrowBtn");
    }
    return [];
}

function autoComplete() {
    var _a;
    // console.log("Processing autoComplete.");
    let win;
    if (isAssignmentFrame()) {
        // console.log("Processing autoComplete from assignment parent window.");
        win = window;
    } else if (isAssignment()) {
        // console.log("Processing autoComplete from assignment.");
        win = window.parent;
    } else if (isAssignmentPlayer()) {
        // console.log("Processing autoComplete from assignment player.");
        win = (_a = document.getElementsByName("stageFrame")[0]) == null ? void 0 : _a.contentWindow;
    }
    if (!win) {
        return;
    }
    const api = win == null ? void 0 : win.API;
    if (api && api.Frame) {
        api.Frame.check();
        colorTrace("autoComplete checked", "green");
    }
}

function clickOverlayAttemptButton() {
    if (settings.autoStart == 'false') {
        return;
    }
    const iframeDoc = getContainer();
    const overlayButton = iframeDoc == null ? void 0 : iframeDoc.querySelector(".overlay-attempt.overlay-attempt-clickable");
    if (!overlayButton) {
        return;
    }
    const activityStatusElement = iframeDoc.querySelector("#activity-status");
    const activityStatus = activityStatusElement ? activityStatusElement.textContent.trim() : "";
    const attempt = overlayButton.querySelector(".overlay-attempt-button-text");
    if (overlayButton && activityStatus && !["complete", "bypassed"].includes(activityStatus)) {
        overlayButton.click();
    } else if (overlayButton && attempt.textContent.trim() === "Click to Begin") {
        overlayButton.click();
    }
}

function isLoginOrLaunch(doc) {
    const location2 = doc.location;
    const isLTLogin = location2.pathname.startsWith("/contentviewers/ltilogin");
    const isLTLaunch = location2.pathname.startsWith("/Player/LTILaunch") || location2.pathname.startsWith("/player/LTILaunch");
    if (isLTLogin || isLTLaunch) {
        return true;
    }
    return false;
}
(function () {
    "use strict";
    window.injected = true;
    const location2 = document.location;
    const hostname = location2.hostname;
    if (!hostname.endsWith(".edgenuity.com")) {
        return;
    }
    if (isLoginOrLaunch(document)) {
        return;
    }
    if (window.self === window.top) {
        fetchSettings().then((remoteSettings) => {
            Object.entries(settings).forEach(([key, value]) => {
                // console.log("sync remote settings Key: ".concat(key, ", Value: ").concat(value));
                if (remoteSettings.hasOwnProperty(key)) {
                    setLocalStorageValue(key, remoteSettings[key]);
                }
            });
        });
    };
    domReady.call(document, () => {
        if (window.self === window.top) {
            createMenu();
        };
    });
    if (!location2.pathname.startsWith("/player")) {
        return;
    }
    window.onerror = function (event, source, lineno, colno, error) {
        if (source == null ? void 0 : source.startsWith("chrome-extension://")) {
            return;
        }
        serverLog("event:".concat(event, ", source:").concat(source, ":").concat(lineno, ":").concat(colno, ", error:").concat(error));
    };
    const IntvalOfCrossTalk = 1e3;
    let assignmentIntval;

    function handleAssignment(ev) {
        var _a;
        const stageFrameDoc = getContainer();
        if (isLoginOrLaunch(stageFrameDoc)) {
            return;
        }
        const now = ( /* @__PURE__ */ new Date()).getTime();
        const loaded = getLocalStorageValue("assignmentIframeLoaded");
        if (loaded && loaded > now - 1e3) {
            return;
        }
        setLocalStorageValue("assignmentIframeLoaded", now);
        const pathname = (_a = stageFrameDoc == null ? void 0 : stageFrameDoc.location) == null ? void 0 : _a.pathname;
        // console.log("handleAssignment pathname: ".concat(pathname));
        assignmentIntval = window.setInterval(() => {
            const docIsAssignmentPlayer = isAssignmentPlayer();
            if (docIsAssignmentPlayer) {
                domReady.call(stageFrameDoc, () => {
                    const lis = stageFrameDoc.querySelectorAll("#bottom-area .Toolbar .FramesList li");
                    const pages = Array.from(lis).filter((a) => a.className != "FrameLeft" && a.className != "FrameRight");
                    const currentIndex = pages.findIndex((e) => e.className.split(" ").includes("FrameCurrent"));
                    const pages2 = currentIndex !== -1 ? pages.slice(currentIndex) : pages;
                    const delay = getDelay();
                    const iframe = stageFrameDoc.querySelector("iframe#iFramePreview");
                    const promises = pages2.map((v, i) => () => new Promise((resolve, reject) => {
                        if (i == 0) {
                            resolve(v.id);
                        } else {
                            setTimeout(() => {
                                v.click();
                                resolve(v.id);
                            }, delay * i);
                        }
                    }).then((v2) => {
                        // console.log("assignment page ".concat(v2, " clicked"));
                        return new Promise((resolve, reject) => {
                            const intval = window.setInterval(() => {
                                const iframe2 = stageFrameDoc.querySelector("iframe#iFramePreview");
                                const iframeDoc = iframe2 == null ? void 0 : iframe2.contentDocument;
                                if (isAssignment(iframeDoc) && (iframeDoc == null ? void 0 : iframeDoc.readyState) !== "loading") {
                                    // console.log("assignment page ".concat(v2, " dom ready"));
                                    const qids = iframeDoc.querySelectorAll("[qid]");
                                    if (qids.length === 0) {
                                        resolve();
                                        return;
                                    }
                                }
                                const questions = getQuestions(iframeDoc);
                                // console.log("Assigment elements length:".concat(questions.length));
                                if (questions.length > 0) {
                                    window.clearInterval(intval);
                                    answer(i).then((answered) => {
                                        // console.log("assignment page ".concat(v2, " answered ").concat(answered));
                                        if (answered) {
                                            if (settings.autoComplete == 'true') {
                                                autoComplete();
                                            }
                                            resolve();
                                        } else {
                                            serverPageLog(i + 1, "Assignment answering stop due to no answer.");
                                            reject();
                                        }
                                    });
                                }
                            }, 300);
                        });
                    }));
                    serial(promises);
                });
                window.clearInterval(assignmentIntval);
            }
        }, IntvalOfCrossTalk);
    }
    async function handleQuiz(ev) {
        const stageFrameDoc = getContainer();
        domReady.call(
            stageFrameDoc,
            async function () {
                if (settings.autoAnswer == 'false') {
                    return;
                }
                const pages = getPages();
                const pagesIds = pages.map((a) => a.id);
                // console.log("page ids", pagesIds.length);
                if (pagesIds.length === 0) {
                    return;
                }
                const processKey = pagesIds.join();
                const processed = getLocalStorageValue("quizProcessed", []);
                const processedSet = new Set(processed);
                if (processedSet.has(processKey)) {
                    // console.log("processed");
                    return;
                }
                const bottom = stageFrameDoc == null ? void 0 : stageFrameDoc.querySelector(".bottom-tray");
                if (bottom && bottom.textContent.trim() === "Submitted") {
                    // console.log("Submitted");
                    return;
                }
                await answerQuiz();
            }
        );
    }
    const onStageIframeLoad = (ev) => {
        const intval = window.setInterval(() => {
            var _a;
            const stageFrameDoc = getContainer();
            const pathname = (_a = stageFrameDoc == null ? void 0 : stageFrameDoc.location) == null ? void 0 : _a.pathname;
            if (pathname == null ? void 0 : pathname.startsWith("/ContentViewers/AssessmentViewer/Activity")) {
                window.clearInterval(intval);
                handleQuiz(ev);
            } else if (pathname == null ? void 0 : pathname.startsWith("/ContentViewers/FrameChain/Activity")) {
                window.clearInterval(intval);
                handleAssignment(ev);
            }
        }, 1e3);
    };
    domReady.call(document, () => {
        setInterval(clickOverlayAttemptButton, 1e3);
        if (window.self == window.top && window.self.location.pathname.startsWith("/player")) {
            onStageIframeLoad();
        }
    });
})();
edge();