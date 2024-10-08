const bcrypt = require("bcryptjs");

const db = require("../data/database");

class User {
  
  constructor(email, password, fullname) {
    this.email = email;
    this.password = password;
    this.name = fullname;
  }

  async signup() {
    const storedPassword = await bcrypt.hash(this.password, 12);

    await db.getDb().collection("technicians").insertOne({
      email: this.email,
      password: storedPassword,
      name: this.name,
    });
  }

  getUserWithSameEmail() {
    return db.getDb().collection("technicians").findOne({ email: this.email });
  }

  async existsAlready() {
    const existingUser = await this.getUserWithSameEmail();
    if (existingUser) {
      return true;
    }
    return false;
  }

  comparePassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }
}

module.exports = User;
