import { error } from './log'
import { renderAnkiTagsInElement } from './anki-tags'

export * from './log'

// show severe errors in anki so that we know that they happen
window.onerror = (evtOrMsgString, source, lineNo, _col, errorObj) => {
  let msg = 'Error: '
  if (typeof errorObj !== 'undefined') {
    msg += `"${msg}"`
  } else if (typeof evtOrMsgString === 'string') {
    msg += `"${msg}"`
  } else {
    msg += '<no message>'
  }
  if (typeof source !== 'undefined') {
    msg += ` at ${source}`
    if (typeof lineNo !== 'undefined') {
      msg += `:${lineNo}`
    }
  }
  error(msg)
}

// render anki tags in dev mode once when everything appears to have loaded
// (no effect in actual anki)
if (process.env.NODE_ENV !== 'production') {
  renderAnkiTagsInElement(document.documentElement)
}
