// Sam
(function () {
    'use strict';

    const themesValue = localStorage.getItem('themes');
    const is_themes = themesValue !== null ? JSON.parse(themesValue) : true;

    if (is_themes) {
        document.body.style.backgroundColor = 'transparent';
    }

    // Function to check if the current page is from Core Edgenuity
    function isCoreEdgenuity() {
        // Add your logic to determine if it's Core Edgenuity
        return false;
    }

    const freeRoamEnabled = localStorage.getItem('freeRoam') === 'true';

    if (freeRoamEnabled && !isCoreEdgenuity()) {
        const enrollmentURLFragment = 'https://student.edgenuity.com/enrollment/';
        const activityStatusGatedClass = 'ActivityTile-status-gated';
        const activityStatusLockedClass = 'ActivityTile-status-locked';

        function readCookie(cookieName) {
            const cookieKey = cookieName + "=";
            const cookieArray = document.cookie.split(";");

            for (const currentCookie of cookieArray) {
                const trimmedCookie = currentCookie.trim();
                if (trimmedCookie.indexOf(cookieKey) === 0) {
                    return trimmedCookie.substring(cookieKey.length, trimmedCookie.length);
                }
            }
            return null;
        }

        function checkURL() {
            const isTimeline = window.location.href.includes(enrollmentURLFragment);
            if (isTimeline) {
                console.log('Is timeline');
                tryToStartObserver();
            }
        }

        function tryToStartObserver() {
            const timelineElement = document.querySelector('.course-timeline');
            if (timelineElement === null) {
                console.log("Can't find timeline. Waiting");
                return;
            }

            const realm = JSON.parse(readCookie('TokenData')).Realm.toString();
            const currentURL = window.location.href;
            const enrollmentIndex = currentURL.indexOf('enrollment') + 11;
            const enrollmentId = currentURL.substr(enrollmentIndex, 36);
            const apiUrl = `//r${(realm.length === 1 ? '0' : '')}${realm}.core.learn.edgenuity.com/lmsapi/sle/api/enrollments/${enrollmentId}/activity/`;

            let lockedButton = null;

            const handleClick = () => {

                document.location = `${apiUrl}${lockedButton.id}`;
            };

            const handleMutation = (mutationsList) => {
                for (const mutation of mutationsList) {
                    for (const addedNode of mutation.addedNodes) {
                        if (addedNode.classList.contains(activityStatusGatedClass) || addedNode.classList.contains(activityStatusLockedClass)) {
                            console.log('Found locked button');
                            lockedButton = addedNode;
                            lockedButton.addEventListener('click', handleClick);
                        }
                    }
                }
            };

            const observer = new MutationObserver(handleMutation);
            observer.observe(document.body, {
                attributes: false,
                childList: true,
                subtree: true,
            });
        }

        checkURL();
        setInterval(() => checkURL(), 1000);
    }

    function duplicateTabs() {
        const excludedKeys = new Set(["RecentPageID", "WrongPageID"]);

        // Override localStorage.setItem
        const originalSetItem = localStorage.setItem.bind(localStorage);
        localStorage.setItem = (key, value) => {
            if (!excludedKeys.has(key)) {
                originalSetItem(key, value);
            }
        };

        // Override localStorage.getItem
        const originalGetItem = localStorage.getItem.bind(localStorage);
        localStorage.getItem = (key) => {
            return excludedKeys.has(key) ? null : originalGetItem(key);
        };

        // Remove excluded keys from localStorage
        excludedKeys.forEach(key => localStorage.removeItem(key));
    }

    if (window.top !== window.self) {
        return;
    }

    document.addEventListener("keydown", function (event) {
        if (event.shiftKey && event.key === "X") {
            const menuContainer = document.getElementById("edgesploitMenuContainer");
            const backgroundOverlay = document.getElementById("edgesploitBackgroundOverlay");

            if (menuContainer.style.display === "none") {
                menuContainer.style.display = "block";
                backgroundOverlay.style.display = "block";
            } else {
                menuContainer.style.display = "none";
                backgroundOverlay.style.display = "none";
            }
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.shiftKey && event.key === "D") {
            const menuButton = document.getElementById("edgesploitMenuButton");
            const isHidden = menuButton.style.display === "none" || menuButton.style.display === "";
            menuButton.style.display = isHidden ? "block" : "none";
            localStorage.setItem("menuButtonHidden", JSON.stringify(!isHidden));

        }
    });

    const versionFileURL = 'https://raw.githubusercontent.com/Databones/Edgesploit/main/version';
    const redirectURL = 'https://github.com/Databones/Edgesploit/raw/main/Edgesploit.user.js';

    async function fetchRemoteVersion(currentVersion) {
        const response = await fetch(versionFileURL);
        const remoteVersion = await response.text();

        if (remoteVersion.trim() !== currentVersion.trim()) {
            window.location.href = redirectURL;
        }
    }

    // Check version if GM_info is defined
    if (typeof GM_info !== 'undefined' && GM_info.script) {
        const currentVersion = GM_info.script.version;
        fetchRemoteVersion(currentVersion);
    }

    const menuButton = document.createElement("button");
    menuButton.id = "edgesploitMenuButton";
    menuButton.style.position = "fixed";
    menuButton.style.bottom = "20px";
    menuButton.style.left = "20px";
    menuButton.style.zIndex = "9999";
    menuButton.style.background = "transparent";
    menuButton.style.border = "none";
    menuButton.style.padding = "20px";
    menuButton.style.cursor = "pointer";
    menuButton.style.backgroundImage = 'url("https://raw.githubusercontent.com/Databones/Edgesploit/main/img/logo.png")';

    menuButton.style.transition = "transform 0.1s ease-in-out";

    menuButton.style.backgroundSize = "contain";

    menuButton.addEventListener("mouseenter", () => {
        menuButton.style.transform = "scale(0.85)";
    });

    menuButton.addEventListener("mouseleave", () => {
        menuButton.style.transform = "scale(1)";
    });

    const storedYPosition = localStorage.getItem("menuButtonYPosition") || "420px";

    menuButton.style.bottom = storedYPosition;
    document.body.appendChild(menuButton);

    let isDragging = false;
    let startY = 0;

    menuButton.addEventListener("mousedown", (e) => {
        isDragging = true;
        startY = e.clientY;
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            const deltaY = startY - e.clientY;
            const newY = parseInt(menuButton.style.bottom) + deltaY;

            const minHeight = 20;
            const maxHeight = window.innerHeight - menuButton.clientHeight - 20;

            const constrainedY = Math.min(maxHeight, Math.max(minHeight, newY));

            menuButton.style.bottom = `${constrainedY}px`;
            startY = e.clientY;

            localStorage.setItem("menuButtonYPosition", `${constrainedY}px`);
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    const backgroundOverlay = document.createElement("div");
    backgroundOverlay.id = "edgesploitBackgroundOverlay";
    backgroundOverlay.style.display = "none";
    backgroundOverlay.style.position = "fixed";
    backgroundOverlay.style.top = "0";
    backgroundOverlay.style.left = "0";
    backgroundOverlay.style.width = "100%";
    backgroundOverlay.style.height = "100%";
    backgroundOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    backgroundOverlay.style.zIndex = "9998";
    backgroundOverlay.style.backdropFilter = "grayscale(100%)";
    document.body.appendChild(backgroundOverlay);

    backgroundOverlay.addEventListener("click", () => {
        toggleMenu();
    });

    const menuContainer = document.createElement("div");
    menuContainer.id = "edgesploitMenuContainer";
    menuContainer.style.display = "none";
    menuContainer.style.position = "fixed";
    menuContainer.style.fontFamily = "Roboto, sans-serif";
    menuContainer.style.fontSize = "16px";
    menuContainer.style.userSelect = 'none';
    menuContainer.style.top = "50%";
    menuContainer.style.background = "linear-gradient(45deg, #111, #333)";
    menuContainer.style.left = "50%";
    menuContainer.style.transform = "translate(-50%, -50%)";
    menuContainer.style.zIndex = "9999";
    menuContainer.style.width = "400px";
    menuContainer.style.padding = "30px";
    menuContainer.style.color = "#FFF";
    menuContainer.style.borderRadius = "10px";
    menuContainer.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";
    menuContainer.style.transition = "transform 0.2s ease-in-out";
    document.body.appendChild(menuContainer);

    const titleElement = document.createElement("div");
    titleElement.style.textAlign = "center";
    titleElement.style.marginBottom = "10px";
    titleElement.style.fontWeight = "100";
    titleElement.style.fontSize = "24px";
    menuContainer.appendChild(titleElement);

    titleElement.innerHTML = `
        <img src="https://raw.githubusercontent.com/Databones/Edgesploit/main/img/logo_full.png" style="width: auto; height: 85px; user-drag: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none; user-select: none;">
        <div style="font-size: 19px;">You are using version 2.0.4</div>
    `;

    menuContainer.appendChild(titleElement);

    const applyBtn = document.createElement("button");
    applyBtn.textContent = "Apply changes?";
    applyBtn.style.marginTop = "10px";
    applyBtn.style.padding = "5px 10px";
    applyBtn.style.backgroundColor = "#111";
    applyBtn.style.color = "#FFF";
    applyBtn.style.border = "none";
    applyBtn.style.borderRadius = "5px";
    applyBtn.style.cursor = "pointer";
    applyBtn.style.border = "1px solid transparent";
    applyBtn.style.transition = "border-color 0.1s ease-out";

    applyBtn.addEventListener("mouseenter", () => {
        applyBtn.style.borderColor = "#FFF";
    });

    applyBtn.addEventListener("mouseleave", () => {
        applyBtn.style.borderColor = "transparent";
    });
    applyBtn.addEventListener("click", () => {
        location.reload();
    });
    menuContainer.appendChild(applyBtn);

    const setBgButton = document.createElement("button");
    setBgButton.textContent = "Set background";
    setBgButton.style.marginTop = "10px";
    setBgButton.style.marginLeft = "10px";
    setBgButton.style.padding = "5px 10px";
    setBgButton.style.backgroundColor = "#111";
    setBgButton.style.color = "#FFF";
    setBgButton.style.border = "none";
    setBgButton.style.borderRadius = "5px";
    setBgButton.style.cursor = "pointer";
    setBgButton.style.border = "1px solid transparent";
    setBgButton.style.transition = "border-color 0.1s ease-out";

    setBgButton.addEventListener("mouseenter", () => {
        setBgButton.style.borderColor = "#FFF";
    });

    setBgButton.addEventListener("mouseleave", () => {
        setBgButton.style.borderColor = "transparent";
    });
    setBgButton.addEventListener("click", () => {
        const bgUrl = prompt("Please enter the URL for the custom background:");
        if (bgUrl !== null && bgUrl.trim() !== "") {
            modules.bgImageUrl = bgUrl;
            localStorage.setItem("bgImageUrl", bgUrl);
            themes();
        }
    });
    menuContainer.appendChild(setBgButton);

    const toggleMenu = () => {
        const display = menuContainer.style.display === "none" ? "block" : "none";
        menuContainer.style.display = display;
        backgroundOverlay.style.display = display;
    };

    menuButton.addEventListener("click", toggleMenu);

    const modules = {
        activityAdvance: localStorage.getItem("activityAdvance") === "true" || false,
        answerLookup: localStorage.getItem("answerLookup") === "true" || false,
        antiTimeout: localStorage.getItem("antiTimeout") === "true" || false,
        autoVocab: localStorage.getItem("autoVocab") === "true" || false,
        duplicateTabs: localStorage.getItem("duplicateTabs") === "true" || false,
        frameAdvance: localStorage.getItem("frameAdvance") === "true" || false,
        frameBypass: localStorage.getItem("frameBypass") === "true" || false,
        freeRoam: localStorage.getItem("freeRoam") === "true" || false,
        guessUngraded: localStorage.getItem("guessUngraded") === "true" || false,
        nameSpoofer: localStorage.getItem("nameSpoofer") === "true" || false,
        showColumns: localStorage.getItem("showColumns") === "true" || false,
        skipIntros: localStorage.getItem("skipIntros") === "true" || false,
        themes: localStorage.getItem("themes") === "true" || false,
    };


    const buttonList = document.createElement("ul");
    buttonList.style.listStyleType = "none";
    buttonList.style.padding = "0";

    menuContainer.appendChild(buttonList);

    const buttonLabels = {
        activityAdvance: "Activity Advance",
        answerLookup: "Answer Lookup",
        antiTimeout: "Anti Timeout",
        autoVocab: "Auto Vocab",
        duplicateTabs: "Duplicate Tabs",
        frameAdvance: "Frame Advance",
        frameBypass: "Frame Bypass",
        freeRoam: "Free Roam",
        guessUngraded: "Guess Ungraded",
        nameSpoofer: "Name Spoofer",
        showColumns: "Show Columns",
        skipIntros: "Skip Intros",
        themes: "Themes",
    };

    const buttonDescriptions = {
        activityAdvance: "Advances to the next activity when the current one is complete.",
        answerLookup: "Pops up several links when you select a question.",
        antiTimeout: "Prevents automatic logouts from inactivity.",
        autoVocab: "Fills words in vocabulary activities.",
        duplicateTabs: "Allows the use of multiple tabs.　⚠️ If it doesn't work, open new tabs slowly.",
        frameAdvance: "Automatically clicks to the next frame.",
        frameBypass: "Removes restrictions to freely navigate through frames.",
        freeRoam: "Module that lets you click on any gated activity.　⚠️ May only function on classes with pre-tests. Buttons may also appear locked when it's clickable. ",
        guessUngraded: "Selects random answers for non-graded activities.",
        nameSpoofer: "Hides personally-identifying labels.",
        showColumns: "Shows every hidden question in assignments.",
        skipIntros: "Removes introduction screens that block your input.",
        themes: "Replaces Edgenuity's depressing background with any background you desire.",
    };

    for (const module in modules) {
        if (modules.hasOwnProperty(module)) {
            const button = document.createElement("button");
            button.className = "module-button";
            button.textContent = buttonLabels[module];
            button.style.marginTop = "10px";
            button.style.padding = "5px 15px 5px 40px";
            button.style.backgroundColor = "#111";
            button.style.color = "#FFF";
            button.style.border = "none";
            button.style.borderRadius = "5px";
            button.style.cursor = "pointer";
            button.style.display = "block";
            button.style.width = "100%";
            button.style.textAlign = "left";

            const imageUrls = {
                answerLookup: 'https://raw.githubusercontent.com/Databones/Edgesploit/main/img/icons/Answer_Lookup.png',
                activityAdvance: 'https://raw.githubusercontent.com/Databones/Edgesploit/main/img/icons/Activity_Advance.png',
                frameAdvance: 'https://raw.githubusercontent.com/Databones/Edgesploit/main/img/icons/Frame_Advance.png',
                frameBypass: 'https://raw.githubusercontent.com/Databones/Edgesploit/main/img/icons/Frame_Bypass.png',
                antiTimeout: 'https://raw.githubusercontent.com/Databones/Edgesploit/main/img/icons/Anti_Logout.png',
                freeRoam: 'https://raw.githubusercontent.com/Databones/Edgesploit/main/img/icons/Free_Roam.png',
                showColumns: 'https://raw.githubusercontent.com/Databones/Edgesploit/main/img/icons/Show_Columns.png',
                nameSpoofer: 'https://raw.githubusercontent.com/Databones/Edgesploit/main/img/icons/Name_Spoofer.png',
                guessUngraded: 'https://raw.githubusercontent.com/Databones/Edgesploit/main/img/icons/Guess_Ungraded.png',
                duplicateTabs: 'https://raw.githubusercontent.com/Databones/Edgesploit/main/img/icons/Duplicate_Tabs.png',
                autoVocab: 'https://raw.githubusercontent.com/Databones/Edgesploit/main/img/icons/Auto_Vocab.png',
                skipIntros: 'https://raw.githubusercontent.com/Databones/Edgesploit/main/img/icons/Skip_Intros.png',
                themes: 'https://raw.githubusercontent.com/Databones/Edgesploit/main/img/icons/Themes.png',
            };

            button.style.border = "1px solid transparent";
            button.style.transition = "border-color 0.1s ease-out";

            button.addEventListener("mouseenter", () => {
                button.style.borderColor = "#FFF";
            });

            button.addEventListener("mouseleave", () => {
                button.style.borderColor = "transparent";
            });

            button.style.backgroundImage = `url('${imageUrls[module]}')`;
            button.style.backgroundSize = "30px 30px";
            button.style.backgroundRepeat = "no-repeat";
            button.style.backgroundPosition = "5px center";


            const enabledIndicator = document.createElement("img");
            enabledIndicator.src = "https://raw.githubusercontent.com/Databones/Edgesploit/main/img/enabled.png";
            enabledIndicator.alt = "enabled";
            enabledIndicator.style.width = "25%";

            const disabledIndicator = document.createElement("img");
            disabledIndicator.src = "https://raw.githubusercontent.com/Databones/Edgesploit/main/img/disabled.png";
            disabledIndicator.alt = "disabled";
            disabledIndicator.style.width = "25%";

            button.appendChild(enabledIndicator);
            button.appendChild(disabledIndicator);

            enabledIndicator.style.display = modules[module] ? "inline" : "none";
            disabledIndicator.style.display = modules[module] ? "none" : "inline";

            button.addEventListener("click", () => {
                modules[module] = !modules[module];
                localStorage.setItem(module, modules[module]);

                enabledIndicator.style.display = modules[module] ? "inline" : "none";
                disabledIndicator.style.display = modules[module] ? "none" : "inline";
            });



            const listItem = document.createElement("li");
            listItem.style.display = "flex";
            listItem.style.justifyContent = "space-between";
            listItem.style.alignItems = "center";

            listItem.appendChild(button);




            buttonList.appendChild(listItem);

            const tooltip = document.createElement("div");
            tooltip.textContent = buttonDescriptions[module];
            tooltip.style.display = "none";
            tooltip.style.position = "absolute";
            tooltip.style.background = "rgba(51, 51, 51, 0.8)";
            tooltip.style.color = "#FFF";
            tooltip.style.padding = "5px";
            tooltip.style.boxShadow = "0px 0px 20px rgba(0, 0, 0, 0.75)";
            tooltip.style.borderRadius = "5px";
            tooltip.style.zIndex = "9999";
            document.body.appendChild(tooltip);

            button.addEventListener("mousemove", (e) => {
                const offsetX = 10;
                const offsetY = 10;
                const mouseX = e.clientX + offsetX;
                const mouseY = e.clientY + offsetY;

                tooltip.style.left = `${mouseX}px`;
                tooltip.style.top = `${mouseY}px`;
            });

            button.addEventListener("mouseenter", () => {
                button.style.borderColor = "#FFF";
                tooltip.style.display = "block";
            });

            button.addEventListener("mouseleave", () => {
                button.style.borderColor = "transparent";
                tooltip.style.display = "none";
            });

        }

    }
    const discordButton = document.createElement("button");
    discordButton.style.marginTop = "10px";
    discordButton.style.padding = "2px";
    discordButton.style.background = "transparent";
    discordButton.style.cursor = "pointer";
    discordButton.style.border = 'none';
    discordButton.style.display = "inline-block";
    discordButton.style.width = "40px";
    discordButton.style.textAlign = "center";

    const discordIcon = document.createElement("img");
    discordIcon.src = "https://raw.githubusercontent.com/Databones/Edgesploit/main/img/discord.png";
    discordIcon.alt = "Discord";
    discordIcon.style.width = "100%";

    discordButton.appendChild(discordIcon);

    discordButton.addEventListener("click", () => {
        window.open("https://discord.gg/HQmSYGK8tV");
    });

    buttonList.appendChild(discordButton);

    const githubButton = document.createElement("button");
    githubButton.style.marginTop = "10px";
    githubButton.style.marginLeft = "5px";
    githubButton.style.padding = "2px";
    githubButton.style.background = "transparent";
    githubButton.style.cursor = "pointer";
    githubButton.style.border = 'none';
    githubButton.style.display = "inline-block";
    githubButton.style.width = "30px";
    githubButton.style.textAlign = "center";

    const githubIcon = document.createElement("img");
    githubIcon.src = "https://raw.githubusercontent.com/Databones/Edgesploit/main/img/github.png";
    githubIcon.alt = "GitHub";
    githubIcon.style.width = "100%";

    githubButton.appendChild(githubIcon);

    githubButton.addEventListener("click", () => {
        window.open("https://github.com/Databones/Edgesploit");
    });

    buttonList.appendChild(githubButton);

    function frameAdvance() {
        const stageFrame = document.getElementById('yourStageFrameId'); // replace 'yourStageFrameId' with the actual ID

        if (stageFrame) {
            var contentWindow = stageFrame.contentWindow;
        }
        const frameChain = contentWindow ? contentWindow.API.FrameChain : null;
        if (frameChain) {
            const {
                currentFrame,
                framesStatus
            } = frameChain;

            if (framesStatus[currentFrame - 1] === 'complete' && frameChain.isComplete()) {
                frameChain.nextFrame();
            } else if (framesStatus[currentFrame - 1] === 'complete') {
                frameChain.nextFrame();
            }
        }
    }


    function guessUngraded() {
        const activityTitle = document.getElementById('activity-title').innerText;
        const stageFrame = document.getElementById('stageFrame').contentWindow.document;


        // const API = document.getElementsByName('stageFrame')[0]?.contentWindow?.API;
        const stageFrameElement = document.getElementsByName('stageFrame')[0];

        // Check if the stageFrameElement and its contentWindow are available
        if (stageFrameElement) {
            const contentWindow = stageFrameElement.contentWindow;

            // Check if API is available in the contentWindow
            const API = contentWindow ? contentWindow.API : null;

            // Now you can use the API if it's available
            if (API) {
                // Your code that uses the API goes here...
            } else {
                console.error('API is not available in the contentWindow.');
            }
        } else {
            console.error('Stage frame element not found.');
        }


        if (stageFrame) {
            var answerChoiceButtons = stageFrame.querySelectorAll('form .answer-choice-button');
        }

        if (['Instruction', 'Warm-Up', 'Summary', 'Lecture', 'Virtual Lab', 'Wet Lab', 'Drafting', 'Prewriting', 'Part', 'Case Study', 'Overview', 'Career Connection', 'Wrap', 'Lab Lesson', 'Unit Overview', 'Mini-Lesson', 'Video'].map(title => title.toLowerCase()).includes(activityTitle.toLowerCase())) {

            API.Frame.check();
            API.Frame.completeTask(API.Frame.StackProgress[0].TaskProgress[0].Guid);

            if (answerChoiceButtons.length > 0) {
                const randomIndex = Math.floor(Math.random() * answerChoiceButtons.length);
                answerChoiceButtons[randomIndex].click();

            } else {
                if (stageFrame) {
                    var iframeAnswerButtons = stageFrame.querySelector('iframe').contentWindow.document.querySelectorAll('.answer-choice-button');
                }
                if (iframeAnswerButtons && iframeAnswerButtons.length > 0) {
                    const randomIndex = Math.floor(Math.random() * iframeAnswerButtons.length);
                    iframeAnswerButtons[randomIndex].click();

                }
            }

        } else {

            // const iframeContentDiv = stageFrame.querySelector('iframe').contentWindow.document.querySelector('.content');

            // if (!iframeContentDiv?.querySelector('[qid]')) {
            //     API.Frame.check();
            // }
            var iframeContentDiv = document.querySelector('iframe').contentWindow.document.querySelector('.content');

            if (iframeContentDiv && !iframeContentDiv.querySelector('[qid]')) {
                API.Frame.check();
            }
        }

    }

    function autoVocab() {
        let isRunning = false;
        let mainInterval = setInterval(() => {
            let iframeDocument = stageFrame.contentDocument;

            if (iframeDocument !== null) {

                let wordBackground = iframeDocument.getElementsByClassName('word-background')[0];

                if (!isRunning && wordBackground !== undefined) {
                    let wordValue = wordBackground.value;

                    if (iframeDocument.getElementsByClassName('word-textbox word-normal')[0] !== undefined) {
                        isRunning = true;
                        let wordTextbox = iframeDocument.getElementsByClassName('word-textbox word-normal')[0];
                        wordTextbox.value = wordValue;
                        wordTextbox.dispatchEvent(new Event('keyup'));

                        let playButtons = iframeDocument.getElementsByClassName('playbutton');
                        for (let i = 0; i < playButtons.length; i++) {
                            playButtons[i].click();
                        }

                        let audioCheckInterval = setInterval(() => {
                            let nextButton = iframeDocument.getElementsByClassName('uibtn uibtn-blue uibtn-arrow-next')[0];

                            if (nextButton !== undefined && !nextButton.className.includes('disabled')) {
                                setTimeout(() => {
                                    nextButton.click();
                                }, 1000);

                                setTimeout(() => {
                                    isRunning = false;
                                }, 2500);

                                clearInterval(audioCheckInterval);
                            }
                        }, 300);
                    }
                }

            }
            clearInterval(mainInterval);
        }, 1000);

    }

    function nameSpoofer() {
        const elementsToRename = [
            '.profile-button',
            'a[data-bind="text: user().FullName, click: user().toggleUserMenu"]',
            '.field-content',
            '.user-title.position-fixed'
        ];

        function renameElements() {
            const combinedSelector = elementsToRename.join(', ');
            const elements = document.querySelectorAll(combinedSelector);

            elements.forEach(element => {
                element.textContent = '?';
            });
        }

        const observerNS = new MutationObserver(renameElements);

        const observerNSOptions = {
            childList: true,
            subtree: true
        };

        observerNS.observe(document.body, observerNSOptions);
    }

    function showColumns() {

        var iframes = document.querySelectorAll('iframe');

        for (var i = 0; i < iframes.length; i++) {
            var innerIframes = iframes[i].contentDocument.querySelectorAll('iframe');

            for (var j = 0; j < innerIframes.length; j++) {
                if (innerIframes[j]) {
                    return;
                }
                var rightColumn = innerIframes[j].contentDocument.querySelector('.right-column');
                var leftColumn = innerIframes[j].contentDocument.querySelector('.left-column');

                if (rightColumn) {
                    rightColumn.children[0].removeAttribute('style');
                }

                if (leftColumn) {
                    leftColumn.children[0].removeAttribute('style');
                }

                var hiddenDivs = innerIframes[j].contentDocument.querySelectorAll('div[fstack][style="display:none;"]');

                for (var k = 0; k < hiddenDivs.length; k++) {
                    hiddenDivs[k].removeAttribute('style');
                }
            }
        }
    }

    function frameBypass() {

        stageFrame.addEventListener('load', function () {
            if (stageFrame.contentWindow.API.E2020) {
                stageFrame.contentWindow.API.E2020.freeMovement = true;
            }
        });

    }

    async function activityAdvance() {
        const isEdgenuitySite = window.location.href.includes("core.learn.edgenuity.com");

        if (isEdgenuitySite) {
            localStorage.setItem('clickActivityTile', true);
        }

        // const api = document.getElementsByName('stageFrame')[0]?.contentWindow?.API;
        // const activityStatusElement = document.getElementById('activity-status');
        // const activityStatus = activityStatusElement?.innerText.toLowerCase();
        const stageFrame = document.getElementsByName('stageFrame')[0];
        // const api = stageFrame ? stageFrame.contentWindow?.API : undefined;
        let api;
        if (stageFrame) {
            api = stageFrame.contentWindow ? stageFrame.contentWindow.API : undefined;
        }
        const activityStatusElement = document.getElementById('activity-status');
        const activityStatus = activityStatusElement ? activityStatusElement.innerText.toLowerCase() : undefined;


        // if (iframeContentDiv && !iframeContentDiv.querySelector('[qid]')) {
        //     if (iframeContentWindow && iframeContentWindow.API) {
        //         iframeContentWindow.API.Frame.check();
        //     }
        // }


        const shouldClickActivityTile = localStorage.getItem('clickActivityTile') === 'true' || false;

        if (shouldClickActivityTile) {
            const element = document.querySelector('.ActivityTile-border-current');
            if (element) {
                element.click();
            }
        }

        const iframe = document.getElementsByName('stageFrame')[0];
        // const overlayElement = iframe?.contentDocument?.querySelector('.overlay-attempt-percentage.overlay-attempt-percentage-low');
        let overlayElement;
        if (iframe && iframe.contentDocument) {
            overlayElement = iframe.contentDocument.querySelector('.overlay-attempt-percentage.overlay-attempt-percentage-low');
        }

        if (overlayElement) {
            return;
        }

        if (api && api.FrameChain && api.FrameChain.isComplete() || ['complete', 'bypassed'].includes(activityStatus)) {
            const linkElement = document.querySelector('a[data-bind="visible: ReturnURL, attr: { href: ReturnURL }, click: goHome"]');
            if (linkElement) {
                const href = linkElement.getAttribute('href');
                if (href) {
                    window.location.href = href;
                }
            }
        }
    }

    function skipIntros() {
        // const API = document.getElementsByName('stageFrame')[0]?.contentWindow?.API;
        const stageFrame = document.getElementsByName('stageFrame')[0];
        const API = stageFrame ? stageFrame.contentWindow.API : null;


        const contentDocument = stageFrame.contentDocument;

        if (API.Frame) {
            API.Frame.hasExitAudioPlayed = API.Frame.hasEntryAudioPlayed = true;
            API.Frame.entryAudioFilename = API.Frame.exitAudioFilename = API.Frame.hintAudioFilename = API.Frame.showMeVideoFilename = null;
        }

        if (contentDocument !== null) {
            const invisODiv = contentDocument.getElementById('invis-o-div');

            if (invisODiv !== null) {
                invisODiv.style.display = 'none';
                API.Audio.stopAudio();
                API.Audio.soundQueue = API.Audio.callBackQueue = [];
                API.Audio.playing = false;
            }

            const mainArea = contentDocument.getElementById('main_area');

            if (mainArea && mainArea.querySelector('video')) {
                const video = mainArea.querySelector('video');
                video.muted = true;

                if (!video.playing) {
                    video.play();
                }
            }
        }
    }

    function elementBlocker() {
        const elementsToBlock = [
            '.ReactModal__Overlay.ReactModal__Overlay--after-open',
            '.lowTimeMessage',
            '.mainfoot',
            'a.btn-primary.enrollment-card-btn-next.btn.d-flex.align-items-baseline'
        ];

        function blockElements() {
            const combinedSelector = elementsToBlock.join(', ');
            document.querySelectorAll(combinedSelector).forEach(element => element.remove());
        }

        const observerEB = new MutationObserver(blockElements);

        observerEB.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function themes() {
        const mainheadDiv = document.querySelector('.mainhead');
        mainheadDiv.style.backgroundColor = 'transparent';
        mainheadDiv.style.webkitBoxShadow = 'none';
        mainheadDiv.style.boxShadow = 'none';

        const elements = document.getElementsByClassName('mainfoot');

        for (const element of elements) {
            element.style.background = 'none';
            element.style.webkitBoxShadow = 'none';
            element.style.boxShadow = 'none';
        }

        const defaultBgImageUrl = 'https://raw.githubusercontent.com/Databones/Edgesploit/main/img/background.webp';
        const bgImageUrl = modules.bgImageUrl || defaultBgImageUrl;

        const css = `
        body {
            background-image: url(${bgImageUrl});
            background-repeat: no-repeat;
        }
    `;

        const style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);

        const customIconUrl = "https://raw.githubusercontent.com/Databones/Edgesploit/main/img/coursemap.png";
        const homeNavLink = document.querySelector('.nav-home.nav');
        if (homeNavLink) {
            homeNavLink.removeAttribute('class');
            homeNavLink.innerHTML = `<img src="${customIconUrl}" alt="Coursemap">`;
        }

        const homeLinkURL = 'https://student.edgenuity.com';
        const homeLinkClass = 'nav-home nav';

        if (mainheadDiv) {
            const homeLinkElement = document.createElement('a');
            homeLinkElement.href = homeLinkURL;
            homeLinkElement.className = homeLinkClass;
            homeLinkElement.setAttribute('data-bind', 'visible: ReturnURL');
            homeLinkElement.innerText = 'Home';

            mainheadDiv.insertBefore(homeLinkElement, mainheadDiv.firstChild);

            const clickHandler = () => {
                localStorage.setItem('clickActivityTile', false);

            };

            homeLinkElement.addEventListener('click', clickHandler);
            homeNavLink.addEventListener('click', clickHandler);
        }

    }

    function antiTimeout() {

        const timerStayButton = document.getElementById('timerStay');
        const sessionTimeoutYesNo = document.querySelectorAll('.sessionTimeoutYesNo');

        let yesButton = null;

        // Loop through each element with the class and check if it contains "Yes"
        sessionTimeoutYesNo.forEach(element => {
            if (element.textContent.includes("Yes")) {
                yesButton = element;
            }
        });

        function handleClick(mutationsList) {
            if (timerStayButton) {
                timerStayButton.click();
            }

            if (yesButton) {
                yesButton.click();
            }
        }

        const observerOptions = {
            childList: true,
            subtree: true
        };

        const observer = new MutationObserver(handleClick);

        observer.observe(document.body, observerOptions);
    }

    function answerLookup() {
        function init() {
            let node = document.getElementById("stageFrame");
            if (node.contentDocument.getElementById("iFramePreview") != null || InnerFrameIsCurrent == true) {
                node = node.contentDocument.getElementById("iFramePreview");
                InnerFrameIsCurrent = true;
            }
            if (node != null) {
                if (node.onmousedown == null || node.onmouseup == null) {
                    doc = node.contentDocument;
                    w = node.contentWindow;
                    node.contentDocument.body.onmouseup = up;
                    node.contentDocument.body.onmousedown = update;
                }
            }
        }

        function up({
            clientY,
            clientX
        }) {
            const rightImgURL = doc.getSelection().toString();
            const isVisible = !leftImgURL && rightImgURL !== "";

            if (isVisible) {
                const _curr_dragged_point = previewElt.getBoundingClientRect();
                const buttonOffsets = [0, 60, 120, 180, 240];

                const setButtonStyle = (button, offset) => {
                    button.style.visibility = "visible";
                    button.style.top = `${clientY + _curr_dragged_point.y + 10}px`;
                    button.style.left = `${clientX + _curr_dragged_point.x + offset}px`;
                };

                [buttonBrainly, buttonQuizlet, buttonGoogle, buttonCourseHero, buttonStudocu].forEach((button, index) => {
                    setButtonStyle(button, buttonOffsets[index]);
                });
            } else {
                leftImgURL = false;
            }
        }

        function update(givenRuns) {
            const buttons = [
                "searchButtonBrainly",
                "searchButtonQuizlet",
                "searchButtonGoogle",
                "searchButtonCourseHero",
                "searchButtonStudocu"
            ];

            buttons.forEach(buttonId => {
                const button = document.getElementById(buttonId);
                if (button) {
                    button.style.visibility = "hidden";
                }
            });

            const selection = window.getSelection ? window.getSelection() : document.selection;

            if (selection) {
                if (selection.empty) {
                    selection.empty();
                } else if (selection.removeAllRanges) {
                    selection.removeAllRanges();
                }
            }
        }

        var InnerFrameIsCurrent = false;
        var doc = document.getElementById("stageFrame").contentDocument;
        var w = document.getElementById("stageFrame").contentWindow;
        var previewElt = document.getElementById("stageFrame");
        var leftImgURL = false;

        var buttonBrainly = createButton("searchButtonBrainly", "https://play-lh.googleusercontent.com/KnPtV_tIErMa7LZ7liBenqGaeHId346O01akTCWMGWb7xnpO3sXKTaV5E5NxHvPDMaM");
        var buttonQuizlet = createButton("searchButtonQuizlet", "https://play-lh.googleusercontent.com/hiQHKRhpuGu4pWAFhpto9H7qWKSdX-BjKbDAtZYgm_jfoD0cN7MCllGOn6L3XWo-6Q");
        var buttonGoogle = createButton("searchButtonGoogle", "https://cdn-teams-slug.flaticon.com/google.jpg");
        var buttonCourseHero = createButton("searchButtonCourseHero", "https://www.coursehero.com/assets/img/coursehero_logo.png");
        var buttonStudocu = createButton("searchButtonStudocu", "https://play-lh.googleusercontent.com/20ssDWF3SWEXIFYy8iFwXjomuIqtuHjGc3OxIWqVojIaeo_9_XxUZEDdmm5YPreLucij");

        function createButton(id, backgroundImage) {
            var button = document.createElement("button");
            button.id = id;
            button.style.backgroundImage = `url("${backgroundImage}")`;
            button.style.backgroundSize = 'contain';
            button.style.width = '50px';
            button.style.height = '50px';
            button.style.position = "absolute";
            button.style.visibility = "hidden";
            document.body.append(button);
            return button;
        }

        document.getElementById("searchButtonBrainly").onclick = () => {
            openSearchWindow("https://brainly.com/app/ask?entry=top&q=");
        };

        document.getElementById("searchButtonQuizlet").onclick = () => {
            openSearchWindow("https://quizlet.com/search?query=");
        };

        document.getElementById("searchButtonGoogle").onclick = () => {
            openSearchWindow("https://www.google.com/search?q=");
        };

        document.getElementById("searchButtonCourseHero").onclick = () => {
            openSearchWindow("https://www.coursehero.com/search/results/?stx=");
        };

        document.getElementById("searchButtonStudocu").onclick = () => {
            openSearchWindow("https://www.studocu.com/en-us/search/");
        };

        function openSearchWindow(searchUrl) {
            leftImgURL = true;
            const searchString = `${searchUrl}${encodeURIComponent(doc.getSelection().toString())}`;
            window.open(searchString, "_blank");
        }

        setInterval(init, 2000);
    }

    // const API = document.getElementsByName('stageFrame')[0]?.contentWindow?.API;
    const __stageFrame = document.getElementsByName('stageFrame')[0];
    if (__stageFrame) {
        var API = __stageFrame && __stageFrame.contentWindow && __stageFrame.contentWindow.API;
    }

    const activityStatusElement = document.getElementById('activity-status');
    // const activityStatus = activityStatusElement?.innerText.toLowerCase();
    const activityStatus = activityStatusElement ? activityStatusElement.innerText.toLowerCase() : null;


    var stageFrame = document.getElementById('stageFrame');
    const iframe = document.getElementsByName('stageFrame')[0];

    const runIfConditionsMet = (condition, action) => condition && action();

    const config = {
        eightHundredFunctions: [{
                condition: modules.guessUngraded && isCoreEdgenuity,
                action: guessUngraded
            },
            {
                condition: modules.frameAdvance && isCoreEdgenuity,
                action: frameAdvance
            },
            {
                condition: modules.skipIntros && isCoreEdgenuity,
                action: skipIntros
            },
            {
                condition: modules.showColumns && isCoreEdgenuity,
                action: showColumns
            },
        ],
        fifteenHundredFunctions: [{
                condition: modules.activityAdvance,
                action: activityAdvance
            },
            {
                condition: modules.autoVocab && isCoreEdgenuity && isVocab,
                action: autoVocab
            },
            {
                condition: modules.frameAdvance && isCoreEdgenuity,
                action: frameAdvance
            },
        ],
    };

    const runFunctions = (functions) => functions.forEach(({
        condition,
        action
    }) => runIfConditionsMet(condition, action));

    const fifteenHundredInterval = setInterval(() => runFunctions(config.fifteenHundredFunctions), 1500);
    const eightHundredInterval = setInterval(() => runFunctions(config.eightHundredFunctions), 800);

    if (modules.duplicateTabs && isCoreEdgenuity) {
        duplicateTabs();
    }

    if (modules.nameSpoofer) {
        nameSpoofer();
    }

    if (modules.antiTimeout) {
        antiTimeout();
    }

    if (modules.themes) {
        elementBlocker();
        themes();
    }

    if (modules.frameBypass && isCoreEdgenuity) {
        frameBypass();
    }

    if (modules.answerLookup && isCoreEdgenuity) {
        answerLookup();
    }

    function isCoreEdgenuity() {
        return window.location.href.includes("://*.core.learn.edgenuity.com/");
    }

    function isStudentEdgenuity() {
        return window.location.href.includes("://*.student.edgenuity.com/");
    }

    function isVocab() {
        const activityTitleElement = document.getElementById("activity-title");
        return (activityTitleElement && activityTitleElement.innerText === "Vocabulary")
    }

})();

(function () {
    'use strict';

    const guessUngraded = localStorage.getItem("guessUngraded") === "true" || true;

    if (!guessUngraded) {
        return;
    }

    // const API = document.getElementsByName('stageFrame')[0]?.contentWindow?.API;
    const stageFrame = document.getElementsByName('stageFrame')[0];
    const API = stageFrame ? stageFrame.contentWindow.API : undefined;

    const activityStatusElement = document.getElementById('activity-status');
    // const activityStatus = activityStatusElement?.innerText.toLowerCase();
    const activityStatus = activityStatusElement ? activityStatusElement.innerText.toLowerCase() : undefined;


    if (API.FrameChain && API.FrameChain.isComplete() || ['complete', 'bypassed'].includes(activityStatus)) {
        return;
    }

    let isRecordingAssignment = false;

    if (location.href.includes('.powerspeak.edgenuity.com')) {
        let intervalId = setInterval(() => {
            const soundBlocker = document.querySelector('.App__container__soundBlocker');
            // soundBlocker?.click();
            if (soundBlocker) {
                soundBlocker.click();
            }

            const pronunciationContainer = document.querySelector('.PronunciationStation__container');
            if (pronunciationContainer && pronunciationContainer.innerHTML) {
                clearInterval(intervalId);
            } else {
                document.querySelector('.CompleteWindow__continue')?.click();
                setTimeout(() => location.reload(), 10000);
            }
        }, 500);
    } else if (location.href.includes('ContentViewers/Writing') || location.href.includes('/ContentViewers/Powerspeak')) {
        let formElement = document.querySelector('form');

        if (formElement !== null) {
            let clickReadMore = () => {
                const gradientDivider = document.querySelector('.gradient-Divider');
                // gradientDivider?.children[0]?.children[0]?.click() || setTimeout(clickReadMore, 500);
                if (gradientDivider && gradientDivider.children[0] && gradientDivider.children[0].children[0]) {
                    gradientDivider.children[0].children[0].click();
                } else {
                    setTimeout(clickReadMore, 500);
                }

            };

            let submitForm = () => {
                const actionIndicator = document.querySelector('#actionIndicator');
                // actionIndicator?.setAttribute('name', 'action:submit');
                if (actionIndicator) {
                    actionIndicator.setAttribute('name', 'action:submit');
                }

                formElement.submit();
            };

            let handleMoreLink = () => {
                let readMoreLink = document.querySelector('#journal-read-more-link');
                // readMoreLink?.innerText.toLowerCase().includes('more') && readMoreLink.click();
                if (readMoreLink) {
                    readMoreLink?.innerText.toLowerCase().includes('more') && readMoreLink.click();
                }
                processQuestion();
            };

            let handleReadMoreLink = () => {
                let readMoreLink = document.querySelector('#journal-read-more-link');
                // readMoreLink?.innerText.toLowerCase().includes('more') && readMoreLink.click();
                if (readMoreLink) {
                    readMoreLink?.innerText.toLowerCase().includes('more') && readMoreLink.click();
                }
                processQuestion();
            };

            let processQuestion = () => {
                try {
                    let questionText = document.querySelector('.journal-question.essay-prompt-expanded')?.innerText;

                    if (!isRecordingAssignment) {
                        isRecordingAssignment = true;
                    }
                } catch (error) {
                    setTimeout(processQuestion, 1000);
                }
            };

            let activityTitle = parent.document.getElementById('activity-title')?.innerText.toLowerCase();
            let isPracticeActivity = activityTitle?.includes('practice');
            let action = formElement.action;

            if (!action.includes('SubmitAudioAttempt') && !action.includes('Writing')) {
                clickReadMore();
            } else if (action.includes('Writing')) {
                handleMoreLink();
            } else {
                handleReadMoreLink();
            }
        }
    } else if (location.href.includes('ContentViewers/Powerspeak/SubmitAttempt')) {
        let submitLoop = setInterval(() => {
            if (window.submitted || document.querySelector('.align-right').innerText.toLowerCase().includes('submitted')) {
                clearInterval(submitLoop);
            }
        }, 500);
    }
    // console.clear();
})();