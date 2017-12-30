'use strict';

import './main.scss';
import { Room } from './room/room.js';
import { Requests } from './request/request.js';

//Смоделировать ответ сервера в виде json и создать запрос

const roomsList = document.querySelector(`.rooms__list`); 
Requests.getRooms('src/roomsResponse.json')
  .then(res => {
    buildRooms(roomsList, res);
  });

function buildRooms(wrapper, rooms) {
  wrapper.textContent = '';
  rooms.forEach(room => {
    const roomEl = new Room(room.host, room.roomId, room.guests)
    wrapper.appendChild(roomEl.room);
  });
}