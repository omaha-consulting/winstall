import { useState, useEffect } from "react";
import styles from "../styles/listSort.module.scss";
import { FiChevronDown } from "react-icons/fi";

const ListSort = ({apps, defaultSort, onSort}) => {
    const [sort, setSort] = useState("");

    useEffect(() => {
      if(!sort){
        setSort(defaultSort);
      }
    })

    let onSortSelected = (e) => {
      let sortChoice = e.target.value;
      setSort(sortChoice);
      applySort(apps, sortChoice);
      onSort(sortChoice);
    };

    return (
      <div className={styles.sort}>
        <label htmlFor="sort">Sort by</label>
        <select id="sort" value={sort} onChange={(e) => onSortSelected(e)}>
          <option value="update-desc">Recently Updated (Newest First)</option>
          <option value="update-asc">Recently Updated (Oldest First)</option>
          <option value="name-asc">Name (Ascending)</option>
          <option value="name-desc">Name (Descending)</option>
        </select>
        <FiChevronDown/>
      </div>
    );
}

function applySort(apps, sortChoice) {
  if (sortChoice === "name-asc") {
    apps.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortChoice === "name-desc") {
    apps.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortChoice === "update-desc") {
    // because the updatedAt values are in ISO, we can just to lexographical comparison
    apps.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } else if (sortChoice === "update-asc") {
    apps.sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
  } else {
    throw new Error("Invalid sortChoice: " + sortChoice);
  }
};

module.exports = {
  ListSort,
  applySort
};