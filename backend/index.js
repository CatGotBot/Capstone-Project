const express = require('express');
const app = express();
const path = require('path');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://postgres:kseniya3@localhost/acme_skiresorts_db');



app.use(express.json());

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
      SET name=$1, is_favorite=$2, updated_at= now()
      WHERE id=$3 RETURNING *
    `;
    const response = await client.query(SQL, [ req.body.name, req.body.is_favorite, req.params.id]);
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
      INSERT INTO resorts(name, is_favorite)
      VALUES($1, $2)
      RETURNING *
    `;
    const response = await client.query(SQL, [ req.body.name, req.body.is_favorite]);
    res.send(response.rows[0]);
  }
  catch(ex){
    next(ex);
  }
});



const init = async()=> {
  await client.connect();
  console.log('connected to database');
  let SQL = `
    DROP TABLE IF EXISTS resorts;
    CREATE TABLE resorts(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      hours VARCHAR(255) NOT NULL
    );
  `;
  await client.query(SQL);
  console.log('tables created');
  SQL = `
    INSERT INTO resorts(name, location, hours) VALUES('Seven Springs', 'Champion, PA', '9am - 9pm');
    INSERT INTO resorts(name, location, hours) VALUES('Wisp', 'McHenry, MD', '9am - 9pm');
    INSERT INTO resorts(name, location, hours) VALUES('Whitetail', 'Mercersburg, PA', '9am - 9pm');
    INSERT INTO resorts(name, location, hours) VALUES('Roundtop', 'Lewisberry, PA', '9am - 9pm');

  `;
  await client.query(SQL);
  console.log('data seeded');
  const port = process.env.PORT || 3000;
  app.listen(port, ()=> console.log(`listening on port ${port}`));
};

init();