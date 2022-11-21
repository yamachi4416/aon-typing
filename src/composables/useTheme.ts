const themeKey = 'theme'
const themeValues = ['light', 'dark'] as const

export type ThemeValues = typeof themeValues[number]

export function useTheme() {

  function getTheme(): ThemeValues {
    try {
      const theme = localStorage.getItem(themeKey) as ThemeValues
      if (theme && themeValues.includes(theme)) {
        return theme
      }
    } catch (e) { }

    return themeValues[0]
  }

  function setTheme(theme: ThemeValues) {
    if (!themeValues.includes(theme)) {
      return
    }

    try {
      localStorage.setItem(themeKey, theme)
    } catch (e) { }
  }

  function changeTheme(theme: ThemeValues) {
    if (process.server) {
      return
    }

    const html = document.getElementsByTagName('html')?.[0]

    if (theme === 'light') {
      html.classList.remove('dark')
    } else if (theme === 'dark') {
      html.classList.add('dark')
    }

    setTheme(theme)
  }

  return {
    changeTheme,
  }
}
