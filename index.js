import express from 'express';
import routes from './routes.js';
import bodyParser from 'body-parser';
import multer from 'multer';

const upload = multer();
const app = express();
const port = process.env.PORT || 3000;
const mode = process.env.PRODUCTION ? 'production' : 'development';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(upload.array()); 
app.use('/public', express.static('dist'));
routes(app);

const onServerStart = () => {
  console.log(`Server start on ${port} port in ${mode} mode`);
};

app.listen(port, onServerStart);