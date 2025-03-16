const express = require('express');
const app = express();
const path = require('path');
const path = require('pg');
const client  = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_skiresorts_db');

app.use(express.json());
app.use(require('morgan')('dev'));

app.get('/api/resorts', async(req, res, next)=> {
    try {
      const SQL = `
        SELECT * from resorts ORDER BY created_at DESC;
      `;
      const response = await client.query(SQL);
      res.send(response.rows);
    }
    catch(ex){
      next(ex);
    }
  });

