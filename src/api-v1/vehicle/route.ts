import { Router } from 'express';

import Controller from './vehicle.controller';

const vehicle: Router = Router();
const controller = new Controller();

vehicle.get('/:id/state', controller.getStateByIdAndTimestamp);

export default vehicle;
