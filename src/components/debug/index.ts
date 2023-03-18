import { error } from './log'
import { renderAnkiTagsInElement } from './anki-tags'

export * from './log'

// show severe errors in anki so that we know that they happen
window.onerror = (evtOrMsgString, source, lineNo) => { error(`Error: "${evtOrMsgString.toString()}" at ${source}:${lineNo}`) }

// render anki tags in dev mode once when everything appears to have loaded
// (no effect in actual anki)
if (process.env.NODE_ENV !== 'production') {
  // window.addEventListener('DOMContentLoaded', () => renderAnkiTagsInElement(document.documentElement))
  renderAnkiTagsInElement(document.documentElement)
}
