import React, { useState, useContext } from "react";
import "./CategoriesStyling.css";

import { useCreatorData } from "../../Context/CreatorDataProvider";
import { iCreatorDataProvider } from "../../Types/creatorStuffTypes";
import { iGlobalValues } from "../../Types/globalVariablesTypes";
import { GlobalValuesContext } from "../../Context/globalValuesContextProvider";

const CategoriesFilters = ({ getCategories }: { getCategories: string[] }) => {
  const [localSelectedCategories, setLocalSelectedCategories] = useState<
    string[]
  >(["All"]);

  let { setSelectedCategories } = useCreatorData() as iCreatorDataProvider;
  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const { setSelectedCategories: setGlobalSelectedCategories } =
    contextValues as iGlobalValues;

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const category = event.target.value;
    console.log("category", category);
    if (event.target.checked) {
      if (category === "All") {
        setLocalSelectedCategories(["All"]);
      } else {
        setLocalSelectedCategories((prevCategories) => {
          // If "All" is currently selected, remove it.
          const newCategories = prevCategories.includes("All")
            ? [category]
            : [...prevCategories, category];
          return newCategories;
        });
      }
    } else {
      setLocalSelectedCategories((prevCategories) => {
        const newCategories = prevCategories.filter((c) => c !== category);
        // If "All" is deselected, select all other categories.
        // If no categories are selected after removing, add "All" back.
        if (category === "All") {
          return getCategories as string[];
        } else if (newCategories.length === 0) {
          return ["All"];
        }
        return newCategories;
      });
    }
  };

  setSelectedCategories(localSelectedCategories);
  setGlobalSelectedCategories(localSelectedCategories);

  return (
    <div className='_categories_container'>
      <label className='_category_label'>
        <input
          type='checkbox'
          value='All'
          checked={localSelectedCategories.includes("All")}
          onChange={handleCategoryChange}
        />
        All
      </label>
      {getCategories?.map((category: string) => (
        <label key={category} className='_category_label'>
          <input
            type='checkbox'
            value={category}
            checked={localSelectedCategories.includes(category)}
            onChange={handleCategoryChange}
          />
          {category}
        </label>
      ))}
    </div>
  );
};

export default CategoriesFilters;
