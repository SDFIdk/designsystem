export function showToast({message, duration = 5000}) {
  const newToast = document.createElement('div')
  const paragraph = document.createElement('p')
  const closeButton = document.createElement('button')
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
  newToast.className = 'ds-toast-item'
  newToast.dataset.theme = 'dark'
  paragraph.innerText = message
  closeButton.className = 'quiet'
  closeButton.title = 'Luk'
  use.setAttribute('href', '../assets/icons.svg#close')
  svg.appendChild(use)
  closeButton.appendChild(svg)
  newToast.appendChild(paragraph)
  newToast.appendChild(closeButton)

  const targetElement = document.querySelector('.ds-toast-container')
  if (!targetElement) {
    const toastcontainer = document.createElement('div')
    toastcontainer.className = 'ds-toast-container'
    document.body.append(toastcontainer)
    toastcontainer.append(newToast)
  } else {
    targetElement.append(newToast)
  }

  closeButton.addEventListener('click', () => newToast.remove())
  
  setTimeout(function() {
    newToast.remove()
  }, duration)
}
