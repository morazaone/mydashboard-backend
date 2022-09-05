/**
 * Service Methods
 */
 const axios = require("axios");

 async function getReccommendedLink() {
  try {
    resp = await axios.get(
      `https://api.github.com/repos/morazaone/my-links-page/contents/data.json`, 
      
      {}, 
      {
        headers: { // token no longer valid
          Authorization: 'Bearer ' + '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',
        }
      }
    );
  } catch (error) {
    console.log('something went wrong with getSHA', error);
    return {
      message: 'something went wrong with getSHA()'
    };
  }
  // console.log(resp)
  // return resp.data;
  return  {
    link: Buffer.from( resp.data.content, 'base64').toString(),
    
    status: 200,
    // oldLink: oldVideoLink,
    // html_url, // gives promise error sometimes
    // path: updateFileResponse.data.content.path, // gives promise error sometimes
  };
};

 
module.exports = {
  getReccommendedLink
};
