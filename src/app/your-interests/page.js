import InterestsList from "@/components/Interests/InterestsList";
import { BASE_URL } from "@/constant/constant";
import Link from "next/link";

async function getData() {
  const resCategory = await fetch(
    `${BASE_URL}/api/user_category_sub_category`,
    {
      method: "GET",
    }
  );

  const resultCat = await resCategory.json();

  const categoryMap = {};

  resultCat?.data?.forEach((item) => {
    if (!categoryMap[item.category_id]) {
      categoryMap[item.category_id] = {
        category_id: item.category_id,
        category_name: item.category_name,
        subcategory: [],
      };
    }
    categoryMap[item.category_id].subcategory.push({
      sub_category_id: item.sub_category_id,
      sub_category_name: item.sub_category_name,
    });
  });

  if (!resCategory.ok) {
    throw new Error("Failed to fetch data");
  }

  return {
    list: Object.values(categoryMap),
  };
}

const Interests = async () => {
  const { list } = await getData();

  return (
    <>
      <div
        className="inner-banner"
        style={{
          backgroundImage: `url("/images/interests-bg.jpg")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <h1>Your Interests</h1>
      </div>
      <section className="terms-cond">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="deals-inner interests-inner">
                <h1 className="text-center mr-0 mb-4">
                  Tell us your Interests{" "}
                  <Link href="/my/profile">
                    <u>Skip</u>
                  </Link>
                </h1>

                <InterestsList list={list} fullwidth={false} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Interests;
