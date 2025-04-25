export function createBlurTracker(setFocusLostCount) {
    let localCount = 0;

    const handleBlur = () => {
        localCount++;
        if (setFocusLostCount) {
            setFocusLostCount(localCount);
        }
    };

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            handleBlur();
        }
    });

    return {
        getCount: () => localCount,
        cleanup: () => {
            document.removeEventListener('visibilitychange', handleBlur);
        }
    };
}
