import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import globalErrorHandler from './error/errorController';
import apiV1 from './api-v1';
import AppError from './helpers/appError';

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.setMiddlewares();
        this.setRoutes();
        this.catchErrors();
    }

    private setMiddlewares(): void {
        this.express.enable('trust proxy');
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(
            express.urlencoded({
                extended: false, // Whether to use algorithm that can handle non-flat data strutures
                limit: 10000, // Limit payload size in bytes
                parameterLimit: 2, // Limit number of form items on payload
            })
        );
        this.express.use(helmet());
    }

    private setRoutes(): void {
        this.express.use('/v1', apiV1);
    }

    private catchErrors(): void {
        this.express.all('*', (req, _res, next) => {
            next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
        });

        this.express.use(globalErrorHandler);
    }
}

export default new App().express;
