import VidScriptApp from "./utils/VidScriptApp.js";

(function () {
    // Check if we're on YouTube
    if (window.location.hostname.includes("youtube.com")) {
        // Initialize on DOM ready
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", VidScriptApp.init);
        } else {
            VidScriptApp.init();
        }
    }
})();
