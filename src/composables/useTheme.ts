const themeKey = 'theme'
const themeValues = ['light', 'dark'] as const

export type ThemeValues = (typeof themeValues)[number]

export function useTheme() {
  function setTheme(theme: ThemeValues) {
    if (!themeValues.includes(theme)) {
      return
    }

    try {
      localStorage.setItem(themeKey, theme)
    } catch {
      // ignore
    }
  }

  function changeTheme(theme: ThemeValues) {
    if (import.meta.server) {
      return
    }

    const html = document.getElementsByTagName('html')![0]!

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
