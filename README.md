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
