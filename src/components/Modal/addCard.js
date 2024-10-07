// import { Modal, Box } from "@mui/material";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import { STRIPE_PUB_KEY } from "@/constant/constant";
// import CheckoutForm from "./checkoutForm";
// const stripePromise = loadStripe(STRIPE_PUB_KEY!);

// const AddCard = ({
//   open,
//   setOpen,
//   callBack,
// }) => {
//   // const options = {
//   //   // mode: "payment",
//   //   amount: amount,
//   //   currency: "usd",

//   //   appearance: {
//   //     theme: "stripe",
//   //   },
//   // };

//   return (
//     <>
//       <Modal open={open}>
//         <Box>
//           {/* {clientSecret && ( */}
//           <Elements stripe={stripePromise}>
//             <CheckoutForm setOpen={setOpen} callBack={callBack} />
//           </Elements>
//           {/* )} */}
//         </Box>
//       </Modal>
//     </>
//   );
// };

// export default AddCard;
//

//

import { Modal, Box } from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { STRIPE_PUB_KEY } from "@/constant/constant";
import CheckoutForm from "./checkoutForm";

// Corrected line without the '!'
const stripePromise = loadStripe(STRIPE_PUB_KEY);

const AddCard = ({ open, setOpen, callBack }) => {
  return (
    <Modal open={open}>
      <Box>
        <Elements stripe={stripePromise}>
          <CheckoutForm setOpen={setOpen} callBack={callBack} />
        </Elements>
      </Box>
    </Modal>
  );
};

export default AddCard;
