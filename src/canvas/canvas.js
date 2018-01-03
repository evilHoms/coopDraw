'use strict';

import './canvas.scss';

export class Canvas {
  constructor(editorElement, host, guests) {
    this.editor = editorElement;
    this.host = host;
    this.guests = guests;
    this.canvas = this.editor.querySelector('#canvas');
    this.ctx = canvas.getContext('2d');
    this.init();
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

  }

  initCanvas() {
    this.canvas.width = window.innerWidth * 3 / 4;
    this.canvas.height = window.innerHeight * 3 / 4;

    this.ctx.moveTo(50, 50);
    this.ctx.lineTo(canvas.width / 2, canvas.height / 2);
    this.ctx.stroke();
  }
}