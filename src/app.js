'use strict';

import './main.scss';
import { Room } from './room/room.js';
import { Requests } from './request/request.js';
import { Popup } from './popup/popup.js';
import { Canvas } from './canvas/canvas';

const root = document.querySelector('#root');
const newRoomBtn = document.querySelector(`.new-room--btn`);
const roomsList = document.querySelector(`.rooms__list`);
let editor = null;

Requests.getRooms('src/roomsResponse.json')
  .then(res => {
    if (res.length) {
      buildRooms(roomsList, res);
    }
    else {
      document.querySelector('.rooms__title').textContent = 'No Rooms';
    }
  })
  .catch(er => console.log(er));

newRoomBtn.addEventListener(`click`, onNewRoomBtnClick);


function buildRooms(wrapper, rooms) {
  wrapper.textContent = '';
  rooms.forEach(room => {
    const roomEl = new Room(room.host, room.roomId, room.guests, onConnectClick);
    wrapper.appendChild(roomEl.room);
  });
}

function onConnectClick(e) {
  e.preventDefault();
  if (!e.target.classList.contains('room__connect--btn'))
    return;

  const popup = new Popup('connectRoom', onPopupSubmitClick);
  document.querySelector('#root').appendChild(popup.popup);
}

function onNewRoomBtnClick(e) {
  e.preventDefault();
  const newRoomPopup = new Popup('newRoom', onPopupSubmitClick);
  root.appendChild(newRoomPopup.popup);
}

function onPopupSubmitClick(e) {
  e.preventDefault();
  if (!e.target.classList.contains('popup__submit--btn'))
    return;

  const name = this.querySelector('#nameInput').value;
  const pass = this.querySelector('#passInput').value;
  console.log(name, pass);

  if (this.dataset.type === 'newRoom') {
    Requests.newRoom('src/newRoomResponse.json', name, pass)
      //Создается объект canvas
      .then(res => {
        document.querySelector('.rooms').classList.add('hidden');
        document.querySelector('.controlls').classList.add('hidden');
        editor = new Canvas(document.querySelector('.editor'), res.host, res.users, name, true);
      })
      .catch(er => console.log(er));
  }
  else if (this.dataset.type === 'connectRoom') {
    Requests.connectRoom('src/connectRoomResponse.json', name, pass)
      //Создается объект canvas
      .then(res => {
        document.querySelector('.rooms').classList.add('hidden');
        document.querySelector('.controlls').classList.add('hidden');
        editor = new Canvas(document.querySelector('.editor'), res.host, res.users, name, false);
      })
      .catch(er => console.log(er));
  }

  this.parentElement.removeChild(this);
}