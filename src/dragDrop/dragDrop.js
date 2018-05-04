class Draggable {
  constructor(element) {
    this.element = element;
    this.xDif = null;
    this.yDif = null;

    this.onElementMove = this.onElementMove.bind(this);
  }

  catchElement({ xMouse, yMouse }) {
    const { element } = this;
    element.dataset.catched = true;
    element.style.cursor = 'all-scroll';
    const left = parseInt(getComputedStyle(element).left);
    const top = parseInt(getComputedStyle(element).top);
    const x = xMouse;
    const y = yMouse;
    const xDif = x - left;
    const yDif = y - top;
    this.xDif = xDif;
    this.yDif = yDif;
    window.addEventListener('mousemove', this.onElementMove);
    return { left: left, top: top };
  }

  moveElement({ xMouse, yMouse }) {
    const { element } = this;
    if (element.dataset.catched === 'true') {
      const xDif = this.xDif;
      const yDif = this.yDif;
      const x = xMouse;
      const y = yMouse;
      element.style.left = x - xDif + 'px';
      element.style.top = y - yDif + 'px';
    }
    return { left: element.style.left, top: element.style.top };
  }

  onElementMove(e) {
    this.moveElement({ xMouse: e.pageX, yMouse: e.pageY });
  }

  dropElement({ xMouse, yMouse }) {
    const { element } = this;
    element.dataset.catched = false;
    element.style.cursor = null;
    const xDif = this.xDif;
    const yDif = this.yDif;
    const x = xMouse;
    const y = yMouse;
    element.style.left = x - xDif + 'px';
    element.style.top = y - yDif + 'px';
    this.xDif = null;
    this.yDif = null;
    window.removeEventListener('mousemove', this.onElementMove);
    return { left: element.style.left, top: element.style.top };
  }
}

export default Draggable;

