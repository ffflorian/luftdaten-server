import * as express from 'express';

const router = express.Router();

export const mainRoute = () => {
  router.get('/', async (req, res) => res.redirect('/temperature'));
  router.get('/entries', async (req, res) => res.render('entries', {page: 'entries'}));
  router.get('/humidity', async (req, res) => res.render('humidity', {page: 'humidity'}));
  router.get('/sds_p1', async (req, res) => res.render('sds_p1', {page: 'sds_p1'}));
  router.get('/sds_p2', async (req, res) => res.render('sds_p2', {page: 'sds_p2'}));
  router.get('/temperature', async (req, res) => res.render('temperature', {page: 'temperature'}));

  return router;
};
