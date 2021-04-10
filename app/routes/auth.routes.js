const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const { body, validationResult } = require('express-validator');
const e = require("express");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    body('email').notEmpty().isEmail(),
    body('password').notEmpty().isLength({min:6}),
    body('username').notEmpty().trim(),
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
      verifySignUp.isValidPhoneNumber
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }else{
        controller.signup(req, res);
      }
    }  
  );

  app.post("/api/auth/signin",
    body('username').notEmpty().trim(), 
    body('password').notEmpty().isLength({min:6}),
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }else{
        controller.signin(req, res);
      }
      
    } 
  );
};