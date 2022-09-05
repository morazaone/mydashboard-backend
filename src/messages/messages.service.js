/**
 * Service Methods
 */

const getPublicMessage = () => {
  console.log('entered');

  return {
    message: "The API doesn't require an access token to share this message.",
  };
};

const getProtectedMessage = () => {
  console.log('entered');

  return {
    message: "The API successfully validated your access token.",
  };
};

module.exports = {
  getPublicMessage,
  getProtectedMessage
};
