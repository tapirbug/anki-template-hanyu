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
  addTo: string | HTMLElement
  /**
   * Prefer a voice with a language code that has the specified language as a
   * substring, e.g. specifing `"zh"` will accept any chinese voice. Can also
   * prefer multiple languages in order of preference, e.g. `["zh-CN", "zh"]`
   * would indicate that `zh-CN` is preferred, but any chinese voice will do.
   * 
   * Leaving out the property or setting it to an empty array will choose the
   * default voice instead.
   */
  lang: string|string[]
  /** Default: true */
  autoplay: boolean
  /**
   * Do not initialize the TTS player if the html element includes any of these
   * classes.
   * 
   * This avoids initializing more than one TTS implementation, which could
   * lead to multiple parallel autoplays, which would probably sound terrible.
   * 
   * If not specified, does not create a player on Linux, Windows, Mac,
   * Android, all of which have their own working built-in TTS solution that
   * can be used instead of this player.
   */
  skipOnPlatforms: string[]
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

const defaultOpts : TtsOptsWithDefaults = {
  addTo: document.body,
  autoplay: true,
  lang: [],
  skipOnPlatforms: [
    'linux',
    'win',
    'mac',
    'android'
  ]
}

export function createTts(requestedOpts: TtsOpts) {
  const opts = buildOpts(requestedOpts)

  const htmlClasses = document.body.parentElement?.classList
  if (htmlClasses === null) {
    console.error('no classlist support, cannot detect platform')
    return
  }
  if (opts.skipOnPlatforms.some(p => htmlClasses?.contains(p))) {
    console.log('skipping TTS intialization relying on native TTS service')
    return
  }

  if (typeof window.speechSynthesis === 'undefined') {
    console.error('speechSynthesis not found, cannot initialize TTS player')
    return
  }

  try {
    const container = intoElement(opts.addTo)
    const speak = speakFn(opts);
    container.appendChild(renderPlayer(opts, speak))
    if (opts.autoplay) {
      speak()
    }
  } catch (error) {
    document.body.append(`Error: ${error}`)
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
function buildOpts(given: TtsOpts): TtsOptsBuilt {
  const opts = Object.assign({}, defaultOpts, given)
  // these type checks are not really necessary, but cannot hurt since the
  // options might originate from unchecked JS
  if (typeof opts.text !== 'string') {
    throw new Error(`Invalid text to speak, must specify a string: ${given.addTo}`)
  }
  if (typeof opts.addTo !== 'string' && !(given.addTo instanceof HTMLElement)) {
    throw new Error(`Invalid addTo, set to HTMLElement or string or leave out: ${given.addTo}`)
  }
  if (typeof opts.lang !== 'string' && !Array.isArray(given.lang)) {
    throw new Error(`Invalid lang, set to array or string or leave out: ${given.lang}`)
  }
  if (typeof opts.autoplay !== 'boolean') {
    throw new Error(`Invalid autoplay, set to boolean or leave out: ${given.autoplay}`)
  }
  if (!Array.isArray(opts.skipOnPlatforms)) {
    throw new Error(`Invalid skipOnPlatforms, set to array of strings or leave out: ${given.autoplay}`)
  }
  return opts
}

function renderPlayer(opts: TtsOptsBuilt, speak: () => void): HTMLElement {
  const player = document.createElement('button')
  player.innerText = '▶'
  player.addEventListener('click', speak)
  return player
}

function speakFn(opts: TtsOptsBuilt): () => void {
  const voice = chooseVoice(opts)
  return () => {
    const utterance = new SpeechSynthesisUtterance(opts.text)
    if (voice) {
      utterance.voice = voice
    } // if preferred language not found, stick to default voice
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel()
    }
    speechSynthesis.speak(utterance)
  }
}

function chooseVoice(opts: TtsOptsBuilt): SpeechSynthesisVoice|null {
  let langs : string[]
  if (Array.isArray(opts.lang)) {
    langs = opts.lang.map(lang => lang.toLowerCase())
  } else if (typeof opts.lang === "string") {
    langs = [ opts.lang.toLowerCase() ]
  } else {
    throw new Error(`Tried to choose a voice but cannot choose voice with illegal parameter ${opts.lang}`)
  }
  for (const lang of langs) {
    const voice = speechSynthesis.getVoices()
      .find(voice => voice.lang.toLowerCase().includes(lang))
    if (voice) {
      return voice
    }
  }
  return null
}

function intoElement(something: string|HTMLElement): HTMLElement {
  if (typeof something === "string") {
    const el = document.getElementById(something)
    if (el == null) {
      throw new Error(`ID or HTMLElement expected, but #${something} not found`)
    }
    return el
  } else if (something instanceof HTMLElement) {
    return something
  } else {
    throw new Error(`ID or HTMLElement expected, got ${something}`)
  }
}
