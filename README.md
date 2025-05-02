# CheatingTracker

CheatingTracker - is a JavaScript library for tracking suspicious actions on the part of the client

The `CheatingTracker` package It contains functionality for tracking changes in page focus.


## Screens:

**createScreenTracker** - Creates definition pressed ScreenShots on keyboard and type `Operating System`
 - events: returns array all pressed screens on keyboard with `title` and `time`
 - lastEvent: returns trying last screen or 
```
{
  title: '',
  time: null,
}
```

_Returns:_

```
type Nullable<T> = T | null

interface IScreenDetect {
   title: string;
   time: Nullable<string>; 
}
 
{
  lastEvent: () => IScreenDetect;
  events: () => IScreenDetect[];
  cleanup: () => void;
}
```

- **React:**

```
import React, { useState, useEffect, useRef } from 'react';
import { createScreenTracker } from 'cheatingtracker';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [lastEvent, setLastEvent] = useState(null);

    const screenTrackerRef = useRef(null);

    useEffect(() => {

        const screenTracker = createScreenTracker((newEvents) => {
            setEvents(newEvents);
            if (screenTrackerRef.current) {
                const last = screenTrackerRef.current.lastEvent();
                setLastEvent(last);
            }
        });

        screenTrackerRef.current = screenTracker;

        return () => {
            screenTracker.cleanup();
        };
    }, []);

    return (
        <div>
            <h2>Events:</h2>
            <ul>
                {events.map((event, index) => (
                    <li key={index}>
                        {event.title} at {event.time}
                    </li>
                ))}
            </ul>

            <h2>Last Event:</h2>
            {lastEvent && (
                <p>{lastEvent.title} at {lastEvent.time}</p>
            )}
        </div>
    );
};

export default Home;
```

- **JavaScript Native:**

```
import { createScreenTracker } from 'cheatingtracker';
const tracker = createScreenTracker();

const btn = document.getElementById('btn')
btn.addEventListener('click', () => {
    console.log(tracker.events());
    console.log(tracker.lastEvent());
})
```

## Blur:

**createBlurTracker** - Creates a focus loss tracker.
- getCount: returns count blur count times

_Returns:_
```
{
  getCount: () => number;
  cleanup: () => void;
}

```


- ***React:***

```
import React, { useEffect, useState } from 'react';
import { createBlurTracker } from 'cheatingtracker';

const Reviews = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const tracker = createBlurTracker(setCount);

        return () => {
            tracker.cleanup();
        };  
    }, []);

    return (
        <div>
            <h1>REVIEWS</h1>
            <h2>Blur Count: {count}</h2>
        </div>
    );
};

export default Reviews;

```
 - **JavaScript Native:**

```
import { createBlurTracker } from 'cheatingtracker';
const tracker = createBlurTracker(0);

const btn = document.getElementById('btn')
btn.addEventListener('click', () => {
    console.log(tracker.getCount());
})
```

___

## Alt + Tab

**createAltTabTracker** - Determines whether the Alt+Tab key combination or a similar focus switch was performed in combination with the pressed Alt. It also records what time it happened and how long the user was absent from the page.
- events: returns array all pressed `alt` + `tab`
- lastEvent: returns trying last `alt` + `tab`


```
type Nullable<T> = T | null;

interface IAltTabEvent {
  at: string;             
  durationMs: Nullable<number>;
}

{
  lastEvent: () => IAltTabEvent;
  events: () => IAltTabEvent[];
  destroy: () => void;
}

```

_Returns:_

## lastEvent
`lastEvent`: () => `IAltTabEvent`;

This method returns an object with the last Alt+Tab event (or a similar focus switch) fixed during operation.

The returned object has the following contents:


```
{
  at: string;             // example: "02:23:50".
  durationMs: Nullable<number>; // duration: `1583`
}
```

**at**: is the time when the event occurred. This time is in the hh:mm:ss format, for example: 02:23:50.

**durationMs** – length of time during which there was no focus on the page (in milliseconds). If focus has been restored, the value will be specified, if not, it will be null.

**examples:**
```
{
  at: '02:23:50',
  durationMs: 1500
}
```

or
```
{
  at: '',
  durationMs: null
}
```

## Events:
`events`: () => `IAltTabEvent[]`;

This method returns an array of all Alt+Tab (or similar focus switches) that have been captured.

The returned array contains objects in the following format:

