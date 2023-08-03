const express = require('express');
const router = express.Router();
const db = require('../db');
const slugify = require('slugify');

router.use(express.json());

router.get('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT code, name FROM companies');
    return res.json({ companies: result.rows });
  } catch (err) {
    return next(err);
  }
});

router.get('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const result = await db.query(
      'SELECT code, name, description FROM companies WHERE code = $1',
      [code]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const company = result.rows[0];

    // Fetch associated industries
    const industriesResult = await db.query(
      'SELECT i.industry FROM industries i JOIN company_industries ci ON i.code = ci.industry_code WHERE ci.comp_code = $1',
      [code]
    );

    company.industries = industriesResult.rows.map(row => row.industry);

    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const code = slugify(name, { lower: true });

    const result = await db.query(
      'INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description',
      [code, name, description]
    );

    return res.status(201).json({ company: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

router.put('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const { name, description } = req.body;

    const result = await db.query(
      'UPDATE companies SET name = $1, description = $2 WHERE code = $3 RETURNING code, name, description',
      [name, description, code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    return res.json({ company: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

router.delete('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    const result = await db.query('DELETE FROM companies WHERE code = $1 RETURNING code', [code]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    return res.json({ status: 'deleted' });
  } catch (err) {
    return next(err);
  }
});

router.post('/:code/industries/:industry', async (req, res, next) => {
  try {
    const { code, industry } = req.params;

    const companyResult = await db.query(
      'SELECT * FROM companies WHERE code = $1',
      [code]
    );
    const industryResult = await db.query(
      'SELECT * FROM industries WHERE code = $1',
      [industry]
    );

    if (companyResult.rowCount === 0 || industryResult.rowCount === 0) {
      return res.status(404).json({ error: 'Company or industry not found' });
    }

    const existingAssociation = await db.query(
      'SELECT * FROM company_industries WHERE comp_code = $1 AND industry_code = $2',
      [code, industry]
    );

    if (existingAssociation.rowCount > 0) {
      return res.status(400).json({ error: 'Association already exists' });
    }

    await db.query(
      'INSERT INTO company_industries (comp_code, industry_code) VALUES ($1, $2)',
      [code, industry]
    );

    return res.status(201).json({ message: 'Industry added to company' });
  } catch (err) {
    return next(err);
  }
});

router.get('/:code/industries', async (req, res, next) => {
  try {
    const { code } = req.params;

    const industriesResult = await db.query(
      'SELECT i.industry FROM industries i JOIN company_industries ci ON i.code = ci.industry_code WHERE ci.comp_code = $1',
      [code]
    );

    const industries = industriesResult.rows.map(row => row.industry);

    return res.json({ industries });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

