import Link from "next/link";
import Image from "next/image";
import { BASE_URL } from "@/constant/constant";

import { separateContentWithoutParser } from "@/components/HtmlToObjectParse";
import Subscribe from "./Component/Subscribe";

async function getData() {
  const resAbout = await fetch(`${BASE_URL}/api/user_about`, {
    method: "GET",
  });

  const about_data = await resAbout.json();
  const parsedHTML = about_data.data.contentText;
  // const resultEvent = await resEventList.json();

  // if (!resCategory.ok) {
  //   throw new Error("Failed to fetch data");
  // }
  if (about_data.data.contentText) {
    return {
      aboutData: parsedHTML,
    };
  } else {
    return null;
  }
}

const About = async () => {
  const { aboutData } = await getData();
  const separatedContent = separateContentWithoutParser(aboutData);
  console.log("******", separatedContent, "h111111111");

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
        <h1>About</h1>
      </div>
      <section className="about-sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="full-img">
                {/* rajan */}
                <Image
                  width={500}
                  height={444}
                  src={
                    separatedContent?.aboutImage?.length > 0
                      ? `${BASE_URL}/${separatedContent.aboutImage}`
                      : "/images/about-img.png"
                  }
                  className="img-fluid"
                  alt=""
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-txt">
                <div className="heading-semi">About</div>
                <div className="heading">
                  What is <span>VoolayVoo</span>
                </div>
                <div
                  dangerouslySetInnerHTML={{ __html: separatedContent.abouts }}
                />
                {/* <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry&apos;s
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged. Lorem Ipsum is simply dummy text of the
                  printing and typesetting industry
                </p>
                <p>
                  Lorem Ipsum has been the industry&apos;s standard dummy text
                  ever since the 1500s, when an unknown printer took a galley of
                  type and scrambled it to make a type specimen book. It has
                  survived not only five centuries, but also the leap into
                  electronic typesetting, remaining essentially unchanged.
                </p> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className="how-it-work"
        style={{
          backgroundImage: "url(./images/how-it-works.png)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <div className="heading-semi">How it Works</div>
              <div className="heading text-white">Voopons You Will Love</div>
              <div
                dangerouslySetInnerHTML={{ __html: separatedContent.voopons }}
              />
              {/* <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry&apos;s standard
                dummy text ever since the 1500s, when an unknown printer took a
                galley of type and scrambled it to make a type specimen book.
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.{" "}
              </p> */}
              <Link
                className="btn btn-learnmore"
                href={"/how-it-works"}
                role="button"
              >
                Read More
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="mission-vission">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6">
              <div className="our-mission mission-icon-box">
                <div className="mission-icon">
                  <Image
                    width={93}
                    height={93}
                    src={
                      separatedContent.missionImage?.length > 0
                        ? `${BASE_URL}/${separatedContent.missionImage}`
                        : "/images/mission-icon.png"
                    }
                    alt=""
                  />{" "}
                </div>
                <div className="heading">Our Mission</div>
                <div
                  dangerouslySetInnerHTML={{ __html: separatedContent.mission }}
                />
                {/* <p>
                  To connect people and businesses and bolster business locally,
                  everywhere.
                </p> */}
              </div>
            </div>
            <div className="col-lg-6 col-md-6 mission-img-box">
              <Image
                width={433}
                height={368}
                src="/images/mission-img.png"
                className="img-fluid"
                alt=""
              />
            </div>
            <div className="col-lg-6 col-md-6 mission-img-box">
              <Image
                width={417}
                height={368}
                src="/images/vision-img.png"
                className="img-fluid"
                alt=""
              />
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="our-mission mission-icon-box">
                <div className="mission-icon">
                  <Image
                    width={93}
                    height={93}
                    src={
                      separatedContent.visionImage?.length > 0
                        ? `${BASE_URL}/${separatedContent.visionImage}`
                        : "/images/vision-icon.png"
                    }
                    className="img-fluid"
                    alt=""
                  />{" "}
                </div>
                <div className="heading">Our Vision</div>
                <div
                  dangerouslySetInnerHTML={{ __html: separatedContent.vision }}
                />

                {/* <p>
                  To create a local social marketplace where people and
                  businesses reap the benefits and rewards when and where they
                  want them.
                </p> */}
              </div>
            </div>
            <div className="col-lg-12 text-center mt-3 gap-3 d-flex justify-content-center">
              <Subscribe />

              <Link
                className="btn btn-learnmore"
                href={"/contact"}
                role="button"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
