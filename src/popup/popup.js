'use strict';

import './popup.scss';

export class Popup {
  constructor(type) {
    this.type = type;
    this.popup = this.createPopup();
    this.popup.addEventListener('click', this.onSubmitPress);
  }

  createPopup() {
    switch(this.type) {
      case 'newRoom':
        return newRoomPopup();
      case 'connectRoom':
        return connectRoomPopup();
      default:
        console.error('wrong popup type');
    }

    function newRoomPopup() {
      const popup = document.createElement('div');
      popup.classList.add('popup');

      const main = document.createElement('div');
      main.classList.add('popup__main');

      const title = document.createElement('h3');
      title.textContent = 'Creating New Room';

      const nameInput = document.createElement('input');
      
      const passInput = document.createElement('input');

      const submitButton = document.createElement('button');
      submitButton.classList.add('popup__submit--btn');
      submitButton.textContent = 'submit';

      main.appendChild(title);
      main.appendChild(nameInput);
      main.appendChild(passInput);
      main.appendChild(submitButton);
      popup.appendChild(main);

      return popup;
    }

    function connectRoomPopup() {
      const popup = document.createElement('div');
      popup.classList.add('popup');

      const main = document.createElement('div');
      main.classList.add('popup__main');

      const title = document.createElement('h3');
      title.textContent = 'Connecting The Room';

      const nameInput = document.createElement('input');
      
      const passInput = document.createElement('input');

      const submitButton = document.createElement('button');
      submitButton.classList.add('popup__submit--btn');
      submitButton.textContent = 'submit';

      main.appendChild(title);
      main.appendChild(nameInput);
      main.appendChild(passInput);
      main.appendChild(submitButton);
      popup.appendChild(main);

      return popup;
    }
  }

  onSubmitPress(e) {
    e.preventDefault();
    if (!e.target.classList.contains('popup__submit--btn'))
      return;

    //Создаем запрос на серер с введенными данными
    //В зависимости от типа разные запросы

    this.parentElement.removeChild(this);
  }
}