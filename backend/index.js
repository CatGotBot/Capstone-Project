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


  app.get('/api/resorts/:id', async(req, res, next)=> {
    try {
      const SQL = `
        SELECT * from resorts WHERE id = $1;
      `;
      const response = await client.query(SQL, [ req.params.id]);
      res.send(response.rows[0]);
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.put('/api/resorts/:id', async(req, res, next)=> {
    try {
      const SQL = `
        UPDATE resorts
        SET name=$1, is_location=$2, updated_at= now()
        WHERE id=$3 RETURNING *
      `;
      const response = await client.query(SQL, [ req.body.name, req.body.is_location, req.params.id]);
      res.send(response.rows[0]);
    }
    catch(ex){
      next(ex);
    }
  });
  

  app.delete('/api/resorts/:id', async(req, res, next)=> {
    try {
      const SQL = `
        DELETE from resorts
        WHERE id = $1
      `;
      const response = await client.query(SQL, [ req.params.id]);
      res.sendStatus(204);
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.post('/api/resorts', async(req, res, next)=> {
    try {
      const SQL = `
        INSERT INTO resorts(name, is_location)
        VALUES($1, $2)
        RETURNING *
      `;
      const response = await client.query(SQL, [ req.body.name, req.body.is_location]);
      res.send(response.rows[0]);
    }
    catch(ex){
      next(ex);
    }
  });
  