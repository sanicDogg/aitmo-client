const isEventKeyCode = (e) => {
  if (e) {
    if (e.keyCode) {
      return true;
    }
  }
  return false;
};

export default function isEnter(event) {
  if (isEventKeyCode(event)) {
    if (event.keyCode !== 13) return false;
  }
  return true;
}

export const isSpace = (event) => {
  if (isEventKeyCode(event)) {
    if (event.keyCode !== 32) return false;
  }
  return true;
};
