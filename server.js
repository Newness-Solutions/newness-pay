const express = require('express');
const cors = require('cors');
const app = express();
const db = require("./app/models");
const Role = db.role;
const usersRouter = require('./app/routes/users');
const dbConfig = require('./app/config/db.config');
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err1 => {
        if (err1) {
          console.log("error", err1);
        }
        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err1 => {
        if (err1) {
          console.log("error", err1);
        }
        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err1 => {
        if (err1) {
          console.log("error", err1);
        }
        console.log("added 'admin' to roles collection");
      });
    }
  });
}

app.use('/users', usersRouter);
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/group.routes')(app);