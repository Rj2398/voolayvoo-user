import { BASE_URL } from "@/constant/constant";
import { convertTo12HourFormat } from "@/utils/eventFunction";
import { Widgets } from "@mui/icons-material";
import { DateTime } from "luxon";
// /images/near-event1.png
const Card = ({ cardData }) => {
  const checkedId =
    cardData?.events_data?.checked_id ||
    cardData?.events_data_business?.checked_id ||
    cardData?.checked_id;

    const imageSrc = cardData?.events_data?.eventimage?.image_name ? `${BASE_URL}/${cardData?.events_data?.eventimage?.image_name}` : cardData?.business_event_image?.image_name ? `${BASE_URL}/${cardData?.business_event_image?.image_name}` : "/images/near-event1.png";

  // Optional: Prevent rendering until image data is ready
  if (!cardData) return null;
  return (
    <>
      <div className="col-lg-3 col-md-6" style={{display:"flex", flexDirection:"column"}}>
        <div className="event-brand-box" style={{
          height:"100%",
          display:"flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <div className="brand-logo">
            <img
              height={223}
              style={{ objectFit: "cover" }}
              src={imageSrc} 
              alt="event"
            />
            <div className="event-price">
              {" "}
              {cardData?.events_data?.events_price == "0" ||
              cardData?.events_price == "0" ||
              cardData?.events_data_business?.events_price == "0"
                ? "Free"
                : "$" +
                  (cardData?.events_data?.events_price ||
                    cardData?.events_data_business?.events_price ||
                    cardData?.events_price)}
            </div>
          </div>
          <div className="event-pad">
            <div style={{ height: "80%" }}>
              <h6 className="title-capitilize">
                {cardData?.events_data?.events_name ||
                  cardData?.events_data_business?.events_name ||
                  cardData?.events_name}
              </h6>
              <p className="truncate-text">
                {cardData?.events_data?.events_description ||
                  cardData?.events_data_business?.events_description ||
                  cardData?.events_description}
              </p>
              <div className="point-icon">
                <div style={{ width: "80%" }}>
                  <img src="/images/location-dot.png" alt="" />{" "}
                  {cardData?.event_away_distance || null} miles away{" "}
                </div>
                <div>
                  <img src="/images/calendar.png" alt="" />
                  {cardData?.events_data?.events_date ||
                    cardData?.events_data_business?.events_date ||
                    cardData?.events_date}
                </div>
                <div>
                  <img src="/images/watch.png" alt="" />
                  {/* {convertTo12HourFormat(cardData?.events_start_time)} to{" "}
                {convertTo12HourFormat(cardData?.events_end_time)}{" "} */}
                  {cardData?.events_data?.events_start_time ||
                    cardData?.events_data_business?.events_start_time ||
                    cardData?.events_start_time}{" "}
                  to{" "}
                  {cardData?.events_data?.events_end_time ||
                    cardData?.events_data_business?.events_end_time ||
                    cardData?.events_end_time}
                </div>
              </div>
            </div>
            <a
              className="btn btn-viewmore-border"
              // href={`/events/${cardData.checked_id}?promoter_id=${cardData.promoter_id}`}
              href={`/events/${checkedId}?promoter_id=${cardData?.promoter_id}`}
              role="button"
            >
              View More
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
