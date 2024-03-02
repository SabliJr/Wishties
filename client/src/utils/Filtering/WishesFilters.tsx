import React, { useContext, useState } from "react";
import "./CategoriesStyling.css";

import { useCreatorData } from "../../Context/CreatorDataProvider";
import { iCreatorDataProvider } from "../../Types/creatorStuffTypes";
import { iGlobalValues } from "../../Types/globalVariablesTypes";
import { GlobalValuesContext } from "../../Context/globalValuesContextProvider";

const WishesFilters = () => {
  const [filter, setFilter] = useState("Default");

  let { setSelectedFilter } = useCreatorData() as iCreatorDataProvider;
  const contextValues = useContext<Partial<iGlobalValues>>(GlobalValuesContext);
  const { setSelectedFilter: setGlobalSelectedFilter } =
    contextValues as iGlobalValues;

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  setSelectedFilter(filter);
  setGlobalSelectedFilter(filter);

  return (
    <div className='_filters_container'>
      <label className='_filters_labels'>
        <input
          type='radio'
          value='Default'
          checked={filter === "Default"}
          onChange={handleFilterChange}
        />
        Default
      </label>
      <label className='_filters_labels'>
        <input
          type='radio'
          value='LowToHigh'
          checked={filter === "LowToHigh"}
          onChange={handleFilterChange}
        />
        Price: Low to High
      </label>
      <label className='_filters_labels'>
        <input
          type='radio'
          value='HighToLow'
          checked={filter === "HighToLow"}
          onChange={handleFilterChange}
        />
        Price: High to Low
      </label>
      <label className='_filters_labels'>
        <input
          type='radio'
          value='MostRecent'
          checked={filter === "MostRecent"}
          onChange={handleFilterChange}
        />
        Most Recent
      </label>
      <label className='_filters_labels'>
        <input
          type='radio'
          value='Oldest'
          checked={filter === "Oldest"}
          onChange={handleFilterChange}
        />
        Oldest
      </label>
    </div>
  );
};

export default WishesFilters;
