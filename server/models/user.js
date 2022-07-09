const users = {
  mthuong: {
    username: "mthuong",
    password: "123456",
  },
  user1: {
    username: "user1",
    password: "123456",
  },
};

module.exports = class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  save() {
    users[this.username] = this;
  }

  static getUser(username) {
    return users[username];
  }

  static login(username, password) {
    const user = users[username];
    if (user && user.password === password) {
      return {
        status: 'ok',
        username: user.username,
        token: user.username + `-${Date.now()}`,
      };
    }
    return {
      status: 'error',
    };
  }

  static verifyToken(token) {
    try {
      const strings = token.split("-");
      const username = strings[0];
      if (users[username]) {
        return username;
      }
      return undefined;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }
};
