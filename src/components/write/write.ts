import HanziWriter from 'hanzi-writer'

const globalId = 'strichfolge-animation'
/// Sizes to use for 1 character, 2, 3, and 4 or more.
const sizes = [160, 100, 60, 50]

const enum State {
  Loading = 'loading',
  Error = 'error',
  Ready = 'ready'
}

interface Write {
  state: State
}

interface WriterOpts {
  addTo: Element
  text: string
}

interface WriteError extends Write {
  state: State.Error
  msg: string
}

interface WriteReady extends Write {
  state: State.Ready
  writers: Writer[]
  animatedIdx: number
  animateNextIdx: number
}

interface Writer {
  character: string
  hanziWriter: HanziWriter
}

/// Adds a Hanzi writer into the element with the ID defined above.
export function createWriter (opts: WriterOpts): void {
  const container = opts.addTo
  if (!(container instanceof Element)) {
    throw new Error(`Could not find element #${globalId} for the Hanz writer`)
  }
  const oldWriteState = getState()
  if (isWriteError(oldWriteState)) {
    container.replaceChildren(`Previous error, not trying again: ${oldWriteState.msg}`)
    return
  }
  try {
    const write = initWriter(container, opts)
    animate(write)
    for (const writer of write.writers) {
      writer.hanziWriter.target.node.addEventListener('click', () => {
        continueAnimationWith(write, writer)
      })
    }
    window[globalId] = write
  } catch (error) {
    const writeError: WriteError = {
      state: State.Error,
      msg: `${error}`
    }
    window[globalId] = writeError
    container.replaceChildren(`Error: ${writeError.msg}`)
  }
}

function getState (): Write {
  const existingWriteState: any = window[globalId]
  if (existingWriteState && isWrite(existingWriteState)) {
    return existingWriteState
  }
  const newWriteState = { state: State.Loading }
  window[globalId] = newWriteState
  return newWriteState
}

/// Creates the necessary state and DOM elements for the later animations.
function initWriter (container: Element, opts: WriterOpts): WriteReady {
  const nightMode = document.getElementsByClassName('nightMode').length > 0
  const colorBg = nightMode ? '#909090' : '#999999'
  const colorFg = nightMode ? '#FFFFFF' : '#222222'
  const chars = splitIntoDrawableChars(opts.text)
  const size = sizes[Math.min(sizes.length - 1, chars.length - 1)]
  const writers: Writer[] = []
  container.innerHTML = ''
  for (let charIdx = 0; charIdx < chars.length; ++charIdx) {
    const char = chars[charIdx]
    if (char === '，' || char === ',') {
      container.append('，')
    } else if (char.length === 0 || char === ' ') {
      container.append(' ')
    } else if (/[\u3400-\u9FBF]/.test(char)) {
      writers.push({
        character: char,
        hanziWriter: HanziWriter.create(
          'strichfolge-animation',
          char,
          {
            width: size,
            height: size,
            padding: 0,
            strokeColor: colorFg,
            outlineColor: colorBg,
            strokeAnimationSpeed: 1.75
          }
        )
      })
    }
  }
  return {
    state: State.Ready,
    writers,
    animatedIdx: -1,
    animateNextIdx: 0
  }
}

function animate (write: WriteReady) {
  if (write.writers.length > 0) {
    write.animatedIdx = 0
    write.animateNextIdx = write.writers.length === 1 ? 0 : 1
    const advance = advanceAnimation(write)
    const first = write.writers[write.animatedIdx]
    first.hanziWriter.animateCharacter({ onComplete: advance })
  }
}

function advanceAnimation (write: WriteReady): () => void {
  const advance = () => {
    write.animatedIdx = write.animateNextIdx
    write.animateNextIdx = (write.animatedIdx + 1) % write.writers.length
    const newWriter = write.writers[write.animatedIdx]
    newWriter.hanziWriter.animateCharacter({ onComplete: advance })
  }
  return advance
}

function continueAnimationWith (write: WriteReady, continueWith: Writer) {
  const { writers, animatedIdx } = write
  const currentWriter = writers[animatedIdx]
  write.animateNextIdx = writers.indexOf(continueWith)
  // reset all current animations, which also triggers the callback
  // to advance the animation to the newly set next index
  currentWriter.hanziWriter.setCharacter(currentWriter.character)
}

/// Replaces commas with chinese commas and some other gimmicks, then returns
/// an array of strings for which we want to add hanzi writers
function splitIntoDrawableChars (text: string): string[] {
  const charsAll = text.split('')
  const chars: string[] = []
  for (let charIdx = 0; charIdx < charsAll.length; ++charIdx) {
    const char = charsAll[charIdx]
    if (char === '，' || char === ',') {
      chars.push('，')
    } else if (char.length === 0 || char === ' ') {
      chars.push(' ')
    } else {
      chars.push(char)
    }
  }
  return chars
}

function isWrite (writer: any): writer is WriteError {
  return 'state' in writer &&
    (writer.state === State.Error ||
      writer.state === State.Loading ||
      writer.state == State.Ready)
}

function isWriteError (writer: Write): writer is WriteError {
  return writer.state === State.Error
}
