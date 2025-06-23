import ConfigManager from "./ConfigManager.js";
import NotificationManager from "./NotificationManager.js";

const PopUpService = (() => {
    const addCurrentResultsToLocalStore = async () => {
        const { context, extractedImageData } = ConfigManager.getAll();

        if (!extractedImageData.text && !extractedImageData.chat.length) {
            NotificationManager.show("No text data found", "error");
            return;
        }

        const { videoId, videoTitle, videoDescription, videoContext } = context;
        const { currentTime } = extractedImageData;

        if (!videoId || !currentTime) {
            NotificationManager.show("Missing required videoId or timestamp", "error");
            return;
        }

        try {
            // Get existing results from localStorage
            const savedResults = await getSavedResults();

            // Initialize video entry if it doesn't exist
            if (!savedResults[videoId]) {
                savedResults[videoId] = {
                    videoId,
                    videoTitle,
                    videoDescription,
                    videoContext,
                    results: {},
                };
            }

            // Find existing result by timestamp or create new one
            savedResults[videoId].results[currentTime] = extractedImageData;

            // Save updated results to localStorage
            chrome.storage.local.set({ "vidscript_results": savedResults });

            NotificationManager.show("Results saved successfully", "success");
        } catch (error) {
            console.error("Error adding results to local storage:", error);
            
            NotificationManager.show("Error adding results to storage", "error");
        }
    }

    // Helper function to get saved results
    const getSavedResults = async () => {
        try {
            const saved = await chrome.storage.local.get("vidscript_results");
            return saved.vidscript_results ?? {};
        } catch (error) {
            console.error("Error parsing saved results:", error);
            return {};
        }
    }

    return {
        addCurrentResultsToLocalStore,
        getSavedResults,
    }
})()

export default PopUpService
