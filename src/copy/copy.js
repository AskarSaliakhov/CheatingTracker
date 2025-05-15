export const createQuestionCopyTracker = (questions, onCopyLogged) => {
    let isTracking = false;
    const events = [];
    let lastSelectedText = '';

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
        const copiedText = lastSelectedText || '';
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

    function addListeners() {
        document.addEventListener('selectionchange', () => {
            const selection = window.getSelection();
            lastSelectedText = selection ? selection.toString() : '';
        });

        document.addEventListener('copy', trackCopy);
    }

    function removeListeners() {
        document.removeEventListener('copy', trackCopy);
        document.removeEventListener('selectionchange', () => {});
    }

    function startTracking() {
        if (isTracking) return;
        addListeners();
        isTracking = true;
    }

    function stopTracking() {
        if (!isTracking) return;
        removeListeners();
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
