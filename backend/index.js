const express = require('express');
const app = express();
const path = require('path');
const path = require('pg');
const client  = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_skiresorts_db');




