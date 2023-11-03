import { Router } from 'express';

import vehicle from './vehicle/route';

const router: Router = Router();

router.use('/vehicle', vehicle);

export default router;
