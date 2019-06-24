import * as express from 'express';

const router = express.Router();

export const mainRoute = () => {
  router.get('/', async (req, res) => res.render('home'));

  router.get('/entries', async (req, res) => res.render('entries'));
  router.get('/temperature', async (req, res) => res.render('temperature'));
  router.get('/humidity', async (req, res) => res.render('humidity'));

  return router;
};
