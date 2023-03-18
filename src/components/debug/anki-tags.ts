import * as initWrite from '../write/init'
import * as initTts from '../tts/init'

/**
 * Replaces anki tags with test data in the given element.
 *
 * This function only has an effect in environments other than production, e.g.
 * testing of the template in the browser before changes are tested in Anki.
 * During production, these tags are rendered by Anki itself and this function
 * has no effect.
 */
export function renderAnkiTagsInElement (element: Element): void {
  for (const child of element.childNodes) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const element = child as Element
      if (element.tagName !== 'SCRIPT') {
        renderAnkiTagsInElement(child as Element)
      }
    } else if (child.nodeType === Node.TEXT_NODE) {
      const replacement = renderTextNode(null, child.textContent ?? '', 0)
      if (replacement !== null) {
        child.replaceWith(...replacement)
      }
    } else {
      console.log('not rendering child: ', child)
    }
  }
}

/**
 * Looks for anki tags in the text content starting with fromIdx and renders
 * them. The rendered contents are appended to the given array of already added
 * elements (or a new list is started if given null). Returns null only if the
 * previously rendered list was already null and no Anki tags were found and
 * thus nothing should be changed about the node with the given text. An empty
 * array would mean that the text consisted only of anki tags and all resulted
 * in empty content, so that the node with the given text should be deleted.
 */
function renderTextNode (rendered: Node[] | null, text: string, fromIdx: number): Node[] | null {
  const tagStart = text.indexOf('{{', fromIdx)
  if (tagStart > 0) {
    // tag found
    const tagContentStart = tagStart + '{{'.length
    const tagEnd = text.indexOf('}}', tagContentStart)
    if (tagEnd < 0) {
      throw new Error('Unclosed Anki tag')
    }

    const tagContent = text.substring(tagContentStart, tagEnd)
    const tagNameEndExcl = !tagContent.includes(' ') ? tagContent.length : tagContent.indexOf(' ')
    const tagName = tagContent.substring(0, tagNameEndExcl)
    // ignore the tag arguments for now

    rendered ??= []

    if (tagStart > fromIdx) {
      // append text before the anki directive if non-empty
      rendered.push(document.createTextNode(text.substring(fromIdx, tagStart)))
    }

    // then the rendered content for the anki directive
    rendered.push(renderTag(tagName))

    // and then render the rest, which could contain more nodes or just text (or nothing)
    rendered = renderTextNode(rendered, text, tagEnd + '}}'.length)
  } else if (fromIdx < text.length) {
    // no more tags found, append trailing text to already rendered content
    rendered ??= []
    rendered.push(document.createTextNode(text.substring(fromIdx)))
  } // else no tags found and no preceding text

  return rendered
}

function renderTag (name: string): Node {
  if (name === 'FrontSide') {
    const loading = document.createElement('div')
    loading.innerText = 'Loading front side...'
    replaceFrontLater(loading)
    return loading
  } else if (name.startsWith('text:')) {
    return renderTagOther(name.substring('text:'.length))
  } else {
    return renderTagOther(name)
  }
}

function renderTagOther (name: string): Text {
  // for now all other tags render to their name
  return document.createTextNode(name)
}

function replaceFrontLater (loading: Element): void {
  if (loading.ownerDocument.location.pathname.endsWith('front.html')) {
    // avoid loops
    return
  }

  const frontUrl = getCorrespondingFrontUrl(window.location)
  fetch(frontUrl).then(async r => await r.text()).then(frontHtml => {
    const front = document.createElement('div')
    front.classList.add('front')
    front.innerHTML = frontHtml
    renderAnkiTagsInElement(front)
    loading.replaceWith(front)
    // in case there are writers or something like that, initialize them
    initWrite.init()
    initTts.init()
  }).catch(console.error)
}

function getCorrespondingFrontUrl (backLocation: Location): URL {
  const pathComponents = backLocation.pathname.split('/')
  pathComponents.pop()
  pathComponents.push('front.html')
  const frontUrl = new URL(backLocation.href)
  frontUrl.pathname = pathComponents.join('/')
  return frontUrl
}
