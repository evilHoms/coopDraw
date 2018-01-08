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
      title.classList.add('popup__title');
      if (this.type === 'newRoom') {
        title.textContent = 'Creating New Room';
      }
      else if (this.type === 'connectRoom') {
        title.textContent = 'Connecting The Room';
      }

      const nameWrapper = document.createElement('div');
      nameWrapper.classList.add('input-wrapper');
      const nameLabel = document.createElement('label');
      nameLabel.classList.add('popup__label');
      nameLabel.setAttribute('for', 'nameInput');
      nameLabel.textContent = 'Name: ';
      const nameInput = document.createElement('input');
      nameInput.classList.add('popup__input');
      nameInput.id = 'nameInput';
      nameWrapper.appendChild(nameLabel);
      nameWrapper.appendChild(nameInput);
      
      const passWrapper = document.createElement('div');
      passWrapper.classList.add('input-wrapper');
      const passLabel = document.createElement('label');
      passLabel.classList.add('popup__label');
      passLabel.setAttribute('for', 'passInput');
      passLabel.textContent = 'Password: ';
      const passInput = document.createElement('input');
      passInput.classList.add('popup__input');
      passInput.id = 'passInput';
      passWrapper.appendChild(passLabel);
      passWrapper.appendChild(passInput);

      const submitButton = document.createElement('button');
      submitButton.classList.add('popup__submit--btn');
      submitButton.textContent = 'submit';

      main.appendChild(title);
      main.appendChild(nameWrapper);
      main.appendChild(passWrapper);
      main.appendChild(submitButton);
      popup.appendChild(main);

      return popup;
    })();
  }
  //Доделать попап, вставить лейблы
}