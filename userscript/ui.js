import {
    domReady
} from "./utils";
import {
    DefaultMinDelay,
    DefaultMaxDelay,
    settings
} from './settings';

function createMenuButton() {
    const menuButton = document.createElement("button");
    menuButton.id = "initiumMenuButton";
    menuButton.style.display = "none";
    menuButton.style.position = "fixed";
    menuButton.style.bottom = "20px";
    menuButton.style.right = "20px";
    menuButton.style.zIndex = "9999";
    menuButton.style.background = "transparent";
    menuButton.style.border = "none";
    menuButton.style.padding = "20px";
    menuButton.style.cursor = "pointer";
    menuButton.style.backgroundImage = 'url("https://cdn.discordapp.com/attachments/1125852090477051975/1182877216690942074/Y.png")';
    menuButton.style.backgroundSize = "contain";
    const storedYPosition = settings.menuButtonYPosition;
    menuButton.style.bottom = storedYPosition;
    return menuButton;
}

function createBackgroundOverlay() {
    const backgroundOverlay = document.createElement("div");
    backgroundOverlay.id = "initiumBackgroundOverlay";
    backgroundOverlay.style.display = "none";
    backgroundOverlay.style.position = "fixed";
    backgroundOverlay.style.top = "0";
    backgroundOverlay.style.left = "0";
    backgroundOverlay.style.width = "100%";
    backgroundOverlay.style.height = "100%";
    backgroundOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    backgroundOverlay.style.zIndex = "9998";
    backgroundOverlay.style.backdropFilter = "grayscale(100%)";
    return backgroundOverlay;
}

function createanswerDelayContainer() {
    const answerDelayContainer = document.createElement("div");
    answerDelayContainer.style.display = "flex";
    answerDelayContainer.style.flexDirection = "row";
    const answerDelayInput = document.createElement("input");
    answerDelayInput.type = "number";
    answerDelayInput.value = settings.answerDelay;
    answerDelayInput.placeholder = "Set answer delay (5s recommended)";
    answerDelayInput.style.marginTop = "10px";
    answerDelayInput.style.padding = "5px 10px";
    answerDelayInput.style.border = "none";
    answerDelayInput.style.borderRadius = "5px";
    answerDelayInput.style.flex = "1";
    answerDelayInput.style.backgroundColor = "#111";
    answerDelayInput.style.color = "#FFF";
    answerDelayContainer.appendChild(answerDelayInput);
    const setanswerDelayButton = document.createElement("button");
    setanswerDelayButton.textContent = "Set answer Delay";
    setanswerDelayButton.style.marginTop = "10px";
    setanswerDelayButton.style.marginLeft = "10px";
    setanswerDelayButton.style.padding = "5px 10px";
    setanswerDelayButton.style.backgroundColor = "#111";
    setanswerDelayButton.style.color = "#FFF";
    setanswerDelayButton.style.border = "none";
    setanswerDelayButton.style.borderRadius = "5px";
    setanswerDelayButton.style.cursor = "pointer";
    setanswerDelayButton.addEventListener("click", () => {
        const newanswerDelay = parseInt(answerDelayInput.value, 10) || DefaultanswerDelay;
        settings.answerDelay = newanswerDelay;
    });
    answerDelayContainer.appendChild(setanswerDelayButton);
    return answerDelayContainer;
}

function createMinDelayContainer() {
    const minDelayContainer = document.createElement("div");
    minDelayContainer.style.display = "flex";
    minDelayContainer.style.flexDirection = "row";
    const minDelayInput = document.createElement("input");
    minDelayInput.type = "number";
    minDelayInput.value = settings.minDelay;
    minDelayInput.placeholder = "Set minimum delay (24s recommended)";
    minDelayInput.style.marginTop = "10px";
    minDelayInput.style.padding = "5px 10px";
    minDelayInput.style.border = "none";
    minDelayInput.style.borderRadius = "5px";
    minDelayInput.style.flex = "1";
    minDelayInput.style.backgroundColor = "#111";
    minDelayInput.style.color = "#FFF";
    minDelayContainer.appendChild(minDelayInput);
    const setMinDelayButton = document.createElement("button");
    setMinDelayButton.textContent = "Set Min Delay";
    setMinDelayButton.style.marginTop = "10px";
    setMinDelayButton.style.marginLeft = "10px";
    setMinDelayButton.style.padding = "5px 10px";
    setMinDelayButton.style.backgroundColor = "#111";
    setMinDelayButton.style.color = "#FFF";
    setMinDelayButton.style.border = "none";
    setMinDelayButton.style.borderRadius = "5px";
    setMinDelayButton.style.cursor = "pointer";
    setMinDelayButton.addEventListener("click", () => {
        const newMinDelay = parseInt(minDelayInput.value, 10) || DefaultMinDelay;
        settings.minDelay = newMinDelay;
    });
    minDelayContainer.appendChild(setMinDelayButton);
    return minDelayContainer;
}

