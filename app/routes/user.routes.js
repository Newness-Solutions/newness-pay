const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const { body, validationResult } = require('express-validator');

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/test/user", 
    [authJwt.verifyToken, authJwt.isAdmin], 
    controller.userGetAll
    );

  app.get("/api/test/user/:id", [authJwt.verifyToken, authJwt.sameUser], controller.userGet);
  app.delete("/api/test/user/:id", [authJwt.verifyToken, authJwt.sameUser], controller.userDelete);
  
  app.put(
    "/api/test/user/:id", 
    [
      authJwt.verifyToken, 
      authJwt.sameUser
    ], controller.userUpdate);
    
  app.put(
    "/api/test/reset-password/:id",
    body('oldPass').notEmpty().isLength({min:6}),
    body('newPass').notEmpty().isLength({min:6}),
    [
      authJwt.verifyToken, 
      authJwt.sameUser,
      authJwt.validPassword
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }else{
        controller.updatePass(req, res);
      }
    }  
  );

  app.put(
    "/api/test/change-password/:id",
    body('newPass').notEmpty().isLength({min:6}),
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }else{
        controller.changePass(req, res);
      }
    }  

  )

  app.put(
    "/api/test/enableTwoStep", 
    [
      authJwt.verifyToken
    ], 
    controller.enableTwoStep);
    
  app.put(
    "/api/test/disableTwoStep", 
    [
      authJwt.verifyToken
    ], 
    controller.disableTwoStep);  

  app.post(
    "/api/test/user/send-password-code", 
    [
      authJwt.emailExists
    ], 
    controller.sendPassCode);  

  app.put(
    "/api/test/user/check-password-code/:id",
    body('passCode').notEmpty().isLength({min:5, max:5}).isAlphanumeric(),
  
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }else{
        controller.checkPassCode(req, res);
      }
    }  
  );

};