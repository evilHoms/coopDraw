'use strict';

import './popup.scss';

export class Popup {
  constructor(type, eventHendler) {
    this.type = type;
    this.popup = null;
    this.createPopup();
    this.popup.addEventListener('click', eventHendler);
  }

  createPopup() {
    this.popup = (() => {
      const popup = document.createElement('div');
      popup.classList.add('popup');
      popup.dataset.type = this.type;

      const main = document.createElement('div');
      main.classList.add('popup__main');

      const title = document.createElement('h3');
      if (this.type === 'newRoom') {
        title.textContent = 'Creating New Room';
      }
      else if (this.type === 'connectRoom') {
        title.textContent = 'Connecting The Room';
      }

      const nameInput = document.createElement('input');
      nameInput.id = 'nameInput';
      
      const passInput = document.createElement('input');
      passInput.id = 'passInput';

      const submitButton = document.createElement('button');
      submitButton.classList.add('popup__submit--btn');
      submitButton.textContent = 'submit';

      main.appendChild(title);
      main.appendChild(nameInput);
      main.appendChild(passInput);
      main.appendChild(submitButton);
      popup.appendChild(main);

      return popup;
    })();
  }
}