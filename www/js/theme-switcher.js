/* global visualTheme:writable, changeTheme, updateThemeSwitcher, localStorage */

function initializeThemeSwitcher () {
  const themeSwitcher = document.getElementById('theme-switcher')
  themeSwitcher.addEventListener('click', switchTheme)
}

function switchTheme () {
  switch (visualTheme) {
    case 'dark': visualTheme = 'light'; break
    case 'light': visualTheme = 'system'; break
    default: visualTheme = 'dark'
  }
  changeTheme()
  updateThemeSwitcher()
  saveTheme()
}

function saveTheme () {
  setTimeout(() => localStorage.setItem('prantlf/requirejs-dependencies/theme', visualTheme))
}

export { initializeThemeSwitcher }
