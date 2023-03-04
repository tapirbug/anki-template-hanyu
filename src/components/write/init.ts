import {} from '../debug'
import { createWriter } from './write'

const writerClass = 'strichfolge-animation'

/// Initializes all hanzi writers in the current document
export function init() {
  for (const writerContainer of document.getElementsByClassName(writerClass)) {
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
