// Labs API Routes
import { Router, Request, Response } from 'express';
import { query } from '../config/database.js';

const router = Router();

/**
 * GET /api/labs
 * Get all labs (with optional filtering)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { owner, domain, limit = 100, offset = 0 } = req.query;

    let sql = `
      SELECT * FROM labs
      WHERE active = TRUE
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (owner) {
      sql += ` AND owner_address = $${paramIndex++}`;
      params.push(owner);
    }

    if (domain) {
      sql += ` AND domain ILIKE $${paramIndex++}`;
      params.push(`%${domain}%`);
    }

    sql += ` ORDER BY total_assets DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    const labs = await query(sql, params);

    // Get total count
    let countSql = 'SELECT COUNT(*) as total FROM labs WHERE active = TRUE';
    const countParams: any[] = [];
    if (owner) {
      countSql += ' AND owner_address = $1';
      countParams.push(owner);
    }
    const countResult = await query<{ total: string }>(countSql, countParams);
    const total = parseInt(countResult[0].total);

    res.json({
      labs,
      total,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });
  } catch (error: any) {
    console.error('Error fetching labs:', error);
    res.status(500).json({ error: 'Failed to fetch labs' });
  }
});

/**
 * GET /api/labs/:id
 * Get single lab by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const labs = await query('SELECT * FROM labs WHERE id = $1', [id]);

    if (labs.length === 0) {
      return res.status(404).json({ error: 'Lab not found' });
    }

    res.json(labs[0]);
  } catch (error: any) {
    console.error('Error fetching lab:', error);
    res.status(500).json({ error: 'Failed to fetch lab' });
  }
});

/**
 * GET /api/labs/:id/deposits
 * Get deposit history for a lab
 */
router.get('/:id/deposits', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // Get vault address for lab
    const labs = await query<{ vault_address: string }>(
      'SELECT vault_address FROM labs WHERE id = $1',
      [id]
    );

    if (labs.length === 0) {
      return res.status(404).json({ error: 'Lab not found' });
    }

    const vaultAddress = labs[0].vault_address;
    if (!vaultAddress) {
      return res.json({ deposits: [], total: 0 });
    }

    const deposits = await query(
      `SELECT * FROM deposits 
       WHERE vault_address = $1 
       ORDER BY timestamp DESC 
       LIMIT $2 OFFSET $3`,
      [vaultAddress, limit, offset]
    );

    const countResult = await query<{ total: string }>(
      'SELECT COUNT(*) as total FROM deposits WHERE vault_address = $1',
      [vaultAddress]
    );

    res.json({
      deposits,
      total: parseInt(countResult[0].total),
    });
  } catch (error: any) {
    console.error('Error fetching deposits:', error);
    res.status(500).json({ error: 'Failed to fetch deposits' });
  }
});

/**
 * GET /api/labs/:id/redemptions
 * Get redemption history for a lab
 */
router.get('/:id/redemptions', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // Get vault address for lab
    const labs = await query<{ vault_address: string }>(
      'SELECT vault_address FROM labs WHERE id = $1',
      [id]
    );

    if (labs.length === 0) {
      return res.status(404).json({ error: 'Lab not found' });
    }

    const vaultAddress = labs[0].vault_address;
    if (!vaultAddress) {
      return res.json({ redemptions: [], total: 0 });
    }

    const redemptions = await query(
      `SELECT * FROM redemptions 
       WHERE vault_address = $1 
       ORDER BY timestamp DESC 
       LIMIT $2 OFFSET $3`,
      [vaultAddress, limit, offset]
    );

    const countResult = await query<{ total: string }>(
      'SELECT COUNT(*) as total FROM redemptions WHERE vault_address = $1',
      [vaultAddress]
    );

    res.json({
      redemptions,
      total: parseInt(countResult[0].total),
    });
  } catch (error: any) {
    console.error('Error fetching redemptions:', error);
    res.status(500).json({ error: 'Failed to fetch redemptions' });
  }
});

export default router;


