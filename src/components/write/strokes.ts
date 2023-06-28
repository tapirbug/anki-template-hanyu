import HanziWriter from 'hanzi-writer'
import { colorFg } from './colors'

interface Strokes {
  /**
   * The container for the strokes, initially empty. If `appendTo` was
   * specified during creation, this property has the same value. Connecting it
   * to the DOM is up to the caller.
   */
  container: HTMLElement
}

interface StrokesOpts {
  /**
   * A container to use. If not specified, creates a new DIV instead. Such an
   * automatically created div is not present in the DOM, but can be retrieved
   * and connected by inspecting the return value.
   */
  appendTo: HTMLElement | undefined | null
  /**
   * A single hanzi for which to get the strokes.
   */
  character: string
}

const strokeSize: number = 75

/**
 * Returns a container for the strokes of a given character, initially empty
 * and unconnected to the dom. The container initially has the  classes
 * `strokes is-loading`. SVG children for the strokes will be added as they
 * are loading in the background.
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
  const container = appendTo ?? document.createElement('div')
  container.classList.add('strokes')
  container.classList.add('is-loading')
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
