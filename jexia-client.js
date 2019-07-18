const fetch = require('node-fetch');

function error(code, message) {
  return { code, message };
}

class JexiaClient {
  constructor() {}

  init({ projectId }) {
    this.projectUrl = `https://${projectId}.app.jexia.com`;
  }

  async signUp(signUpInfo) {
    const requestBody = JSON.stringify(signUpInfo);

    const response = await fetch(this.projectUrl + '/ums/signup', {
      method: 'POST',
      body: requestBody
    });

    if (!response.ok) {
      throw error(response.status, response.statusText);
    }

    return response.json();
  }

  async signIn(signInInfo) {
    const requestBody = JSON.stringify(signInInfo);

    const response = await fetch(this.projectUrl + '/auth', {
      method: 'POST',
      body: requestBody
    });

    if (!response.ok) {
      error(response.status, response.statusText);
    }

    this.auth = await response.json();
  }
}

module.exports = {
  JexiaClient
};
