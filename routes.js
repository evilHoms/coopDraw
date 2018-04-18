import { rootHandler } from './routes/root.js';
import { getRooms, addRoom, removeRoom, changeRoomUsers, setImageId } from './routes/rooms.js';
import { keepConnection } from './routes/connection.js';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
};

const routes = (app) => {
  app.get('/', rootHandler);
  app.get('/connection', keepConnection);
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