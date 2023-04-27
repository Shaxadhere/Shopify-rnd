const express = require("express")
const cors = require("cors")
const app = express()
const Multipassify = require('multipassify');
require('@shopify/shopify-api/adapters/node')
require("dotenv").config()

// Construct the Multipassify encoder
const multipassify = new Multipassify(process.env.SHOPIFY_MULTIPASSIFY_KEY);

var shopifyAPI = require('shopify-node-api');

var Shopify = new shopifyAPI({
    shop: process.env.SHOPIFY_STORE_NAME, // MYSHOP.myshopify.com
    shopify_api_key: process.env.SHOPIFY_API_KEY, // Your API key
    access_token: process.env.SHOPIFY_ACCESS_TOKEN, // Your API password,
    shopify_scope: 'write_customers',
    redirect_uri: 'http://localhost:5000/finish_auth',
    nonce: Math.random().toString(36).substr(2, 9),
    shopify_shared_secret: process.env.SHOPIFY_API_SECRET,
});

app.use(cors())

app.get("/", (req, res) => {
    // Create your customer data hash
    const customerData = {
        email: 'shehzad@mailinator.com',
        remote_ip: '0.0.0.0',
        return_to: `https://${process.env.SHOPIFY_STORE_HOST}/account/#/profile`
    };

    // Encode a Multipass token
    const token = multipassify.encode(customerData);

    // Generate a Shopify multipass URL to your shop
    const url = multipassify.generateUrl(customerData, process.env.SHOPIFY_STORE_HOST);

    res.json({ token, url })
})

app.get("/create-auth-url", (req, res) => {
    var auth_url = Shopify.buildAuthURL();
    res.redirect(auth_url);
})

app.get('/finish_auth', function (req, res) {

    var Shopify = new shopifyAPI(config),
        query_params = req.query;

    Shopify.exchange_temporary_token(query_params, function (err, data) {
        console.log(data)
    });

});

app.listen(process.env.PORT, () => {
    console.log("Server is running on port " + process.env.PORT)
})