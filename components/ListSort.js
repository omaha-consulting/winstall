import { useState, useEffect } from "react";
import styles from "../styles/listSort.module.scss";

const ListSort = ({apps, defaultSort, onSort}) => {
    const [sort, setSort] = useState("");

    useEffect(() => {
      setSort(defaultSort);
    })

    let handleSort = (e) => {
      let sortChoice = e.target.value;
      setSort(sortChoice);
      
      if (sortChoice === "name-asc") {
        apps.sort((a, b) => b.name.localeCompare(a.name));
      } else if (sortChoice === "name-desc") {
        apps.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortChoice === "update-desc") {
        // because the updatedAt values are in ISO, we can just to lexographical comparison
        apps.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      } else if (sortChoice === "update-asc") {
        apps.sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
      }

      onSort(sortChoice);
    };

    return (
      <div className={styles.sort}>
        <p>Sort by</p>
        <select value={sort} onChange={(e) => handleSort(e)}>
          <option value="name-desc">Name (Descending)</option>
          <option value="name-asc">Name (Ascending)</option>
          <option value="update-desc">Recently Updated (Newer First)</option>
          <option value="update-asc">Recently Updated (Older First)</option>
        </select>
      </div>
    );
}

export default ListSort;