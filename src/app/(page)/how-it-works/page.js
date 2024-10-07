import Link from "next/link";
import Image from "next/image";
import { BASE_URL } from "@/constant/constant";
import HtmlRenderer from "@/components/HtmlRenderer";

async function getData() {
  const resHowItWork = await fetch(`${BASE_URL}/api/user_how_its_works`, {
    method: "GET",
  });
  const howItWork_data = await resHowItWork.json();
  if (howItWork_data?.data?.hasOwnProperty("id")) {
    return {
      howItWorkData: howItWork_data.data,
    };
  } else {
    return null;
  }
}
const HowItWorks = async () => {
  const { howItWorkData } = await getData();

  return (
    <>
      <div
        className="inner-banner"
        style={{
          backgroundImage: "url(/images/about-bnr.png)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <h1> How it Works </h1>
      </div>
      <section className="how-it-work-sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="howit-txt text-center">
                {/* <div className="heading-semi"> VoolayVoo Connects</div>
                <div className="heading">Businesses, Promoters and Users</div> */}
                <HtmlRenderer htmlContent={howItWorkData.contentText} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="howsec-two">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="howbox-img">
                <Image
                  width={1216}
                  height={291}
                  src="/images/why-chooimg.png"
                  alt="images"
                  className="img-fluid"
                />
              </div>
              <div className="text-and-btn">
                Still have questions?{" "}
                <Link
                  className="btn btn-learnmore"
                  href={"/contact"}
                  role="button"
                >
                  {" "}
                  Contact Now{" "}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorks;
