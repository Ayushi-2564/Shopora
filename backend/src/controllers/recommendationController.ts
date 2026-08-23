import { Request, Response } from 'express';
import { recommendationService } from '../services/recommendationService';
import { replenishmentService } from '../services/replenishmentService';
import { seasonalService } from '../services/seasonalService';

export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'default-user';
    const recs = recommendationService.getRecommendations(userId);

    return res.status(200).json({
      success: true,
      data: recs,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch recommendations',
    });
  }
};

export const getMealCombos = async (req: Request, res: Response) => {
  try {
    const combos = recommendationService.getMealCombos();
    return res.status(200).json({
      success: true,
      data: combos,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch meal combos',
    });
  }
};

export const getReplenishment = async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'default-user';
    const replenishment = replenishmentService.getReplenishmentSuggestions(userId);

    return res.status(200).json({
      success: true,
      data: replenishment,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch replenishment suggestions',
    });
  }
};

export const getSeasonalPicks = async (req: Request, res: Response) => {
  try {
    const seasonal = seasonalService.getSeasonalPicks();
    const currentSeason = seasonalService.getCurrentSeason();

    return res.status(200).json({
      success: true,
      data: {
        season: currentSeason,
        picks: seasonal,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch seasonal picks',
    });
  }
};
