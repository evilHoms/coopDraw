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
      lineJoin: 'round',
      lineCap: 'round',
      lineWidth: 10,
      strokeWidth: '#000',
      fillColor: '#999'
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
      'erase'
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
    // Открываем ws соединение

    canvas.width = window.innerWidth * 3 / 4;
    canvas.height = window.innerHeight * 3 / 4;

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);

    function onMouseDown(e) {
      canvas.addEventListener('mousemove', onMouseMove);
      // Запоминаем длинну массива с действиями, что бы знать, какие действия отсылать на сервер

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
      // Через ws отсылаем изменения на сервер
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
      case 'rectangle':
        self.drawRect();
        break;
      case 'ellipse':
        self.drawEllipse();
        break;
      case 'erase':
        self.erase();
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
      ctx.strokeStyle = this.options.strokeStyle;
      ctx.lineWidth = this.options.lineWidth;
      ctx.lineCap = this.options.lineCap;
      ctx.lineJoin = this.options.lineJoin;
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
        "attr": [coords.x2, coords.y2, this.options]
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
      ctx.strokeStyle = this.options.strokeStyle;
      ctx.lineWidth = this.options.lineWidth;
      ctx.lineCap = this.options.lineCap;
      ctx.lineJoin = this.options.lineJoin;
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
        "attr": [coords.x2, coords.y2, this.options]
      });
    }
  }

  drawRect() {
    const ctx = this.ctx;
    const coords = this.coords;
    const options = this.options;
    const actions = this.actions;

    if (this.drawOpts.isFirstPoint) {
      coords.xCur = coords.x1 + options.strokeWidth;
      coords.yCur = coords.y1 + options.strokeWidth;
      ctx.beginPath();
      ctx.fillStyle = this.options.fillColor;
      ctx.strokeStyle = this.options.strokeStyle;
      ctx.lineWidth = this.options.lineWidth;
      actions.push({
        "action": "startpoint",
        "attr": [coords.x1, coords.y1]
      });
    }
    else if (!this.drawOpts.isLastPoint) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawBuffered(actions);
      ctx.rect(coords.x1, coords.y1, coords.xCur - coords.x1, coords.yCur - coords.y1);
      ctx.stroke();
      ctx.fill();
    }
    else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawBuffered(actions);
      ctx.rect(coords.x1, coords.y1, coords.x2 - coords.x1, coords.y2 - coords.y1);
      ctx.stroke();
      ctx.fill();
      actions.push({
        "action": "lastrectpoint",
        "attr": [coords.x1, coords.y1, coords.x2, coords.y2, this.options]
      });
    }
  }

  drawEllipse() {
    const ctx = this.ctx;
    const coords = this.coords;
    const options = this.options;
    const actions = this.actions;

    if (this.drawOpts.isFirstPoint) {
      coords.xCur = coords.x1 + options.strokeWidth;
      coords.yCur = coords.y1 + options.strokeWidth;
      ctx.beginPath();
      ctx.fillStyle = this.options.fillColor;
      ctx.strokeStyle = this.options.strokeStyle;
      ctx.lineWidth = this.options.lineWidth;
      actions.push({
        "action": "startellipsepoint",
        "attr": [coords.x1, coords.y1]
      });
    }
    else if (!this.drawOpts.isLastPoint) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawBuffered(actions);
      ctx.ellipse(coords.x1, coords.y1, Math.abs(coords.xCur - coords.x1), 
                  Math.abs(coords.yCur - coords.y1), 0, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
    }
    else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawBuffered(actions);
      ctx.ellipse(coords.x1, coords.y1, Math.abs(coords.x2 - coords.x1), 
                  Math.abs(coords.y2 - coords.y1), 0, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      actions.push({
        "action": "lastellipsepoint",
        "attr": [coords.x1, coords.y1, coords.x2, coords.y2, this.options]
      });
    }
  }

  erase() {
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
      ctx.save();
      ctx.strokeStyle = '#fff';
      ctx.stroke();
      ctx.restore();
      actions.push({
        "action": "point",
        "attr": [coords.xCur, coords.yCur]
      });
    }
    else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawBuffered(actions);
      ctx.lineTo(coords.x2, coords.y2);
      ctx.save();
      ctx.strokeStyle = '#fff';
      ctx.stroke();
      ctx.restore();
      actions.push({
        "action": "lasterasepoint",
        "attr": [coords.x2, coords.y2]
      });

      coords.x1 = coords.xCur;
      coords.y1 = coords.yCur;
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
          ctx.save();
          ctx.strokeStyle = el.attr[2].strokeStyle;
          ctx.lineWidth = el.attr[2].lineWidth;
          ctx.lineCap = el.attr[2].lineCap;
          ctx.lineJoin = el.attr[2].lineJoin;
          ctx.stroke();
          ctx.restore();
          break;
        case "lastrectpoint":
          ctx.rect(el.attr[0], el.attr[1], el.attr[2] - el.attr[0], el.attr[3] - el.attr[1]);
          ctx.save();
          ctx.strokeStyle = el.attr[4].strokeStyle;
          ctx.lineWidth = el.attr[4].lineWidth;
          ctx.fillStyle = el.attr[4].fillColor;
          ctx.stroke();
          ctx.fill();
          ctx.restore();
          break;
        case "startellipsepoint":
          ctx.beginPath();
          break;
        case "lastellipsepoint":
          ctx.ellipse(el.attr[0], el.attr[1], Math.abs(el.attr[2] - el.attr[0]), 
                      Math.abs(el.attr[3] - el.attr[1]), 0, 0, 2 * Math.PI);
          ctx.save();
          ctx.strokeStyle = el.attr[4].strokeStyle;
          ctx.lineWidth = el.attr[4].lineWidth;
          ctx.fillStyle = el.attr[4].fillColor;
          ctx.stroke();
          ctx.fill();
          ctx.restore();
          break;
        case "lasterasepoint":
          ctx.lineTo(el.attr[0], el.attr[1]);
          ctx.save();
          ctx.strokeStyle = '#fff';
          ctx.stroke();
          ctx.restore();
          break;
      }
    });
  }
}