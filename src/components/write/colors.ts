const nightMode = document.getElementsByClassName('nightMode').length > 0

export const colorBg = nightMode ? '#909090' : '#999999'
export const colorFg = nightMode ? '#FFFFFF' : '#222222'
