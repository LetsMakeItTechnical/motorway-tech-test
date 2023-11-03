import 'dotenv/config';
import * as http from 'http';

import app from './api';
import { databaseConnector } from './database/connector';
import AppError from './helpers/appError';

class Server {
  private server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  constructor() {
    this.server = http.createServer(app);
    this.handleProcessSignals();
  }

  public start() {
    const PORT = process.env.API_PORT || '8000';
    const BASE_URL = process.env.APP_BASE_URL || `http://localhost:${PORT}`;
    this.server.listen(PORT, () => {
      console.log(`The API server has successfully started. \nListening at ${BASE_URL}`);
    });
  }

  public handleProcessSignals() {
    process.on('unhandledRejection', (err: AppError) => {
      console.log('UNHANDLED REJECTION! 💥 Shutting down...');
      console.log(err.name, err.message);
      this.server.close(() => {
        process.exit(1);
      });
    });
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
      this.server.close(() => {
        console.log('💥 Process terminated!');
      });
    });
    process.on('SIGINT', () => {
      void databaseConnector.end(); // Disconnect from Postgres
      console.log('Postgres Disconnected.');
      process.exit(0);
    });
  }
}

// Instantiate and start the server
const serverInstance = new Server();
serverInstance.start();
