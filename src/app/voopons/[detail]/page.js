"use server";
// "use client";
import Image from "next/image";
import Events from "./components/events";
// import ClientComponent from "./ClientComponent";
import BackBotton from "../../BackButton";

import { BASE_URL } from "@/constant/constant";
import { getFormData } from "@/fetchData/fetchApi";
import ClientComponent from "./ClientComponent";
import VooponImageGallery from "./VooponImageGallery";
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
  // searchParams: { category_id },
}) => {
  const { voopon_detail } = await getData(detail);
  // console.log(voopon_detail, "Voopon_details*****");

  return (
    <>
      <section className="details-page">
        <BackBotton />

        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              {/* <div className="details-img" style={{ width: 596, height: 375 }}>
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
              </div> */}

              <VooponImageGallery
                voopon_detail={voopon_detail}
                BASE_URL={BASE_URL}
              />
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
              <p>
                {voopon_detail?.voopon_one?.voopons_description ||
                  voopon_detail?.voopon_two?.voopons_description}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Detail;
