import { Router } from 'express';
import Container from 'typedi';
const router = Router();
import { EnderecoController  } from '../controllers/EnderecoController';

const getController = (): EnderecoController => {
  return Container.get<EnderecoController>('EnderecoController');
};

const crateRouter = () => {
  router.get('/:cep', (req, res) => getController().get(req, res));

  return router;
};

export default crateRouter;
