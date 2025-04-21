// Module for configuration settings
const ConfigManager = (() => {
    // Core configuration with defaults
    const config = {
        selectors: {
            targetButtons: ".ytp-right-controls",
            existingButton: "#vidscript-wrapper",
            videoContainer: ".html5-video-container",
            videoElement: "video",
        },
        attributes: {
            buttonId: "vidscript-wrapper",
            buttonClasses: "ytp-vidscript-button",
            buttonClassesLegacy:
                "yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading yt-spec-button-shape-next--enable-backdrop-filter-experiment",
            ariaLabel: "Extract Text",
            title: "Extract Text",
            buttonText: "VidScript",
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
        states: {
            extract: false,
            showBoundingBoxes: false,
            language: "auto",
            fontFamily: "Arial",
            fontSize: 20,
            boxColor: "rgba(255, 0, 0, 0.5)",
            textColor: "rgba(255, 255, 255, 0.9)",
            overlayBackground: "rgba(0, 0, 0, 0.6)",
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
    };
})();

export default ConfigManager;
