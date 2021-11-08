import createDevServer from './server.dev';
import createProdServer from './server.prod';

const createServer = process.env.NODE_ENV === 'development' ?
  createDevServer :
  createProdServer
;

export default createServer;
