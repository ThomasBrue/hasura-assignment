const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// app.post("/:route", (req, res) => {
//   console.log("POST___STARTET");
//   const { arg1 } = req.body.input;
//   console.log("ARG____:: ", arg1);
//   console.log("BODY____:: ", req.body);
//   try {
//     const handler = require(`./handlers/${req.params.route}`);
//     if (!handler) {
//       return res.status(404).json({
//         message: `not found`,
//       });
//     }
//     return handler(req, res);
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({
//       message: `unexpected error occured`,
//     });
//   }
// });

//-----------------------------------------------------------------------
const fetch = require("node-fetch");

const HASURA_OPERATION = `
mutation insertPaymentAction($name: String, $amount: Int) {
  insert_PaymentTable_one(object: {amount: $amount, name: $name}) {
    name
  }
}
`;

// execute the parent operation in Hasura
const execute = async (variables) => {
  const fetchResponse = await fetch("http://localhost:8080/v1/graphql", {
    method: "POST",
    body: JSON.stringify({
      query: HASURA_OPERATION,
      variables,
    }),
  });
  const data = await fetchResponse.json();
  console.log("DEBUG: ", data);
  return data;
};

// Request Handler
app.post("/insertPaymentAction", async (req, res) => {
  // get request input
  const { name, amount } = req.body.input;

  // run some business logic

  // execute the Hasura operation
  const { data, errors } = await execute({ name, amount });

  // if Hasura operation errors, then throw error
  if (errors) {
    return res.status(400).json(errors[0]);
  }

  // success
  return res.json({
    ...data.insert_PaymentTable_one,
  });
});

//--------------------------------------------------------------------

console.log("------------ LISTENING_on:: ", PORT);

app.listen(PORT);
