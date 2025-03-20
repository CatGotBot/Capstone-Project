// Import neccesart modules for code to woek like express for server or reacR for frontend, pg is for library, apth is for Node.js bild in path module

const express = require('express');
const app = express();
const path = require('path');
const pg = require('pg');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// database in Postgres
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://postgres:kseniya3@localhost/acme_skiresorts_db');

// JWT secret key, change key in ''???
const JWT_SECRET = process.env.JWT_SECRET || '9737547d971cfbd9b3507c50be50a28a5c5e5a8f21622ea2aff5d256539b5d6c8ebeb5ae8020041da27f34e7ce2975c69f7aa192593f1d0f63e6cdad7668bf08';

// Helps server read JSON and send website files
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/dist")));

// Sends homepage to users
app.get("/", (req, res) =>
    res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);

//authentification middleware 
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

//registeration route
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        const result = await client.query(`
        WITH existing AS (
          SELECT username FROM users WHERE username = $1
        )
        INSERT INTO users(username, password)
        SELECT $1, $2
        WHERE NOT EXISTS (SELECT 1 FROM existing)
        RETURNING id, username
      `, [username, await bcrypt.hash(password, 10)]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Username exists!' });
        }

        const token = jwt.sign({ id: result.rows[0].id }, JWT_SECRET, { expiresIn: '1h' });
        return res.status(201).json({
            message: 'User created, proceed!',
            user: result.rows[0],
            token
        });

    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
});

//login route
app.post('/api/login', async (req, res, next) => {
    try {
        const SQL = `SELECT * FROM users WHERE username = $1`;
        const response = await client.query(SQL, [req.body.username]);

        if (response.rows.length === 0) {
            return res.status(400).json({ error: 'Incorrect username or password' });
        }

        // verify password by using bcrypt 
        const validPassword = await bcrypt.compare(req.body.password, response.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Incorrect username or password' });
        }

        // creating JWT token, to identify user
        const token = jwt.sign({ id: response.rows[0].id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: 'Youre in, enjoy!',
            user: {
                id: response.rows[0].id,
                username: response.rows[0].username
            },
            token
        });
    } catch (ex) {
        next(ex);
    }
});

//   current user route, fetch user's info
app.get('/api/me', authenticateToken, async (req, res, next) => {
    try {
        const SQL = `SELECT id, username FROM users WHERE id = $1`;
        const response = await client.query(SQL, [req.user.id]);

        if (response.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(response.rows[0]);
    } catch (ex) {
        next(ex);
    }
});

// CRUD routes for resorts(pathes of how where to Create, Read, Update, Delete data for resorts)
app.get('/api/resorts', async (req, res, next) => {

    console.log('get resorts')

    try {
        const SQL = `
      SELECT * from resorts;
    `;
        const response = await client.query(SQL);

        console.log(response)

        res.send(response.rows);
    }
    catch (ex) {
        next(ex);
    }
});



app.get('/api/resorts/:id', async (req, res, next) => {
    try {
        const SQL = `
      SELECT * from resorts WHERE id = $1;
    `;
        const response = await client.query(SQL, [req.params.id]);
        res.send(response.rows[0]);
    }
    catch (ex) {
        next(ex);
    }
});

app.put('/api/resorts/:id', async (req, res, next) => {
    try {
        const SQL = `
        UPDATE resorts
        SET name=$1, location=$2, hours=$3
        WHERE id=$4 RETURNING *
      `;
        const response = await client.query(SQL, [req.body.name, req.body.location, req.body.hours, req.params.id]);
        res.send(response.rows[0]);
    }
    catch (ex) {
        next(ex);
    }
});


app.delete('/api/resorts/:id', async (req, res, next) => {
    try {
        const SQL = `
      DELETE from resorts
      WHERE id = $1
    `;
        const response = await client.query(SQL, [req.params.id]);
        res.sendStatus(204);
    }
    catch (ex) {
        next(ex);
    }
});

app.post('/api/resorts', async (req, res, next) => {
    try {
        const SQL = `
        INSERT INTO resorts(name, location, hours)
        VALUES($1, $2, $3)
        RETURNING *
      `;
        const response = await client.query(SQL, [req.body.name, req.body.location, req.body.hours]);
        res.send(response.rows[0]);
    }
    catch (ex) {
        next(ex);
    }
});

// setup database + server
const init = async () => {
    await client.connect();
    console.log('connected to database');
    let SQL = `
      DROP TABLE IF EXISTS resorts;
      DROP TABLE IF EXISTS users;
      
      CREATE TABLE resorts(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        hours VARCHAR(255) NOT NULL
      );
      
      CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    // create table and pull their info (seed info?)
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
    app.listen(port, () => console.log(`listening on port ${port}`));
};

init();