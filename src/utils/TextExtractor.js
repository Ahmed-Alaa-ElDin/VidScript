import NotificationManager from "./NotificationManager.js";
import VideoManager from "./VideoManager.js";
import ConfigManager from "./ConfigManager.js";

// Module for OCR and text extraction
const TextExtractor = (() => {
    // Process the video frame to extract text
    const processFrame = async (frameData) => {
        try {
            // In a real extension, this would connect to a backend API
            // or use a WebAssembly OCR solution like Tesseract.js

            // For this example, we'll simulate OCR with mock data
            NotificationManager.show("Processing frame...", "info");

            // Simulate API call with timeout
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Mock OCR result
            const mockExtractedText = generateMockText(frameData);

            return {
                success: true,
                text: mockExtractedText.fullText,
                lines: mockExtractedText.lines,
                timestamp: frameData.timestamp,
                frameWidth: frameData.width,
                frameHeight: frameData.height,
            };
        } catch (error) {
            console.error("Text extraction error:", error);
            return {
                success: false,
                error: error.message,
            };
        }
    };

    // Generate mock OCR text data
    const generateMockText = (frameData) => {
        const videoTitle = VideoManager.getVideoTitle();
        const timestamp = VideoManager.formatTime(frameData.timestamp);

        // Create mock text lines based on video data
        const lines = [
            {
                text: `${videoTitle} - Transcript at ${timestamp}`,
                confidence: 0.95,
                boundingBox: {
                    x: 50,
                    y: 50,
                    width: 400,
                    height: 30,
                },
                words: [
                    {
                        text: videoTitle,
                        confidence: 0.97,
                        boundingBox: { x: 50, y: 50, width: 300, height: 30 },
                    },
                    {
                        text: "-",
                        confidence: 0.99,
                        boundingBox: { x: 355, y: 50, width: 10, height: 30 },
                    },
                    {
                        text: "Transcript",
                        confidence: 0.96,
                        boundingBox: { x: 370, y: 50, width: 70, height: 30 },
                    },
                    {
                        text: "at",
                        confidence: 0.98,
                        boundingBox: { x: 445, y: 50, width: 20, height: 30 },
                    },
                    {
                        text: timestamp,
                        confidence: 0.95,
                        boundingBox: { x: 470, y: 50, width: 70, height: 30 },
                    },
                ],
            },
            {
                text: "This is a simulated OCR result for demonstration.",
                confidence: 0.92,
                boundingBox: {
                    x: 50,
                    y: 90,
                    width: 450,
                    height: 30,
                },
                words: [
                    {
                        text: "This",
                        confidence: 0.93,
                        boundingBox: { x: 50, y: 90, width: 40, height: 30 },
                    },
                    {
                        text: "is",
                        confidence: 0.95,
                        boundingBox: { x: 95, y: 90, width: 20, height: 30 },
                    },
                    {
                        text: "a",
                        confidence: 0.97,
                        boundingBox: { x: 120, y: 90, width: 10, height: 30 },
                    },
                    {
                        text: "simulated",
                        confidence: 0.91,
                        boundingBox: { x: 135, y: 90, width: 90, height: 30 },
                    },
                    {
                        text: "OCR",
                        confidence: 0.94,
                        boundingBox: { x: 230, y: 90, width: 40, height: 30 },
                    },
                    {
                        text: "result",
                        confidence: 0.92,
                        boundingBox: { x: 275, y: 90, width: 50, height: 30 },
                    },
                    {
                        text: "for",
                        confidence: 0.96,
                        boundingBox: { x: 330, y: 90, width: 30, height: 30 },
                    },
                    {
                        text: "demonstration.",
                        confidence: 0.89,
                        boundingBox: { x: 365, y: 90, width: 135, height: 30 },
                    },
                ],
            },
            {
                text: "VidScript would extract the actual text from your video frame.",
                confidence: 0.9,
                boundingBox: {
                    x: 50,
                    y: 130,
                    width: 500,
                    height: 30,
                },
                words: [
                    {
                        text: "VidScript",
                        confidence: 0.95,
                        boundingBox: { x: 50, y: 130, width: 80, height: 30 },
                    },
                    {
                        text: "would",
                        confidence: 0.92,
                        boundingBox: { x: 135, y: 130, width: 60, height: 30 },
                    },
                    {
                        text: "extract",
                        confidence: 0.91,
                        boundingBox: { x: 200, y: 130, width: 70, height: 30 },
                    },
                    {
                        text: "the",
                        confidence: 0.98,
                        boundingBox: { x: 275, y: 130, width: 30, height: 30 },
                    },
                    {
                        text: "actual",
                        confidence: 0.93,
                        boundingBox: { x: 310, y: 130, width: 60, height: 30 },
                    },
                    {
                        text: "text",
                        confidence: 0.97,
                        boundingBox: { x: 375, y: 130, width: 40, height: 30 },
                    },
                    {
                        text: "from",
                        confidence: 0.94,
                        boundingBox: { x: 420, y: 130, width: 50, height: 30 },
                    },
                    {
                        text: "your",
                        confidence: 0.93,
                        boundingBox: { x: 475, y: 130, width: 40, height: 30 },
                    },
                    {
                        text: "video",
                        confidence: 0.92,
                        boundingBox: { x: 520, y: 130, width: 50, height: 30 },
                    },
                    {
                        text: "frame.",
                        confidence: 0.9,
                        boundingBox: { x: 575, y: 130, width: 60, height: 30 },
                    },
                ],
            },
        ];

        // Combine all text
        const fullText = lines.map((line) => line.text).join("\n");

        return {
            fullText,
            lines,
        };
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
