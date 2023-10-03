# light-dark-system-mode---react-tutorial

a template created from a tutorial about creating a light/dark/system mode

this branch is dedicated to using the (completed) tutorial as the starting point to creating a theme engine for MLB teams.

yet another change!

## Tutorial(s) Link
this is a series so the tutorial is broken up into several parts.

[Light Mode Dark Mode the lazy way - Part I](https://dev.to/ayc0/light-dark-mode-the-lazy-way-4j71)

## Related/Referenced resources

### [Improved dark mode default styling with the color-scheme CSS property and the corresponding meta tag](https://web.dev/color-scheme/)
---
### [MDN documenation on system-colors](https://developer.mozilla.org/en-US/docs/Web/CSS/system-color)
#### TLDR:
Note that these keywords are case insensitive, but are listed here with mixed case for readability.

* AccentColor --> Background of accented user interface controls

* AccentColorText --> Text of accented user interface controls

* ActiveText --> Text of active links

* ButtonBorder --> Base border color of controls

* ButtonFace --> Background color of controls

* ButtonText --> Text color of controls

* Canvas --> Background of application content or documents

* CanvasText --> Text color in application content or documents

* Field --> Background of input fields

* FieldText --> Text in input fields

* GrayText --> Text color for disabled items (e.g. a disabled control)

* Highlight --> Background of selected items

* HighlightText --> Text color of selected items

* LinkText --> Text of non-active, non-visited links

* Mark --> Background of text that has been specially marked (such as by the HTML mark element)

* MarkText --> Text that has been specially marked (such as by the HTML mark element)

* VisitedText --> Text of visited links

```
.button {
  border: 0;
  padding: 10px;
  box-shadow:
    -2px -2px 5px gray,
    2px 2px 5px gray;
}

@media (forced-colors: active) {
  .button {
    /* Use a border instead, since box-shadow
    is forced to 'none' in forced-colors mode */
    border: 2px ButtonBorder solid;
  }
}
```
---
### [CSS Specs Color Module Level 4](https://drafts.csswg.org/css-color/#css-system-colors)
---
### [Using CSS custom properties (variables)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
---
### [React reference to Lazy Initial State](https://legacy.reactjs.org/docs/hooks-reference.html#lazy-initial-state)
---
---
# [I. Tutorial Part One](https://dev.to/ayc0/light-dark-mode-the-lazy-way-4j71)

## meta tag or css root?

```
<meta name="color-scheme" content="light dark" />
```
versus
```
:root { color-scheme: light dark; }
```

Both the `<meta name="color-scheme" content="light dark" />` meta tag and the `:root { color-scheme: light dark; }` CSS rule serve a similar purpose, which is to indicate to the browser that your website supports both light and dark color schemes. However, they are used in slightly different contexts, and whether you should use one or both depends on your specific use case and compatibility considerations.

Here's a breakdown of the differences and advantages of each option:

### 1. `<meta name="color-scheme" content="light dark" />` (Meta Tag):

#### Advantages:

* This meta tag provides a hint to the browser and the operating system about your website's color scheme support at a global level.
* It doesn't rely on CSS, so it can be useful for setting the color scheme preference for users who may have disabled or limited CSS in their browsers.
* It's straightforward to implement and doesn't require any changes to your existing CSS.

#### Disadvantages:

* It's a global setting that applies to the entire website, so if you want more fine-grained control over light and dark mode styling in different parts of your site, you may still need CSS.

### 2. `:root { color-scheme: light dark; }` (CSS Rule):

#### Advantages:

* This CSS rule allows you to define the color scheme at a more granular level, and you can override it in specific parts of your site or for specific elements if needed.
* It's compatible with more modern browsers that support CSS Custom Properties (variables).
#### Disadvantages:

* It relies on CSS, so users who disable CSS or have limited CSS support in their browsers may not benefit from this setting.
* It requires adding custom CSS to your project, which might be an advantage or a disadvantage depending on your familiarity with CSS and the complexity of your project.

### Should I Use Both?

You don't necessarily need to use both options unless you want to provide compatibility for a wide range of browsers and user preferences. Here are some considerations:

* Using Only the Meta Tag: If you want a simple and globally applied approach that works even for users with limited CSS support, you can stick with the `<meta name="color-scheme" content="light dark" />` meta tag.

* Using Only CSS Rule: If you want more fine-grained control over your site's light and dark mode styles and are confident that your target audience primarily uses modern browsers with good CSS support, you can rely on the `:root { color-scheme: light dark; }` CSS rule.

* Using Both: Using both options provides a broader compatibility net. It ensures that modern browsers with good CSS support will recognize your color scheme preference, while older browsers or users who disable CSS will still see the color scheme specified in the meta tag.

* In most cases, you can start by using just one of these options based on your project's requirements and gradually add the other if you find that you need broader compatibility or more control over your site's styling.

**<--NB--> I've decided to use both.**

### Codepen given at the end of part one of tutorial:
[Light/dark mode, the lazy way - Part One](https://codepen.io/ayc0/pen/GRWOgaR)
---
---
# [II.  Light/dark mode: the simple way - Part Two](https://dev.to/ayc0/light-dark-mode-the-lazy-way-4j71)

## final CSS for part II
```
:root {
  --text: black;
  --background: white;
}

@media (prefers-color-scheme: dark) {
  :root {
    --text: white;
    --background: black;
  }
}

body {
  color: var(--text);
  background: var(--background);
}
```

### Codepen given at the end of part two of tutorial:
[codepen for Light/dark mode: the simple way](https://codepen.io/ayc0/pen/yLMPbLz)
---
# [III Light/dark mode: user input - Part Three](https://dev.to/ayc0/light-dark-mode-user-input-ai1)

Since users cannot change their theme directly from the website, they have to change their system mode to change it. Which can be a bit annoying when you want your OS to be in light mode and the website in dark mode for instance.

### CSS: 
```
:root[data-theme="light"] {
  color-scheme: light;
  --text: black;
  --background: white;
}
:root[data-theme="dark"] {
  color-scheme: dark;
  --text: white;
  --background: black;
}

body {
  color: var(--text);
  background: var(--background);
}
```
### JavaScript related design decisions
We’ll have to store the user preference for future visits to the website. You can do that with the method you prefer:

* localStorage (if everything is done in the frontend)
* cookie (if you want to have access to it from the backend)
* remote database (if you want to apply the same theme to multiple devices)

If you store the preferences in a remote database, I'd still recommend to double save it in a cookie/localStorage, because we'll see later how to avoid blinks when loading the pages. And this needs synchronous access to the stored value.

I'm gonna stick with localStorage here, because it's the easiest to deal with, but it doesn't really matter for this example.

### **Step One** --- Reading and writing the theme
We can use this couple of function as first class getters/setters of the theme:
```
function getTheme() {
  return localStorage.getItem('theme') || 'light';
}
function saveTheme(theme) {
  localStorage.setItem('theme', theme);
}
```
### **Step Two** --- Setting the theme
As we only used a data attribute on the html, applying only corresponds to setting the attribute on it.

This leaves us with this function:
```
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}
```

### Step Three --- Assembling the whole ensemble
```
const themeToggler = document.getElementById('theme-toggle');

let theme = getTheme();
applyTheme(theme);

themeToggler.onclick = () => {
  const newTheme = rotateTheme(theme);
  applyTheme(newTheme);
  saveTheme(newTheme);

  theme = newTheme;
}
```
#### <--Note--> if you don't want any blink when users will load the page (seeing an empty white page when reloading the page for instance while they picked a dark mode for your website), it's important that this JS is executed in a blocking way, so that browsers won't render the html/css without having first computed this JS and applied the data attribute on the html.

### Codepen given at the end of part three of tutorial:
[Light/Dark mode with user input](https://codepen.io/ayc0/pen/NWpwgqM)

# [IV Light/dark mode: system mode + user preferences - Part Four](https://dev.to/ayc0/light-dark-mode-system-mode-user-preferences-1fcd)

### The Use Case
You’ll have to be able to handle 4 different configurations:
* the user picked "light mode"
* the user picked "dark mode"
* the user picked "system mode" and their system is in light
* the user picked "system mode" and their system is in dark

You have 2 possibilities for dealing with this:

* 1 variable that can be light/dark/system and then within the CSS/JS have a way to get the "visual theme" from the system mode
* 2 variables representing (a) user choice: light/dark/system and (b) applied mode: light/dark

### The CSS
As the CSS only deals with the visual appearance, we'll only have to care about the applied mode: light/dark.

The easiest is to apply a data attribute to the html light/dark. Also, as we chose the 2nd method with 2 distinct sets of variables, we only have to deal with light/dark. Dealing with the system will be done by another tool. So we don't have to use media queries.  

> NB the CSS is the same from part three.

```
:root[data-applied-mode="light"] {
  color-scheme: light;
  --text: black;
  --background: white;
}
:root[data-applied-mode="dark"] {
  color-scheme: dark;
  --text: white;
  --background: black;
}
```

### The JS
We’ll have to store the user preference for future visits to the website. You can do that with the method you prefer:

* localStorage (if everything is done in the frontend)
* cookie (if you want to have access to it from the backend)
* remote database (if you want to apply the same theme to multiple devices)

>If you store the preferences in a remote database, I'd still recommend to double save it in a cookie/localStorage, because we'll see later how to avoid blinks when loading the pages. And this needs synchronous access to the stored value.

I'm gonna stick with localStorage here, because it's the easiest to deal with, but it doesn't really matter for this example.

### Reading and writing the user preference

We can use this couple of function as first class getters/setters of the user preference:
```
function getUserPreference() {
  return localStorage.getItem('theme') || 'system';
}

function saveUserPreference(userPreference) {
  localStorage.setItem('theme', userPreference);
}
```

### Translating the user preference in the applied mode

Now that we have a way to get the saved user preference, we need a way to translate it to an applied mode.

The equivalence is simple:

* the user picked "light mode" => light
* the user picked "dark mode" => dark
* the user picked "system mode" and their system is in light => light
* the user picked "system mode" and their system is in dark => dark

The complicated part relies on the last 2 possibilities. Before we were using CSS media queries to handle this. Fortunately we can query CSS media queries with JS: matchMedia(<media query>).matches will return true/false depending on whether or not the browser is matching this media query:
```
function getAppliedMode(userPreference) {
  if (userPreference === 'light') {
    return 'light';
  }
  if (userPreference === 'dark') {
    return 'dark';
  }
  // system
  if (matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}
```

### Setting the applied mode

As we only used an attribute on the html, applying only corresponds to setting the attribute on it.

This leaves us with this function:
```
function setAppliedMode(mode) {
  document.documentElement.dataset.appliedMode = mode;
}
```

### Assembling the whole ensemble
Now that we have all the elements, this is basically like legos: we need to assemble everything.

You still need to define 2 things:

* an input that will trigger the rotation of your user preferences,
* a function that will return the next preference based on the current one.

But then, you can do the following:
```
const themeToggler = document.getElementById('theme-toggle');
let userPreference = getUserPreference();
setAppliedMode(getAppliedMode(userPreference));

themeToggler.onclick = () => {
  const newUserPref = rotatePreferences(userPreference);
  userPreference = newUserPref;
  saveUserPreference(newUserPref);
  setAppliedMode(getAppliedMode(newUserPref));
}
```

### Codepen given at the end of part four of tutorial:
[Light/dark mode, system mode + user preferences](https://codepen.io/ayc0/pen/MWpOmbQ)

>Note that if you don't want any blink when users will load the page (seeing an empty white page when reloading the page for instance while they picked a dark mode for your website), it's important that this JS is executed in a blocking way, so that browsers won't render the html/css without having first computed this JS and applied the data attribute on the html.

>Note that the system mode we built here only resolves the theme when system is picked. But it won’t follow the system’s value in real time.

# [V Light/dark mode: avoid flickering on reload - Part Five](https://dev.to/ayc0/light-dark-mode-avoid-flickering-on-reload-1567)

### Presentation of the issue
If you already added a dark mode to your website, and if you are allowing your users to pick the mode they prefer, you may already save their preferences so that they don't have to pick it again the next time they visit your website.

But now, you have to restore their preference on page load. And if this is done within your application, you cannot guarantee that this will be the 1st action done by the browser when loading the JS (specially if you lazy loaded the javascript code).

This can result in a flicker when users visit your website: they picked the dark mode, but when loading the website, for a fragment of seconds, a white background can be displayed.

### The fix

The way the browsers work is that if there is a `<script>` tag in your head or at the very beginning of your body, this script will block the rendering of the page until it hasn't completed.

In general you want to avoid this, as you add unnecessary burden on the rendering of the page, and it will delay everything else.
But for critical rendering like this one, this is okay.

All you have to do is add something like the following in your HTML:

```
<body>
  <script>
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.dataset.theme = theme;
  </script>

  <!-- rest of your html -->
</body>
```

### The Drawback
Now the logic for handling the theme gets duplicated: in this script tag and in your main JS.

My advice would be to either:

* if your logic is really simple, to put everything in this script tag,
* if you logic is more complex - like handled by a framework like React (you can call it a library if you want), or if you need to fetch it from a database, or else - only put the critical logic in this blocking script tag.

### Conclusion
In my opinion, when dealing with themes, avoiding flickering on load is one of the most important things to care about. Otherwise you'll irritate your users fairly quickly.

This is why I considered earlier this code snippet as critical.

If you want to read about how to implement a light/dark mode for your users, you can read the other articles from this series.

### Codepen given at the end of part five of tutorial:
[Light/dark mode, without flicker on load](https://codepen.io/ayc0/pen/KKWZNMW)

# [VI Light/dark mode: React implementation - Part Six](https://dev.to/ayc0/light-dark-mode-react-implementation-3aoa)

### Introduction

In the previous posts, we saw how to:

* use CSS to handle different themes,
* handle system themes and also user-picked themes,
* store the previously picked theme for next visits,
* how to avoid theme blink on page reload.

In this post, we'll see how we can use everything together, and add React and a remote database (for fun) in this mix.
The goal is to show the backbone of what could be the actual code you'd use to handle themes in your app.

### Flow of logic to implement
The following flow is related to a frontend app, not a server-side rendered website (like what you would have in PHP):

1. Users are loading your website
2. We are applying (in a blocking way) the previously picked theme (it can be a wrong one)
3. A fetch is performed on your database to retrieve their favorite mode (light/dark/system)
4. The favorite mode is saved in their browser for future visits
5. The mode is saved in a react context (for reactive updates if needed)
6. When the mode changes, it is saved locally (for future uses), a request is performed against your database, and the react context is updated.

### First Visit Ever
Your users won't have any entry in your database and they won't have any local data saved either. So we'll use the system mode as a fallback.

### First visit on a new browser
Your users won't have any local data, so while the request is being done against your database to retrieve their preferred mode, we'll use the system one to avoid unwanted flashes.

### Re-visit
The mode they previously picked on this browser will be initially picked. And then 2 possibilities:

* they haven't changed their preferred mode on another device, so the local one matches the remote one => no differences and no flashes (this is the flow during a page refresh),
* they have changed it, and here we'll have a small flash at the initial re-visit (but we cannot prevent that)

### Results

[Code Sandbox Results](https://codesandbox.io/s/light-dark-mode-react-implementation-forked-vgywjs?file=/src/theme.tsx)

### Explanations
#### CSS related:
I went with something simple for the CSS: a data-attribute data-theme with 2 values light and dark, and I'm updating 2 css variables, than in the end control the look of the main body.

And as in all other posts of this series, we need to set the color-scheme, ensuring that native elements will respond to the correct theme:

```
:root[data-theme="light"] {
  color-scheme: light;
  --color: #111;
  --background: #fff;
}
:root[data-theme="dark"] {
  color-scheme: dark;
  --color: #cecece;
  --background: #333;
}
body {
  color: var(--color);
  background: var(--background);
}
```

#### Blocking Script
As we want to avoid flicker during page loads, I added a small blocking script tag, performing only synchronous actions, that only checks for the most basic requirements to determine to best theme to display:
```
<script>
  const mode = localStorage.getItem("mode") || "system";
  let theme;
  if (mode === "system") {
    const isSystemInDarkMode = matchMedia("(prefers-color-scheme: dark)")
      .matches;
    theme = isSystemInDarkMode ? "dark" : "light";
  } else {
    // for light and dark, the theme is the mode
    theme = mode;
  }
  document.documentElement.dataset.theme = theme;
</script>
```

### Base variables
First, we need to determine our variables: I'm gonna use mode for the saved modes (light / dark / system), and theme for the visual themes (light / dark):
>Note I chose to not use the typescript implementation so the project does not include any typescript mentioned here or hereafter.

### React context
As we want to be able to provide some informations about the current mode/theme and also a way for users to change the mode, we'll create a React context containing everything:
```
const ThemeContext = React.createContext<{
  mode: Mode;
  theme: Theme;
  setMode: (mode: Mode) => void;
}>({
  mode: "system",
  theme: "light",
  setMode: () => {}
});
```
### Initialization of the mode
We'll use a state (as its value can change and it should trigger updates) to store the mode.
With `React.useState`, you can provide a function, called a [**lazy initial state**](https://legacy.reactjs.org/docs/hooks-reference.html#lazy-initial-state), that will only get called during the 1st render:
```
const [mode, setMode] = React.useState<Mode>(() => {
  const initialMode =
    (localStorage.getItem(localStorageKey) as Mode | undefined) || "system";
  return initialMode;
});
```

### Database sync
Now that we have a `mode` state, we need to update it with the remote database. To do so, we could use an effect, but I decided to use another `useState`, which seems weird as I'm not using the returned state, but as mentioned above, lazy initial states are only called during the 1st render.
This allows us to start the backend call during the render, and not after in an effect. And as we're starting the API call earlier, we'll also receive the response faster:
```
// This will only get called during the 1st render
React.useState(() => {
  getMode().then(setMode);
});
```

### Save the mode in local storage & the database

When the mode changes, we want to:

* save it in the local storage (to avoid flashes on reload)
* in the database (for cross-device support)

The `useEffect` hook is the perfect use-case for that: we pass the `mode` in the [**dependencies array**](https://legacy.reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect), so that the effect will be called every time the mode changes:

```
React.useEffect(() => {
  localStorage.setItem(localStorageKey, mode);
  saveMode(mode); // database
}, [mode]);
```

### Initialization of the mode
Now that we have a way to get, save, and update the mode, we need a way to translate it to a visual theme.
For this we will use another state (because theme change should trigger an update).

We'll use another lazy initial state to synchronize the `system` mode with the theme users picked for their devices:

```
const [theme, setTheme] = React.useState<Theme>(() => {
  if (mode !== "system") {
    return mode;
  }
  const isSystemInDarkMode = matchMedia("(prefers-color-scheme: dark)")
    .matches;
  return isSystemInDarkMode ? "dark" : "light";
});
```

### System theme update

If users picked the `system` mode, we need to track down if they decide to change it from light to dark while still being in our system mode (which is why we are also using a state for the `theme`).

To do so, we'll also use an effect that will detect any changes in the mode. In addition to that, when users are in the `system` mode, we'll get their current system theme and start an event listener to detect any changes in their theme:

```
React.useEffect(() => {
  if (mode !== "system") {
    setTheme(mode);
    return;
  }

  const isSystemInDarkMode = matchMedia("(prefers-color-scheme: dark)");
  // If system mode, immediately change theme according to the current system value
  setTheme(isSystemInDarkMode.matches ? "dark" : "light");

  // As the system value can change, we define an event listener when in system mode
  // to track down its changes
  const listener = (event: MediaQueryListEvent) => {
    setTheme(event.matches ? "dark" : "light");
  };
  isSystemInDarkMode.addListener(listener);
  return () => {
    isSystemInDarkMode.removeListener(listener);
  };
}, [mode]);
```

### Apply the theme back to the HTML

Now that we have a reliable `theme` state, we can make so that the CSS and the HTML follows this state:

```
React.useEffect(() => {
  // Clear previous theme on the html and set the new one
  document.documentElement.dataset.theme = theme;
}, [theme]);
```

### Defining the context
Now that we have all the variables we need, the last thing to do is to wrap the whole app in a context provider:

```
<ThemeContext.Provider value={{ theme, mode, setMode }}>
  {children}
</ThemeContext.Provider>
```
And when we need to refer to it, we can do:
```
const { theme, mode, setMode } = React.useContext(ThemeContext);
```

### Conclusion

Handling multiple themes isn't trivial, especially if you want to provide the best experience possible for users while having handy tools for your fellow developers.

Here I only presented one possible way of handling this, and it can be refined, improved, and expanded for other use-cases.

But even if your logic/requirements are different, the flow presented at the beginning shouldn't be that different from the one you should adopt.

And if you want to have a look at the full code I wrote in the example, you can find it here: [https://codesandbox.io/s/themes-tbclf](https://codesandbox.io/s/themes-tbclf).

# [VII Light/dark mode: Corrections - Part Seven](https://dev.to/ayc0/lightdark-mode-corrections-5e19)

## Issues Corrected:
### 1. `meta` tag versus css `:root`
### 2. Native system colors
### 3. using `:root` with class names
>Note: The `:root` CSS [pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) matches the root element of a tree representing the document. In HTML, `:root` represents the `<html>` element and is identical to the selector `html`, except that its ***specificity*** is higher.

After some tests, I can confirm that the following works fine:
```
:root.dark-mode {
  /* Works great! */
}
/* Equivalent to html but with a greater specificity */
html.dark-mode {
  /* Works great! */
}
```
> Note: `:root` has specificity of `(0, 1, 0)`, and `html` has a specificity of `(0, 0, 1)`.
### 4. Using data attriutes instead of class names
In this post, I mentioned that we were using 2 classes .light and .dark. And that we were using this function to control those classes:
```
const colorScheme = document.querySelector('meta[name="color-scheme"]');
function applyTheme(theme) {
  document.body.className = theme;
  colorScheme.content = theme;
}
```
The issue with it, is that it overrides all classes set on the body. This is fine for this post, as we don’t have any other classes, but it may not be in your own application.

A more realistic function would be something like:
```
const colorScheme = document.querySelector('meta[name="color-scheme"]');
function applyTheme(theme) {
  document.body.classList.remove('light');
  document.body.classList.remove('dark');
  document.body.classList.add(theme);
  colorScheme.content = theme;
}
```
You can see that it's a bit tedious to have to remove all classes, especially if you start to add more themes, like low/high contrast, etc.

A better solution would be to use data attributes, to which we can add the correction we did for the `color-scheme`, and for the root `:root` :
```
:root[data-theme="light"] {
  color-scheme: light;
  --text: black;
  --background: white;
}
:root[data-theme="dark"] {
  color-scheme: dark;
  --text: white;
  --background: black;
}

body {
  color: var(--text);
  background: var(--background);
}
```
And to set it:
```
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}
```
> Note: (`document.documentElement` is the `<html>` node, see on the [MDN documentElement documentation](https://developer.mozilla.org/en-US/docs/Web/API/Document/documentElement))

### Real time system mode
In this post, I explained how to use a custom picker and how to use a `system` mode.

I forgot to say that this system mode won’t follow the current theme users have on their machine. Instead it just computes this theme when the mode is picked.

This mechanism is more complicated and can be explained in its own post. But in the meantime, the React implementation includes this feature.