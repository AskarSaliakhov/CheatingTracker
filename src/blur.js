let focusLostCount = 0;
let onFocusLostCallback = null;

function initBlurTracker() {
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            focusLostCount++;
            if (typeof onFocusLostCallback === 'function') {
                onFocusLostCallback(focusLostCount);
            }
        }
    });
}

function onFocusLost(callback) {
    onFocusLostCallback = callback;
}

function getFocusLostCount() {
    return focusLostCount;
}

export {
    initBlurTracker,
    onFocusLost,
    getFocusLostCount
};
