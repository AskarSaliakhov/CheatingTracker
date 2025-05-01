import { KEYS } from "./consts.js";

function formatTime(date) {
    return date.toTimeString().split(" ")[0];
}

export function createAltTabTracker(onAltTabDetected = () => {}) {
    let isAltPressed = false;
    let altPressedAt = 0;
    let isWaitingForFocus = false;
    let hiddenStartedAt = 0;

    const events = [];
    let lastEvent = null;

    function handleKeyDown(event) {
        if (event.keyCode === KEYS.ALT) {
            isAltPressed = true;
            altPressedAt = Date.now();
        }
    }

    function handleKeyUp(event) {
        if (event.keyCode === KEYS.ALT) {
            isAltPressed = false;
        }
    }

    function handleVisibilityChange() {
        const now = Date.now();

        if (document.visibilityState === "hidden" && isAltPressed) {
            const timeSinceAlt = now - altPressedAt;
            if (timeSinceAlt > 1) {
                isWaitingForFocus = true;
                hiddenStartedAt = now;

                lastEvent = {
                    at: formatTime(new Date(now)),
                    durationMs: null,
                };

                onAltTabDetected();
            }
        } else if (document.visibilityState === "visible") {
            isAltPressed = false;
            isWaitingForFocus = false;

            const visibleAt = Date.now();
            const duration = visibleAt - hiddenStartedAt;

            if (lastEvent && lastEvent.durationMs === null) {
                lastEvent.durationMs = duration;
                events.push({ ...lastEvent });
            }
        }
    }


    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    document.addEventListener("blur", handleVisibilityChange);

    return {
        destroy: () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        },
        lastEvent: () => lastEvent,
        events: () => events,
    };
}
