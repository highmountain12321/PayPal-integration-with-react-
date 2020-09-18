import React, { useState, useEffect, useRef } from "react";

function App() {
  const [paidFor, setPaidFor] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const paypalRef = useRef();

  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: function (data, actions) {
          // This function sets up the details of the transaction, including the amount and line item details.
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: "10.0",
                },
              },
            ],
          });
        },
        onApprove: function (data, actions) {
          // This function captures the funds from the transaction.
          return actions.order.capture().then(function (details) {
            // This function shows a transaction success message to your buyer.
            console.log(details);
            setSuccessMessage(details.payer.name.given_name);
            setPaidFor(true);
          });
        },
        onError: (err) => {
          setError(err);
          console.error("ERROR", err);
        },
      })
      .render(paypalRef.current);
  }, []);

  if (paidFor) {
    return <div>Thanks for making the purchase.{successMessage}</div>;
  }

  if (error) {
    return <div>Error in processing order. Please Retry again</div>;
  }

  return (
    <div className="App">
      <div ref={paypalRef} />
    </div>
  );
}

export default App;
