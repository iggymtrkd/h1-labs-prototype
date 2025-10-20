// Analytics API Routes
import { Router, Request, Response } from 'express';
import { query } from '../config/database.js';

const router = Router();

/**
 * GET /api/analytics/platform
 * Get platform-wide statistics
 */
router.get('/platform', async (req: Request, res: Response) => {
  try {
    // Check cache first
    const cached = await query<{ data: any }>(
      'SELECT data FROM analytics_cache WHERE key = $1 AND expires_at > NOW()',
      ['platform_stats']
    );

    if (cached.length > 0) {
      return res.json(cached[0].data);
    }

    // Calculate stats
    const [labStats, userStats, tvlStats] = await Promise.all([
      query<{ total: string }>('SELECT COUNT(*) as total FROM labs WHERE active = TRUE'),
      query<{ total: string }>('SELECT COUNT(*) as total FROM users'),
      query<{ total: string }>(
        'SELECT COALESCE(SUM(total_assets), 0) as total FROM labs WHERE active = TRUE'
      ),
    ]);

    // Top labs by TVL
    const topLabs = await query(
      `SELECT * FROM labs 
       WHERE active = TRUE 
       ORDER BY total_assets DESC 
       LIMIT 10`
    );

    const stats = {
      totalLabs: parseInt(labStats[0].total),
      totalUsers: parseInt(userStats[0].total),
      totalLabsStaked: tvlStats[0].total,
      totalRevenue: '0', // Would calculate from revenue table
      topLabsByTVL: topLabs,
    };

    // Cache for 5 minutes
    await query(
      `INSERT INTO analytics_cache (key, data, expires_at) 
       VALUES ($1, $2, NOW() + INTERVAL '5 minutes')
       ON CONFLICT (key) DO UPDATE SET data = $2, expires_at = NOW() + INTERVAL '5 minutes'`,
      ['platform_stats', JSON.stringify(stats)]
    );

    res.json(stats);
  } catch (error: any) {
    console.error('Error fetching platform stats:', error);
    res.status(500).json({ error: 'Failed to fetch platform stats' });
  }
});

/**
 * GET /api/analytics/user/:address
 * Get user-specific statistics
 */
router.get('/user/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;

    const [user, labs, deposits, redemptions] = await Promise.all([
      query('SELECT * FROM users WHERE address = $1', [address]),
      query('SELECT * FROM labs WHERE owner_address = $1', [address]),
      query(
        'SELECT COUNT(*) as total, COALESCE(SUM(labs_amount), 0) as total_amount FROM deposits WHERE user_address = $1',
        [address]
      ),
      query(
        'SELECT COUNT(*) as total, COALESCE(SUM(labs_amount), 0) as total_amount FROM redemptions WHERE user_address = $1',
        [address]
      ),
    ]);

    res.json({
      user: user[0] || { address, labs_staked: '0', total_deposits: '0', total_redemptions: '0' },
      labsOwned: labs.length,
      labs,
      depositStats: deposits[0],
      redemptionStats: redemptions[0],
    });
  } catch (error: any) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

/**
 * GET /api/analytics/lab/:id
 * Get lab-specific statistics
 */
router.get('/lab/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [lab, deposits, redemptions, uniqueDepositors] = await Promise.all([
      query('SELECT * FROM labs WHERE id = $1', [id]),
      query(
        'SELECT COUNT(*) as total, COALESCE(SUM(labs_amount), 0) as total_amount FROM deposits WHERE vault_address = (SELECT vault_address FROM labs WHERE id = $1)',
        [id]
      ),
      query(
        'SELECT COUNT(*) as total, COALESCE(SUM(labs_amount), 0) as total_amount FROM redemptions WHERE vault_address = (SELECT vault_address FROM labs WHERE id = $1)',
        [id]
      ),
      query(
        'SELECT COUNT(DISTINCT user_address) as total FROM deposits WHERE vault_address = (SELECT vault_address FROM labs WHERE id = $1)',
        [id]
      ),
    ]);

    if (lab.length === 0) {
      return res.status(404).json({ error: 'Lab not found' });
    }

    res.json({
      lab: lab[0],
      depositStats: deposits[0],
      redemptionStats: redemptions[0],
      uniqueDepositors: parseInt(uniqueDepositors[0].total),
    });
  } catch (error: any) {
    console.error('Error fetching lab stats:', error);
    res.status(500).json({ error: 'Failed to fetch lab stats' });
  }
});

export default router;


