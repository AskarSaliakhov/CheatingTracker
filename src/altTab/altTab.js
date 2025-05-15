import { KEYS } from "./consts.js";

function formatTime(date) {
    return date.toTimeString().split(" ")[0];
}

export function createAltTabTracker(onAltTabDetected = () => {}) {
    let isAltPressed = false;
    let altPressedAt = 0;
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
                hiddenStartedAt = now;

                lastEvent = {
                    at: formatTime(new Date(now)),
                    durationMs: null,
                };

                onAltTabDetected();
            }
        } else if (document.visibilityState === "visible") {
            const duration = now - hiddenStartedAt;

            if (lastEvent && lastEvent.durationMs === null) {
                lastEvent.durationMs = duration;
                events.push({ ...lastEvent });
            }

            isAltPressed = false;
        }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    document.addEventListener("visibilitychange", handleVisibilityChange);

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
