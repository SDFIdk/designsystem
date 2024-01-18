export function showToast({message, duration = 5000}) {
  const newToast = document.createElement('div')
  newToast.className = 'ds-toast-item'
  newToast.innerText = message
  newToast.dataset.theme = 'dark'

  const targetElement = document.querySelector('.ds-toast-container')
  if (!targetElement) {
    const toastcontainer = document.createElement('div')
    toastcontainer.className = 'ds-toast-container'
    document.body.append(toastcontainer)
    toastcontainer.append(newToast)
  } else {
    targetElement.append(newToast)
  }
  
  setTimeout(function() {
    newToast.remove()
  }, duration)
}
