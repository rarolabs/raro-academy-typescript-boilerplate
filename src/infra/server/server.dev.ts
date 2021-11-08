import * as express from 'express';

const createServer = (app: express.Express) => {
  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`Application running on port ${port}`);
  });
}

export default createServer;
