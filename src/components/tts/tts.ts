import * as debug from '../debug'

export interface TtsOptsMandatory {
  /**
   * The text to speak, this is the only mandatory property.
   */
  text: string
}

export interface TtsOptsWithDefaults {
  /**
   * The parent element to attach the player to at the end, or ID of that
   * parent element in the document. If left out, appends to the end of the
   * body.
   */
  addTo: string | Element
  /**
   * Prefer a voice with a language code that has the specified language as a
   * substring, e.g. specifing `"zh"` will accept any chinese voice. Can also
   * prefer multiple languages in order of preference, e.g. `["zh-CN", "zh"]`
   * would indicate that `zh-CN` is preferred, but any chinese voice will do.
   *
   * Leaving out the property or setting it to an empty array will choose the
   * default voice instead.
   */
  lang: string | string[]
  /** Default: true */
  autoplay: boolean
}

/**
 * The options specified by the user to specify how to create the TTS player.
 *
 * Anything that has a default can be left out.
 */
export type TtsOpts = TtsOptsMandatory & Partial<TtsOptsWithDefaults>

/**
 * The user-given options, but with defaults filled in and with the types
 * checked.
 */
type TtsOptsBuilt = TtsOptsMandatory & TtsOptsWithDefaults

const defaultOpts: TtsOptsWithDefaults = {
  addTo: document.body,
  autoplay: true,
  lang: []
}

export function createTts (requestedOpts: TtsOpts): void {
  const opts = buildOpts(requestedOpts)
  const container = intoElement(opts.addTo)
  const speak = speakFn(opts)
  const player = renderPlayer(opts, speak)
  // clear any elements or text previously in there
  container.replaceChildren()
  container.appendChild(player)
  if (opts.autoplay) {
    speak()
  }
}

/**
 * Builds the effective options to use to build the player, derived from a
 * number of inputs, in reverse order of preference, e.g. first the defaults
 * and then the user options.
 *
 * If the final options are missing a property or if it has the wrong type,
 * throws an error.
 */
function buildOpts (given: TtsOpts): TtsOptsBuilt {
  const opts = Object.assign({}, defaultOpts, given)
  // these type checks are not really necessary, but cannot hurt since the
  // options might originate from unchecked JS
  if (typeof opts.text !== 'string') {
    throw new Error(
      'Invalid text to speak, must specify a string: ' +
      JSON.stringify(given.addTo)
    )
  }
  if (typeof opts.addTo !== 'string' && !(given.addTo instanceof Element)) {
    throw new Error(
      'Invalid addTo, set to Element or string or leave out: ' +
      JSON.stringify(given.addTo)
    )
  }
  if (typeof opts.lang !== 'string' && !Array.isArray(given.lang)) {
    throw new Error(
      'Invalid lang, set to array or string or leave out: ' +
      JSON.stringify(given.lang)
    )
  }
  if (typeof opts.autoplay !== 'boolean') {
    throw new Error(
      'Invalid autoplay, set to boolean or leave out: ' +
      JSON.stringify(given.autoplay)
    )
  }
  return opts
}

function renderPlayer (opts: TtsOptsBuilt, speak: () => void): Element {
  const player = document.createElement('button')
  player.innerText = '▶'
  player.addEventListener('click', speak)
  return player
}

/**
 * Creates a function that uses the speechSynthesis browser API to speak the
 * text specified with the opts.
 *
 * @param opts determiens text and language
 * @returns function that speaks the configured text when called
 */
function speakFn (opts: TtsOptsBuilt): () => void {
  if (typeof window.speechSynthesis === 'undefined') {
    throw new Error('speechSynthesis not found, cannot initialize TTS player')
  }

  const voice = chooseVoice(opts)
  return () => {
    const utterance = new SpeechSynthesisUtterance(opts.text)
    if (voice != null) {
      utterance.voice = voice
    } // if preferred language not found, stick to default voice
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel()
    }
    speechSynthesis.speak(utterance)
    debug.trace('spoken on web')
  }
}

function chooseVoice (opts: TtsOptsBuilt): SpeechSynthesisVoice | null {
  let langs: string[]
  if (Array.isArray(opts.lang)) {
    langs = opts.lang.map(lang => lang.toLowerCase())
  } else {
    langs = [opts.lang.toLowerCase()]
  }
  for (const lang of langs) {
    const voice = speechSynthesis.getVoices()
      .find(voice => voice.lang.toLowerCase().includes(lang))
    if (voice != null) {
      return voice
    }
  }
  return null
}

function intoElement (something: string | Element): Element {
  if (typeof something === 'string') {
    const el = document.getElementById(something)
    if (el == null) {
      throw new Error(`ID or Element expected, but #${something} not found`)
    }
    return el
  } else {
    return something
  }
}
