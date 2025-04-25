let screenshotCount = 0;
let onScreenshotCallback = null;


function initScreenshotTracker() {
    document.addEventListener('keydown', (e) => {
        console.log(e)
        if (e.key === 'PrintScreen') {
            screenshotCount++;
            if (typeof onScreenshotCallback === 'function') {
                onScreenshotCallback(screenshotCount);
            }
        }
    });
}

function onScreenshot(callback) {
    onScreenshotCallback = callback;
}

function getScreenshotCount() {
    return screenshotCount;
}

export {
    initScreenshotTracker,
    onScreenshot,
    getScreenshotCount
};
