import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';

import { routes } from './routes';

const app = express();
app.use(cors());
app.use(express.json());

app.use(routes);

const staticFilesPath = path.join(
  __dirname,
  process.env.STATIC_FILES_PATH || './public'
);
app.use('/public', express.static(staticFilesPath));

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});
