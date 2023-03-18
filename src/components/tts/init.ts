/// This file initalizes all text-to-speech players on the page when loaded.
///
/// All players get the text content of a node with id "tts-text"
import * as debug from '../debug'
import { createTts } from './tts'
import { isOnPlatform, Platform } from '../platform'

const ttsPlayerClass = 'anki-web-player'
const languages = ['cmn', 'zh-cn', 'zh_cn', 'zh']

export function init (): void {
  if (!isOnPlatform(Platform.AnkiDroid, Platform.Desktop)) {
    debug.trace('start initializing tts')
    for (const playerContainer of document.getElementsByClassName(ttsPlayerClass)) {
      if (!playerContainer.classList.contains('is-initialized')) {
        const text = playerContainer.textContent?.trim()
        if (text) {
          createTts({
            addTo: playerContainer,
            text,
            lang: languages
          })
        }
        playerContainer.classList.add('is-initialized')
      }
    }
    debug.trace('done initializing tts')
  } else {
    debug.trace('skipping script-based TTS in favor of native TTS')
  }
}
