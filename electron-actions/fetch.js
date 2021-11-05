const axios = require("axios").default;

const fetch = ({ baseUrl, method, data, url, headers }) => {
  console.log("config ---", {
    baseUrl,
    data: method === "POST" ? data : undefined,
    method,
    params: method === "GET" ? data : undefined,
    url,
    headers: {
      Accept: "application/json",
      ...headers,
    },
  });

  return axios({
    data: method === "POST" ? data : undefined,
    method,
    params: method === "GET" ? data : undefined,
    url: baseUrl + url,
    headers: {
      Accept: "application/json",
      ...headers,
    },
  });
};

module.exports = fetch;
