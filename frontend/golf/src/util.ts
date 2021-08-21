export function emptyElement(elem: Element) {
  while (elem.firstChild) {
    elem.firstChild.remove();
  }
}

export function hideElement(id: string): boolean {
  const elem = document.getElementById(id);

  if (elem == null) {
    return false;
  }

  elem.style.display = 'none';
  return true;
}

// export function toggleElement(id: string) {
//   const elem = 
// }
