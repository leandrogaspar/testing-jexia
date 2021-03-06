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

async function test(projectId) {
  const credentials = {
    email: `test@test${Math.floor(Math.random() * 100000)}.com`,
    password: `password`
  };

  const client = new JexiaClient();
  client.init({ projectId });

  await client.signUp(credentials);
  await client.signIn({ ...credentials, method: "ums" });
  const createdRecords = await client.createRecords("posts", [
    {
      name: "postname",
      otherfield: "other",
      post_child: [{ name: "child_name_1" }, { name: "child_name_2" }]
    }
  ]);
  console.log("Created records: ", JSON.stringify(createdRecords, null, 2));

  const posts = await client.fetchRecords("posts", "outputs=[\"post_child.name\"]");
  console.log("Posts: ", JSON.stringify(posts, null, 2));

  const fetchedRecords = await client.fetchRecords("post_child", "");
  console.log("Post child: ", JSON.stringify(fetchedRecords, null, 2));

  await client.deleteRecords("posts");
  await client.deleteRecords("post_child");
}

// givenAlreadyUsedEmail_whenSigningUp_thenReturn409(config.projectId)
//   .then(() => console.log("Bug done"))
//   .catch(err => console.error("Unexpected error for bug reproduction", err));

test(config.projectId)
  .then(() => console.log("Test done"))
  .catch(err => console.log("Test failed", err));
