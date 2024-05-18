export const convertHexString = nativeEventCode => {
  const evtKey = nativeEventCode.key;
  let chromeKey = '';
  if (nativeEventCode.code) chromeKey = nativeEventCode.code;

  if (evtKey === 'A' || evtKey === 'a' || chromeKey === 'KeyA') return 'A';
  else if (evtKey === 'B' || evtKey === 'b' || chromeKey === 'KeyB') return 'B';
  else if (evtKey === 'C' || evtKey === 'c' || chromeKey === 'KeyC') return 'C';
  else if (evtKey === 'D' || evtKey === 'd' || chromeKey === 'KeyD') return 'D';
  else if (evtKey === 'E' || evtKey === 'e' || chromeKey === 'KeyE') return 'E';
  else if (evtKey === 'F' || evtKey === 'f' || chromeKey === 'KeyF') return 'F';
  else if (evtKey === '1') return '1';
  else if (evtKey === '2') return '2';
  else if (evtKey === '3') return '3';
  else if (evtKey === '4') return '4';
  else if (evtKey === '5') return '5';
  else if (evtKey === '6') return '6';
  else if (evtKey === '7') return '7';
  else if (evtKey === '8') return '8';
  else if (evtKey === '9') return '9';
  else if (evtKey === '0') return '0';
  else if (evtKey === 'Backspace') return evtKey;
  return '';
};

/**
 * @description
 * The function that just input only number into text field
 * @param {nativeEventCode: any} : key code
 */
export const convertNumber = nativeEventCode => {
  const evtKey = nativeEventCode.key;

  if (evtKey === '1') return '1';
  else if (evtKey === '2') return '2';
  else if (evtKey === '3') return '3';
  else if (evtKey === '4') return '4';
  else if (evtKey === '5') return '5';
  else if (evtKey === '6') return '6';
  else if (evtKey === '7') return '7';
  else if (evtKey === '8') return '8';
  else if (evtKey === '9') return '9';
  else if (evtKey === '0') return '0';
  else if (evtKey === 'Backspace') return evtKey;
  return '';
};
