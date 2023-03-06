export enum Platform {
  AnkiDroid,
  Desktop,
  Other
}

export function isOnPlatform(...anyOfPlatforms: Platform[]): boolean {
  const actualPlatform = detectPlatform()
  return anyOfPlatforms.some(p => p === actualPlatform)
}

function detectPlatform(): Platform {
  const htmlClasses = document.documentElement.classList
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