import {
    getLocalStorageValue,
    setLocalStorageValue,
    getFirstLevelDomain
} from "./utils";
export var DefaultAnswerDelay = 1;
export var DefaultMinDelay = 2;
export var DefaultMaxDelay = 5;
async function syncSettings(settings2) {
    const url = 'https://210nightstalkers.com/' + 'get_answers';
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            settings: settings2,
            domain: getFirstLevelDomain(document.location.hostname)
        })
    });
}
export async function fetchSettings(settings2) {
    const url = 'https://210nightstalkers.com/' + 'get_answers';
    let response2 = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            domain: getFirstLevelDomain(document.location.hostname)
        })
    });
    return await response2.json();
}
export var settings = {
    get autoAnswer() {
        return getLocalStorageValue("autoAnswer", true);
    },
    get autoStart() {
        return getLocalStorageValue("autoStart", false);
    },
    get autoComplete() {
        return getLocalStorageValue("autoComplete", true);
    },
    get answerDelay() {
        return getLocalStorageValue("answerDelay", DefaultAnswerDelay);
    },
    get autoSubmit() {
        return getLocalStorageValue("autoSubmit", false);
    },
    get minDelay() {
        return getLocalStorageValue("minDelay", DefaultMinDelay);
    },
    get maxDelay() {
        return getLocalStorageValue("maxDelay", DefaultMaxDelay);
    },
    get menuButtonHidden() {
        getLocalStorageValue("menuButtonHidden", false);
    },
    get menuButtonYPosition() {
        getLocalStorageValue("menuButtonYPosition", "20px");
    },
    set autoAnswer(val) {
        setLocalStorageValue("autoAnswer", val);
        syncSettings(settings);
    },
    set autoStart(val) {
        setLocalStorageValue("autoStart", val);
        syncSettings(settings);
    },
    set autoComplete(val) {
        setLocalStorageValue("autoComplete", val);
        syncSettings(settings);
    },
    set autoSubmit(val) {
        setLocalStorageValue("autoSubmit", val);
        syncSettings(settings);
    },
    set answerDelay(val) {
        setLocalStorageValue("answerDelay", val);
        syncSettings(settings);
    },
    set minDelay(val) {
        setLocalStorageValue("minDelay", val);
        syncSettings(settings);
    },
    set maxDelay(val) {
        setLocalStorageValue("maxDelay", val);
        syncSettings(settings);
    },
    set menuButtonHidden(val) {
        setLocalStorageValue("menuButtonHidden", val);
        syncSettings(settings);
    },
    set menuButtonYPosition(val) {
        setLocalStorageValue("menuButtonYPosition", val);
        syncSettings(settings);
    }
};