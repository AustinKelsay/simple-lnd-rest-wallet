// Import the necessary dependencies
// - React: The core React library
// - useState: A hook from React that allows functional components to have state
// - axios: A library for making HTTP requests
import React, { useState } from "react";
import axios from "axios";

// Define the LightningWallet functional component
// It receives props: host, port, macaroon, and lightningBalance
function LightningWallet({ host, port, macaroon, lightningBalance }) {
  // Use the useState hook to manage the component's state
  // - receiveShowing: A boolean indicating whether the receive form is visible (default: false)
  // - sendShowing: A boolean indicating whether the send form is visible (default: false)
  // - invoice: A string to store the invoice to be paid (default: empty string)
  // - amount: A string to store the amount when creating an invoice (default: empty string)
  const [receiveShowing, setReceiveShowing] = useState(false);
  const [sendShowing, setSendShowing] = useState(false);
  const [invoice, setInvoice] = useState("");
  const [amount, setAmount] = useState("");

// Function to create an invoice
// https://lightning.engineering/api-docs/api/lnd/lightning/add-invoice
const createInvoice = async () => {
  try {
    // Define the request options
    const options = {
      method: "POST",
      url: `${host}:${port}/v1/invoices`,
      data: {
        value: amount,
      },
      headers: {
        "grpc-metadata-macaroon": macaroon,
      },
    };

    // Make the API request to create an invoice
    const response = await axios(options);

    // Display the created invoice's payment request in an alert
    alert(`Invoice created successfully\n\n${response.data.payment_request}`);

    // Reset the form state
    setReceiveShowing(false);
    setAmount("");
  } catch (error) {
    alert(`Failed to create invoice: ${JSON.stringify(error.response?.data)}`);
  }
};

// Function to pay an invoice
// https://lightning.engineering/api-docs/api/lnd/lightning/send-payment-sync
const payInvoice = async () => {
  try {
    // Define the request options
    const options = {
      method: "POST",
      url: `${host}:${port}/v1/channels/transactions`,
      data: {
        payment_request: invoice,
      },
      headers: {
        "grpc-metadata-macaroon": macaroon,
      },
    };

    // Make the API request to pay the invoice
    const response = await axios(options);

    // Display the payment preimage in an alert
    alert(`Invoice paid successfully\n\npayment preimage: ${response.data.payment_preimage}`);

    // Reset the form state
    setSendShowing(false);
    setInvoice("");
  } catch (error) {
    alert(`Failed to pay invoice: ${JSON.stringify(error.response?.data)}`);
  }
};

  // The component's render method
  // It returns the JSX that defines the structure and appearance of the component
  return (
    <div>
      {/* Display the lightning balance */}
      <div className="balance">
        <h3>Lightning balance</h3>
        <p>{lightningBalance} sats</p>
      </div>

      {/* Buttons to toggle the receive and send forms */}
      {/* When clicked, they update the respective state variables */}
      <div>
        <button onClick={() => setReceiveShowing(!receiveShowing)}>Receive</button>
        <button onClick={() => setSendShowing(!sendShowing)}>Send</button>
      </div>

      {/* Render the receive form if receiveShowing is true */}
      {/* It displays an input field for the amount and a button to create an invoice */}
      {receiveShowing && (
        <div className="invoice-form">
          <input
            type="text"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={createInvoice}>Create Invoice</button>
        </div>
      )}

      {/* Render the send form if sendShowing is true */}
      {/* It displays an input field for the invoice and a button to pay the invoice */}
      {sendShowing && (
        <div className="invoice-form">
          <input
            type="text"
            placeholder="Invoice"
            value={invoice}
            onChange={(e) => setInvoice(e.target.value)}
          />
          <button onClick={payInvoice}>Pay Invoice</button>
        </div>
      )}
    </div>
  );
}

// Export the LightningWallet component as the default export
// This allows other files to import and use this component
export default LightningWallet;