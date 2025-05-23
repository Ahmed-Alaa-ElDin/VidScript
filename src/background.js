const cohereKey = import.meta.env.VITE_COHERE_KEY;
const ocrKey = import.meta.env.VITE_OCR_SPACE_KEY;

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
                console.error("OCR Error:", error);
                sendResponse({ success: false, error: error.message });
            });

        return true; // Keeps the channel open for async response
    }

    if (message.type === "send-llm-request" && message.text) {
        console.log("Cohere Request:", message.text);
        
        fetch("https://api.cohere.ai/v2/chat", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${cohereKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "command-a-03-2025",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant.",
                    },
                    {
                        role: "user",
                        content: message.text,
                    },
                ],
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log("Cohere Response:", data);
                
                if (data.message && data.message.content && data.message.content[0] && data.message.content[0].text) {
                    sendResponse({ success: true, result: data.message.content[0].text });
                } else {
                    sendResponse({ success: false, error: "Empty response from Cohere" });
                }
            })
            .catch(error => {
                console.error("Cohere Error:", error);
                sendResponse({ success: false, error: error.message });
            });

        return true;
    }
});
