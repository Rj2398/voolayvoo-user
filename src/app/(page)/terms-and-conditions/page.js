import { BASE_URL } from "@/constant/constant";

async function getData() {
  const resTerms = await fetch(`${BASE_URL}/api/user_terms_conditions`, {
    method: "GET",
  });

  const terms_data = await resTerms.json();
  const parsedHTML = terms_data.data.contentText;

  if (terms_data.data.contentText) {
    return {
      termsData: parsedHTML,
    };
  } else {
    return null;
  }
}

const Terms = async () => {
  const { termsData } = await getData();
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
        <h1> Terms & Conditions </h1>
      </div>
      <section className="terms-cond">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div dangerouslySetInnerHTML={{ __html: termsData }} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Terms;
