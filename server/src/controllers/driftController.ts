import { Request, Response } from 'express';
import { DriftPoint } from '../models/DriftPoint';
import { calculateEnhancedDrift } from '../services/driftService';

export const ingestData = async (req: Request, res: Response) => {
  try {
    const { prompt, response, category, embedding, isBaseline } = req.body;
    
    const newPoint = await DriftPoint.create({
      prompt,
      response,
      category,
      embedding,
      isBaseline
    });

    res.status(201).json(newPoint);
  } catch (error) {
    res.status(500).json({ error: 'Failed to ingest data' });
  }
};

export const getDriftAnalysis = async (req: Request, res: Response) => {
  try {
    const baseline = await DriftPoint.findAll({ where: { isBaseline: true } });
    const currentRun = await DriftPoint.findAll({ where: { isBaseline: false }, order: [['timestamp', 'DESC']], limit: 100 });

    const analysis = calculateEnhancedDrift(baseline, currentRun);
    
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Analysis failed' });
  }
};
