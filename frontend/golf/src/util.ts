export function animateFrom(elem: SVGElement, coord: { x?: number, y?: number }, seconds = 1) {
  const { x, y } = coord;

  requestAnimationFrame(() => {
    if (x != null && y != null) {
      elem.style.transform = `translate(${x}px, ${y}px)`;
    } else if (x != null) {
      elem.style.transform = `translateX(${x}px)`;
    } else if (y != null) {
      elem.style.transform = `translateY(${y}px)`;
    }

    elem.style.transition = 'transform 0s';

    requestAnimationFrame(() => {
      elem.style.transform = ''; // set the elem back to its original position
      elem.style.transition = `transform ${seconds}s`;
    });
  })
}
