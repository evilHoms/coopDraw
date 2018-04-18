'use strict';

import './main.scss';
import { Room } from './room/room.js';
import { Requests } from './request/request.js';
import { Popup } from './popup/popup.js';
import { Canvas } from './canvas/canvas';
import config from '../config.json';

// Адрес один, тк различаются типом запроса GET POST DELETE
const { hostname } = config;
const requestUrl = hostname + '/rooms';

const root = document.querySelector('#root');
const newRoomBtn = document.querySelector(`.new-room--btn`);
const roomsList = document.querySelector(`.rooms__list`);
let editor = null;

Requests.getRooms(requestUrl)
  .then(res => {
    if (res.length) {
      console.log(res);
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
    const roomEl = new Room(room.host, room.roomId, room.users.length - 1, onConnectClick);
    wrapper.appendChild(roomEl.room);
  });
}

function onConnectClick(e) {
  e.preventDefault();
  const roomId = e.currentTarget.dataset.roomId;
  if (!e.target.classList.contains('room__connect--btn'))
    return;

  const popup = new Popup('connectRoom', onPopupSubmitClick, roomId);
  root.appendChild(popup.popup);
  document.querySelector('.popup').querySelector('input').focus();
}

function onNewRoomBtnClick(e) {
  e.preventDefault();
  const newRoomPopup = new Popup('newRoom', onPopupSubmitClick);
  root.appendChild(newRoomPopup.popup);
  document.querySelector('.popup').querySelector('input').focus();
}

function onPopupSubmitClick(e) {
  e && e.preventDefault();
  if (!e.target.classList.contains('popup__submit--btn'))
    return;

  const name = this.querySelector('#nameInput').value;
  const pass = this.querySelector('#passInput').value;
  console.log(name, pass);

  if (this.dataset.type === 'newRoom') {
    Requests.newRoom(requestUrl, name, pass)
      //Создается объект canvas
      .then(res => {
        document.querySelector('.rooms').classList.add('hidden');
        document.querySelector('.controlls').classList.add('hidden');
        console.log(res.userId);
        editor = new Canvas(document.querySelector('.editor'), res.host, res.users, name, true, res.roomId, res.userId);
      })
      .catch(er => console.log(er));
  }
  else if (this.dataset.type === 'connectRoom') {
    const roomId = e.currentTarget.dataset.roomId;
    console.log(roomId);
    Requests.connectRoom(requestUrl, name, roomId, pass)
      //Создается объект canvas
      .then(res => {
        console.log(res);
        document.querySelector('.rooms').classList.add('hidden');
        document.querySelector('.controlls').classList.add('hidden');
        editor = new Canvas(document.querySelector('.editor'), res.host, res.users, name, false, roomId, res.userId, res.imageId, res.background);
      })
      .catch(er => console.log(er));
  }

  this.parentElement.removeChild(this);
}