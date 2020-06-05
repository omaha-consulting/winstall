import React, {useState, useContext, useEffect} from "react";
import styles from "../styles/singleApp.module.scss";
import SelectedContext from "../ctx/SelectedContext";

import Link from "next/link";

import {
  FiExternalLink,
  FiDownload,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

import AppIcon from "./AppIcon";

let SingleApp = ({ app, showDesc=true, all }) => {
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
      
        if(all){
          app = all.find(i => app._id == i._id);
          setSelectedApps([...selectedApps, app]);
        } else{
          setSelectedApps([...selectedApps, app]);
        }
        
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
          <h3>
            <AppIcon name={app.name} icon={app.icon} />
            <p>{app.name}</p>
          </h3>
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
        <div>
          <h3>
            <AppIcon name={app.name} icon={app.icon} />
            <p>{app.name}</p>
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

                <Link href={`/apps/${app._id}`}>
                  <a>
                    <FiExternalLink />
                    View App
                  </a>
                </Link>
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
      </li>
    );
}

export default SingleApp;