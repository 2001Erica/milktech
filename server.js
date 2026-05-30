

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./milktech.db');

/* CRIAR TABELA */

db.run(`

CREATE TABLE IF NOT EXISTS animais (

id INTEGER PRIMARY KEY AUTOINCREMENT,
nome TEXT,
leite INTEGER

)

`);

/* LISTAR */

app.get('/animais', (req, res) => {

db.all(
'SELECT * FROM animais',
[],
(erro, rows) => {

if (erro) {
return res.send(erro);
}

res.json(rows);

});

});

/* CADASTRAR */

app.post('/animais', (req, res) => {

const { nome, leite } = req.body;

db.run(

'INSERT INTO animais (nome, leite) VALUES (?, ?)',

[nome, leite],

function(erro) {

if (erro) {
return res.send(erro);
}

res.json({

id: this.lastID,
nome,
leite

});

}

);

});

/* EDITAR */

app.put('/animais/:id', (req, res) => {

const { nome, leite } = req.body;

db.run(

'UPDATE animais SET nome = ?, leite = ? WHERE id = ?',

[nome, leite, req.params.id],

function(erro) {

if (erro) {
return res.send(erro);
}

res.send('Animal atualizado');

}

);

});

/* EXCLUIR */

app.delete('/animais/:id', (req, res) => {

db.run(

'DELETE FROM animais WHERE id = ?',

[req.params.id],

function(erro) {

if (erro) {
return res.send(erro);
}

res.send('Animal removido');

}

);

});

/* SERVIDOR */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🐄 MilkTech rodando na porta ${PORT}`);
});