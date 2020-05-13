import * as express from 'express';

const router = express.Router();

export const robotsRoute = () => {
  return router.get('/robots.txt', async (_, res) => {
    const robotsTxt = 'User-agent: *\nDisallow: /';
    return res.contentType('text/plain; charset=UTF-8').send(robotsTxt);
  });
};
