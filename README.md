# Assignment Hasura / GraphQL

### Thomas Bründl

# Introduction

With this app a user can create new payments by entering a name and an amount. <br>
(The uuid will be generated on the hasura service) <br>
The payments are send to Hasura and stored in a payment table. <br>
The payments are fetched form the payments server. <br>

# How to run

1. docker-compose up

<br> You have to create a "PaymentTable" in hasura with the following specifications:

`uuid - uuid, primary key, unique, default: gen_random_uuid()` <br>
`name - text` <br>
`amount - integer` <br>
`status - boolean` <br>

2. npm start

Go to `http://localhost:4200/` to open the banking-interface.
