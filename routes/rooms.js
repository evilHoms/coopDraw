import rooms from '../rooms.js';

const generateUserId = (name) => {
  return Date.now() + Math.round(Math.random() * 1000) + name;
}

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
};

const getRooms = (req, res) => {
  // Создаем тело ответа из списка комнат
  const body = rooms;
  res.writeHead(200, {
    'access-control-allow-origin': '*'
  });
  res.write(JSON.stringify(body));
  res.end();
}

const addRoom = (req, res) => {
  // Добаить инфу о комнате в rooms
  console.log(req.body);
  const userId = generateUserId(req.body.host);
  rooms.push({
    roomId: req.body.roomId,
    host: req.body.host,
    password: req.body.password,
    users: [
      {
        userId: userId,
        name: req.body.host,
        ableToDraw: true,
        isHost: true
      }
    ]
  });
  console.log(req.body);
  const body = {
    userId: userId,
    roomId: req.body.roomId,
    host: req.body.host,
    password: req.body.password,
    users: [
      {
        userId: userId,
        name: req.body.host,
        ableToDraw: true,
        isHost: true
      }
    ]
  };
  res.writeHead(200, headers);
  res.write(JSON.stringify(body));
  res.end();
}

const removeRoom = (req, res) => {
  // Удалить комнату из rooms
  rooms.find((el, index) => {
    if (el.roomId === req.body.roomId) {
      rooms.splice(index, 1);
      return true;
    }
  });
  const body = rooms;
  res.writeHead(200, headers);
  res.write(JSON.stringify(body));
  res.end();
}

const changeRoomUsers = (req, res) => {
  // Action это действие над пользователем: добавление, удаление, изменение прав
  console.log(req.body.roomId, req.body.name, req.body.password, req.body.action);
  const room = rooms.find(el => el.roomId === req.body.roomId);
  let userId = null;
  switch (req.body.action) {
    case 'connect':
      if (room.password === req.body.password) {
        console.log('connected');
        userId = generateUserId(req.body.name);
        console.log(userId);
        room.users.push({
          userId: userId,
          name: req.body.name, 
          ableToDraw: false, 
          isHost: false
        });
        const body = Object.assign({userId: userId}, room);
        res.writeHead(200, headers);
        res.write(JSON.stringify(body));
        res.end();
      }
      else {
        const body = {msg: 'denied'};
        res.writeHead(200, headers);
        res.write(JSON.stringify(body));
        res.end();
      }
      break;
    case 'disconnect':
      console.log('disconnect');
      room && room.users.find((el, index) => {
        if (el.userId === req.body.userId) {
          console.log(el.userId, req.body.userId);
          userId = el.userId;
          room.users.splice(index, 1);
          return true;
        }
      }); 
      const body = room ? room : {msg: 'empty'};
      res.writeHead(200, headers);
      res.write(JSON.stringify(body));
      res.end();
      break;
  }
}

const setImageId = (req, res) => {
  const room = rooms.find(el => el.roomId === req.body.roomId);
  room.imageId = req.body.imageId;
  res.writeHead(200, headers);
  res.write(JSON.stringify(room));
  res.end();
}

export { getRooms, addRoom, removeRoom, changeRoomUsers, setImageId };