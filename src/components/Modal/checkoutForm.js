// import {
//   useStripe,
//   useElements,
//   CardNumberElement,
//   CardCvcElement,
//   CardExpiryElement,
// } from "@stripe/react-stripe-js";
// import Image from "next/image";
// import { useState } from "react";
// import { toast } from "react-toastify";

// const CheckoutForm = ({ setOpen, callBack }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [cardHolderName, setCardHolderName] = useState("");
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!stripe || !elements) {
//       // Stripe.js hasn't yet loaded.
//       // Make sure to disable form submission until Stripe.js has loaded.
//       return;
//     }
//     elements.submit();
//     const cardNumberElement = elements?.getElement(CardNumberElement);
//     const result = await stripe.createToken(cardNumberElement!, {
//       name: cardHolderName,
//     });

//     if (result?.error) {
//       toast.error(`${result?.error}`);
//     } else {
//       setOpen(false);
//       callBack(result.token);
//     }
//   };

//   return (
//     <div
//       className="modal fade show"
//       style={{ display: "block", paddingRight: "0px" }}
//     >
//       <div className="modal-dialog card-width">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title modal-title-center add-card-hd" id="">
//               Add Card
//             </h5>
//             <button
//               onClick={() => setOpen(false)}
//               type="button"
//               className="close collab-btn"
//             >
//               <span aria-hidden="true">
//                 <Image width={28} height={28} src="/images/cross.svg" alt="" />
//               </span>
//             </button>
//           </div>
//           <div className="modal-body">
//             <div className="add-to-card">
//               <form onSubmit={handleSubmit}>
//                 {/* <CardElement /> */}
//                 <div className="form-group">
//                   <label>Card Holder Name</label>
//                   <input
//                     // type="email"
//                     id="cardholderName"
//                     className="form-control"
//                     placeholder="Card Holder Name"
//                     value={cardHolderName}
//                     onChange={(e) => setCardHolderName(e.currentTarget.value)}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Card Number</label>

//                   <div className="form-control card-img cardElement">
//                     <CardNumberElement />
//                   </div>
//                 </div>
//                 <div className="grid-add-card">
//                   <div className="exp-date half-Width">
//                     <label>Expiry Date</label>
//                     <div className="form-control cardElement">
//                       <CardExpiryElement />
//                     </div>
//                   </div>
//                   <div className="exp-pass half-Width">
//                     <label>CVV</label>
//                     <div className="form-control cardElement">
//                       <CardCvcElement />
//                     </div>
//                   </div>
//                 </div>

//                 <button className="btn submit-add-card mt-3 mb-2" type="submit">
//                   {" "}
//                   Submit{" "}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutForm;
//

import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";

const CheckoutForm = ({ setOpen, callBack }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardHolderName, setCardHolderName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    const result = await stripe.createToken(cardNumberElement, {
      name: cardHolderName,
    });

    if (result.error) {
      toast.error(result.error.message);
    } else {
      setOpen(false);
      callBack(result.token);
    }
  };

  return (
    <div
      className="modal fade show"
      style={{ display: "block", paddingRight: "0px" }}
    >
      <div className="modal-dialog card-width">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title modal-title-center add-card-hd">
              Add Card
            </h5>
            <button
              onClick={() => setOpen(false)}
              type="button"
              className="close collab-btn"
            >
              <span aria-hidden="true">
                <Image width={28} height={28} src="/images/cross.svg" alt="" />
              </span>
            </button>
          </div>
          <div className="modal-body">
            <div className="add-to-card">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Card Holder Name</label>
                  <input
                    id="cardholderName"
                    className="form-control"
                    placeholder="Card Holder Name"
                    value={cardHolderName}
                    onChange={(e) => setCardHolderName(e.currentTarget.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Card Number</label>
                  <div className="form-control card-img cardElement">
                    <CardNumberElement />
                  </div>
                </div>
                <div className="grid-add-card">
                  <div className="exp-date half-Width">
                    <label>Expiry Date</label>
                    <div className="form-control cardElement">
                      <CardExpiryElement />
                    </div>
                  </div>
                  <div className="exp-pass half-Width">
                    <label>CVV</label>
                    <div className="form-control cardElement">
                      <CardCvcElement />
                    </div>
                  </div>
                </div>
                <button className="btn submit-add-card mt-3 mb-2" type="submit">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
