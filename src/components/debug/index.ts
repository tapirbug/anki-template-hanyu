export function trace(text: string): void {
  log(Level.Trace, text)
}

export function info(text: string): void {
  log(Level.Info, text)
}

export function error(text: string): void {
  log(Level.Error, text)
}

const enum Level {
  Trace = 'trace',
  Info = 'info',
  Error = 'error'
}

function log(level: Level, text: string): void {
  const container = getOrCreateDebugContainer()
  const logLine = document.createElement('p')
  logLine.classList.add(level)
  logLine.innerText = text
  container.appendChild(logLine)
}

function getOrCreateDebugContainer(): HTMLElement {
  const debugContainerId = 'debug-container'
  let container = document.getElementById(debugContainerId)
  if (!container) {
    container = document.createElement('div')
    container.id = debugContainerId
    document.body.appendChild(container)
  }
  return container
}