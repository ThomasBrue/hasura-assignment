const fetch = require("node-fetch");

import { v4 as uuidv4 } from "uuid";
// uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

/* const HASURA_OPERATION = `
mutation createCartItem($product_id: Int!, $store_id: Int!, $user_id: Int!, $new_stock: Int!) {
  insert_cart_one(object: {
    product_id: $product_id, store_id: $store_id, user_id: $user_id
  }) {
    id
  }
  stock_status_update: update_inventory_by_pk(pk_columns: 
    {product_id: $product_id, store_id: $store_id}, _set: {stock_available: $new_stock}
  ) {
    stock_available
  }
}
`;
 */
const INVENTORY_QUERY = `
query ($product_id: Int!, $store_id: Int!) {
  inventory_by_pk(product_id: $product_id, store_id: $store_id) {
    stock_available
  }
}
`;

/* const INSERT_PRODUCT = `
mutation insert_single_article($id: Int!, $name: Int!, $user_id: Int!, $new_stock: Int!) {
  insert_product(objects: {id: 13, name: "Jimmy333", price: 6666}){affected_rows}
}
`; */

// const INSERT_PRODUCT_2 = `
// mutation insertProduct ($id: Int!, $name: String, $price: numeric) {
//   insert_product_one(object: {id: $id, name: $name, price: $price}){id}
// }
// `;

const INSERT_PAYMENT = `
mutation insertProduct ($name: String, $price: Int) {
  insert_product_one(object: {name: $name, price: $price}){id}
}
`;

// mutation {
//   insert_product(objects: {id: $id, name: $name, price: $price}) {
//     affected_rows
//   }
// }

// execute the parent mutation in Hasura
const execute = async (variables, operation) => {
  const fetchResponse = await fetch("http://localhost:8080/v1/graphql", {
    method: "POST",
    body: JSON.stringify({
      query: operation,
      variables,
    }),
  });
  return await fetchResponse.json();
};

// Request Handler
const handler = async (req, res) => {
  // get request input

  console.log("HANDLER_____STARTET");
  // console.log("HANDLER_____RES", res);
  const { product_id, store_id } = req.body.input;

  const user_id = req.body.session_variables["x-hasura-user-id"];

  // run some business logic
  // fetch current inventory data
  /*  const { data: inventory_response, errors: inventory_errors } = await execute(
    { product_id, store_id },
    INVENTORY_QUERY
  );
  const inventory_by_pk = inventory_response.inventory_by_pk;
  console.log("inventory_response:: ", inventory_response); */
  /*   if (!inventory_by_pk) {
    return res.status(400).json({
      message: "Invalid product or store",
    });
  }
  const stock_available = inventory_by_pk ? inventory_by_pk.stock_available : 0;

  if (stock_available <= 0) {
    return res.status(400).json({
      message: "Out of stock",
    });
  } */

  console.log("Insert product.... ");

  const id = Math.floor(Math.random() * (1000 + 1)); //uuidv4();
  const name = "MilkShake";
  const price = 1243;

  //   {"id": 444,
  //   "name": "jimmyddd",
  //   "price": 34

  // }

  const { data, errors } = await execute({ name, price }, INSERT_PAYMENT);

  console.log("RES_error:: ", errors);

  console.log("RES_data:: ", data);

  // const { data, errors } = await execute({}, INSERT_PRODUCT);

  return res.json({
    ...data.insert_product,
  });

  // execute the Hasura operation
  /*  const { data, errors } = await execute(
    { product_id, store_id, user_id },
    HASURA_OPERATION
  ); */

  // if Hasura operation errors, then throw error
  if (errors) {
    return res.status(400).json({
      message: errors.message,
    });
  }

  console.log("generalResponse: ", res);

  // success
  return res.json({
    ...data.insert_cart_one,
  });
};

module.exports = handler;
