import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import sha256 from "sha256";
import axios from "axios";

dotenv.config();

const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const SALT_KEY = process.env.PHONEPE_SALT_KEY;
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX;
const APP_BACKEND_URL = process.env.BACKEND_URL;

const PHONEPE_HOST_URL = "https://api.phonepe.com/apis/hermes";
// const PHONEPE_HOST_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";
const PHONEPE_PAY_API_ENDPOINT = "/pg/v1/pay";

/**
 * Initiates PhonePe Payment Gateway then makes a payment status check API call
 * @param {*} req
 * @param {*} res
 */
export const payment = async (req, res) => {
  // Generating the transaction ID.
  const merchantTransactionId = `TI${uuidv4()}${Date.now()}`;

  const { merchantUserId, mobileNumber, amount } = req.body;

  // Creating the payload to encrypted
  const payload = {
    merchantId: MERCHANT_ID, // PHONEPE_MERCHANT_ID
    merchantTransactionId: merchantTransactionId,
    merchantUserId: merchantUserId,
    amount: amount * 100, // converting to Paise
    redirectUrl: `${APP_BACKEND_URL}/payment/status/${merchantTransactionId}`,
    redirectMode: "POST",
    mobileNumber: mobileNumber,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  console.log("Payload", payload);

  const base64EncodedPayload = Buffer.from(
    JSON.stringify(payload),
    "utf8"
  ).toString("base64");

  const xVerifyChecksum =
    sha256(base64EncodedPayload + PHONEPE_PAY_API_ENDPOINT + SALT_KEY) +
    "###" +
    SALT_INDEX;

  // axios request
  axios
    .post(
      `${PHONEPE_HOST_URL}${PHONEPE_PAY_API_ENDPOINT}`,
      {
        request: base64EncodedPayload,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerifyChecksum,
          accept: "application/json",
        },
      }
    )
    .then((response) => {
      res.redirect(response.data.data.instrumentResponse.redirectInfo.url);
    })
    .catch((error) => {
      console.log("Error: ", error);
      res.send(error);
    });
};

export const paymentStatus = async (req, res) => {
  const { merchantTransactionId } = req.params;
  // check the status of the payment using merchantTransactionId
  if (merchantTransactionId) {
    let statusUrl =
      `${PHONEPE_HOST_URL}${PHONEPE_PAY_API_ENDPOINT}${MERCHANT_ID}/` +
      merchantTransactionId;

    // generate X-VERIFY
    let string =
      `/pg/v1/status/${MERCHANT_ID}/` + merchantTransactionId + SALT_KEY;
    let sha256_val = sha256(string);
    let xVerifyChecksum = sha256_val + "###" + SALT_INDEX;

    axios
      .get(statusUrl, {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerifyChecksum,
          "X-MERCHANT-ID": merchantTransactionId,
          accept: "application/json",
        },
      })
      .then(function (response) {
        console.log("response->", response.data);
        if (response.data && response.data.code === "PAYMENT_SUCCESS") {
          // redirect to FE payment success status page
          res.send(response.data);
        } else {
          // redirect to FE payment failure / pending status page
        }
      })
      .catch(function (error) {
        // redirect to FE payment failure / pending status page
        res.send(error);
      });
  } else {
    res.send("Sorry!! Error");
  }
};
