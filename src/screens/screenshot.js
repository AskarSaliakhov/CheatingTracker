import { KEYS } from "./consts.js";

export function createScreenTracker() {
    const lastEvent = {
        title: '',
        time: null,
    };

    const events = [];
    let pressedKeys = [];

    function alreadyClicked(key) {
        return pressedKeys.includes(key);
    }

    function handleDeleteKey(key) {
        const index = pressedKeys.indexOf(key);
        if (index !== -1) {
            pressedKeys.splice(index, 1);
        }
    }

    function handlePressKey(event) {
        if (Object.values(KEYS).includes(event.keyCode) && !alreadyClicked(event.keyCode)) {
            pressedKeys.push(event.keyCode);
        }
    }

    function saveEvent(title) {
        const time = new Date().toLocaleTimeString();
        events.push({
            title,
            time
        });
        lastEvent.title = title;
        lastEvent.time = time;
    }

    function checkIfPrintscreenPressed() {
        if (alreadyClicked(KEYS.PRINT_SCREEN)) {
            saveEvent('printScreen');
        }
    }

    window.addEventListener('keydown', event => {
        handlePressKey(event);
    });

    window.addEventListener('keyup', event => {
        handlePressKey(event);
        checkIfPrintscreenPressed();
        handleDeleteKey(event.keyCode);
    });

    window.addEventListener('blur', () => {
        if (alreadyClicked(KEYS.META) && alreadyClicked(KEYS.SHIFT)) {
            if (navigator.platform.indexOf('Mac') > -1) {
                saveEvent('Command + Shift : macOS');
            } else if (navigator.platform.indexOf('Win') > -1) {
                saveEvent('Win + Shift + S : Windows');
            }
        }
        pressedKeys = [];
    });

    return {
        lastEvent: () => lastEvent,
        events: () => events,
    };
}
