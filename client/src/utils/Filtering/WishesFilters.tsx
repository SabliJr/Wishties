import React, { useContext } from "react";
import "./CategoriesStyling.css";

import { GlobalValuesContext } from "../../Context/globalValuesContextProvider";
import { iGlobalValues } from "../../Types/creatorSocialLinksTypes";

const WishesFilters = () => {
  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const { selectedFilter, setSelectedFilter, setDisplayFilters } =
    contextValues as iGlobalValues;

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFilter(event.target.value);
    setDisplayFilters(false);
  };

  return (
    <div className='_filters_container'>
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
