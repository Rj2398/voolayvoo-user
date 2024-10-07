export function findSubCategory(selectionList, subCategory) {
  for (const category of selectionList) {
    const foundSubCategory = category.subCategoryArray.find(
      (sub) =>
        sub?.sub_category_id === subCategory?.sub_category_id &&
        sub?.sub_category_name === subCategory?.sub_category_name
    );
    if (foundSubCategory) {
      return foundSubCategory;
    }
  }
  return null;
}
