const request = require('supertest');
const app = require('../app'); 
const db = require('../db');

// Clean up the database after tests
afterAll(async () => {
  await db.end();
});

describe('Invoices Routes', () => {
  test('GET /invoices', async () => {
    const response = await request(app).get('/invoices');
    expect(response.statusCode).toBe(200);
    expect(response.body.invoices).toBeDefined();
  });

  test('GET /invoices/:id', async () => {
    const response = await request(app).get('/invoices/1'); // Replace '1' with an actual existing invoice ID from your database
    expect(response.statusCode).toBe(200);
    expect(response.body.invoice).toBeDefined();
  });

  test('GET /invoices/:id (nonexistent)', async () => {
    const response = await request(app).get('/invoices/999'); // An ID that does not exist
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Invoice not found');
  });

  test('POST /invoices', async () => {
    const newInvoice = { comp_code: 'apple', amt: 500 }; // Replace 'apple' with an actual existing company code from your database
    const response = await request(app).post('/invoices').send(newInvoice);
    expect(response.statusCode).toBe(201);
    expect(response.body.invoice).toBeDefined();
  });
  
  test('PUT /invoices/:id', async () => {
    const updatedInvoice = { amt: 600 };
    const response = await request(app).put('/invoices/1').send(updatedInvoice); // Replace '1' with an actual existing invoice ID from your database
    expect(response.statusCode).toBe(200);
    expect(response.body.invoice).toBeDefined();
  });
  
  test('DELETE /invoices/:id', async () => {
    const response = await request(app).delete('/invoices/1'); // Replace '1' with an actual existing invoice ID from your database
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('deleted');
  });

  test('DELETE /invoices/:id (nonexistent)', async () => {
    const response = await request(app).delete('/invoices/999'); // An ID that does not exist
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Invoice not found');
  });
});
