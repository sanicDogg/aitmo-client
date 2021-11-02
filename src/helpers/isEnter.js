export default function isEnter(event) {
  if (event.keyCode) {
    if (event.keyCode !== 13) return false;
  }
  return true;
}

export const isSpace = (event) => {
  if (event.keyCode) {
    if (event.keyCode !== 32) return false;
  }
  return true;
};
