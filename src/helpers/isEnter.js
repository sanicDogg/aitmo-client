export default function isEnter(event) {
  if (event.code) {
    if (event.code !== 'Enter') return false;
  }
  return true;
}

export const isSpace = (event) => {
  if (event.code) {
    if (event.code !== 'Space') return false;
  }
  return true;
};
