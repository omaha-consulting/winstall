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
      let found = selectedApps.findIndex((a) => a._id === app._id) !== -1;

      setSelected(found)
    }, [selectedApps, app._id])

    let handleAppSelect = () => {
      let found = selectedApps.findIndex((a) => a._id === app._id);

      if (found !== -1) {
        let updatedSelectedApps = selectedApps.filter(
          (a, index) => index !== found
        );

        setSelectedApps(updatedSelectedApps);
        setSelected(false)
      } else{
        setSelected(true);
        setSelectedApps([...selectedApps, app]);
      }
    }

    let toggleDescription = (e, status) => {
      e.stopPropagation();
      setViewingDesc(status);
    };

    if(!app && !app.img) return <></>

    if (showDesc && !app.img && app.desc && viewingDesc) {
      return (
        <li
          key={app._id}
          onClick={handleAppSelect}
          className={`${styles.single} ${selected ? styles.selected : ""}`}
        >
          <h3>{app.name}</h3>
          <p>{app.desc}</p>
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
        key={app._id}
        onClick={handleAppSelect}
        className={`${styles.single} ${selected ? styles.selected : ""}`}
      >
        {app.img && (
          <div>
            <div className={styles.imgContainer}>
              <picture>
                <source srcSet={`./assets/apps/${app.img}`} type="image/webp" />
                <source
                  srcSet={`./assets/apps/fallback/${app.img.replace(
                    "webp",
                    "png"
                  )}`}
                  type="image/png"
                />
                <img
                  src={`./assets/apps/fallback/${app.img.replace(
                    "webp",
                    "png"
                  )}`}
                  alt={`Logo for ${app.name}`}
                  draggable={false}
                />
              </picture>
            </div>
            <h3 className={styles.imgHeader}>{app.name}</h3>
          </div>
        )}

        {!app.img && (
          <div>
            <h3>
              {app.icon ? (
                <img
                  src={app.icon}
                  draggable={false}
                  alt={`Logo for ${app.name}`}
                />
              ) : (
                ""
              )}{" "}
              {app.name}
            </h3>
            <h4>{app.publisher ? `by ${app.publisher}` : ""}</h4>
            <em>{app.latestVersion ? `v${app.latestVersion}` : ""}</em>
            {showDesc && (
              <div>
                {app.desc && (
                  <button
                    onClick={(e) => toggleDescription(e, true)}
                    className={styles.subtle}
                  >
                    View Description
                    <FiChevronDown />
                  </button>
                )}

                <div className={styles.controls}>
                  {app.homepage && (
                    <a
                      href={`${app.homepage}?ref=winstall`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FiExternalLink />
                      View Site
                    </a>
                  )}
                  {/* {app.contents.Installers && (
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
                  )} */}
                </div>
              </div>
            )}
          </div>
        )}
      </li>
    );
}

export default SingleApp;