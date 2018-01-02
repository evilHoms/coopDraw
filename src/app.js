'use strict';

import './main.scss';
import { Room } from './room/room.js';
import { Requests } from './request/request.js';
import { Popup } from './popup/popup.js';

//Смоделировать ответ сервера в виде json и создать запрос

const root = document.querySelector('#root');
const newRoomBtn = document.querySelector(`.new-room--btn`);
const roomsList = document.querySelector(`.rooms__list`); 
Requests.getRooms('src/roomsResponse.json')
  .then(res => {
    buildRooms(roomsList, res);
  });

newRoomBtn.addEventListener(`click`, onNewRoomBtnClick);

function buildRooms(wrapper, rooms) {
  wrapper.textContent = '';
  rooms.forEach(room => {
    const roomEl = new Room(room.host, room.roomId, room.guests)
    wrapper.appendChild(roomEl.room);
  });
}

function onNewRoomBtnClick(e) {
  e.preventDefault();
  const newRoomPopup = new Popup('newRoom');
  root.appendChild(newRoomPopup.popup);
}