const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASS = process.env.ADMIN_PASS || 'mbigucci2026';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token === `Bearer ${ADMIN_PASS}`) return next();
  res.status(401).json({ error: 'Não autorizado' });
};

// --- CARDS ---
app.get('/api/data', (req, res) => {
  try { res.json(JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'data.json'), 'utf8'))); }
  catch { res.status(500).json({ error: 'Erro ao carregar dados' }); }
});
app.post('/api/data', requireAuth, (req, res) => {
  try {
    fs.writeFileSync(path.join(__dirname, 'public', 'data.json'), JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Erro ao salvar' }); }
});

// --- SETTINGS (NOVO) ---
app.get('/api/settings', (req, res) => {
  try { res.json(JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'settings.json'), 'utf8'))); }
  catch { res.json({}); }
});
app.post('/api/settings', requireAuth, (req, res) => {
  try {
    fs.writeFileSync(path.join(__dirname, 'public', 'settings.json'), JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Erro ao salvar settings' }); }
});

app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`🚀 Rodando em http://localhost:${PORT} | 🔐 Admin: /admin`));