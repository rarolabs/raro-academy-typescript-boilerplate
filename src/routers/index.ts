import * as express from 'express';
import createUserRouter from './userRouter';
import createEnderecoRouter from './enderecoRouter';

const createRouters = (app: express.Express) => {
  app.use('/users', createUserRouter());
  app.use('/enderecos', createEnderecoRouter());
};

export default createRouters;
