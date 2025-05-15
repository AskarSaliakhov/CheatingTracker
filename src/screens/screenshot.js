import { KEYS } from "./consts.js";

export function createScreenTracker(onEventUpdate) {
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
        const event = { title, time };
        events.push(event);
        lastEvent.title = title;
        lastEvent.time = time;
        if (onEventUpdate) {
            onEventUpdate([...events]);
        }
    }

    function checkIfPrintscreenPressed() {
        if (alreadyClicked(KEYS.PRINT_SCREEN)) {
            saveEvent('printScreen');
        }
    }

    const keydownHandler = (event) => {
        handlePressKey(event);
    }
    const keyupHandler = (event) => {
        handlePressKey(event);
        checkIfPrintscreenPressed();
        handleDeleteKey(event.keyCode);
    };
    const blurHandler = () => {
        if (alreadyClicked(KEYS.META) && alreadyClicked(KEYS.SHIFT)) {
            if (navigator.platform.indexOf('Mac') > -1) {
                saveEvent('Command + Shift : macOS');
            } else if (navigator.platform.indexOf('Win') > -1) {
                saveEvent('Win + Shift + S : Windows');
            }
        }
        pressedKeys = [];
    };

    window.addEventListener('keydown', keydownHandler);
    window.addEventListener('keyup', keyupHandler);
    window.addEventListener('blur', blurHandler);

    return {
        lastEvent: () => lastEvent,
        events: () => events,
        cleanup: () => {
            window.removeEventListener('keydown', keydownHandler);
            window.removeEventListener('keyup', keyupHandler);
            window.removeEventListener('blur', blurHandler);
        },
    };
}

