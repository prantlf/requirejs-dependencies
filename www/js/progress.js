let progressWrapper

function initializeProgress () {
  progressWrapper = document.getElementById('progress')
}

function startProgress () {
  progressWrapper.style.display = 'block'
}

function stopProgress () {
  progressWrapper.style.display = 'none'
}

export { initializeProgress, startProgress, stopProgress }
