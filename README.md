# CheatingTracker

CheatingTracker - is a JavaScript library for tracking suspicious actions on the part of the client

The `CheatingTracker` package It contains functionality for tracking changes in page focus.


## Screens:

**createScreenTracker** - Creates definition pressed ScreenShots on keyboard

_Returns:_

```
interface IScreenDetect {
   title: string,
   time: string
}
 
{
  lastEvent: () => IScreenDetect,
  events: () => IScreenDetect[]
}
```

- **JavaScript Native:**

```
const tracker = createScreenTracker();

const btn = document.getElementById('btn')
btn.addEventListener('click', () => {
    console.log(tracker.events());
    console.log(tracker.lastEvent());
})
```

## Blur:

**createBlurTracker** - Creates a focus loss tracker.
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
const tracker = createBlurTracker(0)

const btn = document.getElementById('btn')
btn.addEventListener('click', () => {
    console.log(tracker.getCount());
})
```

___
