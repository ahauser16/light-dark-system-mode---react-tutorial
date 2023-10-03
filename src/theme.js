import * as React from "react"

const localStorageKey = "mode"

// Emulate backend calls
const getMode = () =>
  new Promise(res =>
    setTimeout(() => {
      res(localStorage.getItem(localStorageKey) || "system")
    }, 3000)
  )
const saveMode = async mode => {}

// exposed context for doing awesome things directly in React
export const ThemeContext = React.createContext({
  mode: "system",
  theme: "light",
  setMode: () => {}
})

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = React.useState(() => {
    const initialMode = localStorage.getItem(localStorageKey) || "system"
    return initialMode
  })

  // This will only get called during the 1st render
  React.useState(() => {
    getMode().then(setMode)
  })

  // When the mode changes, save it to the localStorage and to the database
  React.useEffect(() => {
    localStorage.setItem(localStorageKey, mode)
    saveMode(mode)
  }, [mode])

  const [theme, setTheme] = React.useState(() => {
    if (mode !== "system") {
      return mode
    }
    const isSystemInDarkMode = matchMedia("(prefers-color-scheme: dark)")
      .matches
    return isSystemInDarkMode ? "dark" : "light"
  })

  // Update the theme according to the mode
  React.useEffect(() => {
    if (mode !== "system") {
      setTheme(mode)
      return
    }

    const isSystemInDarkMode = matchMedia("(prefers-color-scheme: dark)")
    // If system mode, immediately change theme according to the current system value
    setTheme(isSystemInDarkMode.matches ? "dark" : "light")

    // As the system value can change, we define an event listener when in system mode
    // to track down its changes
    const listener = event => {
      setTheme(event.matches ? "dark" : "light")
    }
    isSystemInDarkMode.addListener(listener)
    return () => {
      isSystemInDarkMode.removeListener(listener)
    }
  }, [mode])

  // Update the visuals on theme change
  React.useEffect(() => {
    // Clear previous theme on the html and set the new one
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