```
{
  at: string;             // example: "02:23:50".
  durationMs: Nullable<number>; // duration: `1583`
}
```

## Example of the returned array:


    [
        { at: '02:23:50', durationMs: 1500 },
        { at: '03:15:42', durationMs: 1200 },
    ]

___

## EXAMPLES:

## JavaScript Native

```
import { createAltTabTracker } from "./src/altTab/altTab.js";

const btn = document.getElementById('btn');

const tracker = createAltTabTracker();

btn.addEventListener('click', () => {
    console.log(tracker.events());
    console.log(tracker.lastEvent());
});
```


## React
```
import React, { useEffect, useState, useRef } from 'react';
import { createAltTabTracker } from 'cheatingtracker';

const AltTabLog = () => {
    const [events, setEvents] = useState([]);
    const [lastEvent, setLastEvent] = useState(null);
    const trackerRef = useRef(null);

    useEffect(() => {
        const tracker = createAltTabTracker(() => {
            const all = tracker.events();
            setEvents(all);
            setLastEvent(tracker.lastEvent());
        });

        trackerRef.current = tracker;

        return () => {
            tracker.destroy();
        };
    }, []);

    return (
        <div>
            <h3>Alt+Tab events:</h3>
            <ul>
                {events.map((e, idx) => (
                    <li key={idx}>
                        {e.at} ({e.durationMs} мс)
                    </li>
                ))}
            </ul>

            <h4>Last Event:</h4>
            {lastEvent && (
                <p>{lastEvent.at} ({lastEvent.durationMs} мс)</p>
            )}
        </div>
    );
};

export default AltTabLog;

```

---
## INACTIVITY

**createInactivityTracker** - Creates and returns a tracker object that tracks the user's periods of inactivity on a web page. If the user is inactive for a set number of seconds and the page is active, information about inactivity is recorded in the console and an array of events, and then about the moment when they return to activity.

__Returned methods__:

`start()`
Starts tracking. It attaches listeners to activity events and monitors the visibility of the page.

`stop()`
Stops tracking. Deletes all listeners and clears the timer.

`getEvents()`
Returns an array of all recorded events of inactivity and return to activity.

### The structure of the event in the array:

```
{
  type: 'inactivity',                         
  time: '03:05:23',                           
  message: 'Пользователь был бездействующим 5 секунд', 
  activityAfterSeconds: 7,                   
  activityType: 'mousemove'                  
}

```
 - `type`: Type of event
 - `time`: The time when inactivity was recorded (local)
 - `message`: message
 - `activityAfterSeconds`: How many seconds after inactivity did the user become active
 - `activityType`: Activity type: mousemove, keydown, etc.

**Behaviour:**

- Listens to the following activities: mousemove, keydown, mousedown, touchstart.

- Counts only when the page is active 

- Activity events are displayed in the console, but only if they occurred after a period of inactivity.

- All events are saved to an array accessible via getEvents().

**Notes:**

- The tracker's default value is 60 seconds
- Each period of inactivity is recorded once, and only after it is the moment of the next activity monitored.
- Time is saved in a readable format: HH:MM:CC in local time.


## EXAMPLES:

- **JavaScript Native**

```
import { createInactivityTracker } from "./src/inactivity/inactivity.js";

    const tracker = createInactivityTracker(30 );
    tracker.start();

    const start = document.getElementById('start')
    const end = document.getElementById('end')
    
    start.addEventListener('click', () => {
        console.log(tracker.events())
    })
    
    end.addEventListener('click', () => {
        tracker.stop();
    })
```
- **React**

```
import React, { useEffect, useState } from 'react';
import { createInactivityTracker } from 'cheatingtracker';

export default function App() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const tracker = createInactivityTracker(5); // 5-second timeout
        tracker.start();

        return () => {
            tracker.stop();
            clearInterval(interval);
        };
    }, []);

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1>🛑 Inactivity Tracker</h1>
            <p>Try not moving your mouse or pressing keys for 5 seconds...</p>
            <ul>
                {events.map((event, index) => (
                    <li key={index} style={{ marginBottom: '0.5rem' }}>
                        <strong>{event.time}</strong> — {event.message}
                        {event.activityAfterSeconds !== undefined && (
                            <div>
                                ↪ Activity: <em>{event.activityType}</em> after{' '}
                                <strong>{event.activityAfterSeconds}</strong> sec.
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

```
