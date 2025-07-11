import { BASE_URL } from "@/constant/constant";
import { checkExpirationStatus } from "@/utils/voopanFunction";
import { DateTime } from "luxon";
import Image from "next/image";
const Card = ({ data }) => {
  return (
    <div className="col-lg-3 col-md-6">
      <div className="voopan-box">
        {checkExpirationStatus(data?.voopons_valid_thru) && (
          <span className="expiring-soon">Expiring soon</span>
        )}
        <div className="voopon-logo">
          <Image
            width={125}
            height={125}
            src={
              data?.vooponimage?.image_name ? `${BASE_URL}${data?.vooponimage?.image_name}` : data?.business_voopon_image?.image_name ? `${BASE_URL}${data?.business_voopon_image?.image_name}` 
                : "/images/voopons-logo-1.png"
            }
            style={{ objectFit: "cover" }}
            alt="voopons"
          />
        </div>

        <div className="voopon-heading">{data?.voopons_name} </div>
        <h5>{data?.voopons_description}</h5>
        <p>
          Valid Thru : {data?.voopons_valid_thru}
          {/* {DateTime.fromFormat(data?.voopons_valid_thru, "yyyy-MM-dd").toFormat(
            "MMMM dd, yyyy"
          )} */}
        </p>

        <a
          className="btn btn-viewmore"
          href={`/voopons/${data.category_id}`}
          role="button"
        >
          View More
        </a>
      </div>
    </div>
  );
};

export default Card;
