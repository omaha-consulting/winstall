import React, {useState, useContext, useEffect} from "react";
import styles from "../styles/singleApp.module.scss";
import SelectedContext from "../utils/SelectedContext";

let SingleApp = ({ app }) => {
    const [selected, setSelected] = useState(false);
    const { selectedApps, setSelectedApps } = useContext(SelectedContext);

    useEffect(() => {
      let found = selectedApps.findIndex((a) => a.id === app.id) !== -1;

      setSelected(found)
    })

    let handleAppSelect = () => {
      let found = selectedApps.findIndex((a) => a.id === app.id);

      if (found !== -1) {
        let updatedSelectedApps = selectedApps.filter(
          (a, index) => index !== found
        );

        setSelectedApps(updatedSelectedApps);
        setSelected(false)
      } else{
        setSelectedApps([...selectedApps, app]);
        setSelected(true)
      }
     
    }

    return (
      <li
        key={app.id}
        onClick={handleAppSelect}
        className={selected ? styles.selected : ""}
      >
        {app.img && (
          <div>
            <div className={styles.imgContainer}>
              <img
                src={app.img}
                alt={`Logo for ${app.name}`}
                draggable={false}
              />
              {selected}
            </div>
            <h3 className={styles.imgHeader}>{app.name}</h3>
          </div>
        )}

        {!app.img && (
          <div>
            <h3>{app.name}</h3>
            <h4>{app.publisher ? `by ${app.publisher}` : ""}</h4>
            <em>{app.version ? `v${app.version}`: ""}</em>
          </div>
        )}
      </li>
    );
}

export default SingleApp;