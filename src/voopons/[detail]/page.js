"use server";
import Image from "next/image";
import Events from "./components/events";
import ClientComponent from "./ClientComponent";
import { BASE_URL } from "@/constant/constant";
import { getFormData } from "@/fetchData/fetchApi";
// 43892199"vooopan one
// 88604396 paid
// 39768585 for voopan two
async function getData(detail) {
  const formData = new FormData();
  formData.append("voopon_unique_number", detail);
  const resVoopon = await fetch(`${BASE_URL}/api/user_voopon_detail_list`, {
    method: "POST",
    body: formData,
  });
  const vooponDetails = await resVoopon.json();

  // const resRelatedEvent = await fetch(
  //   `${BASE_URL}/api/user_event_list_related_voopon`,
  //   {
  //     method: "POST",
  //     body: getFormData({ voopon_id: detail, promoter_id }),
  //   }
  // );
  // const relatedEvent = await resRelatedEvent.json();

  return {
    voopon_detail: vooponDetails.data,
    // related_event: relatedEvent?.data?.[0]?.event_related_list,
  };
}

const Detail = async ({
  params: { detail },
  searchParams: { promoter_id },
}) => {
  const { voopon_detail } = await getData(detail);

  return (
    <>
      <section className="details-page">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="details-img" style={{ width: 596, height: 375 }}>
                <Image
                  width={596}
                  height={375}
                  src={
                    voopon_detail?.voopon_one?.vooponsimage[0]?.image_name
                      ? `${BASE_URL}/${voopon_detail?.voopon_one?.vooponsimage[0]?.image_name}`
                      : voopon_detail?.voopon_two?.business_voopon_image
                          ?.image_name
                      ? `${BASE_URL}/${voopon_detail?.voopon_two?.business_voopon_image?.image_name}`
                      : "/images/amf-details.png"
                  }
                  alt="images"
                  className="img-voopon"
                />
              </div>
            </div>
            <ClientComponent voopon_detail={voopon_detail} />
          </div>
        </div>
      </section>

      <section className="about-details">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="heading-sec">About this Voopons</div>
              <p>{voopon_detail?.voopon_one?.voopons_description}</p>

              <div className="heading-sec">Terms & Conditions</div>
              <ul>
                <li>
                  Voopons are not redeemable for cash unless required by law{" "}
                </li>
                <li>Voopons cannot be returned for cash refunds </li>
                <li>Voopons cannot be replaced if lost or stolen</li>
                <li>
                  Voopons cannot be redeemed at non-participating retail stores
                  or other websites{" "}
                </li>
                <li>Voopons cannot be resold or exchanged for cash </li>
                <li>
                  Voopons cannot be used for unauthorized advertising,
                  marketing, sweepstakes, or other promotional purposes{" "}
                </li>
                <li>
                  Voopons cannot be used with other promotions, gift
                  certificates, coupons, or discounts
                </li>
                <li>
                  Voopons are the sole liability of the issuing Business or
                  Promoter
                </li>
                <li>
                  Unauthorized or unlawful reproduction, modification, or trade
                  of voopons is prohibited{" "}
                </li>
                <li>
                  Pricing for certain products may change at any time without
                  notice
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* {related_event && <Events related_event={related_event} />} */}
    </>
  );
};

export default Detail;
