import React, { useContext, useRef } from "react";
import "./CategoriesStyling.css";

import { GlobalValuesContext } from "../../Context/globalValuesContextProvider";
import { iGlobalValues } from "../../Types/globalVariablesTypes";
import CloseModules from "../CloseModules";

const CategoriesFilters = ({
  getCategories,
}: {
  getCategories: string[] | null;
}) => {
  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const { selectedCategories, setSelectedCategories, setDisplayCategories } =
    contextValues as iGlobalValues;

  let modelRef = useRef<HTMLDivElement | null>(null);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const category = event.target.value;
    if (event.target.checked) {
      if (category === "All") {
        setSelectedCategories(["All"]);
      } else {
        setSelectedCategories((prevCategories) => {
          // If "All" is currently selected, remove it.
          const newCategories = prevCategories.includes("All")
            ? [category]
            : [...prevCategories, category];
          return newCategories;
        });
      }
    } else {
      setSelectedCategories((prevCategories) => {
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

  const handleCloseCategories = () => {
    setDisplayCategories(false);
  };

  CloseModules({
    module_ref: modelRef,
    ft_close_module: handleCloseCategories,
  });

  return (
    <div className='_categories_container' ref={modelRef}>
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
