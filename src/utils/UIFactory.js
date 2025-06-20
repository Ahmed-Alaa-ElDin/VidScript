import ConfigManager from "./ConfigManager.js";
import EventManager from "./EventManager.js";
import VideoManager from "./VideoManager.js";
import DOMManager from "./DOMManager.js";

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
        // Create main wrapper
        const wrapper = document.createElement("div");
        wrapper.id = "vidscript-wrapper";
        wrapper.title = "Extract Text";
        wrapper.className = ConfigManager.getCurrentState() === "READY" ? "checked" : "";

        // Create toggler wrapper
        const togglerWrapper = document.createElement("label");
        togglerWrapper.setAttribute("for", "vidscript-toggle");
        togglerWrapper.id = "vidscript-toggler-wrapper";

        // Add icon
        togglerWrapper.appendChild(createVideoIcon());

        // Add text label
        const text = document.createElement("span");
        text.textContent = "VidScript";
        togglerWrapper.appendChild(text);

        // Add toggle switch
        const switchWrapper = document.createElement("div");
        switchWrapper.id = "vidscript-switch-wrapper";

        const switchLabel = document.createElement("label");
        switchLabel.id = "vidscript-switch-label";

        const toggle = document.createElement("input");
        toggle.id = "vidscript-toggle";
        toggle.type = "checkbox";
        toggle.checked = ConfigManager.getCurrentState() === "READY" ? true : false;

        const slider = document.createElement("span");
        slider.id = "vidscript-toggle-slider";

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
        let stateElement = document.getElementById("vidscript-state");

        if (!stateElement) {
            stateElement = document.createElement("div");
            stateElement.id = "vidscript-state";
        }

        // Set notification style based on type
        switch (type) {
            case "success":
                stateElement.style.backgroundColor = "#4caf50";
                stateElement.style.color = "white";
                break;
            case "error":
                stateElement.style.backgroundColor = "#f44336";
                stateElement.style.color = "white";
                break;
            default:
                stateElement.style.backgroundColor = "#2196f3";
                stateElement.style.color = "white";
        }

        stateElement.textContent = message;
        stateElement.style.opacity = "1";

        if (!stateElement.parentNode) {
            document.body.appendChild(stateElement);
        }

        return stateElement;
    };

    // Create the video overlay
    const createVideoOverlay = () => {
        const frameData = ConfigManager.getFrameData();

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

        // Selection mode toggler
        const selectionToggleContainer = createSelectorToggle();

        // Selection canvas
        const selectionCanvas = createSelectionCanvas();

        // Add to DOM
        overlay.appendChild(inner);
        overlay.appendChild(sparkle);
        overlay.appendChild(selectionToggleContainer);
        overlay.appendChild(selectionCanvas);
        videoContainer.appendChild(overlay);
        videoContainer.appendChild(borderOverlay);

        // Initialize the tools on that canvas:
        setupSelectionTools(selectionCanvas);

        // Add click event to overlay
        overlay.addEventListener("click", (e) => {
            e.stopPropagation();
        });

        console.log("✅ Overlay is gradually revealed with magic effect");
        return true;
    };

    // Resize the video overlay
    // Resize the video overlay
    const resizeVideoOverlay = () => {
        const frameData = ConfigManager.getFrameData();

        // Find the existing overlay
        const overlay = document.querySelector("#vidscript-overlay");

        // If no overlay exists, create one
        if (!overlay) {
            return createVideoOverlay();
        }

        // Get old dimensions before updating
        const oldWidth = parseFloat(overlay.style.width) || frameData.width;
        const oldHeight = parseFloat(overlay.style.height) || frameData.height;

        // Calculate scale factors
        const scaleX = frameData.width / oldWidth;
        const scaleY = frameData.height / oldHeight;

        // Update overlay dimensions and position
        overlay.style.width = `${frameData.width}px`;
        overlay.style.height = `${frameData.height}px`;
        overlay.style.left = `${frameData.left}px`;
        overlay.style.top = `${frameData.top}px`;

        // Update overlay inner background
        const inner = document.querySelector("#vidscript-overlay-inner");
        if (inner) {
            inner.style.background = `url(${frameData.dataUrl}) no-repeat center center`;
            inner.style.backgroundSize = "100% 100%";
        }

        // Update border overlay if it exists
        const borderOverlay = document.querySelector("#vidscript-border");
        if (borderOverlay) {
            borderOverlay.style.width = `${frameData.width}px`;
            borderOverlay.style.height = `${frameData.height}px`;
            borderOverlay.style.left = `${frameData.left}px`;
            borderOverlay.style.top = `${frameData.top}px`;
        }

        // Update selection canvas
        const selectionCanvas = document.querySelector("#vidscript-selection-canvas");

        if (selectionCanvas) {
            selectionCanvas.width = frameData.width;
            selectionCanvas.height = frameData.height;
            selectionCanvas.style.width = `${frameData.width}px`;
            selectionCanvas.style.height = `${frameData.height}px`;

            // Get current selection data
            const currentSelectorSettings = ConfigManager.getCurrentSelectorSettings();

            // If there's an active selection, scale it to the new dimensions
            if (currentSelectorSettings.path && currentSelectorSettings.path.length) {
                // Scale the existing path
                const scaledPath = currentSelectorSettings.path.map((point) => ({
                    x: point.x * scaleX,
                    y: point.y * scaleY,
                }));

                // Update start coordinates
                const startX = currentSelectorSettings.startX * scaleX;
                const startY = currentSelectorSettings.startY * scaleY;

                // Update the selector settings
                ConfigManager.updateSelectorSettings("startX", startX);
                ConfigManager.updateSelectorSettings("startY", startY);
                ConfigManager.updateSelectorSettings("path", scaledPath);

                // Redraw the path on the canvas
                const ctx = selectionCanvas.getContext("2d");
                ctx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
                ctx.strokeStyle = currentSelectorSettings.strokeStyle;
                ctx.lineWidth = currentSelectorSettings.lineWidth;

                if (currentSelectorSettings.mode === "rectangle" && scaledPath.length >= 2) {
                    // Redraw rectangle
                    const width = scaledPath[1].x - startX;
                    const height = scaledPath[1].y - startY;
                    ctx.strokeRect(startX, startY, width, height);
                } else if (currentSelectorSettings.mode === "freehand" && scaledPath.length >= 2) {
                    // Redraw freehand path
                    ctx.beginPath();
                    ctx.moveTo(scaledPath[0].x, scaledPath[0].y);

                    for (let i = 1; i < scaledPath.length; i++) {
                        ctx.lineTo(scaledPath[i].x, scaledPath[i].y);
                    }

                    ctx.stroke();
                }
            }
        }

        console.log(
            "🔄 Video overlay resized to",
            frameData.width,
            "x",
            frameData.height,
            "with scale factors:",
            scaleX.toFixed(2),
            "x",
            scaleY.toFixed(2)
        );

        return overlay;
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

    // Create selector toggle
    const createSelectorToggle = () => {
        // Create the wrapper
        const selectionToolsWrapper = document.createElement("div");
        selectionToolsWrapper.id = "vidscript-selection-tools-wrapper";

        // Create a toggle switch container
        const toggleContainer = document.createElement("div");
        toggleContainer.id = "vidscript-selector-toggle";

        // Create the switch (tiny button)
        const switchButton = document.createElement("div");
        switchButton.id = "vidscript-selector-toggle-button";

        // The tiny circle that moves
        const switchCircle = document.createElement("div");
        switchCircle.id = "vidscript-selector-toggle-circle";

        // Text label
        const switchLabel = document.createElement("span");
        switchLabel.id = "vidscript-selector-toggle-label";
        switchLabel.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3a2 2 0 0 0-2 2m16-2a2 2 0 0 1 2 2m0 14a2 2 0 0 1-2 2M5 21a2 2 0 0 1-2-2M9 3h1M9 21h1m4-18h1m-1 18h1M3 9v1m18-1v1M3 14v1m18-1v1"/></svg>';

        // Full screen selector
        const fullScreenSelector = document.createElement("button");
        fullScreenSelector.id = "vidscript-full-screen-selector";
        fullScreenSelector.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><path fill="none" stroke="currentColor" d="M2 14.5h11m-5.5-4v4m-7-13v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-12a1 1 0 0 0-1 1Z" stroke-width="1"/></svg>';

        // Add text label
        const fullScreenLabel = document.createElement("span");
        fullScreenLabel.id = "vidscript-label";
        fullScreenLabel.innerText = "Selection Tools";

        // Assemble the toggle
        selectionToolsWrapper.appendChild(fullScreenLabel);
        selectionToolsWrapper.appendChild(fullScreenSelector);
        selectionToolsWrapper.appendChild(toggleContainer);
        switchButton.appendChild(switchCircle);
        toggleContainer.appendChild(switchButton);
        toggleContainer.appendChild(switchLabel);

        // Logic for switching
        let currentMode = ConfigManager.getCurrentSelectorMode();

        toggleContainer.addEventListener("click", (e) => {
            e.stopPropagation();

            currentMode = currentMode === "rectangle" ? "freehand" : "rectangle";
            ConfigManager.updateSelectorSettings("mode", currentMode);

            switchCircle.style.left = currentMode === "rectangle" ? "1px" : "15px";
            switchLabel.innerHTML =
                currentMode === "rectangle"
                    ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3a2 2 0 0 0-2 2m16-2a2 2 0 0 1 2 2m0 14a2 2 0 0 1-2 2M5 21a2 2 0 0 1-2-2M9 3h1M9 21h1m4-18h1m-1 18h1M3 9v1m18-1v1M3 14v1m18-1v1"/></svg>'
                    : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M8.162 2.212a8 8 0 0 1 3.676 0a.75.75 0 0 1-.344 1.46a6.5 6.5 0 0 0-2.988 0a.75.75 0 0 1-.344-1.46M6.825 3.437a.75.75 0 0 1-.242 1.033A6.54 6.54 0 0 0 4.47 6.583a.75.75 0 0 1-1.275-.79a8.04 8.04 0 0 1 2.598-2.598a.75.75 0 0 1 1.032.242m6.35 0a.75.75 0 0 1 1.032-.242a8.04 8.04 0 0 1 2.598 2.598a.75.75 0 0 1-1.275.79a6.54 6.54 0 0 0-2.112-2.113a.75.75 0 0 1-.243-1.033M3.114 7.604a.75.75 0 0 1 .558.902a6.5 6.5 0 0 0 0 2.988a.75.75 0 0 1-1.46.344a8 8 0 0 1 0-3.676a.75.75 0 0 1 .902-.558m13.772 0a.75.75 0 0 1 .902.558a8 8 0 0 1 0 3.676a.75.75 0 0 1-1.46-.344a6.5 6.5 0 0 0 0-2.988a.75.75 0 0 1 .558-.902m-13.449 5.57a.75.75 0 0 1 1.033.244a6.54 6.54 0 0 0 2.113 2.112a.75.75 0 1 1-.79 1.275a8.04 8.04 0 0 1-2.598-2.598a.75.75 0 0 1 .242-1.032m13.673 1.262a.75.75 0 0 0-1.22-.872l-.003.004l-.017.022l-.074.097a10.3 10.3 0 0 1-1.33 1.376c-1.018-.73-2.34-1.313-3.966-1.313c-.752 0-1.388.244-1.84.677A2.17 2.17 0 0 0 7.987 16c0 .571.224 1.144.671 1.573c.453.433 1.088.677 1.841.677c1.532 0 2.868-.584 3.915-1.274l.055.054a8.4 8.4 0 0 1 1.285 1.67l.06.108l.012.024l.002.003c-.152-.266 0 .002 0 .002a.75.75 0 0 0 1.342-.672l-.001-.002v-.001l-.003-.005l-.007-.012l-.022-.043l-.08-.146a10 10 0 0 0-1.445-1.903a12 12 0 0 0 1.362-1.44q.063-.078.097-.125l.026-.036l.008-.01l.003-.004zm-6.61.814c1.027 0 1.91.304 2.65.743c-.784.443-1.683.757-2.65.757c-.422 0-.668-.131-.803-.26a.67.67 0 0 1-.21-.49c0-.179.07-.356.21-.49c.135-.129.38-.26.803-.26"/></svg>';

            console.log(`🖱️ Switched to: ${currentMode} mode`);
        });

        fullScreenSelector.addEventListener("click", (e) => {
            e.stopPropagation();

            // Clear the old drawing
            const selectionCanvas = document.getElementById("vidscript-selection-canvas");
            if (selectionCanvas) {
                selectionCanvas
                    .getContext("2d")
                    .clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
            }

            // Process the full screen
            processSelectedRegion(true);
        });

        return selectionToolsWrapper;
    };

    // Create selection canvas
    const createSelectionCanvas = () => {
        const frameData = ConfigManager.getFrameData();
        const selectionCanvas = document.createElement("canvas");
        selectionCanvas.id = "vidscript-selection-canvas";
        selectionCanvas.width = frameData.width;
        selectionCanvas.height = frameData.height;

        // Apply styling using Object.assign for clean property assignment
        Object.assign(selectionCanvas.style, {
            position: "absolute",
            top: "0",
            left: "0",
            width: `${frameData.width}px`,
            height: `${frameData.height}px`,
            cursor: "crosshair",
            zIndex: 10001,
            pointerEvents: "auto",
        });

        return selectionCanvas;
    };

    // Setup selection tools
    const setupSelectionTools = (canvas) => {
        // Drawing context and state variables
        const ctx = canvas.getContext("2d");

        // Initialize mode listener
        initModeToggleListener(ctx);

        // Set up event listeners with capture phase
        setupSelectionEventListeners(canvas, ctx);
    };

    // Initialize mode toggle listener
    const initModeToggleListener = (ctx) => {
        const toggleElement = document.getElementById("vidscript-selector-toggle");
        if (!toggleElement) return;

        toggleElement.addEventListener("click", () => {
            // Clear any in-progress drawing
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        });
    };

    // Set up all event listeners
    const setupSelectionEventListeners = (canvas, ctx) => {
        // Mouse down - start drawing
        canvas.addEventListener(
            "mousedown",
            (e) => {
                e.preventDefault();
                e.stopPropagation();

                startDrawing(e, canvas);
            },
            true
        );

        // Mouse move - update drawing
        canvas.addEventListener(
            "mousemove",
            (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (!ConfigManager.getCurrentSelectorSettings().isActive) return;

                updateDrawing(e, canvas, ctx);
            },
            true
        );

        // Mouse up - finish drawing and process
        canvas.addEventListener(
            "mouseup",
            (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (!ConfigManager.getCurrentSelectorSettings().isActive) return;

                finishDrawing(ctx, ConfigManager.getCurrentSelectorSettings());
            },
            true
        );
    };

    // Handle starting a drawing operation
    const startDrawing = (e, canvas) => {
        ConfigManager.updateSelectorSettings("isActive", true);

        const rect = canvas.getBoundingClientRect();
        ConfigManager.updateSelectorSettings("startX", e.clientX - rect.left);
        ConfigManager.updateSelectorSettings("startY", e.clientY - rect.top);

        // Initialize path for freehand drawing
        if (ConfigManager.getCurrentSelectorSettings().mode === "freehand") {
            ConfigManager.updateSelectorSettings("path", [
                {
                    x: ConfigManager.getCurrentSelectorSettings().startX,
                    y: ConfigManager.getCurrentSelectorSettings().startY,
                },
            ]);
        } else {
            ConfigManager.updateSelectorSettings("path", []);
        }
    };

    // Handle drawing updates during mouse movement
    const updateDrawing = (e, canvas, ctx) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Clear previous drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Apply drawing styles
        ctx.strokeStyle = ConfigManager.getCurrentSelectorSettings().strokeStyle;
        ctx.lineWidth = ConfigManager.getCurrentSelectorSettings().lineWidth;

        if (ConfigManager.getCurrentSelectorSettings().mode === "rectangle") {
            // Draw rectangle
            const width = x - ConfigManager.getCurrentSelectorSettings().startX;
            const height = y - ConfigManager.getCurrentSelectorSettings().startY;
            ctx.strokeRect(
                ConfigManager.getCurrentSelectorSettings().startX,
                ConfigManager.getCurrentSelectorSettings().startY,
                width,
                height
            );

            // Store current position in path (this is what was missing)
            ConfigManager.updateSelectorSettings("path", [
                {
                    x: ConfigManager.getCurrentSelectorSettings().startX,
                    y: ConfigManager.getCurrentSelectorSettings().startY,
                },
                { x, y },
            ]);
        } else {
            // Draw freehand path
            ConfigManager.updateSelectorSettings("path", [
                ...ConfigManager.getCurrentSelectorSettings().path,
                { x, y },
            ]);
            drawFreehandPath(ctx, ConfigManager.getCurrentSelectorSettings().path);
        }
    };

    // Draw freehand path
    const drawFreehandPath = (ctx, path) => {
        if (path.length < 2) return;

        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);

        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
        }

        ctx.stroke();
    };

    // Handle finishing a drawing operation
    const finishDrawing = () => {
        ConfigManager.updateSelectorSettings("isActive", false);

        // Process the selected region
        processSelectedRegion();
    };

    // Process the selected region for OCR
    const processSelectedRegion = (fullScreen = false) => {
        const image = new Image();
        image.src = ConfigManager.getFrameData().dataUrl;

        image.onload = () => {
            let cropData;

            if (fullScreen) {
                cropData = extractFullScreenRegion();
            } else {
                cropData = extractImageRegion(image);
            }

            if (!cropData) return;

            ConfigManager.updateExtractedImageData({
                dataUrl: cropData.dataUrl,
                currentTime: VideoManager.getCurrentTime(),
                timestamp: Date.now(),
            });

            ConfigManager.updateState("EXTRACTING");

            // Download image
            // downloadImage(cropData.dataUrl);
        };
    };

    const downloadImage = (dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "selected_region.png";
        link.click();
    };

    // Extract the selected region from the image
    const extractImageRegion = (image) => {
        const cropCanvas = document.createElement("canvas");
        const cropCtx = cropCanvas.getContext("2d");

        if (ConfigManager.getCurrentSelectorSettings().mode === "rectangle") {
            return extractRectangleRegion(image, cropCanvas, cropCtx);
        } else {
            return extractFreehandRegion(image, cropCanvas, cropCtx);
        }
    };

    // Extract rectangle region
    const extractRectangleRegion = (image, cropCanvas, cropCtx) => {
        const { startX, startY, path } = ConfigManager.getCurrentSelectorSettings();
        const endX = path[1]?.x ?? startX;
        const endY = path[1]?.y ?? startY;

        // Calculate width and height (absolute values)
        const width = Math.abs(endX - startX);
        const height = Math.abs(endY - startY);

        // Calculate the top-left corner coordinates
        const x = Math.min(startX, endX);
        const y = Math.min(startY, endY);

        // Skip if selection is too small
        if (width < 5 || height < 5) return null;

        cropCanvas.width = width;
        cropCanvas.height = height;

        cropCtx.drawImage(
            image,
            x,
            y,
            width,
            height,
            0,
            0,
            width,
            height
        );

        return {
            dataUrl: cropCanvas.toDataURL("image/png"),
        };
    };

    // Extract freehand region
    const extractFreehandRegion = (image, cropCanvas, cropCtx) => {
        const path = ConfigManager.getCurrentSelectorSettings().path;

        // Calculate bounding box of path
        const minX = Math.min(...path.map((p) => p.x));
        const maxX = Math.max(...path.map((p) => p.x));
        const minY = Math.min(...path.map((p) => p.y));
        const maxY = Math.max(...path.map((p) => p.y));

        const width = maxX - minX;
        const height = maxY - minY;

        // Skip if selection is too small
        if (width < 5 || height < 5) return null;

        cropCanvas.width = width;
        cropCanvas.height = height;

        // Clip to path
        cropCtx.save();
        cropCtx.beginPath();
        cropCtx.translate(-minX, -minY);
        cropCtx.moveTo(path[0].x, path[0].y);

        path.forEach((p) => cropCtx.lineTo(p.x, p.y));

        cropCtx.closePath();
        cropCtx.clip();

        // Draw the image shifted
        cropCtx.drawImage(image, 0, 0);
        cropCtx.restore();

        return {
            dataUrl: cropCanvas.toDataURL("image/png"),
        };
    };

    // Extract full screen region
    const extractFullScreenRegion = () => {
        return {
            dataUrl: ConfigManager.getFrameData().dataUrl,
        };
    };

    // Create results canvas
    const createResultsCanvas = () => {
        const canvasParent = document.createElement("div");
        canvasParent.id = "vidscript-slider-content-left-results-canvas-wrapper";
        canvasParent.style.position = "relative";

        const canvas = document.createElement("img");
        canvas.id = "vidscript-results-image";
        canvas.src = ConfigManager.getExtractedImageData().dataUrl;
        canvasParent.appendChild(canvas);

        return canvasParent;
    };

    // Put the image on the canvas
    const putImageOnCanvas = () => {
        const canvasParent = document.querySelector("#vidscript-slider-content-left-results-canvas");
        if (!canvasParent) {
            return;
        }

        const canvas = createResultsCanvas();
        canvasParent.appendChild(canvas);
    };

    // Display OCR result
    const drawResultsOnCanvas = async () => {
        const canvasParent = document.querySelector(
            "#vidscript-slider-content-left-results-canvas-wrapper"
        );
        const canvas = document.querySelector("#vidscript-results-image");
        const textOverlay = ConfigManager.getExtractedImageData().textOverlay;

        if (!canvasParent || !canvas || !textOverlay) {
            return;
        }

        // Wait for the image to load if it's not already loaded
        if (!canvas.complete || canvas.naturalWidth === 0) {
            await new Promise((resolve) => {
                canvas.onload = resolve;
                // In case the image is already loaded but the event didn't fire
                if (canvas.complete) resolve();
            });
        }

        // Remove existing overlay if it exists
        const existingOverlay = document.querySelector("#vidscript-results-overlay-canvas");
        if (existingOverlay) {
            canvasParent.removeChild(existingOverlay);
        }

        // Create overlay canvas
        const overlayCanvas = document.createElement("canvas");
        overlayCanvas.id = "vidscript-results-overlay-canvas";

        // Set canvas dimensions to match the image
        overlayCanvas.width = canvas.naturalWidth || canvas.width;
        overlayCanvas.height = canvas.naturalHeight || canvas.height;

        canvasParent.appendChild(overlayCanvas);

        // Get context
        const ctx = overlayCanvas.getContext("2d");
        if (!ctx) {
            console.error("Failed to get canvas context");
            return;
        }

        // Clear canvas
        ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

        // Draw each word at its position
        textOverlay.Lines.forEach((line) => {
            line.Words.forEach((word) => {
                try {
                    const x = word.Left;
                    const y = word.Top;
                    const width = word.Width;
                    const height = word.Height;

                    // Draw bounding box with blur effect
                    ctx.save();

                    // Create a clipping region for the blur effect
                    ctx.beginPath();
                    ctx.rect(x, y, width, height);
                    ctx.clip();

                    // Apply blur effect to the background
                    ctx.filter = "blur(5px)";
                    // Draw a slightly larger rectangle for the blur to spread
                    const padding = 10;
                    ctx.drawImage(
                        canvas,
                        Math.max(0, x - padding),
                        Math.max(0, y - padding),
                        Math.min(canvas.width, width + padding * 2),
                        Math.min(canvas.height, height + padding * 2),
                        x - padding,
                        y - padding,
                        width + padding * 2,
                        height + padding * 2
                    );

                    // Reset filter and draw a semi-transparent overlay
                    ctx.filter = "none";
                    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
                    ctx.fillRect(x, y, width, height);
                    ctx.restore();

                    // Set text styling
                    const fontSize = height;
                    ctx.font = `${fontSize}px Arial`;
                    ctx.fillStyle = "white";
                    ctx.textBaseline = "top";

                    // Draw the word
                    const measured = ctx.measureText(word.WordText);
                    const scaleX = width / measured.width;

                    ctx.save();
                    ctx.translate(x, y);
                    ctx.scale(scaleX, 1);
                    ctx.fillText(word.WordText, 0, 0);
                    ctx.restore();
                } catch (error) {
                    console.error(`Error drawing word: ${error.message}`);
                }
            });
        });
    };

    // Add results to text area
    const addResultsToTextArea = () => {
        const textArea = document.querySelector("#vidscript-slider-content-left-results-textarea");
        if (!textArea) {
            return;
        }

        textArea.value = ConfigManager.getExtractedImageData().text;
    };

    // Load chat
    const loadChat = () => {
        const chat = ConfigManager.getExtractedImageData().chat;

        chat.forEach((message) => {
            DOMManager.addSliderChatMessage(message.content, message.role, new Date(message.timestamp).toLocaleString(), false);
        });
    };

    // Render results
    const renderResults = () => {
        addResultsToTextArea();
        putImageOnCanvas();
        drawResultsOnCanvas();
        loadChat();
    };

    return {
        createMainButton,
        createSettingsMenu,
        createModal,
        createNotification,
        createVideoOverlay,
        resizeVideoOverlay,
        removeVideoOverlay,
        createResultsCanvas,
        drawResultsOnCanvas,
        addResultsToTextArea,
        renderResults,
    };
})();

export default UIFactory;
