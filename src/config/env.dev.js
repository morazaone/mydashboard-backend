const dotenv = require("dotenv");

dotenv.config();

const domain = process.env.AUTH0_DOMAIN;
const clientOriginUrl = process.env.CLIENT_ORIGIN_URL;


if (!domain) {
  throw new Error(
    ".env is missing the definition of an AUTH0_DOMAIN environmental variable",
  );
}

if (!clientOriginUrl) {
  throw new Error(
    ".env is missing the definition of a APP_ORIGIN environmental variable",
  );
}

const clientOrigins = [  clientOriginUrl, 'https://frontend-juan.netlify.app','http://localhost:4040'];

module.exports = {
  domain,
  clientOriginUrl,
  clientOrigins,
};
