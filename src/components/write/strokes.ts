import HanziWriter from 'hanzi-writer'
import { colorFg } from './colors'

export interface Strokes {
  /**
   * The container for the strokes, initially empty. If `appendTo` was
   * specified during creation, then this container is contained within.
   * Otherwise it is up to the caller to connect this element to the DOM
   * somewhere.
   */
  container: HTMLDivElement
}

export interface StrokesOpts {
  /**
   * A container to use. If not specified, the container for the strokes is
   * returned without adding it to the DOM.
   */
  appendTo: HTMLElement | undefined | null
  /**
   * A single hanzi for which to get the strokes.
   */
  character: string
}

const strokeSize: number = 75

/**
 * Returns a container for the strokes of a given character. The container
 * initially has the classes `strokes is-loading`. SVG children for the strokes
 * will be added as they are loading in the background.
 *
 * When `appendTo` is specified, the strokes container will be added to the end
 * of that element.
 *
 * The rendered result looks something like this when fully loaded:
 * ```
 * <div class="strokes">
 *   <svg class="stroke"><!-- stroke 1 --></svg>
 *   <svg class="stroke"><!-- stroke 2 --></svg>
 *   <!-- and more... -->
 * </div>
 *
 * If an error occurs loading the character data, the container is left empty.
 * ```
 */
export function createStrokes ({ appendTo, character }: StrokesOpts): Strokes {
  const container = document.createElement('div')
  container.classList.add('strokes')
  container.classList.add('is-loading')
  if (appendTo != null) {
    appendTo.appendChild(container)
  }

  HanziWriter.loadCharacterData(character).then(character => {
    if (character == null) {
      return
    }

    character.strokes
      // start with just the first stroke and then add more
      .map((_, idx) => character.strokes.slice(0, idx + 1))
      .forEach(strokes => {
        const svg = document.createElementNS(
          'http://www.w3.org/2000/svg', 'svg'
        )
        svg.classList.add('stroke')
        svg.style.width = `${strokeSize}px`
        svg.style.height = `${strokeSize}px`
        container.appendChild(svg)

        const group = document.createElementNS(
          'http://www.w3.org/2000/svg', 'g'
        )
        const { transform } = HanziWriter.getScalingTransform(
          strokeSize, strokeSize
        )
        group.setAttributeNS(null, 'transform', transform)
        svg.appendChild(group)

        strokes.forEach(strokePath => {
          const path = document.createElementNS(
            'http://www.w3.org/2000/svg', 'path'
          )
          path.setAttributeNS(null, 'd', strokePath)
          path.style.fill = colorFg
          group.appendChild(path)
        })
      })

    container.classList.remove('is-loading')
  }).catch(console.error)
  return { container }
}
