const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.group = require("./group.model");
db.userGroup = require("./userGroup.model");
db.transaction = require("./transaction.model");
db.balance = require("./balance.model");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;