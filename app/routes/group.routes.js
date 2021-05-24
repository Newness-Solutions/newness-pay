const { authJwt } = require("../middlewares");
const groupCon = require("../controllers/group.controller");
const userGroupCon = require("../controllers/userGroup.controller");
const eSend = require("../controllers/email.controller");
const { body, validationResult } = require('express-validator');


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/test/group", [authJwt.verifyToken, authJwt.isAdmin], groupCon.groupCreate);
  app.get("/api/test/group", [authJwt.verifyToken, authJwt.isAdmin], groupCon.groupGetAll);
  app.get("/api/test/group/:id", [authJwt.verifyToken, authJwt.isAdmin], groupCon.groupGet);
  app.delete("/api/test/group/:id", [authJwt.verifyToken, authJwt.isAdmin], groupCon.groupDelete);
  app.put("/api/test/group/:id", [authJwt.verifyToken, authJwt.isAdmin], groupCon.groupUpdate);
  

  app.post("/api/test/addUserGroup/", [authJwt.verifyToken,authJwt.checkDuplicateEmail, authJwt.isAdmin], userGroupCon.addGroupUser);
  app.delete("/api/test/deleteUserGroup/", [authJwt.verifyToken, authJwt.isAdmin], userGroupCon.deleteGroupUser);
  app.put("/api/test/validateEmail/:id", userGroupCon.validateUserEmail);
  app.post(
    "/api/sendEmail/",
    [
      body('to','Valid email required').notEmpty().isEmail(),
      body('subject','Email subject cannot be empty').notEmpty().trim(),

    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }else{
        eSend.emailsend(req, res);
      }
    }
    
     );
}
