const users = [];
let seq = 1;

const usersDb = {
  all() {
    return users;
  },
  insert({ kullaniciadi, sifre }) {
    const user = { id: seq++, kullaniciadi, sifre };
    users.push(user);
    return user;
  },
  findByUsername(kullaniciadi) {
    return users.find(u => u.kullaniciadi === kullaniciadi);
  },
};

module.exports = { usersDb };
