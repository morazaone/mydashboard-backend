/**
 * Required External Modules
 */

 const express = require("express");
 const cors = require("cors");
 const helmet = require("helmet");
 const { clientOrigins, serverPort } = require("./config/env.dev.js");
 
 const { messagesRouter } = require("./messages/messages.router");
 const { updateVideoRouter } = require("./updateVideo/updateVideo.router");
 const { publicRouter } = require("./public/public.router");
 const serverless = require('serverless-http')

 /**
  * App Variables 
  */
 
 const app = express();
 const apiRouter = express.Router();
 
 /**
  *  App Configuration
  */
 
 app.use(helmet());
 app.use(cors({ origin: clientOrigins }));
 app.use(express.json());
 
 app.use("/api", apiRouter);
 
 apiRouter.use("/messages", messagesRouter);
 apiRouter.use("/public", publicRouter);
 apiRouter.use("/updateVideo", updateVideoRouter);
 
 app.use(function (err, req, res, next) {
   console.log(err);
   res.status(500).send(err.message);
 });

 /**
  * Server Activation
  */
 
//  app.listen(serverPort, () =>
//    console.log(`API Server listening on port ${serverPort}`)
//  );
 app.use("/.netlify/functions/index", apiRouter);


module.exports = app;

module.exports.handler = serverless(app);
