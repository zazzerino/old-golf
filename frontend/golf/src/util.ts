export function emptyElem(elem: Element) {
  while (elem.firstChild) {
    elem.firstChild.remove();
  }
}
