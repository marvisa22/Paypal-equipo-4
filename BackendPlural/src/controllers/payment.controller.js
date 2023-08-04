import {
  HOST, 
  PAYPAL_API, 
  PAYPAL_API_CLIENT, 
  PAYPAL_API_SECRET,
} from '../config.js';
import axios from 'axios';

export const createOrder2 = async(req, res) =>{
  const order = {
    intent: "",
    purchase_units: [
      {
        amount: {
          currency_code: "",
          value: "105.70",
        },
      },
    ],
    application_context: {
      brand_name: "PLURALCURSOS.com",
      landing_page: "NO_PREFERENCE",
      user_action: "PAY_NOW",
      return_url: `${HOST}/capture-order`,
      cancel_url: `${HOST}/cancel-payment`,
    },
  };

  let body = "";
   req.on('data', chunk => {
    body += chunk.toString()
   })
   req.on('end', () => {
    const data = JSON.parse(body);
    data.timestamp = Date.now()
    data.test = data.intent
    order.intent = data.intent
    order.purchase_units[0].amount.currency_code = data.purchase_units[0].amount.currency_code
    res.status(201).json(data)
   })
}

export const createOrder = async (req, res) => {
  try {
    
    const order = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: "105.70",
          },
        },
      ],
      application_context: {
        brand_name: "PLURALCURSOS.com",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${HOST}/capture-order`,
        cancel_url: `${HOST}/cancel-payment`,
      },
    };

    
   let body = "";
   req.on('data', chunk => {
    body += chunk.toString()
   })
   req.on('end', () => {
    const data = JSON.parse(body);
    order.purchase_units[0].amount.currency_code = data.purchase_units[0].amount.currency_code
    order.purchase_units[0].amount.value = data.purchase_units[0].amount.value
   })

    
    // format the body
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    // Generate an access token
    const {
      data: { access_token },
    } = await axios.post(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          
        },
        auth: {
          username: PAYPAL_API_CLIENT,
          password: PAYPAL_API_SECRET,
        },
      }
    );

    console.log(access_token);

    // make a request
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      order,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    console.log(response.data);

    return res.json(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Something goes wrong");
  }
};


export const captureOrder = async (req, res) => {
  const { token } = req.query;

  try {
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
      {},
      {
        auth: {
          username: PAYPAL_API_CLIENT,
          password: PAYPAL_API_SECRET,
        },
      }
    );

    console.log(response.data);

    res.redirect("http://localhost:4200//payed");
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server error" });
  }
};


export const cancelPayment = (req, res) => res.redirect("http://localhost:4200/principal");