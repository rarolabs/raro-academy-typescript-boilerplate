import * as express from 'express';
import * as cluster from 'cluster';
import * as os from 'os';
import * as http from 'http';

const PORT = process.env.PORT;

const createServer = (app: express.Express) => {
  if ((cluster as any).isMaster) {
    const n = os.cpus().length;
    for (var i = 0; i < n; i++) {
      (cluster as any).fork();
    }

    (cluster as any).on('online', function(worker) {
      console.log(`Filho inicializado pelo PID: ${worker.process.pid}`);
    });

    (cluster as any).on('exit', function(worker, code, signal) {
      console.log(`PID ${worker.process.pid} code: ${code} signal: ${signal}`);
      (cluster as any).fork();
    });
  } else {
    app.set('port', PORT);
    const server = http.createServer(app);
    server.listen(PORT);
    server.on('error', onError);
  }
};

function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  var bind = typeof PORT === 'string' ? `Pipe ${PORT}`: `Port ${PORT}`;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
    default:
      throw error;
  }
}

export default createServer;
