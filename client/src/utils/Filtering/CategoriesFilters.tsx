import React, { useContext } from "react";
import "./CategoriesStyling.css";

import { GlobalValuesContext } from "../../Context/globalValuesContextProvider";
import { iGlobalValues } from "../../Types/creatorSocialLinksTypes";

const CategoriesFilters = ({
  getCategories,
}: {
  getCategories: string[] | null;
}) => {
  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const {
    selectedCategories,
    setSelectedCategories,
    displayCategories,
    setDisplayCategories,
  } = contextValues as iGlobalValues;

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const category = event.target.value;
    if (event.target.checked) {
      setSelectedCategories((prevCategories) => [...prevCategories, category]);
    } else {
      setSelectedCategories((prevCategories) =>
        prevCategories.filter((c) => c !== category)
      );
    }
  };

  return (
    <div className='_categories_container'>
      <label className='_category_label'>
        <input
          type='checkbox'
          value='All'
          checked={selectedCategories.includes("All")}
          onChange={handleCategoryChange}
        />
        All
      </label>
      {getCategories?.map((category) => (
        <label key={category} className='_category_label'>
          <input
            type='checkbox'
            value={category}
            checked={selectedCategories.includes(category)}
            onChange={handleCategoryChange}
          />
          {category}
        </label>
      ))}
    </div>
  );
};

export default CategoriesFilters;
