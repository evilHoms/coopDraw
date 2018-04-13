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
        method: 'POST',
        body: form
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

  static connectRoom(url, guest, roomId, pass = null) {
    //Request to connect the room
    return new Promise((resolve, reject) => {
      const form = new FormData();
      form.append('name', guest);
      form.append('password', pass);
      form.append('action', 'connect');
      form.append('roomId', roomId);
      console.log(url);
      fetch(url, {
        method: 'PUT',
        body: form
      })
        .then(res => {
          return res.json();
        })
        .then(res => {
          resolve(res);
        });
    });
  }

  static disconnectRoom(url, guest, roomId) {
    //Request to disconnect the room
    return new Promise((resolve, reject) => {
      const form = new FormData();
      form.append('name', guest);
      form.append('action', 'disconnect');
      form.append('roomId', roomId);
      console.log(url);
      fetch(url, {
        method: 'PUT',
        body: form
      })
        .then(res => {
          return res.json();
        })
        .then(res => {
          resolve(res);
        });
    });
  }

  static deleteRoom(url, roomId) {
    //Request to delete the room
    return new Promise((resolve, reject) => {
      const form = new FormData();
      form.append('roomId', roomId);
      console.log(url);
      fetch(url, {
        method: 'DELETE',
        body: form
      })
        .then(res => {
          return res.json();
        })
        .then(res => {
          resolve(res);
        });
    });
  }

  static newImage(url, image, name) {
    // Посылаем POST запрос на сервер http://neto-api.herokuapp.com/pic
    // Content-Type: multipart/form-data
    // Тело запроса - формдата, с полями title, image(название, изображение)
    // В ответе приходит id изображения, записать в imageId конкретной комнаты
    // Можно делать данный запрос и передавать в канву в app.js
    return new Promise((resolve, reject) => {
      const form = new FormData();
      form.append('title', name);
      form.append('image', image);
      const fetchOpts = {
        method: 'POST',
        body: form
      }
      fetch(url, fetchOpts)
        .then(res => {
          if (res.status === 200)
            return res.json();
          else
            reject(res);
        })
        .then(res => {
          console.log(res);
          resolve(res);
        })
        .catch(reject);
    });
  }

  static setImageId(url, roomId, imageId) {
    return new Promise((resolve, reject) => {
      const data = new FormData();
      data.append('roomId', roomId);
      data.append('imageId', imageId);
      // const data = JSON.stringify({
      //   roomId: roomId,
      //   imageId: imageId
      // });
      const fetchOpts = {
        method: 'PATCH',
        body: data
      }
      fetch(url, fetchOpts)
        .then(res => res.json())
        .then(resolve)
        .catch(reject);
    });
  }
}