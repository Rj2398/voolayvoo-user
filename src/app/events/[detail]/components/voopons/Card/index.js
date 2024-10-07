import { BASE_URL } from "@/constant/constant";
import { checkExpirationStatus } from "@/utils/voopanFunction";
import Image from "next/image";
import { DateTime } from "luxon";
import Link from "next/link";

const Card = ({ cardData }) => {
  return (
    <>
      <div className="item">
        <div className="voopan-box">
          {checkExpirationStatus(cardData?.voopons_valid_thru) && (
            <span className="expiring-soon">Expiring soon</span>
          )}
          <div className="voopon-logo">
            <Image
              width={125}
              height={125}
              src={
                cardData?.vooponimage?.image_name
                  ? `${BASE_URL}${cardData?.vooponimage?.image_name}`
                  : "/images/voopons-logo-1.png"
              }
              alt=""
            />
          </div>
          <div className="voopon-heading"> {cardData?.voopons_name} </div>
          <h5>{cardData?.voopons_description}</h5>
          <p>
            Valid Thru:{" "}
            {DateTime.fromFormat(
              cardData?.voopons_valid_thru,
              "yyyy-MM-dd"
            ).toFormat("MMMM dd, yyyy")}
          </p>
          <Link
            className="btn btn-viewmore"
            href={`/voopons/${cardData?.id}?promoter_id=${cardData?.promoter_id}`}
            role="button"
          >
            View More
          </Link>
        </div>
      </div>
    </>
  );
};

export default Card;
