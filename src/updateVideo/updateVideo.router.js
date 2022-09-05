const express = require("express");
 
const { callEverything } = require("./updateVideo.service");
const { checkJwt } = require("../authz/check-jwt");

 /**
 * Router Definition
 */
const updateVideoRouter = express.Router();

// /update-video endpoint 
updateVideoRouter.get("/update-video", checkJwt, (req, res) => {
  let response;
  // console.log('hi');
  try {
    response = callEverything(req.query);
    setTimeout(() => {
      response.then(value => { // return value from promise
        console.log(value);
        res.status(value.status).json(value);
      }).catch(err => {
        console.log(err);
        return {
          message: 'something went wrong with /update-video endpoint'
        };
      });
    }, 2000)
  } catch (error) {
    return {
      message: 'something went wrong with /update-video endpoint'
    };
  }
});
module.exports = {
  updateVideoRouter,
};
