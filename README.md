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
```:root {
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
```:root[data-theme="light"] {
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
```function getTheme() {
  return localStorage.getItem('theme') || 'light';
}
function saveTheme(theme) {
  localStorage.setItem('theme', theme);
}
```
### **Step Two** --- Setting the theme
As we only used a data attribute on the html, applying only corresponds to setting the attribute on it.

This leaves us with this function:
```function applyTheme(theme) {
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