const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

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
  app.put("/api/test/user/:id", [authJwt.verifyToken, authJwt.sameUser], controller.userUpdate);

};