const cohereKey = import.meta.env.VITE_COHERE_KEY;
const ocrKey = import.meta.env.VITE_OCR_SPACE_KEY;
const youtubeApiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
const pasteBinApiKey = import.meta.env.VITE_PASTEBIN_API_KEY;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "ocr-space-request" && message.image) {
        const formData = new FormData();
        formData.append("base64Image", message.image);
        formData.append("language", "auto");
        formData.append("isOverlayRequired", true);
        formData.append("OCREngine", 2);

        fetch("https://api.ocr.space/parse/image", {
            method: "POST",
            headers: {
                apikey: ocrKey,
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
                sendResponse({ success: false, error: error.message });
            });

        return true; // Keeps the channel open for async response
    }

    if (message.type === "send-llm-request" && message.prompt) {
        fetch("https://api.cohere.ai/v2/chat", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${cohereKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "command-a-03-2025",
                messages: message.prompt,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.message && data.message.content && data.message.content[0] && data.message.content[0].text) {
                    sendResponse({ success: true, result: data.message.content[0].text });
                } else {
                    sendResponse({ success: false, error: "Empty response from Cohere" });
                }
            })
            .catch(error => {
                sendResponse({ success: false, error: error.message });
            });

        return true;
    }

    if (message.type === "get-video-context" && message.videoId) {
        fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${message.videoId}&key=${youtubeApiKey}`)
            .then(response => response.json())
            .then(data => {
                sendResponse({ success: true, result: data });
            })
            .catch(error => {
                sendResponse({ success: false, error: error.message });
            });

        return true;
    }
});
