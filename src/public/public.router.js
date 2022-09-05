/**
 * Required External Modules and Interfaces
 */

 const express = require("express");
 const { getReccommendedLink } = require("./public.service");
//  const { checkJwt } = require("../authz/check-jwt");
 
  /**
  * Router Definition
  */
 
 const publicRouter = express.Router();
 
 /**
  * Controller Definitions
  */
 // GET messages/
 
 publicRouter.get("/getReccommendedLink", (req, res) => {
  try {
    response = getReccommendedLink();
   
      response.then(value => { // return value from promise
        console.log(value);
        res.status(value.status).json(value.link);
      }).catch(err => {
        console.log(err);
        return {
          message: 'something went wrong with /update-video endpoint'
        };
      });
    
  } catch (error) {
    return {
      message: 'something went wrong with /update-video endpoint'
    };
  }

    
 });
 
 module.exports = {
  publicRouter,
 };
 