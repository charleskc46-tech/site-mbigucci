const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
  const dataPath = path.join(process.cwd(), 'public', 'data.json');
  
  if (req.method === 'GET') {
    try {
      const data = fs.readFileSync(dataPath, 'utf8');
      res.status(200).json(JSON.parse(data));
    } catch (err) {
      res.status(200).json([]);
    }
  } else if (req.method === 'POST') {
    const { password, links } = req.body;
    
    if (password !== 'mbigucci2026') {
      return res.status(401).json({ error: 'Senha incorreta' });
    }
    
    try {
      fs.writeFileSync(dataPath, JSON.stringify(links, null, 2));
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao salvar' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}