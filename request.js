const axios = require("axios");
const request = async (method, url, data = {}, headers = {}, token = '') => {
  try {
    const response = await axios({
      method,
      url,
      data,
      headers: {
        ...headers,
        "Content-Type": "application/json",
        clientId: "manke-app", // Adding clientId to the headers
        deviceSystem: "android",
        deviceName: "vivo x21",
        deviceNo: "AKDLJSLFJLDSKJFLKSD",
        accessToken: token,
        loginCity: "",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export default request;
