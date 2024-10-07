"use client";

import { useAuth } from "@/app/UserProvider";
import { postFetchWithAuth } from "@/fetchData/fetchApi";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

const InterestsList = ({ list = [], fullwidth = false }) => {
  const [searchText, setSearchText] = useState("");
  const [tempList, setTempList] = useState(list);
  useEffect(() => {
    setTempList(list);
  }, [list]);
  console.log(tempList, "*****************");

  const [selectionList, setSelectionList] = useState([]);
  const { userDetails } = useAuth();
  const router = useRouter();
  console.log(list, "hello list data comes from");

  const handleSearchChange = useCallback(
    (event) => {
      const { value } = event.target;
      setSearchText(value);
      if (value === "") {
        setTempList(list);
      }
    },
    [list]
  );
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText) {
      setTempList(
        list.filter((item) =>
          item?.category_name.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    } else {
      setTempList(list);
    }
  };

  const removeTab = useCallback((closeItem) => {
    setSelectionList((prevList) =>
      prevList.map((category) => ({
        ...category,
        subCategoryArray: category?.subCategoryArray.filter(
          (sub) =>
            !(
              sub?.sub_category_id === closeItem?.sub_category_id &&
              sub?.sub_category_name === closeItem?.sub_category_name
            )
        ),
      }))
    );
  }, []);
  // useEffect(() => {
  //   // Populate selectionList with categories/subcategories where like = "Yes"
  //   const likedCategories = list
  //     .filter((category) => category.like === "Yes")
  //     .map((category) => ({
  //       category_id: category.category_id,
  //       subCategoryArray: category.subcategory.map((sub) => sub),
  //     }));

  //   setSelectionList((prevList) => {
  //     // Combine already selected with liked categories
  //     return [...likedCategories];
  //   });
  // }, [list]);

  useEffect(() => {
    // Populate selectionList with categories/subcategories where like = "Yes"
    const likedCategories = list
      .filter((category) => category.like === "Yes")
      .map((category) => ({
        category_id: category.category_id,
        subCategoryArray: category.subcategory
          .filter((sub) => sub.like === "Yes") // Filter subcategories
          .map((sub) => ({
            sub_category_id: sub.sub_category_id, // Set subcategory ID
            sub_category_name: sub.sub_category_name, // Set subcategory name
          })),
      }));

    setSelectionList((prevList) => {
      // Combine already selected with liked categories
      return [...likedCategories]; // Combine with previous selections
    });
  }, [list]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Filter out any categories that have no sub-categories selected
    const filteredSelectionList = selectionList.filter(
      (category) => category.subCategoryArray.length > 0
    );

    // Convert selectionList into format for submission
    const convertedArray = filteredSelectionList.map((item) => ({
      category_id: item.category_id,
      sub_category_id: item.subCategoryArray
        .map((subItem) => subItem.sub_category_id)
        .join(","),
    }));

    const formdata = {
      user_id: userDetails?.user_id,
      selectionList: convertedArray,
    };

    try {
      const response = await postFetchWithAuth({
        data: formdata,
        endpoint: "user_interest_create",
        authToken: userDetails.token,
      });
      if (response?.success) {
        toast.success(response?.message);
        router.push("/my/profile/");
      } else {
        throw response;
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  return (
    <>
      <div className="deals-inner-search">
        <form action="">
          <label htmlFor="" className="interests-search">
            <input
              type="text"
              placeholder="Search for Categories"
              value={searchText}
              onKeyDown={handleKeyDown}
              onChange={handleSearchChange}
            />
            <button onClick={handleSearch}>
              <img src="/images/search.png" alt="Search" />
            </button>
          </label>
        </form>
        <p>
          Sharing your interests would help us curate personalized Voopons &
          Events for you.
        </p>
      </div>
      <div className={`deals-inner-heading ${fullwidth ? "w-100" : ""}`}>
        <h1>My Interests</h1>
      </div>
      <div className={`interests-filters ${fullwidth ? "w-100" : ""}`}>
        <ul>
          {/* Loop through the selectionList, which contains selected categories and subcategories */}
          {selectionList.length > 0 ? (
            selectionList.map((category) =>
              category?.subCategoryArray?.length > 0
                ? category.subCategoryArray.map((subCat) => (
                    <SubCategoryTab
                      key={subCat.sub_category_id}
                      subCat={subCat} // Pass the selected sub-category data
                      removeTab={removeTab} // Function to remove the selected tab
                    />
                  ))
                : null
            )
          ) : (
            <p>No interests selected yet.</p>
          )}
        </ul>
      </div>
      <div className="interests-list">
        {tempList.length > 0 &&
          tempList.map((item) => (
            <CategoryList
              key={"cat" + item?.category_id}
              item={item}
              setSelectionList={setSelectionList}
              selectionList={selectionList}
            />
          ))}

        {/* Additionally, show categories where like = "Yes" */}
        {list
          .filter(
            (item) =>
              item.like === "Yes" &&
              !tempList.some(
                (tempItem) => tempItem.category_id === item.category_id
              )
          )
          .map((item) => (
            <CategoryList
              key={"likeCat" + item?.category_id}
              item={item}
              setSelectionList={setSelectionList}
              selectionList={selectionList}
            />
          ))}
      </div>

      <div className="interest-btn">
        <Link href="#" onClick={handleSubmit}>
          SUBMIT
        </Link>
      </div>
    </>
  );
};

export default InterestsList;

const SubCategoryTab = ({ subCat, removeTab }) => {
  const handleRemoveItem = useCallback(
    (e) => {
      e.preventDefault();
      removeTab(subCat);
    },
    [removeTab, subCat]
  );

  return (
    <li>
      {subCat.sub_category_name}
      <Link href="#" onClick={handleRemoveItem}>
        <Image
          src="/images/interests/icons_cross.png"
          alt="cross"
          width={15}
          height={15}
        />
      </Link>
    </li>
  );
};

const CategoryList = ({ item, setSelectionList, selectionList }) => {
  // console for debug
  console.log(selectionList, "set selection list data");
  console.log(item, "item data from category list");

  const [open, setOpen] = useState(true);
  const handleOpen = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, []);
  const handleSelection = useCallback(
    (subCategory) => {
      setSelectionList((prevList) => {
        const categoryIndex = prevList.findIndex(
          (category) => category.category_id === item.category_id
        );

        if (categoryIndex !== -1) {
          const subCategoryIndex = prevList[
            categoryIndex
          ].subCategoryArray.findIndex(
            (sub) => sub.sub_category_id === subCategory.sub_category_id
          );

          if (subCategoryIndex !== -1) {
            // If the sub-category is already selected, remove it
            const updatedSubArray = prevList[
              categoryIndex
            ].subCategoryArray.filter(
              (sub) => sub.sub_category_id !== subCategory.sub_category_id
            );

            // If there are no sub-categories left, remove the category
            if (updatedSubArray.length === 0) {
              return prevList.filter((_, i) => i !== categoryIndex);
            }

            // Otherwise, just update the sub-category array
            return prevList.map((category, i) =>
              i === categoryIndex
                ? { ...category, subCategoryArray: updatedSubArray }
                : category
            );
          } else {
            // If the sub-category isn't selected, add it to the category
            return prevList.map((category, i) =>
              i === categoryIndex
                ? {
                    ...category,
                    subCategoryArray: [
                      ...category.subCategoryArray,
                      subCategory,
                    ],
                  }
                : category
            );
          }
        } else {
          // If the category isn't selected, add it with the selected sub-category
          return [
            ...prevList,
            {
              category_id: item.category_id,
              subCategoryArray: [subCategory],
            },
          ];
        }
      });
    },
    [item, setSelectionList]
  );

  return (
    <div className="deal-search-filter">
      <div onClick={handleOpen}>
        <h2>
          {item.category_name}{" "}
          <i className={`fas fa-chevron-down ${open ? "down-side" : ""}`}></i>
        </h2>
      </div>
      {open && (
        <div className="deal-search-filter-list">
          <ul className="deal-search-filter-list-scroll">
            {item.subcategory.map((subItem) => (
              <SubCategoryItem
                key={subItem.sub_category_id}
                subItem={subItem}
                handleSelection={handleSelection}
                selectionList={selectionList}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const SubCategoryItem = ({ subItem, handleSelection, selectionList }) => {
  const [check, setCheck] = useState(false);
  const handleSubItemClick = useCallback(
    (e) => {
      e.preventDefault();
      handleSelection(subItem);
    },
    [handleSelection, subItem]
  );

  // useEffect(() => {
  //   const check = selectionList.some((category) =>
  //     category.subCategoryArray.some(
  //       (sub) => sub.sub_category_id === subItem.sub_category_id
  //     )
  //   );
  //   setCheck(check);
  // }, [selectionList]);
  useEffect(() => {
    const isChecked = selectionList.some((category) =>
      category.subCategoryArray.some(
        (sub) => sub.sub_category_id === subItem.sub_category_id
      )
    );
    setCheck(isChecked);
  }, [subItem, selectionList]);

  return (
    <li>
      <Link href="#" onClick={handleSubItemClick}>
        {subItem?.sub_category_name}
        <input type="checkbox" checked={check} readOnly />
      </Link>
    </li>
  );
};
