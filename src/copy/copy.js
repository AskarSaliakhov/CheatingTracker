export const createQuestionCopyTracker = (questions, onCopyLogged) => {
    let isTracking = false;
    const events = [];

    function getTimeString() {
        return new Date().toLocaleTimeString('ru-RU', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    }

    function logCopyEvent(copiedText, type) {
        const time = getTimeString();
        const eventObj = {
            type,
            time,
            copiedText,
        };

        events.push(eventObj);

        if (typeof onCopyLogged === 'function') {
            onCopyLogged(eventObj);
        }
    }

    function trackCopy() {
        const copiedText = window.getSelection().toString();
        if (copiedText) {
            questions.forEach((q) => {
                if (q.question.includes(copiedText)) {
                    logCopyEvent(copiedText, 'question');
                } else if (q.options.some(opt => opt.includes(copiedText))) {
                    logCopyEvent(copiedText, 'answer');
                }
            });
        }
    }

    function addCopyListeners() {
        document.addEventListener('copy', trackCopy);
        document.addEventListener('keydown', (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
                trackCopy(event);
            }
        });
    }

    function removeCopyListeners() {
        document.removeEventListener('copy', trackCopy);
        document.removeEventListener('keydown', trackCopy);
    }

    function startTracking() {
        if (isTracking) {
            return;
        }
        addCopyListeners();
        isTracking = true;
    }

    function stopTracking() {
        if (!isTracking) {
            return;
        }
        removeCopyListeners();
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
};
