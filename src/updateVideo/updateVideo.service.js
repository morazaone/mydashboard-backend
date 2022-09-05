/**
 * Service Methods
 */
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
// const GITHUB_PATH = process.env.GITHUB_PATH;
// const GITHUB_REPO_NAME= process.env.GITHUB_REPO_NAME;
// const GITHUB_USER_NAME= process.env.GITHUB_USER_NAME;
// // const GITHUB_API =`https://api.github.com/repos/${GITHUB_USER_NAME}/${GITHUB_REPO_NAME}/contents/${GITHUB_PATH}` 
const GITHUB_FILE_URL = process.env.GITHUB_FILE_URL;
const YOUTUBE_CHANNEL = process.env.YOUTUBE_CHANNEL;
const YOUTUBE_KEY = process.env.YOUTUBE_KEY;
const YOUTUBE_API = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${YOUTUBE_CHANNEL}&maxResults=1&order=date&key=${YOUTUBE_KEY}`
const axios = require("axios");
 
/**
 * updateGithubFile()
 * @param {string} sha - string returned from github api 
 * @param {string} updatedVideoLink - url to be replaced file
 */
 function parseGithubValues(githubURL) {
  // example
  // https://github.com/morazaone/links/blob/master/level_1/level_2/test.txt
  let url = githubURL.slice(19);
  let userName = url.substr(0, url.indexOf('/'));
  url = url.slice(userName.length + 1);
  let repo = url.substr(0, url.indexOf('/'));
  url = url.slice(repo.length + 6);
  let branch = url.substr(0, url.indexOf('/'));
  url = url.slice(branch.length +1);
  let path =url;
  return `https://api.github.com/repos/${userName}/${repo}/contents/${path}`;
}
async function updateGithubFile(sha, updatedVideoLink) {
  let resp;
  //json format 
  const updateJSON = '{"videolink": "'+ updatedVideoLink+'"}';
  try {
    resp = await axios.put(
      parseGithubValues(GITHUB_FILE_URL), {
        message: "updated links",
        content: Buffer.from(updateJSON).toString('base64'), // encodes new link string to base68
        sha
      }, {
        headers: {
          Authorization: 'Bearer ' + GITHUB_TOKEN //the token is a variable which holds the token
        }
      }
    );
    //  console.log(resp.data);
  } catch (error) {
    console.log('something went wrong with updateGithubFile()', error);
    return {
      message: 'something went wrong with updateGithubFile()'
    };
  }
  return resp;
};

/**
 * getRecentVideo()
 */
async function getRecentVideo() {
  let resp;
  try {
    resp = await axios.get(
      YOUTUBE_API, {}, {
        headers: {
          'user-agent': 'request',
          Authorization: 'Bearer ' + YOUTUBE_KEY,
        }
      });
    // console.log(resp.data.items[0].id.videoId);
  } catch (error) {
    return {
      message: 'something went wrong with getRecentVideo()'
    };
  }
  return resp;
};
/**
 * getSHA()
 */
async function getSHA() {
  let resp;
  try {
   
    resp = await axios.get(
      parseGithubValues(GITHUB_FILE_URL), 
      {}, 
      {
        headers: {
          Authorization: 'Bearer ' + GITHUB_TOKEN,
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
  return resp;
};

/**
 * getSHA()
 * @param {string} customVideoLink - JSON object containing video(if applicable)
 * description: calls 3 functions:
 *  getSHA(), getRecentVideo()?, updateGithubFile()
 */
async function callEverything(customVideoLink) {

  // get SHA
  const getSHAResponse = await getSHA();
  const sha = await getSHAResponse.data.sha; // gets new SHA 
  const html_url = await getSHAResponse.data.html_url;
  const oldVideoLink = await Buffer.from(getSHAResponse.data.content, 'base64').toString(); //decodes old string 
  // console.log("getSHAResponse");
  // console.log(getSHAResponse);
  let updatedVideoLink;
  if (Object.keys(customVideoLink).length === 0) { // get most recent video from Youtube API
    const youtubeResponse = await getRecentVideo();
    updatedVideoLink = 'https://www.youtube.com/watch?v=' + youtubeResponse.data.items[0].id.videoId;
  } else { // do custom video
    updatedVideoLink = customVideoLink.recentVideo;
  }
  // console.log('most recent video: '+ updatedVideoLink);

  // update github file
  let updateFileResponse = await updateGithubFile(sha, updatedVideoLink);
  // console.log(updateFileResponse.data);
  if(updateFileResponse.data.sha === sha){
    return  {
      message: 'Didn\' get new SHA!',
      status: 400,
      oldLink: oldVideoLink,
      html_url, // gives promise error sometimes
      // path: updateFileResponse.data.content.path, // gives promise error sometimes
    };
  }
  return {
    message: 'File was updated succesfully!',
    status: 200,
    oldLink: oldVideoLink,
    updatedText: updatedVideoLink,
    html_url, // gives promise error sometimes
  };
}


module.exports = {
  callEverything,
};
