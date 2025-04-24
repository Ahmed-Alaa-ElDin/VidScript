import EventManager from "./EventManager.js";

// Module for configuration settings
const ConfigManager = (() => {
    const statuses = ["OFF", "READY", "EXTRACTING", "DONE"];

    // Core configuration with defaults
    const config = {
        selectors: {
            targetButtons: ".ytp-right-controls", // Target buttons container
            existingButton: "#vidscript-wrapper", // Our button wrapper
            videoContainer: ".html5-video-container", // Video container
            videoElement: "video", // Video element
        },
        attributes: {
            buttonId: "vidscript-wrapper",
            buttonText: "VidScript",
            title: "Extract Text",

            buttonClasses: "ytp-vidscript-button",
            buttonClassesLegacy:
                "yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading yt-spec-button-shape-next--enable-backdrop-filter-experiment",
            ariaLabel: "Extract Text",
        },
        // Default settings that can be overridden by user
        settings: {
            showBoundingBoxes: false,
            language: "auto",
            fontFamily: "Arial",
            fontSize: 20,
            boxColor: "rgba(255, 0, 0, 0.5)",
            textColor: "rgba(255, 255, 255, 0.9)",
            overlayBackground: "rgba(0, 0, 0, 0.6)",
        },
        status: {
            current: "OFF",
        },
    };

    return {
        get: (path) => {
            // Parse dot notation path to get nested config values
            return path.split(".").reduce((obj, key) => obj && obj[key], config);
        },
        getAll: () => config,
        update: (path, value) => {
            const keys = path.split(".");
            const lastKey = keys.pop();
            const target = keys.reduce((obj, key) => obj[key], config);
            target[lastKey] = value;

            // Save to localStorage when updating settings
            if (path.startsWith("settings.")) {
                localStorage.setItem("vidscript_settings", JSON.stringify(config.settings));
            }
            return value;
        },
        loadSavedSettings: () => {
            try {
                const savedSettings = localStorage.getItem("vidscript_settings");
                if (savedSettings) {
                    const parsed = JSON.parse(savedSettings);
                    config.settings = { ...config.settings, ...parsed };
                }
            } catch (e) {
                console.error("Error loading saved settings:", e);
            }
        },
        updateStatus: (newStatus) => {
            // Validate the new status is valid
            if (!statuses.includes(newStatus)) {
                console.error(`Invalid status: ${newStatus}`);
                return false;
            }

            const previousStatus = config.status.current;
            config.status.current = newStatus;

            // Emit status change event
            if (typeof EventManager !== "undefined") {
                switch (newStatus) {
                    case "OFF":
                        EventManager.emit("remove-overlay");
                        break;
                    case "READY":
                        EventManager.emit("add-overlay");
                        break;
                    case "EXTRACTING":
                        EventManager.emit("start-extraction");
                        break;
                    case "DONE":
                        EventManager.emit("end-extraction");
                        break;
                }
            }

            return true;
        },
        getCurrentStatus: () => {
            return config.status.current;
        },
    };
})();

export default ConfigManager;
