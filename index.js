const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const stripeRoute = require("./routes/stripe");
const orderRoute = require("./routes/order");
const cors = require("cors");



const sgMail = require('@sendGrid/mail')
const API_KEY = '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';
sgMail.setApiKey(API_KEY)

const email = 'ters.ghoneim@hotmail.com';

const messageCancel ={
  to: 'ters.ghoneim@hotmail.com',
  from: 'ters.ghoneim@hotmail.com',
  name: 'Ghoneim',
  template_id: 'd-39dd207e6e0a48938c8192e2b8eea6c2',
}
const messageDelivered ={
  to: email,
  from: 'ters.ghoneim@hotmail.com',
  name: 'Ghoneim',
  template_id: 'd-0e9d21450cc7485c92d9af85e556a155',
}
const messageShipped ={
  to: email,
  from: 'ters.ghoneim@hotmail.com',
  name: 'Ghoneim',
  template_id: 'd-5977da268a7e4ff2888e3645877a8d4c',
}



mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);


app.get('/api/processing', (req, res) => {
    res.status(200).send({
      status: "PROCESSING"
    })
});

app.get('/api/fulfilled', (req, res) => {
  res.status(200).send({
    status: "FULFILLED"
  })
});

app.get('/api/shipped', (req, res) => {
  res.status(200).send({
    status: "SHIPPED"
  })
  sgMail
        .send(messageShipped)
        .then((response) => console.log('Email sent!'))
        .catch((error) => console.log(error.messageShipped));
});

app.get('/api/delivered', (req, res) => {
  res.status(200).send({
    status: "DELIVERED"
  })
  sgMail
        .send(messageDelivered)
        .then((response) => console.log('Email sent!'))
        .catch((error) => console.log(error.messageDelivered));

});

app.get('/api/returned', (req, res) => {
  res.status(200).send({
    status: "RETURNED"
  })
});

app.get('/api/cancelled', (req, res) => {
  res.status(200).send({
    status: "CANCELLED"
  })
  sgMail
  .send(messageCancel)
  .then((response) => console.log('Email sent!'))
  console.log(res)
  .catch((error) => console.log(error.messageCancel));  
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running!");
});
