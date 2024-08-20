const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Configuração do banco de dados
const db = mysql.createConnection({
  host: '192.168.1.197',
  user: 'root',
  password: '',
  database: 'sgveauto',
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL');
});

// Rota para buscar produtos
app.get('/api/search', (req, res) => {
  const query = req.query.q;
  const sql = `SELECT Descricao, Preco, Quantidade, Ncm, Cod_vector FROM produto WHERE Substring(Descricao,1,4)<>'INAT' AND Descricao LIKE ? `;
  db.query(sql, [`%${query}%`], (err, results) => {
    if (err) {
      console.error('Erro ao buscar os dados:', err);
      res.status(500).send('Erro ao buscar os dados');
      return;
    }
    res.json(results);
  });
});

// Rota para buscar clientes
app.get('/api/clientes', (req, res) => {
  const query = req.query.q;
  console.log('Recebida solicitação de busca com query:', query); // Log da query recebida
  const sql = `SELECT Nome, Cpf, Endereco, Cep, Bairro, Cidade FROM cliente WHERE Nome LIKE ?`;
  db.query(sql, [`%${query}%`], (err, results) => {
    if (err) {
      console.error('Erro ao buscar os dados:', err);
      res.status(500).send('Erro ao buscar os dados');
      return;
    }
    console.log('Resultados encontrados:', results); // Log dos resultados encontrados
    res.json(results);
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
