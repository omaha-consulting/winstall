import React, {useState, useContext, useEffect} from "react";
import styles from "../styles/singleApp.module.scss";
import SelectedContext from "../ctx/SelectedContext";

import {
  FiExternalLink,
  FiDownload,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

let SingleApp = ({ app, showDesc=true }) => {
    const [selected, setSelected] = useState(false);
    const { selectedApps, setSelectedApps } = useContext(SelectedContext);
    const [viewingDesc, setViewingDesc] = useState(false);

    useEffect(() => {
      let found = selectedApps.findIndex((a) => a.id === app.id) !== -1;

      setSelected(found)
    }, [selectedApps, app.id])

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

    let toggleDescription = (e, status) => {
      e.stopPropagation();
      setViewingDesc(status);
    };

    if(!app.contents && !app.img) return <></>

    if (showDesc && !app.img && app.contents.Description && viewingDesc) {
      return (
        <li
          key={app.id}
          onClick={handleAppSelect}
          className={selected ? styles.selected : ""}
        >
          <h3>{app.contents.Name}</h3>
          <p>{app.contents.Description}</p>
          <button
            onClick={(e) => toggleDescription(e, false)}
            className={styles.subtle}
          >
            Hide Description
            <FiChevronUp />
          </button>
        </li>
      );
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
                src={require(`../assets/apps/${app.img}`)}
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
                {app.contents.Description && (
                  <button
                    onClick={(e) => toggleDescription(e, true)}
                    className={styles.subtle}
                  >
                    View Description
                    <FiChevronDown />
                  </button>
                )}

                <div className={styles.controls}>
                  {app.contents.Homepage && (
                    <a
                      href={`${app.contents.Homepage}?ref=winstall`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FiExternalLink />
                      View Site
                    </a>
                  )}
                  {app.contents.Installers && (
                    <a
                      href={`${app.contents.Installers[0].Url}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FiDownload />
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