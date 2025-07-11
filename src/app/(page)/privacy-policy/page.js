export const dynamic = "force-dynamic"; // Ensures server renders fresh content. extra addition line

import { BASE_URL } from "@/constant/constant";

async function getData() {
  const resPrivacy = await fetch(`${BASE_URL}/api/user_privacy_policy`, {
    method: "GET",
    cache: "no-cache"
  });

  const privacy_data = await resPrivacy.json();
  const parsedHTML = privacy_data.data.contentText;

  if (privacy_data.data.contentText) {
    return {
      privacyData: parsedHTML,
    };
  } else {
    return null;
  }
}

const PrivacyPolicy = async () => {
  const { privacyData } = await getData();
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
        <h1> Privacy Policy </h1>
      </div>
      <section className="terms-cond">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div dangerouslySetInnerHTML={{ __html: privacyData }} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicy;
