export function emptyElement(elem: Element) {
  while (elem.firstChild) {
    elem.firstChild.remove();
  }
}
