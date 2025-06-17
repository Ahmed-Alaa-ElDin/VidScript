import NotificationManager from "./NotificationManager.js";
import ConfigManager from "./ConfigManager.js";
import VideoManager from "./VideoManager.js";

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
                        NotificationManager.show(
                            "Text extraction failed. Please try again.",
                            "error"
                        );
                        ConfigManager.updateState("READY");
                    }
                }
            );
        } catch (error) {
            NotificationManager.show("Text extraction failed. Please try again.", "error");
            ConfigManager.updateState("READY");
        }
    };

    const prepareSharingText = () => {
        let videoTitle = ConfigManager.get("context.videoTitle");
        let videoId = ConfigManager.get("context.videoId");
        let text = ConfigManager.get("extractedImageData.text");
        let currentTime = ConfigManager.get("extractedImageData.currentTime");
        let currentTimeInSeconds = Math.floor(currentTime);
        let timestamp = VideoManager.formatTime(currentTime);
        let videoLink = `https://youtube.com/watch?v=${videoId}&t=${currentTimeInSeconds}s`;

        let sharingText = `From "${videoTitle}" → ${videoLink} \n🕒 ${timestamp} \n"${text}"`;

        return sharingText;
    };

    const copyOcrText = () => {
        let extractedText = ConfigManager.getExtractedImageData().text;

        if (!extractedText) {
            NotificationManager.show("No text to copy!", "error");
            return;
        }

        navigator.clipboard.writeText(extractedText);
        NotificationManager.show("Text copied to clipboard!", "success");
    };

    const getSharingText = (length = null) => {
        const sharingTextArea = document.querySelector(
            "#vidscript-platform-select-popup-body-textarea"
        );

        if (length && length < sharingTextArea.value.length) {
            return sharingTextArea.value.slice(0, length - 3) + "...\"";
        }

        return sharingTextArea.value;
    };

    const copySharingText = () => {
        let sharingText = getSharingText();

        if (!sharingText) {
            NotificationManager.show("No text to copy!", "error");
            return false;
        }

        navigator.clipboard.writeText(sharingText);
        NotificationManager.show("Text copied to clipboard!", "success");
        return true;
    };

    const shareToFacebook = async () => {
        const sharingText = getSharingText();

        if (!sharingText) {
            NotificationManager.show("No text to share!", "error");
            return false;
        }

        let sharingUrl = `https://www.facebook.com/sharer/sharer.php?u=`;

        window.open(sharingUrl, "_blank");
        return true;
    };

    const shareToLinkedIn = async () => {
        const sharingText = getSharingText();

        if (!sharingText) {
            NotificationManager.show("No text to share!", "error");
            return false;
        }

        let sharingUrl = `https://www.linkedin.com/sharing/share-offsite/?url=`;

        window.open(sharingUrl, "_blank");
        return true;
    };

    const shareToWhatsApp = async () => {
        const sharingText = getSharingText();

        if (!sharingText) {
            NotificationManager.show("No text to share!", "error");
            return false;
        }

        let sharingUrl = `https://wa.me/?text=${encodeURIComponent(sharingText)}`;

        window.open(sharingUrl, "_blank");
        return true;
    };

    const shareToTelegram = async () => {
        const sharingText = getSharingText();

        if (!sharingText) {
            NotificationManager.show("No text to share!", "error");
            return false;
        }

        let sharingUrl = `https://t.me/share/url?url=${encodeURIComponent(sharingText)}`;

        window.open(sharingUrl, "_blank");
        return true;
    };

    const shareToX = () => {
        const sharingText = getSharingText(280);
    
        if (!sharingText) {
            NotificationManager.show("No text to share!", "error");
            return false;
        }
    
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(sharingText)}`;
        window.open(twitterUrl, "_blank");
        return true;
    };
    return {
        processFrame,
        prepareSharingText,
        copyOcrText,
        copySharingText,
        shareToFacebook,
        shareToLinkedIn,
        shareToWhatsApp,
        shareToTelegram,
        shareToX,
    };
})();

export default TextExtractor;
