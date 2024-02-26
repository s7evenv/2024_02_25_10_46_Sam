function parseValue(s) {
    if (typeof s === "string") {
        if (s === "true") {
            return true;
        } else if (s === "false") {
            return false;
        } else if (!isNaN(parseInt(s, 10))) {
            return parseInt(s, 10)
        }
        var j
        try {
            j = JSON.parse(s)
        } catch (e) {
            return s;
        }
        return j;
    }
    return s;

}

export function getLocalStorageValue(key, defaultValue) {
    return localStorage.getItem(key);
}

export function setLocalStorageValue(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function colorTrace(msg, color) {
    console.log("%c" + msg, "color:" + color + ";font-weight:bold;");
}

export function domReady(doSomething) {
    if (this.readyState === "loading") {
        this.addEventListener("DOMContentLoaded", doSomething);
    } else {
        doSomething();
    }
}

export function pageLog(...data) {
    const location2 = document.location;
    const page = location2.href;
    console.log.apply(null, ["".concat(page, "\n"), ...data]);
}
var concat = (list) => Array.prototype.concat.bind(list);
var promiseConcat = (f) => (x) => f().then(concat(x));
var promiseReduce = (acc, x) => acc.then(promiseConcat(x));
export var serial = (funcs) => funcs.reduce(promiseReduce, Promise.resolve([]));
export var setAsyncTimeout = (cb, timeout = 0) => new Promise((resolve) => {
    setTimeout(() => {
        if (cb.constructor.name == "AsyncFunction") {
            cb().then((_) => resolve());
        } else {
            cb();
            resolve();
        }
    }, timeout);
});

export function getFirstLevelDomain(hostname) {
    const domainParts = hostname.split(".").reverse();
    const isIp = /^\d+\.\d+\.\d+\.\d+$/.test(domainParts[0]);
    return isIp ? domainParts[0] : "".concat(domainParts[1], ".").concat(domainParts[0]);
}