function createMaxDelayContainer() {
    const maxDelayContainer = document.createElement("div");
    maxDelayContainer.style.display = "flex";
    maxDelayContainer.style.flexDirection = "row";
    const maxDelayInput = document.createElement("input");
    maxDelayInput.type = "number";
    maxDelayInput.value = settings.maxDelay;
    maxDelayInput.placeholder = "Set maximum delay (36s recommended)";
    maxDelayInput.style.marginTop = "10px";
    maxDelayInput.style.padding = "5px 10px";
    maxDelayInput.style.border = "none";
    maxDelayInput.style.borderRadius = "5px";
    maxDelayInput.style.flex = "1";
    maxDelayInput.style.backgroundColor = "#111";
    maxDelayInput.style.color = "#FFF";
    maxDelayContainer.appendChild(maxDelayInput);
    const setMaxDelayButton = document.createElement("button");
    setMaxDelayButton.textContent = "Set Max Delay";
    setMaxDelayButton.style.marginTop = "10px";
    setMaxDelayButton.style.marginLeft = "10px";
    setMaxDelayButton.style.padding = "5px 10px";
    setMaxDelayButton.style.backgroundColor = "#111";
    setMaxDelayButton.style.color = "#FFF";
    setMaxDelayButton.style.border = "none";
    setMaxDelayButton.style.borderRadius = "5px";
    setMaxDelayButton.style.cursor = "pointer";
    setMaxDelayButton.addEventListener("click", () => {
        const newMaxDelay = parseInt(maxDelayInput.value, 10) || DefaultMaxDelay;
        settings.maxDelay = newMaxDelay;
    });
    maxDelayContainer.appendChild(setMaxDelayButton);
    return maxDelayContainer;
}

function createButtonList() {
    const buttonList = document.createElement("ul");
    buttonList.style.listStyleType = "none";
    buttonList.style.padding = "0";
    const buttonLabels = {
        autoAnswer: "Auto Answer",
        autoStart: "Auto Start",
        autoComplete: "Auto Complete",
        autoSubmit: "Auto Submit"
    };
    const buttonDescriptions = {
        autoAnswer: "Automatically answers questions.",
        autoStart: "Automatically starts any quizzes.",
        autoComplete: "Automatically completes questions on assignments when answered.",
        autoSubmit: "Automatically submits quizzes."
    };
    const showInMenu = ["autoAnswer", "autoStart", "autoComplete", "autoSubmit"];
    for (const setting in settings) {
        if (settings.hasOwnProperty(setting) && showInMenu.includes(setting)) {
            const button = document.createElement("button");
            button.className = "setting-button";
            button.textContent = buttonLabels[setting];
            button.title = buttonDescriptions[setting];
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
                autoAnswer: "https://cdn.discordapp.com/attachments/1125852090477051975/1182881314471428207/5.png",
                autoStart: "https://cdn.discordapp.com/attachments/1125852090477051975/1182881313892601896/q.png",
                autoComplete: "https://cdn.discordapp.com/attachments/1125852090477051975/1183038030433497138/p.png",
                autoSubmit: "https://cdn.discordapp.com/attachments/1125852090477051975/1183042721812860928/3.png"
            };
            button.style.border = "1px solid transparent";
            button.style.transition = "border-color 0.1s ease-out";
            button.addEventListener("mouseenter", () => {
                button.style.borderColor = "#FFF";
            });
            button.addEventListener("mouseleave", () => {
                button.style.borderColor = "transparent";
            });
            button.style.backgroundImage = "url('".concat(imageUrls[setting], "')");
            button.style.backgroundSize = "30px 30px";
            button.style.backgroundRepeat = "no-repeat";
            button.style.backgroundPosition = "10px center";
            const enabledIndicator = document.createElement("img");
            enabledIndicator.src = "https://raw.githubusercontent.com/INTIMSOCIAL/Edgesploit/main/enabled.png";
            enabledIndicator.alt = "enabled";
            enabledIndicator.style.width = "20%";
            const disabledIndicator = document.createElement("img");
            disabledIndicator.src = "https://raw.githubusercontent.com/Databones/Edgesploit/main/img/disabled.png";
            disabledIndicator.alt = "disabled";
            disabledIndicator.style.width = "20%";
            button.appendChild(enabledIndicator);
            button.appendChild(disabledIndicator);
            // enabledIndicator.style.display = settings[setting] ? "inline" : "none";
            // disabledIndicator.style.display = settings[setting] ? "none" : "inline";
            if (settings[setting] == 'true') {
                enabledIndicator.style.display = "inline";
                disabledIndicator.style.display = "none";
            } else {
                enabledIndicator.style.display = "none";
                disabledIndicator.style.display = "inline";
            }
            button.addEventListener("click", () => {
                if (settings[setting] == 'true') {
                    settings[setting] = false;
                    enabledIndicator.style.display = "none";
                    disabledIndicator.style.display = "inline";

                } else {
                    settings[setting] = true;
                    enabledIndicator.style.display = "inline";
                    disabledIndicator.style.display = "none";
                }
            });
            const listItem = document.createElement("li");
            listItem.appendChild(button);
            buttonList.appendChild(listItem);
        }
    }
    return buttonList;
}

