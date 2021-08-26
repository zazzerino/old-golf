export function removeChildren(elem: Element) {
  while (elem.firstChild) {
    elem.firstChild.remove();
  }
}
