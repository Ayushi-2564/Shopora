import { Request, Response } from 'express';
import { store } from '../data/store';

export const getUserPreferences = async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'default-user';
    const preferences = store.getPreferences(userId);

    return res.status(200).json({
      success: true,
      data: preferences,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch preferences',
    });
  }
};

export const updateUserPreferences = async (req: Request, res: Response) => {
  try {
    const userId = (req.body.userId as string) || 'default-user';
    const updates = req.body;

    const preferences = store.updatePreferences(userId, updates);

    return res.status(200).json({
      success: true,
      data: preferences,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to update preferences',
    });
  }
};
