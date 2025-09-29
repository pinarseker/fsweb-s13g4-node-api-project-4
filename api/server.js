const express = require('express');
const cors = require('cors');
const { usersDb } = require('./users-db');

const server = express();

server.use(cors());
server.use(express.json());

const paths = {
  list: ['/api/kullanıcılar', '/api/kullanicilar'],
  signup: ['/api/kayıtol', '/api/kayitol'],
  login: ['/api/giriş', '/api/giris'],
};

server.get(paths.list, (req, res) => {
  const safe = usersDb.all().map(u => ({ id: u.id, kullaniciadi: u.kullaniciadi }));
  res.json(safe);
});

server.post(paths.signup, (req, res) => {
  const { kullaniciadi, sifre } = req.body || {};
  if (!kullaniciadi || !sifre) {
    return res.status(400).json({ message: 'Lütfen { kullaniciadi, sifre } sağlayın' });
  }
  if (usersDb.findByUsername(kullaniciadi)) {
    return res.status(409).json({ message: 'Bu kullanıcı adı zaten alınmış' });
  }
  const created = usersDb.insert({ kullaniciadi, sifre });
  res.status(201).json({ id: created.id, kullaniciadi: created.kullaniciadi });
});

server.post(paths.login, (req, res) => {
  const { kullaniciadi, sifre } = req.body || {};
  if (!kullaniciadi || !sifre) {
    return res.status(400).json({ message: 'Lütfen { kullaniciadi, sifre } sağlayın' });
  }
  const user = usersDb.findByUsername(kullaniciadi);
  if (!user || user.sifre !== sifre) {
    return res.status(401).json({ message: 'Geçersiz kimlik bilgileri' });
  }
  res.json({ message: `Hoş geldin, ${user.kullaniciadi}` });
});

server.get('/', (_req, res) => {
  res.send('<h1>S13G4 API ✔</h1>');
});

server.use((req, res) => {
  res.status(404).json({ message: 'not found' });
});

server.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'server error' });
});

module.exports = server;
