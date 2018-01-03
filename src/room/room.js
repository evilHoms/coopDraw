'use strict';

import './room.scss'

export class Room {
  constructor(hostName, roomId, guestsCount, eventHandler) {
    this.hostName = hostName;
    this.guestsCount = guestsCount;
    this.roomId = roomId;
    this.room = null;
    this.updateRoom(this.guestsCount);
    this.room.addEventListener(`click`, eventHandler);
  }

  updateRoom(guestsCount) {
    this.guestsCount = guestsCount;

    this.room = (() => {
      const room = document.createElement('div');
      room.classList.add('room');
      room.dataset.roomId = this.roomId;

      const host = document.createElement('div');
      host.classList.add('room__host');
      host.textContent = `Host: ${this.hostName}`;

      const guests = document.createElement('div');
      guests.classList.add('room__guests');
      guests.textContent = `Guests: ${this.guestsCount}`;

      const connect = document.createElement('button');
      connect.classList.add('room__connect--btn');
      connect.textContent = 'Connect';

      room.appendChild(host);
      room.appendChild(guests);
      room.appendChild(connect);

      return room;
    })();
  }
}