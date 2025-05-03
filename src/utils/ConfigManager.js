import EventManager from "./EventManager.js";

// Module for configuration settings
const ConfigManager = (() => {
    const states = ["OFF", "READY", "EXTRACTING", "DONE"];
    const selectorStates = ["rectangle", "freehand"];

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

        // Current state of the application
        state: "OFF",

        // Current extraction image data
        extractionImage: {
            dataUrl: null,
            currentTime: null,
            timestamp: null,
            text: null,
            textOverlay: null,
        },

        // Current selector settings
        selectorSettings: {
            mode: "rectangle",
            strokeStyle: "#ff6666",
            lineWidth: 2,
            isActive: false,
            startX: 0,
            startY: 0,
            path: [],
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

        getExtractionImage: () => {
            return config.extractionImage;
        },

        updateExtractionImage: (image) => {
            config.extractionImage = { ...config.extractionImage, ...image };
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

        updateState: (newState) => {
            // Validate the new state is valid
            if (!states.includes(newState)) {
                console.error(`Invalid state: ${newState}`);
                return false;
            }

            config.state = newState;

            // Emit state change event
            if (typeof EventManager !== "undefined") {
                switch (newState) {
                    case "OFF":
                        EventManager.emit("remove-overlay");
                        EventManager.emit("toggle-vidscript", false);
                        break;
                    case "READY":
                        EventManager.emit("add-overlay");
                        EventManager.emit("toggle-vidscript", true);
                        EventManager.emit("hide-results");
                        break;
                    case "EXTRACTING":
                        EventManager.emit("extract-text");
                        break;
                    case "DONE":
                        EventManager.emit("show-results");
                        break;
                }
            }

            return true;
        },

        getCurrentState: () => {
            return config.state;
        },

        getCurrentSelectorMode: () => {
            return config.selectorSettings.mode;
        },

        updateSelectorSettings: (key = null, value) => {
            switch (key) {
                case "mode":
                    if (!selectorStates.includes(value)) {
                        console.error(`Invalid selector setting: ${value}`);
                        return false;
                    }
                    config.selectorSettings.mode = value;
                    break;
                case "isActive":
                    config.selectorSettings.isActive = value;
                    break;
                case "startX":
                    config.selectorSettings.startX = value;
                    break;
                case "startY":
                    config.selectorSettings.startY = value;
                    break;
                case "path":
                    config.selectorSettings.path = value;
                    break;
                case "strokeStyle":
                    config.selectorSettings.strokeStyle = value;
                    break;
                case "lineWidth":
                    config.selectorSettings.lineWidth = value;
                    break;
                case null:
                    config.selectorSettings = value;
                    break;
                default:
                    config.selectorSettings[key] = value;
                    break;
            }

            // Emit selector setting change event
            if (typeof EventManager !== "undefined") {
                EventManager.emit("update-selector-settings", config.selectorSettings);
            }

            return true;
        },

        getCurrentSelectorSettings: (key = null) => {
            if (key) {
                return config.selectorSettings[key];
            }

            return config.selectorSettings;
        },

        resetSettings: () => {
            config.settings = {
                showBoundingBoxes: false,
                language: "auto",
                fontFamily: "Arial",
                fontSize: 20,
                boxColor: "rgba(255, 0, 0, 0.5)",
                textColor: "rgba(255, 255, 255, 0.9)",
                overlayBackground: "rgba(0, 0, 0, 0.6)",
            };

            config.selectorSettings = {
                mode: "rectangle",
                strokeStyle: "#ff6666",
                lineWidth: 2,
                isActive: false,
                startX: 0,
                startY: 0,
                path: [],
            };
        },
    };
})();

export default ConfigManager;
