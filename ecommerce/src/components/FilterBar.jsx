import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCategory,
  setSortBy,
  selectCategory,
  selectSortBy,
  selectCategories,
} from "../store/slices/productsSlice";
import "./FilterBar.css";

const FilterBar = () => {
  const dispatch = useDispatch();
  const category = useSelector(selectCategory);
  const sortBy = useSelector(selectSortBy);
  const categories = useSelector(selectCategories);

  return (
    <div className="filter-bar">
      <div className="filter-categories">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-chip ${category === cat ? "active" : ""}`}
            onClick={() => dispatch(setCategory(cat))}
          >
            {cat}
          </button>
        ))}
      </div>
      <select
        className="sort-select"
        value={sortBy}
        onChange={(e) => dispatch(setSortBy(e.target.value))}
      >
        <option value="default">Sort: Default</option>
        <option value="price-asc">Price: Low → High</option>
        <option value="price-desc">Price: High → Low</option>
        <option value="rating">Top Rated</option>
      </select>
    </div>
  );
};

export default FilterBar;
