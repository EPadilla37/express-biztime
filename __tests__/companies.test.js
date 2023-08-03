const request = require('supertest');
const app = require('../app'); 
const db = require('../db');

// Clean up the database after tests
afterAll(async () => {
  await db.end();
});

describe('Companies Routes', () => {
  test('GET /companies', async () => {
    const response = await request(app).get('/companies');
    expect(response.statusCode).toBe(200);
    expect(response.body.companies).toBeDefined();
  });

  test('GET /companies/:code', async () => {
    const response = await request(app).get('/companies/apple'); // Replace 'apple' with an actual existing company code from your database
    expect(response.statusCode).toBe(200);
    expect(response.body.company).toBeDefined();
  });
  
  test('GET /companies/:code (nonexistent)', async () => {
    const response = await request(app).get('/companies/NONEXISTENT'); // Use a nonexistent company code
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Company not found');
  });

  test('POST /companies', async () => {
    const newCompany = { code: 'NEW', name: 'New Company', description: 'A new company' };
    const response = await request(app).post('/companies').send(newCompany);
    expect(response.statusCode).toBe(201);
    expect(response.body.company).toBeDefined();
  });

  test('PUT /companies/:code', async () => {
    const updatedCompany = { name: 'Updated Company', description: 'An updated company' };
    const response = await request(app).put('/companies/NEW').send(updatedCompany);
    expect(response.statusCode).toBe(200);
    expect(response.body.company).toBeDefined();
  });

  test('DELETE /companies/:code', async () => {
    const response = await request(app).delete('/companies/NEW');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('deleted');
  });

  test('DELETE /companies/:code (nonexistent)', async () => {
    const response = await request(app).delete('/companies/NONEXISTENT');
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Company not found');
  });
});
