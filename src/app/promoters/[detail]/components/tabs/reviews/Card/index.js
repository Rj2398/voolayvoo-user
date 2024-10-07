// import Image from "next/image";

// const Card = ({ DataMap }) => {
//   const user_data_comment = [
//     {
//       user_id: 368,
//       business_id: "3",
//       average_rating_total: "2.5",
//       description: "adding note",
//       feedback_date: "2024-09-02",
//       time: "6:25 AM",
//     },
//   ];
//   return (
//     <>
//       <div className="user-rating-box">
//         <div className="comment-time">32 minutes ago</div>
//         <div className="rating-user">
//           <img src="../images/rating-person-1.png" alt="" />
//         </div>
//         <div className="rating-and-comment">
//           <div className="rating-person">Haylie Aminoff</div>
//           <div className="rating-box-com">
//             4.5
//             <span>
//               <img src="../images/user-rating.png" alt="" />
//             </span>
//             <span>
//               <img src="../images/user-rating.png" alt="" />
//             </span>
//             <span>
//               <img src="../images/user-rating.png" alt="" />
//             </span>
//             <span>
//               <img src="../images/user-rating.png" alt="" />
//             </span>
//             <span>
//               <img src="../images/user-rating.png" alt="" />
//             </span>
//           </div>
//           <div className="rating-comment">
//             Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
//             commodo ligula eget dolor. Aenean massa. Cum sociis natoque
//             penatibus et magnis dis{" "}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Card;
// code written by rajan
import Image from "next/image";
import { Rating } from "@mui/material";
const Card = ({ DataMap }) => {
  // const user_data_comment = [
  //   {
  //     user_id: 368,
  //     business_id: "3",
  //     average_rating_total: "2.5",
  //     description: "adding note",
  //     feedback_date: "2024-09-02",
  //     time: "6:25 AM",
  //   },
  //   // Add more objects here if needed
  // ];

  return (
    <>
      {DataMap?.map((user, index) => (
        <div className="user-rating-box" key={index}>
          <div className="comment-time">
            {user.time} on {user.feedback_date}
          </div>
          <div className="rating-user">
            <Image
              src="/images/rating-person-1.png"
              alt="User"
              width={50}
              height={50}
            />
          </div>
          <div className="rating-and-comment">
            <div className="rating-person">User ID: {user.user_id}</div>
            <div className="rating-box-com">
              {user.average_rating_total}

              <Rating
                value={user.average_rating_total}
                onChange={(event, newValue) => {}}
                precision={0.5}
                disabled={true}
              />
              {/* You can add more star icons based on user.average_rating_total */}
            </div>
            <div className="rating-comment">{user.description}</div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Card;
