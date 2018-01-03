'use strict';

export class Requests {
  
  static getRooms(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(res => {
          return res.json();
        })
        .then(res => {
          resolve(res);
        });
    });
  }

  static newRoom(url, host, pass = null) {
    //Request to adding new room
    return new Promise((resolve, reject) => {
      const form = new FormData();
      form.append('host', host);
      form.append('password', pass);
      form.append('roomId', generateRandomRoomId('room'));

      fetch(url, {
        // method: 'POST',
        // body: form
      })
        .then(res => {
          return res.json();
        })
        .then(res => {
          resolve(res);
        });

      function generateRandomRoomId(base) {
        const rooms = document.querySelectorAll('.room');
        let isUnick;
        let randomEnding;

        do {
          isUnick = true;
          randomEnding = Math.round(Math.random() * 10000);
          rooms.forEach(el => {
            if (el.dataset.roomId === base + randomEnding)
              isUnick = false;
          });
        } while (!isUnick);
        
        return base + randomEnding;
      }
    });
  }

  static connectRoom(url, guest, pass = null) {
    //Request to connect the room
    return new Promise((resolve, reject) => {
      const form = new FormData();
      form.append('guest', guest);
      form.append('password', pass);

      fetch(url, {
        // method: 'POST',
        // body: form
      })
        .then(res => {
          return res.json();
        })
        .then(res => {
          resolve(res);
        });
    });
  }
}