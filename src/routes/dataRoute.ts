import * as express from 'express';

const router = express.Router();

export const dataRoute = () => {
  return router.post('/data/?', async (req, res, next) => {
    console.log('body', req.body);
    return res.sendStatus(200);
  });
};
