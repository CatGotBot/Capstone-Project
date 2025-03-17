const express = require('express');
const app = express();
const path = require('path');
const pg = require('pg');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://postgres:kseniya3@localhost/acme_skiresorts_db');

const JWT_SECRET = process.env.JWT_SECRET || 'set_up_jwt_secret_key_after';


app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);
 

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: 'Access denied' });
  
    try {
      const verified = jwt.verify(token, JWT_SECRET);
      req.user = verified;
      next();
    } catch (error) {
      res.status(400).json({ error: 'Invalid token' });
    }
  };


app.get('/api/resorts', async(req, res, next)=> {

    console.log ('get resorts')

  try {
    const SQL = `
      SELECT * from resorts;
    `;
    const response = await client.query(SQL);

    console.log (response)

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
        SET name=$1, location=$2, hours=$3
        WHERE id=$4 RETURNING *
      `;
      const response = await client.query(SQL, [ req.body.name, req.body.location, req.body.hours, req.params.id]);
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
        INSERT INTO resorts(name, location, hours)
        VALUES($1, $2, $3)
        RETURNING *
      `;
      const response = await client.query(SQL, [ req.body.name, req.body.location, req.body.hours ]);
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