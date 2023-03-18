import {} from '../debug'
import { createWriter } from './write'

const writerClass = 'strichfolge-animation'

/// Initializes all hanzi writers in the current document
export function init (): void {
  const writerContainers = document.getElementsByClassName(writerClass)
  for (let i = 0; i < writerContainers.length; ++i) {
    const writerContainer = writerContainers[i]
    if (!writerContainer.classList.contains('is-initialized')) {
      const text = writerContainer.textContent?.trim()
      if (text) {
        createWriter({
          addTo: writerContainer,
          text
        })
      }
      writerContainer.classList.add('is-initialized')
    }
  }
}
