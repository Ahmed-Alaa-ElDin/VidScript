import ConfigManager from "./ConfigManager.js";
import NotificationManager from "./NotificationManager.js";
import EventManager from "./EventManager.js";
import VideoManager from "./VideoManager.js";

// Module for UI operations
const UIFactory = (() => {
    // Create the main button icon
    const createVideoIcon = () => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("version", "1.0");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("width", "15");
        svg.setAttribute("height", "15");
        svg.setAttribute("viewBox", "0 0 600 600");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

        svg.innerHTML = `
            <g transform="matrix(0.1, 0, 0, -0.1, -203.299118, 898.282043)" fill="#000000" stroke="none">
                <path d="M 2693.46 8946.44 C 2392.42 8891.72 2141.39 8680.22 2078.63 8425.44 C 2060.98 8353.57 2060 8263.74 2060 5965.76 C 2060 3331.33 2056.07 3515.08 2120.8 3381.97 C 2225.72 3168.82 2439.49 3017.75 2698.36 2973.66 C 2787.59 2958.13 2855.26 2957.32 5058.65 2957.32 C 7560.13 2957.32 7393.42 2954.05 7549.34 3007.95 C 7815.08 3099.42 8014.14 3319.9 8051.4 3561.63 C 8059.24 3610.62 8061.21 4329.25 8059.24 6015.58 L 8056.3 8400.12 L 8033.75 8461.37 C 7984.72 8592.84 7878.82 8726.76 7761.15 8804.34 C 7667.01 8867.22 7603.27 8895.8 7492.46 8928.47 L 7399.31 8955.42 L 5080.21 8957.05 C 3055.29 8957.87 2752.29 8957.05 2693.46 8946.44 Z M 7360.08 8619.79 C 7477.76 8594.47 7575.81 8526.7 7631.71 8430.33 L 7664.07 8375.62 L 7667.01 5995.16 C 7668.98 4206.75 7667.01 3603.27 7658.19 3569.78 C 7624.85 3439.13 7516.98 3338.68 7364.01 3299.49 C 7306.15 3284.79 7235.55 3283.97 5055.7 3283.97 C 2830.74 3283.97 2806.23 3283.97 2743.47 3300.3 C 2624.82 3330.51 2526.76 3406.47 2480.67 3502.01 L 2457.14 3549.37 L 2457.14 5958.42 L 2457.14 8367.45 L 2479.69 8414.81 C 2525.78 8509.55 2624.82 8585.49 2743.47 8616.52 C 2798.38 8631.22 2881.73 8632.04 5050.8 8632.04 C 7055.12 8632.85 7308.12 8631.22 7360.08 8619.79 Z" style="stroke-miterlimit: 7.44; stroke-width: 130px; stroke-opacity: 0.37; fill: rgb(255, 255, 255);"/>
                <path d="M 3148.45 8002.42 C 3124.92 7991.8 3091.58 7969.76 3075.89 7952.6 L 3045.49 7920.76 L 3042.55 7153.14 C 3040.59 6414.9 3040.59 6384.69 3059.22 6351.21 C 3086.68 6298.13 3137.67 6270.37 3211.21 6266.28 C 3284.76 6263.01 3274.95 6258.12 3639.72 6450.02 C 3792.7 6530.86 4105.51 6695.01 4334.97 6815.87 C 4564.42 6935.91 4760.55 7040.43 4770.35 7047.79 C 4802.71 7070.65 4827.23 7127.82 4820.36 7162.93 C 4808.59 7220.91 4763.49 7249.49 4364.39 7455.28 C 4156.5 7562.26 3835.85 7728.04 3650.52 7823.58 C 3466.16 7919.13 3299.47 8002.42 3280.83 8008.95 C 3233.77 8025.28 3198.47 8023.65 3148.45 8002.42 Z M 3403.82 7728.4 C 3416.8 7723.85 3532.97 7665.81 3661.44 7599.22 C 3790.59 7532.64 4014.04 7417.13 4158.91 7342.57 C 4437.03 7199.17 4468.45 7179.24 4476.66 7138.84 C 4481.45 7114.38 4464.36 7074.54 4441.81 7058.6 C 4434.97 7053.48 4298.31 6980.63 4138.41 6896.98 C 3978.51 6812.76 3760.52 6698.38 3653.92 6642.04 C 3399.72 6508.3 3406.55 6511.71 3355.3 6513.99 C 3304.05 6516.85 3268.52 6536.19 3249.39 6573.18 C 3236.4 6596.51 3236.4 6617.57 3237.76 7132.01 L 3239.82 7666.94 L 3261 7689.14 C 3271.93 7701.08 3295.17 7716.46 3311.57 7723.85 C 3346.41 7738.65 3371.02 7739.79 3403.82 7728.4 Z" style="paint-order: stroke markers; fill-rule: evenodd; fill: rgb(255, 255, 255);"/>
                <path d="M 4898.81 8017.05 C 4821.34 7994.03 4766.43 7932.38 4766.43 7866.61 C 4766.43 7799.23 4825.26 7732.63 4901.75 7714.54 C 4925.28 7709.61 5294.97 7706.31 5987.26 7706.31 C 6989.42 7706.31 7038.46 7707.13 7076.7 7721.95 C 7125.73 7740.86 7156.12 7765.5 7179.66 7809.08 C 7222.8 7886.34 7181.62 7974.32 7085.52 8011.3 C 7048.26 8026.09 6997.27 8026.92 5987.26 8026.09 C 5275.35 8026.09 4918.42 8022.81 4898.81 8017.05 Z" style="fill: rgb(255, 255, 255);"/>
                <path d="M 4933.12 6759.01 C 4830.17 6745.61 4766.43 6686.02 4766.43 6602.93 C 4766.43 6537.46 4825.26 6466.1 4891.94 6449.33 C 4906.65 6446 5399.89 6443.46 5987.26 6443.46 C 7052.18 6443.46 7056.11 6443.46 7095.33 6461.07 C 7116.9 6470.33 7148.28 6494.66 7163.97 6513.95 C 7189.46 6544.16 7193.39 6557.62 7193.39 6602.08 C 7193.39 6666.72 7161.03 6714.56 7097.29 6743.09 L 7056.11 6762.37 L 6016.68 6763.24 C 5445 6764.1 4957.64 6762.37 4933.12 6759.01 Z" style="fill: rgb(255, 255, 255);"/>
                <path d="M 3134.73 5488.11 C 2984.7 5443.26 2970.96 5263.74 3112.17 5199.74 L 3153.36 5180.6 L 5104.73 5180.6 L 7056.11 5180.6 L 7102.19 5203.07 C 7156.12 5230.48 7189.46 5272.05 7196.33 5322.73 C 7206.14 5395.85 7146.32 5472.32 7063.95 5491.46 C 7038.46 5498.1 6415.78 5500.6 5099.83 5500.6 C 3488.72 5499.76 3167.09 5498.1 3134.73 5488.11 Z" style="fill: rgb(255, 255, 255);"/>
                <path d="M 3155.4 4222.19 C 2960.6 4163.1 2965.62 3985.06 3164.19 3930.08 C 3205.67 3919.4 3424.35 3917.76 5109.68 3917.76 C 7149.42 3917.76 7055.15 3916.14 7124.27 3957.13 C 7195.92 3999.01 7217.28 4089.25 7170.77 4151.61 C 7143.13 4188.56 7099.14 4213.16 7033.79 4227.94 C 7002.37 4235.31 6513.49 4237.75 5098.36 4237.75 C 3284.85 4237.75 3203.15 4236.96 3155.4 4222.19 Z" style="fill: rgb(255, 255, 255);"/>
            </g>
        `;

        return svg;
    };

    // Create the menu dots icon
    const createDotsIcon = () => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("version", "1.0");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("width", "15");
        svg.setAttribute("height", "15");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

        svg.innerHTML = `
            <g fill="currentColor">
            <rect width="4" height="4" x="10" y="3" rx="2"/>
            <rect width="4" height="4" x="10" y="10" rx="2"/>
            <rect width="4" height="4" x="10" y="17" rx="2"/>
            </g>
        `;

        return svg;
    };

    // Create the main button
    const createMainButton = () => {
        const { buttonId, buttonText, title } = ConfigManager.get("attributes");

        // Create main wrapper
        const wrapper = document.createElement("div");
        wrapper.id = buttonId;
        wrapper.title = title;
        wrapper.className = ConfigManager.getCurrentStatus() === "READY" ? "checked" : "";

        // Create toggler wrapper
        const togglerWrapper = document.createElement("label");
        togglerWrapper.setAttribute("for", "vidscript-toggle");
        togglerWrapper.id = "vidscript-toggler-wrapper";

        // Add icon
        togglerWrapper.appendChild(createVideoIcon());

        // Add text label
        const text = document.createElement("span");
        text.textContent = buttonText;
        togglerWrapper.appendChild(text);

        // Add toggle switch
        const switchWrapper = document.createElement("div");
        switchWrapper.id = "vidscript-switch-wrapper";

        const switchLabel = document.createElement("label");
        switchLabel.id = "vidscript-switch-label";

        const toggle = document.createElement("input");
        toggle.id = "vidscript-toggle";
        toggle.type = "checkbox";
        toggle.checked = ConfigManager.getCurrentStatus() === "READY" ? true : false;

        const slider = document.createElement("span");
        slider.id = "vidscript-slider";

        switchLabel.appendChild(toggle);
        switchLabel.appendChild(slider);
        switchWrapper.appendChild(switchLabel);
        togglerWrapper.appendChild(switchWrapper);

        // Add toggler wrapper to main wrapper
        wrapper.appendChild(togglerWrapper);

        // Add menu button
        const menuButton = document.createElement("button");
        menuButton.id = "vidscript-menu-button";
        menuButton.ariaLabel = "VidScript Menu";
        menuButton.title = "VidScript Menu";
        menuButton.appendChild(createDotsIcon());

        wrapper.appendChild(menuButton);

        return wrapper;
    };

    // Create settings menu
    const createSettingsMenu = () => {
        const menu = document.createElement("div");
        menu.id = "vidscript-menu";

        // Menu header
        const header = document.createElement("div");
        header.className = "vidscript-menu-header";
        header.textContent = "VidScript Settings";
        menu.appendChild(header);

        // Menu items
        const settings = ConfigManager.get("settings");

        // Show bounding boxes toggle
        const showBoxes = createMenuToggleItem(
            "Show Bounding Boxes",
            "showBoundingBoxes",
            settings.showBoundingBoxes,
            "Show text detection boxes"
        );
        menu.appendChild(showBoxes);

        // About button
        const aboutItem = document.createElement("div");
        aboutItem.className = "vidscript-menu-item";
        aboutItem.textContent = "About VidScript";
        aboutItem.addEventListener("click", () => {
            EventManager.emit("show-about");
        });
        menu.appendChild(aboutItem);

        return menu;
    };

    // Helper to create menu toggle items
    const createMenuToggleItem = (label, key, initialValue, tooltip = "") => {
        const item = document.createElement("div");
        item.className = "vidscript-menu-item";
        if (tooltip) {
            item.classList.add("vidscript-tooltip");
            item.setAttribute("data-tooltip", tooltip);
        }

        const labelSpan = document.createElement("span");
        labelSpan.textContent = label;

        const toggle = document.createElement("input");
        toggle.type = "checkbox";
        toggle.style.cursor = "pointer";
        toggle.checked = initialValue;
        toggle.addEventListener("change", (e) => {
            ConfigManager.update(`settings.${key}`, e.target.checked);
            EventManager.emit("setting-changed", { key, value: e.target.checked });
        });

        item.appendChild(labelSpan);
        item.appendChild(toggle);

        return item;
    };

    // Create text extraction modal
    const createModal = (headerTitle, text, buttons = []) => {
        // Create backdrop
        const backdrop = document.createElement("div");
        backdrop.className = "vidscript-backdrop active";

        // Create modal
        const modal = document.createElement("div");
        modal.id = "vidscript-modal";
        modal.className = "active";

        // Add click event to backdrop
        backdrop.addEventListener("click", () => {
            document.body.removeChild(backdrop);
            document.body.removeChild(modal);
        });

        // Modal header
        const header = document.createElement("div");
        header.className = "vidscript-modal-header";

        const title = document.createElement("h3");
        title.textContent = headerTitle;

        const closeButton = document.createElement("button");
        closeButton.className = "vidscript-close-button";
        closeButton.innerHTML = "×";
        closeButton.addEventListener("click", () => {
            document.body.removeChild(backdrop);
            document.body.removeChild(modal);
        });

        header.appendChild(title);
        header.appendChild(closeButton);
        modal.appendChild(header);

        // Modal content
        const content = document.createElement("div");
        content.className = "vidscript-modal-content";
        const textArea = document.createElement("div");
        textArea.id = "vidscript-extracted-text";
        textArea.textContent = text || "No text was detected in this frame.";
        content.appendChild(textArea);

        modal.appendChild(content);

        // Modal footer
        const footer = document.createElement("div");
        footer.className = "vidscript-modal-footer";

        // Create buttons
        for (const button of buttons) {
            const buttonElement = document.createElement("button");
            buttonElement.className = button.classNames;
            buttonElement.textContent = button.text;
            buttonElement.addEventListener("click", () => {
                button.action();
            });
            footer.appendChild(buttonElement);
        }

        modal.appendChild(footer);

        // Add to DOM
        document.body.appendChild(backdrop);
        document.body.appendChild(modal);

        return { modal, backdrop };
    };

    // Create notification component
    const createNotification = (message, type = "info") => {
        let statusElement = document.getElementById("vidscript-status");

        if (!statusElement) {
            statusElement = document.createElement("div");
            statusElement.id = "vidscript-status";
        }

        // Set notification style based on type
        switch (type) {
            case "success":
                statusElement.style.backgroundColor = "#4caf50";
                statusElement.style.color = "white";
                break;
            case "error":
                statusElement.style.backgroundColor = "#f44336";
                statusElement.style.color = "white";
                break;
            default:
                statusElement.style.backgroundColor = "#2196f3";
                statusElement.style.color = "white";
        }

        statusElement.textContent = message;
        statusElement.style.opacity = "1";

        if (!statusElement.parentNode) {
            document.body.appendChild(statusElement);
        }

        return statusElement;
    };

    // Create the video overlay
    const createVideoOverlay = (frameData) => {
        const videoContainer = document.querySelector(".html5-video-container");
        if (!videoContainer) return false;

        // Remove old overlay
        const existingOverlay = document.getElementById("vidscript-overlay");
        if (existingOverlay) existingOverlay.remove();

        // Remove old border
        const existingBorder = document.getElementById("vidscript-border");
        if (existingBorder) existingBorder.remove();

        // Create container
        const overlay = document.createElement("div");
        overlay.id = "vidscript-overlay";
        overlay.style.width = `${frameData.width}px`;
        overlay.style.height = `${frameData.height}px`;
        overlay.style.left = `${frameData.left}px`;
        overlay.style.top = `${frameData.top}px`;

        // Image layer
        const inner = document.createElement("div");
        inner.id = "vidscript-overlay-inner";
        inner.style.background = `url(${frameData.dataUrl}) no-repeat center center`;

        // Magic sparkle line
        const sparkle = document.createElement("div");
        sparkle.id = "vidscript-sparkle";

        const borderOverlay = document.createElement("div");
        borderOverlay.id = "vidscript-border";
        borderOverlay.style.left = `${frameData.left}px`;
        borderOverlay.style.top = `${frameData.top}px`;
        borderOverlay.style.width = `${frameData.width}px`;
        borderOverlay.style.height = `${frameData.height}px`;

        // Add to DOM
        overlay.appendChild(inner);
        overlay.appendChild(sparkle);
        videoContainer.appendChild(overlay);
        videoContainer.appendChild(borderOverlay);

        console.log("✅ Overlay is gradually revealed with magic effect");
        return true;
    };

    // Remove overlay
    const removeVideoOverlay = () => {
        const overlay = document.getElementById("vidscript-overlay");
        const sparkle = document.getElementById("vidscript-sparkle");
        const borderOverlay = document.getElementById("vidscript-border");

        if (overlay) overlay.remove();
        if (sparkle) sparkle.remove();
        if (borderOverlay) borderOverlay.remove();

        console.log("✅ Overlay is gradually hidden with magic effect");
        return true;
    };

    return {
        createMainButton,
        createSettingsMenu,
        createModal,
        createNotification,
        createVideoOverlay,
        removeVideoOverlay,
    };
})();

export default UIFactory;
