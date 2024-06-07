import { CONFIG } from "./config.mjs";
import express from "express";
import { MongoClient } from "mongodb";
import bodyParser from "body-parser";
import pug from 'pug';

const app = express();
const PORT = process.env.PORT || 3000;
const URI = CONFIG.URI;

const client = new MongoClient(URI);

app.set('views', './views');
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));

async function run() {
  try {
    await client.connect();
    console.log("connected");
    const db = client.db('Test');
    const users = db.collection('users');

    app.post('/users', async (req, res) => {
      try {
        const user = req.body;
        await users.insertOne(user);
        res.redirect('/users');
      } catch (error) {
        console.log(error);
        res.status(500).send('Error adding user');
      }
    });

    app.get('/users', async (req, res) => {
      try {
        const result = await users.find().toArray();
        res.render('users', { users: result });
      } catch (error) {
        console.log(error);
        res.status(500).send('Error fetching users');
      }
    });

    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
}

run().catch(console.dir);
