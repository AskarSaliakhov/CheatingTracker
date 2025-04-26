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
