const { JexiaClient } = require("./jexia-client");
const config = require("./config.json");

async function givenAlreadyUsedEmail_whenSigningUp_thenReturn409(projectId) {
  const credentials = {
    email: `test@test${Math.floor(Math.random() * 100000)}.com`,
    password: `password`
  };

  const client = new JexiaClient();
  client.init({ projectId });

  const firstResponse = await client.signUp(credentials);
  console.log(
    `Response for first signup with email ${credentials.email}`,
    firstResponse
  );

  try {
    // The following signup should return a 409, since the user was already created
    const secondResponse = await client.signUp(credentials);

    console.log("This should never be reached on this example", secondResponse);
  } catch (err) {
    console.log(
      `Status Code for second signup with email ${
        credentials.email
      } should be 409, however it was ${err.code}`
    );
  }
}

async function playingWithSignIn(projectId) {
  const credentials = {
    email: `test@test${Math.floor(Math.random() * 100000)}.com`,
    password: `password`
  };

  const client = new JexiaClient();
  client.init({ projectId });

  await client.signUp(credentials);
  return client.signIn({ ...credentials, method: "ums" });
}

givenAlreadyUsedEmail_whenSigningUp_thenReturn409(config.projectId)
  .then(() => console.log("Bug done"))
  .catch(err => console.error("Unexpected error for bug reproduction", err));

playingWithSignIn(config.projectId)
  .then(() => console.log("Sign in done"))
  .catch(err => console.log("Sign in failed", err));
