import { Router } from 'express';
import { ingestData, getDriftAnalysis } from '../controllers/driftController';

const router = Router();

router.post('/ingest', ingestData);
router.get('/analysis', getDriftAnalysis);

export default router;
