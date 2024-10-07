"use server";
import ClientComponent from "./ClientComponent";
import { BASE_URL } from "@/constant/constant";

async function getData() {
  const resCategory = await fetch(`${BASE_URL}/api/user_category_list`, {
    method: "POST",
  });
  const resultCat = await resCategory.json();

  if (!resCategory.ok) {
    throw new Error("Failed to fetch data");
  }

  return {
    categoryList: resultCat.data,
  };
}

const Events = async () => {
  const { categoryList } = await getData();
  return <ClientComponent categoryMainList={categoryList} />;
};

export default Events;
