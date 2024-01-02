const express = require('express'); //external module for using express
const { Client } = require('pg') //external module for using postgres with node
const config = require('./config.js'); // internal module for connecting to our config file

const app = express();
const port = 3000;

app.use(express.json());

const client = new Client(config); //creating our database Client with our config values

const getLanguages = async () => {
    await client.connect() //connecting to our database
    const result = await client.query('SELECT * FROM programming_languages');
    console.log(result.rows);
    await client.end() //ending the connection to our database
    return result.rows;
  }
  
  app.get('/get-languages', async (req, res) => {
    const languages = await getLanguages();
    res.send(languages);
  });
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  })
  
const getLanguage = async (id) => {
  await client.connect() //connecting to our database
  const result = await client.query(`SELECT * FROM programming_languages WHERE id = ${id}`)
  console.log(result.rows);
  await client.end() //ending the connection to our database
  return result.rows;
}
app.get('/get-language/:id', async (req, res) => {
  const language = await getLanguage(req.params.id);
  res.send(language);
});

//Routs

// POST  to add a new language
app.post('/languages', (req, res) => {
  const { languageName } = req.body;
  const sql = 'INSERT INTO languages (name) VALUES (?)';
  db.query(sql, [languageName], (err, result) => {
    if (err) throw err;
    res.status(201).send('Language added successfully');
  });
});
// DELETE to remove a language
app.delete('/languages/:id', (req, res) => {
  const languageId = req.params.id;
  const sql = 'DELETE FROM languages WHERE id = ?';
  db.query(sql, [languageId], (err, result) => {
    if (err) throw err;
    res.send('Language removed successfully');
  });
});