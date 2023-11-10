export function showToast({message, target = 'body', duration = 5000}) {
  const newToast = document.createElement('div')
  newToast.className = 'ds-toast-item'
  newToast.innerText = message
  document.querySelector(target).append(newToast)

  setTimeout(function() {
    newToast.remove()
  }, duration)
}
