import rooms from '../rooms.js';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
};

let timer = 0;

const timers = [];

class timerTemplate {
  constructor(roomId, userName, isHost) {
    this.roomId = roomId;
    this.userName = userName;
    this.isHost = isHost;
    this.timer = null
  }

  setTimer() {
    this.timer = setTimeout(() => {
      console.log('bam!');
    }, timeout);
  }

  clearTimer() {
    clearTimeout(this.timer);
  }
}

// Создать отдельный таймер для каждой комнаты
const awaitRequestTimer = (timeout, roomId, userId) => {
  // Ищем комнату по roomId и пользователя в ней по userId, если пользователь - хост,
  // Удаляем комнату, иначе удаляем пользователя из комнаты
  timer = setTimeout(() => {
    rooms.find((room, index) => {
      if (room.roomId === roomId) {
        const host = room.users.find((user, index) => {
          if (user.userId === userId) {
            if (user.isHost) {
              return true;
            }
            else {
              room.users.splice(index, 1);
              console.log('user removed');
              return false;
            }
          }
        });
        if (host) {
          rooms.splice(index, 1);
          console.log('room removed');
        }
      }
    });
    console.log(rooms);
    console.log(roomId + userId + ' bam!');
  }, timeout);
}

// Реализуем что то вроде Long Poling
// Получаем запрос с клиента, после этого ждем 10 секунд
// И отправляем ответ, после чего ожидаем нового запроса
// Если в течение 20 секунд не получаем запрос,
// Исключаем данного пользователя из комнаты
// Если не получаем запрос от хоста, удаляем комнату.
const keepConnection = (req, res) => {
  console.log(req.query);
  clearTimeout(timer);
  const room = rooms.find(room => room.roomId === req.query.roomId)
  const body = JSON.stringify(room ? room : {msg: 'closed'});
  setTimeout(() => {
    awaitRequestTimer(15000, req.query.roomId, req.query.userId);
    res.writeHead(200, headers);
    res.write(body);
    res.end();
  }, 7000);
}

export { keepConnection };