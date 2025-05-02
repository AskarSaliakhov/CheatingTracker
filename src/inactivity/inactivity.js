import { ACTIVITY_EVENTS } from "./consts.js";

export function createInactivityTracker(timeoutInSeconds = 60) {
    let timeoutId;
    let isTracking = false;
    let lastActivityTime = Date.now();
    let lastInactivityEvent = null;

    const events = [];

    function getTimeString() {
        return new Date().toLocaleTimeString('ru-RU', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    }

    function logInactivity() {
        const time = getTimeString();
        const eventObj = {
            type: 'inactivity',
            time,
            message: `inactivity: ${timeoutInSeconds} seconds`,
        };
        events.push(eventObj);
        lastInactivityEvent = eventObj;
    }

    function handleActivity(event) {
        const now = Date.now();
        const diffInSeconds = Math.round((now - lastActivityTime) / 1000);

        if (lastInactivityEvent && !lastInactivityEvent.activityAfterSeconds) {
            lastInactivityEvent.activityAfterSeconds = diffInSeconds;
            lastInactivityEvent.activityType = event.type;
        }

        lastActivityTime = now;
        resetTimer();
    }

    function resetTimer() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(logInactivity, timeoutInSeconds * 1000);
    }

    function addActivityListeners() {
        ACTIVITY_EVENTS.forEach(event =>
            window.addEventListener(event, handleActivity)
        );
    }

    function removeActivityListeners() {
        ACTIVITY_EVENTS.forEach(event =>
            window.removeEventListener(event, handleActivity)
        );
    }

    function handleVisibilityChange() {
        if (document.visibilityState === 'visible') {
            lastActivityTime = Date.now();
            resetTimer();
            addActivityListeners();
        } else {
            clearTimeout(timeoutId);
            removeActivityListeners();
        }
    }

    function startTracking() {
        if (isTracking) {
            return;
        }
        document.addEventListener('visibilitychange', handleVisibilityChange);
        if (document.visibilityState === 'visible') {
            lastActivityTime = Date.now();
            resetTimer();
            addActivityListeners();
        }
        isTracking = true;
    }

    function stopTracking() {
        if (!isTracking) {
            return;
        }
        removeActivityListeners();
        clearTimeout(timeoutId);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        isTracking = false;
    }

    function getEvents() {
        return events;
    }

    return {
        start: startTracking,
        stop: stopTracking,
        events: getEvents,
    };
}
