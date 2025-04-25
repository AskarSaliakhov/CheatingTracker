# CheatingTracker

CheatingTracker - is a JavaScript library for tracking suspicious actions on the part of the client

The `CheatingTracker` package It contains functionality for tracking changes in page focus.

## How it use? ##

### Blur:

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
import React, { useState, useEffect } from 'react';
import { createBlurTracker } from 'cheatingtracker';

const Home = () => {
    const [count, setCount] = useState(0)

    useEffect(() => {
        (setCount);

        return () => {
            tracker.cleanup();
        };
    }, []);

    return (
        <div>
            <h2>Blur Count: {count}</h2>
        </div>
    );
};

export default Home;
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
