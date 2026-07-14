const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// ⚠️ ESTA LINHA É A SOLUÇÃO DO ERRO ⚠️
// Ela diz: "Se alguém digitar /admin, abra o arquivo admin.html"
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Arquivo que guarda os links
const DATA_FILE = path.join(__dirname, 'public', 'data.json');

// Ler links
app.get('/api/links', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      res.json([]);
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// Salvar links (só com senha)
app.post('/api/links', (req, res) => {
  const { password, links } = req.body;
  
  if (password !== 'mbigucci2026') {
    return res.status(401).json({ error: 'Senha incorreta' });
  }
  
  fs.writeFile(DATA_FILE, JSON.stringify(links, null, 2), (err) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao salvar' });
    } else {
      res.json({ success: true });
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando: http://localhost:${PORT}`);
  console.log(`🔐 Admin: http://localhost:${PORT}/admin`);
});