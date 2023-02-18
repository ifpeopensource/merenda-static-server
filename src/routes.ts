import { Router } from 'express';

export const routes = Router();

routes.get('/', (_request, response) => {
  return response.json({ message: 'Hello World' });
});
