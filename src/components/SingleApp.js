import React, {useState, useContext, useEffect} from "react";
import styles from "../styles/singleApp.module.scss";
import SelectedContext from "../ctx/SelectedContext";
import { sanitize } from "../utils/helpers";

let SingleApp = ({ app, showDesc=true }) => {
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

    let openExtLink = (e, link) => {
      e.stopPropagation();
    }

    if(!app.contents && !app.img) return <></>

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
            <h3>{app.contents.Name}</h3>
            <h4>
              {app.contents.Publisher ? `by ${app.contents.Publisher}` : ""}
            </h4>
            <em>{app.contents.Version ? `v${app.contents.Version}` : ""}</em>
            {showDesc && (
              <div>
                {app.contents.Description && <p>{app.contents.Description}</p>}

                <div className={styles.controls}>
                  {app.contents.Homepage && (
                    <a
                      href={`${app.contents.Homepage}?ref=winstall`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => openExtLink(e, app.contents.Homepage)}
                    >
                      View Site
                    </a>
                  )}
                  {app.contents.Installers && (
                    <a
                      href={`${app.contents.Installers[0].Url}`}
                      onClick={(e) => openExtLink(e, app.contents.Homepage)}
                    >
                      Download{" "}
                      {app.contents.InstallerType
                        ? `.${app.contents.InstallerType.toLowerCase()}`
                        : "App"}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </li>
    );
}

export default SingleApp;