import NotificationManager from "./NotificationManager.js";
import ConfigManager from "./ConfigManager.js";

// Module for OCR and text extraction
const TextExtractor = (() => {
    // Process the video frame to extract text
    const processFrame = async () => {
        try {
            // For this example, we'll simulate OCR with mock data
            NotificationManager.show("Extracting text from video...", "info");

            // Get extraction image
            let image = ConfigManager.getExtractedImageData();

            // Send image to OCR service (ocr-space-request)
            chrome.runtime.sendMessage(
                {
                    type: "ocr-space-request",
                    image: image.dataUrl,
                },
                (response) => {
                    console.log("OCR Response:", response);
                    if (response && response.success) {
                        ConfigManager.updateExtractedImageData({
                            text: response.text,
                            textOverlay: response.textOverlay,
                        });

                        NotificationManager.show("Text extracted successfully!", "success");
                        ConfigManager.updateState("DONE");
                    } else {
                        NotificationManager.show("Text extraction failed. Please try again.", "error");
                        ConfigManager.updateState("READY");
                    }
                }
            );
        } catch (error) {
            NotificationManager.show("Text extraction failed. Please try again.", "error");
            ConfigManager.updateState("READY");
        }
    };

    return {
        processFrame,
    };
})();

export default TextExtractor;
