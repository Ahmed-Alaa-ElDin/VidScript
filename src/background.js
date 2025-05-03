chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "ocr-space-request" && message.image) {
        const apiKey = "K84343132688957";

        const formData = new FormData();
        formData.append("base64Image", message.image);
        formData.append("language", "auto");
        formData.append("isOverlayRequired", true);
        formData.append("OCREngine", 2);

        fetch("https://api.ocr.space/parse/image", {
            method: "POST",
            headers: {
                apikey: apiKey,
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                const parsedResult = data.ParsedResults?.[0];
                
                if (parsedResult) {
                    const text = data.ParsedResults?.[0]?.ParsedText || "";
                    const textOverlay = parsedResult.TextOverlay;
                    sendResponse({ success: true, text: text, textOverlay: textOverlay });
                } else {
                    sendResponse({ success: false, error: "No parsed results" });
                }
            })
            .catch((error) => {
                console.error("OCR.space Error:", error);
                sendResponse({ success: false, error: error.message });
            });

        return true; // Keeps the channel open for async response
    }
});
