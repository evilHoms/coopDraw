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

  static newRoom(url, host, id, pass = null) {
    //Request for adding new room
  }

  static connectRoom(url, name, pass = null) {
    //Request to connect the room
  }
}