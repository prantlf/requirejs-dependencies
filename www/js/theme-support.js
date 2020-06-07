/* global $, visualTheme:writable, localStorage */

visualTheme = localStorage.getItem('prantlf/requirejs-dependencies/theme') || 'system'

changeTheme()

function changeTheme () {
  switch (visualTheme) {
    case 'dark': applyDarkTheme(); break
    case 'light': applyLightTheme(); break
    default: applySystemTheme()
  }
}

function applySystemTheme () {
  const style = createThemeStyle('theme', `
    @import url(/www/css/bootstrap.darkly.min.css) (prefers-color-scheme: dark);
    @import url(/www/css/bootstrap.flatly.min.css) (prefers-color-scheme: light);
    @import url(/www/css/bootstrap.flatly.min.css) (prefers-color-scheme: no-preference);`)
  document.head.insertBefore(style, document.head.getElementsByTagName('title')[0])
}

function applyDarkTheme () {
  applyFixedTheme('darkly')
}

function applyLightTheme () {
  applyFixedTheme('flatly')
}

function applyFixedTheme (name) {
  const link = createThemeLink('theme', `/www/css/bootstrap.${name}.min.css`)
  document.head.insertBefore(link, document.head.getElementsByTagName('title')[0])
}

function createThemeLink (id, href) {
  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.type = 'text/css'
  link.href = href
  return link
}

function createThemeStyle (id, content) {
  const style = document.createElement('style')
  style.id = id
  style.textContent = content
  return style
}

function updateThemeSwitcher () { // eslint-disable-line no-unused-vars
  const button = document.getElementById('theme-switcher')
  const label = document.getElementById('theme-switcher-text')
  switch (visualTheme) {
    case 'dark':
      label.textContent = '\ueaaf'
      button.title = 'Theme: Dark'
      break
    case 'light':
      label.textContent = '\ue9d4'
      button.title = 'Theme: Light'
      break
    default:
      label.textContent = '\ue9ca'
      button.title = 'Theme: System'
  }
  if (typeof $ !== 'undefined') {
    const $button = $(button)
    $button.tooltip('dispose').tooltip()
    if (document.activeElement === button) {
      $button.tooltip('show')
    }
  }
}
