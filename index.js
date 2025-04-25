import {
    initScreenshotTracker,
    onScreenshot,
    getScreenshotCount
} from './screenshot.js';

import {
    initBlurTracker,
    onFocusLost,
    getFocusLostCount
} from './blur.js';

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
