'use strict';

import './canvas.scss';

export class Canvas {
  constructor(editorElement, host, guests) {
    this.editor = editorElement;
    this.host = host;
    this.guests = guests;
    this.canvas = this.editor.querySelector('#canvas');
    this.ctx = canvas.getContext('2d');
    this.drawOpts = {
      isFirstPoint: true,
      isLastPoint: false
    }
    this.tool = {
      current: 'pen'
    };
    this.coords = {
      x1: null,
      y1: null,
      x2: null,
      y2: null,
      xCur: null,
      yCur: null
    };
    this.options = {
      strokeWidth: 1,
      strokeColor: '#000',
      fillColor: '#fff'
    }
    this.actions = [];
    this.init();
    this.editor.querySelector('#pen').classList.add('selected');
  }

  init() {
    this.buildUsersPanel();
    this.buildAsideMenu();
    this.initCanvas();
    this.editor.classList.remove('hidden');
  }

  buildUsersPanel() {
    const panel = this.editor.querySelector('.users');
    panel.textContent = '';

    panel.appendChild(buildUser(this.host.name))
    this.guests.forEach(el => {
      panel.appendChild(buildUser(el.name));
    });

    function buildUser(name) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('user');

      const userName = document.createElement('div');
      userName.classList.add('userName');
      userName.textContent = name;

      wrapper.appendChild(userName);

      return wrapper;
    }
  }

  buildAsideMenu() {
    const aside = this.editor.querySelector('.editor__menu');
    const tools = [
      'pen',
      'line',
      'rectangle',
      'ellipse',
      'erase',
      'undo',
      'redo'
    ];

    aside.textContent = '';
    tools.forEach(el => {
      addAsideElement(aside, el, this);
    });

    function addAsideElement(wrapper, tool, self) {
      const element = document.createElement('div');
      element.classList.add('tool');
      element.id = tool;
      element.textContent = tool;
      element.addEventListener('click', (e) => {
        onToolClick(e, self);
      });
      wrapper.appendChild(element);
    }

    function onToolClick(e, self) {
      self.editor.querySelector('.selected').classList.remove('selected');
      self.tool.current = e.currentTarget.id;
      e.currentTarget.classList.add('selected');
    }
  }

  initCanvas() {
    const canvas = this.canvas;
    const coords = this.coords;
    const tool = this.tool;
    const drawOpts = this.drawOpts;
    const self = this;
    const draw = this.draw;

    canvas.width = window.innerWidth * 3 / 4;
    canvas.height = window.innerHeight * 3 / 4;

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);

    function onMouseDown(e) {
      canvas.addEventListener('mousemove', onMouseMove);

      drawOpts.isLastPoint = false;
      drawOpts.isFirstPoint = true;

      const canvasBoundingRect = canvas.getBoundingClientRect();
      coords.x1 = Math.round(e.pageX - canvasBoundingRect.x);
      coords.y1 = Math.round(e.pageY - canvasBoundingRect.y);

      draw(tool.current, self);
      drawOpts.isFirstPoint = false;
    }

    function onMouseMove(e) {
      const canvasBoundingRect = canvas.getBoundingClientRect();
      coords.xCur = Math.round(e.pageX - canvasBoundingRect.x);
      coords.yCur = Math.round(e.pageY - canvasBoundingRect.y);

      draw(tool.current, self);
    }

    function onMouseUp(e) {
      canvas.removeEventListener('mousemove', onMouseMove);
      const canvasBoundingRect = canvas.getBoundingClientRect();
      coords.x2 = Math.round(e.pageX - canvasBoundingRect.x);
      coords.y2 = Math.round(e.pageY - canvasBoundingRect.y);

      drawOpts.isLastPoint = true;
      draw(tool.current, self);
    }
  }

  draw(tool, self) {
    switch(tool) {
      case 'pen':
        self.drawPoint();
        break;
      case 'line':
        self.drawLine();
        break;
    }
  }

  drawPoint() {
    const ctx = this.ctx;
    const coords = this.coords;
    const options = this.options;
    const actions = this.actions;

    if (this.drawOpts.isFirstPoint) {
      coords.xCur = coords.x1 + options.strokeWidth;
      coords.yCur = coords.y1 + options.strokeWidth;
      ctx.beginPath();
      ctx.moveTo(coords.x1, coords.y1);
      actions.push({
        "action": "startpoint",
        "attr": [coords.x1, coords.y1]
      });
    }
    else if (!this.drawOpts.isLastPoint) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawBuffered(actions);
      ctx.lineTo(coords.xCur, coords.yCur);
      ctx.stroke();
      actions.push({
        "action": "point",
        "attr": [coords.xCur, coords.yCur]
      });
    }
    else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawBuffered(actions);
      ctx.lineTo(coords.x2, coords.y2);
      ctx.stroke();
      actions.push({
        "action": "lastpoint",
        "attr": [coords.x2, coords.y2]
      });

      coords.x1 = coords.xCur;
      coords.y1 = coords.yCur;
    }
  }

  drawLine() {
    const ctx = this.ctx;
    const coords = this.coords;
    const options = this.options;
    const actions = this.actions;

    if (this.drawOpts.isFirstPoint) {
      coords.xCur = coords.x1 + options.strokeWidth;
      coords.yCur = coords.y1 + options.strokeWidth;
      ctx.beginPath();
      actions.push({
        "action": "startpoint",
        "attr": [coords.x1, coords.y1]
      });
    }
    else if (!this.drawOpts.isLastPoint) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawBuffered(actions);
      ctx.moveTo(coords.x1, coords.y1);
      ctx.lineTo(coords.xCur, coords.yCur);
      ctx.stroke();
    }
    else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawBuffered(actions);
      ctx.moveTo(coords.x1, coords.y1);
      ctx.lineTo(coords.x2, coords.y2);
      ctx.stroke();
      actions.push({
        "action": "lastpoint",
        "attr": [coords.x2, coords.y2],
      });
    }
  }

  drawBuffered(actions) {
    const ctx = this.ctx;
    actions.forEach(el => {
      switch(el.action) {
        case "startpoint":
          ctx.beginPath();
          ctx.moveTo(el.attr[0], el.attr[1]);
          break;
        case "point":
          ctx.lineTo(el.attr[0], el.attr[1]);
          break;
        case "lastpoint":
          ctx.lineTo(el.attr[0], el.attr[1]);
          ctx.stroke();
          break;
      }
    });
  }
}