function createMenuContainer() {
    const menuContainer = document.createElement("div");
    menuContainer.id = "edgesploitMenuContainer";
    menuContainer.style.display = "none";
    menuContainer.style.position = "fixed";
    menuContainer.style.fontFamily = "Roboto, sans-serif";
    menuContainer.style.fontSize = "12px";
    menuContainer.style.userSelect = 'none';
    menuContainer.style.top = "50%";
    menuContainer.style.background = "linear-gradient(45deg, #111, #333)";
    menuContainer.style.left = "50%";
    menuContainer.style.transform = "translate(-50%, -50%)";
    menuContainer.style.zIndex = "9999";
    menuContainer.style.width = "400px";
    // menuContainer.style.width = "800px";
    menuContainer.style.padding = "30px";
    menuContainer.style.color = "#FFF";
    menuContainer.style.borderRadius = "10px";
    menuContainer.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";
    menuContainer.style.transition = "transform 0.2s ease-in-out";
    document.body.appendChild(menuContainer);

    const titleElement = document.createElement("div");
    titleElement.style.textAlign = "center";
    titleElement.style.fontWeight = "100";
    titleElement.style.fontSize = "24px";

    titleElement.innerHTML = `
        <img src="https://raw.githubusercontent.com/INTIMSOCIAL/Edgesploit/main/initium.png" style="width: auto; height: 85px; user-drag: none; -moz-user-select: none; -webkit-user-drag: none; -webkit-user-select: none; -ms-user-select: none; user-select: none;">
        <div style="font-size: 24px; margin: 0px;">Initium</div>
        `;
    menuContainer.appendChild(titleElement);
    const applyBtn = document.createElement("button");
    applyBtn.textContent = "Apply changes?";
    applyBtn.style.marginTop = "5px";
    applyBtn.style.padding = "5px 10px";
    applyBtn.style.width = "49%";
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
    setBgButton.style.marginTop = "5px";
    setBgButton.style.marginLeft = "10px";
    setBgButton.style.padding = "5px 10px";
    setBgButton.style.width = "48%";
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

    const answerDelayContainer = createanswerDelayContainer();
    menuContainer.appendChild(answerDelayContainer);
    const minDelayContainer = createMinDelayContainer();
    menuContainer.appendChild(minDelayContainer);
    const maxDelayContainer = createMaxDelayContainer();
    menuContainer.appendChild(maxDelayContainer);
    const buttonList = createButtonList();
    menuContainer.appendChild(buttonList);
    return menuContainer;
}

export function createMenu() {
    let menuButton1 = document.getElementById("initiumMenuButton");
    if (menuButton1) {
        return;
    }
    const menuButton = createMenuButton();
    document.addEventListener("keydown", (event) => {
        if (event.shiftKey && event.key === "D") {
            const menuButton2 = document.getElementById("initiumMenuButton");
            const isHidden = menuButton2.style.display === "none" || menuButton2.style.display === "";
        }
    });
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
            menuButton.style.bottom = "".concat(constrainedY, "px");
            startY = e.clientY;
            settings.menuButtonYPosition = "".concat(constrainedY, "px");
        }
    });
    document.addEventListener("mouseup", () => {
        isDragging = false;
    });
    const backgroundOverlay = createBackgroundOverlay();
    backgroundOverlay.addEventListener("click", () => {
        toggleMenu();
    });
    const menuContainer = createMenuContainer();
    const toggleMenu = () => {
        const display = menuContainer.style.display === "none" ? "block" : "none";
        menuContainer.style.display = display;
        backgroundOverlay.style.display = display;
    };
    document.addEventListener("keydown", function (event) {
        if (event.shiftKey && event.key === "Z") {
            const menuContainer2 = document.getElementById("edgesploitMenuContainer");
            const backgroundOverlay2 = document.getElementById("initiumBackgroundOverlay");
            if (menuContainer2.style.display === "none") {
                // menuContainer2.style.display = "block";
                // backgroundOverlay2.style.display = "block";
            } else {
                menuContainer2.style.display = "none";
                backgroundOverlay2.style.display = "none";
            }
        }
    });
    menuButton.addEventListener("click", toggleMenu);
    domReady.call(document, (event) => {
        document.body.appendChild(menuButton);
        document.body.appendChild(backgroundOverlay);
        document.body.appendChild(menuContainer);
        const menuButton12 = document.getElementById("initiumMenuButton");
        // menuButton12.style.display = settings.menuButtonHidden ? "none" : "block";
    });
}