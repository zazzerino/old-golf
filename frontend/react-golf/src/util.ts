export function emptyElement(elem: Element) {
  while (elem.firstChild) {
    elem.firstChild.remove();
  }
}

export function notNull(o: any) {
  return o != null;
}
