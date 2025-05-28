const iconClose = `
    <svg class="ds-icon" width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="var(--ds-icon-color, black)" stroke-linejoin="round" stroke-linecap="round" stroke-width="var(--ds-icon-stroke, 1)">
        <path d="M2 2L14.5 14.5M14.5 14.5L27 27M14.5 14.5L2 27M14.5 14.5L27 2"/>
      </g>
    </svg>
  `

export function showToast({message, duration = 5000}) {
  const newToast = document.createElement('div')
  const paragraph = document.createElement('p')
  const closeButton = document.createElement('button')
  newToast.className = 'ds-toast-item'
  newToast.dataset.theme = 'dark'
  paragraph.innerText = message
  closeButton.className = 'quiet'
  closeButton.title = 'Luk'
  closeButton.innerHTML = iconClose
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
