import rooms from './rooms.js';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
};

const rootHandler = (req, res) => {
  const staticPath = '/public';
  res.writeHead(200);
  res.write(
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
    
      <link href="${staticPath}/main.css" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css?family=Architects+Daughter" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css?family=Lato:400,700" rel="stylesheet">
    
      <title>Coop Draw</title>
    
    </head>
    
    
    <body>
    
      <div id="root">
    
        <h1 class="coop-draw-title">
          Coop Draw
        </h1>
      
        <header class="controlls">
          <button class="new-room--btn">New Room</button>
        </header>
      
        <main class="rooms">
          <h2 class="rooms__title">
            Rooms
          </h2>
          <div class="rooms__list"></div>
        </main>
      
        <div class="canvas-loader hidden">
          LOADING...
        </div>
    
        <section class="editor hidden">
          <div class="users">
            Users
          </div>
          <div class="canvas-wrapper">
            <aside class="editor__menu">
              Editor menu
            </aside>
            <canvas id="canvas">
              Your browser doesnt supports.
            </canvas>
            <img crossorigin="anonymous" class="editor__image hidden" src="#" alt="canvas image">
          </div>
        </section>
    
      </div>
      <script src="${staticPath}/bundle.js"></script>
    </body>
    </html>
    `
  );
  res.end();
}

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
  rooms.push({
    roomId: req.body.roomId,
    host: req.body.host,
    password: req.body.password,
    users: [
      {
        name: req.body.host,
        ableToDraw: true,
        isHost: true
      }
    ]
  });
  console.log(req.body);
  const body = {
    roomId: req.body.roomId,
    host: req.body.host,
    users: [
      {
        name: req.body.host,
        ableToDraw: true,
        isHost: true
      }
    ],
    name: req.body.host
  };
  res.writeHead(200, headers);
  res.write(JSON.stringify(body));
  res.end();
}

const removeRoom = (req, res) => {
  // Удалить комнату из rooms
  let searchingElementIndex = null;
  rooms.find((el, index) => {
    if (el.roomId === req.body.roomId) {
      searchingElementIndex = index;
      return true;
    }
  });
  if (searchingElementIndex || searchingElementIndex === 0) {
    rooms.splice(searchingElementIndex, 1);
  }
  const body = rooms;
  res.writeHead(200, headers);
  res.write(JSON.stringify(body));
  res.end();
}

const changeRoomUsers = (req, res) => {
  // Action это действие над пользователем: добавление, удаление, изменение прав
  console.log(req.body.roomId, req.body.name, req.body.password, req.body.action);
  const room = rooms.find(el => el.roomId === req.body.roomId);
  switch (req.body.action) {
    case 'connect':
      console.log('connected');
      room.users.push({name: req.body.name, ableToDraw: false, isHost: false});
      break;
    case 'disconnect':
      console.log('disconnect');
      room.users.find((el, index) => {
        if (el.name === req.body.name) {
          room.users.splice(index, 1);
          return true;
        }
      }); 
  }
  res.writeHead(200, headers);
  res.write(JSON.stringify(room));
  res.end();
}

const setImageId = (req, res) => {
  const room = rooms.find(el => el.roomId === req.body.roomId);
  room.imageId = req.body.imageId;
  res.writeHead(200, headers);
  res.write(JSON.stringify(room));
  res.end();
}

const routes = (app) => {
  app.get('/', rootHandler);
  app.get('/rooms', getRooms);
  app.post('/rooms', addRoom);
  app.delete('/rooms', removeRoom);
  app.put('/rooms', changeRoomUsers);
  app.patch('/rooms', setImageId);
  app.options('/rooms', (req, res) => {
    res.writeHead(200, headers);
    res.write(JSON.stringify({ok: 'ok'}));
    res.end();
  });
}

export default routes;