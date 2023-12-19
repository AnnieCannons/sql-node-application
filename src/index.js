const express = require('express'); //external module for using express
const {Client} = require('pg') //external module for using postgres with node
const config = require('./config.js'); // internal module for connecting to our config file

const app = express();
const port = 3000;

app.use(express.json());
const client = new Client(config); //creating our database Client with our config values

//crud routes
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
});

//helper function
const getLanguage = async (id) => {
    await client.connect() //connecting to our database
    const result = await client.query(`SELECT * FROM programming_languages WHERE id = ${id}`)
    console.log(result.rows);
    await client.end() //ending the connection to our database
    return result.rows; //returning array-sent back to front end
}

//callback
app.get('/get-language/:id', async (req, res) => {
    const language = await getLanguage(req.params.id);
    res.send(language);
});

const addLanguage = async (language, released_year, githut_rank, pypl_rank, tiobe_rank) => {
    await client.connect()
    const maxIdResult = await client.query('SELECT MAX(id) AS max_id FROM programming_languages');
    const maxId = maxIdResult.rows[0].max_id || 0;
    const nextId = maxId + 1;
    const result = await client.query(
        `INSERT INTO programming_languages (id, name, released_year, githut_rank, pypl_rank, tiobe_rank) 
        VALUES (${nextId}, '${language}', ${released_year}, ${githut_rank}, ${pypl_rank}, ${tiobe_rank})`
    );
    console.log(result.rows);
    await client.end()
    return result.rows;
}
app.post('/add-language', async (req, res) => {
    await addLanguage(
        req.body.language,
        req.body.released_year,
        req.body.githut_rank,
        req.body.pypl_rank,
        req.body.tiobe_rank
    );
    res.send("Language data added");
});

const deleteLanguage = async (id) => {
    await client.connect()
    const query = {
    text: 'DELETE FROM programming_languages WHERE id = $1',
    values: [id],
    };

    const result = await client.query(query);
    console.log(result.rows);
    await client.end()
    return result.rows;
};


app.delete("/delete-language/:id", async (req, res) => {
    const id = Number(req.params.id);
    await deleteLanguage(id);
    res.send("Language with " + id + " has been deleted.");
});
