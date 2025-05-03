import NotificationManager from "./NotificationManager.js";
import VideoManager from "./VideoManager.js";
import ConfigManager from "./ConfigManager.js";

// Module for OCR and text extraction
const TextExtractor = (() => {
    // Process the video frame to extract text
    const processFrame = async () => {
        try {
            // For this example, we'll simulate OCR with mock data
            NotificationManager.show("Processing frame...", "info");

            // Get extraction image
            let image = ConfigManager.getExtractionImage();

            return {
                success: true,
                text: "Hello World",
                textOverlay: "Hello World",
            };

            // // Send image to OCR service (ocr-space-request)
            // chrome.runtime.sendMessage(
            //     {
            //         type: "ocr-space-request",
            //         image: image.dataUrl,
            //     },
            //     (response) => {
            //         if (response && response.success) {
            //             ConfigManager.updateExtractionImage({
            //                 text: response.text,
            //                 textOverlay: response.textOverlay,
            //             });

            //             ConfigManager.updateState("DONE");
            //         } else {
            //             console.log("response", response);
            //             NotificationManager.show("Text extraction failed. Please try again.", "error");
            //             ConfigManager.updateState("READY");
            //         }
            //     }
            // );
        } catch (error) {
            NotificationManager.show("Text extraction failed. Please try again.", "error");
            ConfigManager.updateState("READY");
        }
    };

    // Draw text overlay on canvas
    const drawTextOverlay = (canvas, ocrResult) => {
        if (!canvas || !ocrResult || !ocrResult.success) return;

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set up drawing style
        const settings = ConfigManager.get("settings");
        ctx.font = `${settings.fontSize}px ${settings.fontFamily}`;

        // Draw semi-transparent overlay
        ctx.fillStyle = ConfigManager.get("settings.overlayBackground");
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw each line and its words
        ocrResult.lines.forEach((line) => {
            line.words.forEach((word) => {
                const { boundingBox } = word;

                // Draw bounding box if enabled
                if (settings.showBoundingBoxes) {
                    ctx.strokeStyle = settings.boxColor;
                    ctx.lineWidth = 2;
                    ctx.strokeRect(
                        boundingBox.x,
                        boundingBox.y,
                        boundingBox.width,
                        boundingBox.height
                    );
                }

                // Draw text
                ctx.fillStyle = settings.textColor;
                ctx.fillText(
                    word.text,
                    boundingBox.x,
                    boundingBox.y + boundingBox.height * 0.8 // Position text within box
                );
            });
        });
    };

    return {
        processFrame,
        drawTextOverlay,
    };
})();

export default TextExtractor;
