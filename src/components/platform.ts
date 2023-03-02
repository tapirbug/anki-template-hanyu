export enum Platform {
  AnkiDroid,
  Desktop,
  Other
}

export function isOnPlatform(...anyOfPlatforms: Platform[]): boolean {
  const htmlClasses = document.body.parentElement?.classList
  if (!htmlClasses) {
    throw new Error('no classlist support, cannot detect platform')
  }
  const actualPlatform = detectPlatform()
  return anyOfPlatforms.some(p => p === actualPlatform)
}

function detectPlatform(): Platform {
  const htmlClasses = document.body.parentElement?.classList
  if (!htmlClasses) {
    throw new Error('no classlist support, cannot detect platform')
  }
  if (htmlClasses.contains('linux') && !htmlClasses.contains('android')
      || htmlClasses.contains('win')
      || htmlClasses.contains('max')) {
    return Platform.Desktop
  }

  if (htmlClasses.contains('android')) {
    // for testing its enough to specify android without linux
    return Platform.AnkiDroid
  }

  return Platform.Other
}