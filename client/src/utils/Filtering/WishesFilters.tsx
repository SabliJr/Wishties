import React, { useContext, useRef } from "react";
import "./CategoriesStyling.css";

import { GlobalValuesContext } from "../../Context/globalValuesContextProvider";
import { iGlobalValues } from "../../Types/globalVariablesTypes";
import CloseModules from "../CloseModules";

const WishesFilters = () => {
  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const { selectedFilter, setSelectedFilter, setDisplayFilters } =
    contextValues as iGlobalValues;
  let modelRef = useRef<HTMLDivElement | null>(null);

  const handleCloseFilters = () => {
    setDisplayFilters(false);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFilter(event.target.value);
    handleCloseFilters();
  };

  CloseModules({ module_ref: modelRef, ft_close_module: handleCloseFilters });

  return (
    <div className='_filters_container' ref={modelRef}>
      <label className='_filters_labels'>
        <input
          type='radio'
          value='Default'
          checked={selectedFilter === "Default"}
          onChange={handleFilterChange}
        />
        Default
      </label>
      <label className='_filters_labels'>
        <input
          type='radio'
          value='LowToHigh'
          checked={selectedFilter === "LowToHigh"}
          onChange={handleFilterChange}
        />
        Price: Low to High
      </label>
      <label className='_filters_labels'>
        <input
          type='radio'
          value='HighToLow'
          checked={selectedFilter === "HighToLow"}
          onChange={handleFilterChange}
        />
        Price: High to Low
      </label>
      <label className='_filters_labels'>
        <input
          type='radio'
          value='MostRecent'
          checked={selectedFilter === "MostRecent"}
          onChange={handleFilterChange}
        />
        Most Recent
      </label>
      <label className='_filters_labels'>
        <input
          type='radio'
          value='Oldest'
          checked={selectedFilter === "Oldest"}
          onChange={handleFilterChange}
        />
        Oldest
      </label>
    </div>
  );
};

export default WishesFilters;
