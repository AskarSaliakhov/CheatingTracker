import {
    initScreenshotTracker,
    onScreenshot,
    getScreenshotCount
} from './src/screenshot.js';

import {
    initBlurTracker,
    onFocusLost,
    getFocusLostCount
} from './src/blur.js';

function startTracking() {
    initScreenshotTracker();
    initBlurTracker();
}

export {
    startTracking,
    onScreenshot,
    onFocusLost,
    getScreenshotCount,
    getFocusLostCount
};
