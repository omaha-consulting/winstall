import React, {useState, useContext, useEffect} from "react";
import styles from "../styles/singleApp.module.scss";
import SelectedContext from "../ctx/SelectedContext";
import moment from "moment";

import Link from "next/link";

import {
  FiExternalLink,
  FiDownload,
  FiChevronDown,
  FiChevronUp,
  FiPackage,
  FiPlus,
  FiX,
  FiClock,
  FiCode
} from "react-icons/fi";


import AppIcon from "./AppIcon";
import { compareVersion } from "../utils/helpers";

let SingleApp = ({ app, all, onVersionChange = false }) => {
  const [selected, setSelected] = useState(false);
  const { selectedApps, setSelectedApps } = useContext(SelectedContext);

  const [version, setVersion] = useState(app.latestVersion);

  if (!app.selectedVersion) app.selectedVersion = version;

  if (app.versions.length > 1) {
    app.versions = app.versions.sort((a, b) =>
      compareVersion(b.version, a.version)
    );
  }

  useEffect(() => {
    let found = selectedApps.find((a) => a._id === app._id);

    if (!found) return;

    if (found.selectedVersion !== app.latestVersion) {
      setVersion(found.selectedVersion);
    }

    setSelected(true);
  }, [selectedApps, app._id]);

  let handleAppSelect = () => {
    let found = selectedApps.findIndex((a) => a._id === app._id);

    if (found !== -1) {
      let updatedSelectedApps = selectedApps.filter(
        (a, index) => index !== found
      );

      setSelectedApps(updatedSelectedApps);
      setSelected(false);
    } else {
      setSelected(true);

      if (all) {
        app = all.find((i) => app._id == i._id);
        setSelectedApps([...selectedApps, app]);
      } else {
        setSelectedApps([...selectedApps, app]);
      }
    }

  };

  if (!app && !app.img) return <></>;

  let VersionSelector = () => {
    return (
      <div className={styles.versions}>
        <select
          className={styles.versionSelector}
          value={version}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            setVersion(e.target.value);
            app.selectedVersion = e.target.value;

            if (selected) {
              let found = selectedApps.find((a) => a._id === app._id);
              found.selectedVersion = e.target.value;

              if(onVersionChange) onVersionChange();
            }
          }}
        >
          {app.versions.map((v) => {
            return (
              <option key={v.version} value={v.version}>
                v{v.version}
              </option>
            );
          })}
        </select>
        {app.versions.length > 1 && (
          <span>
            ({app.versions.length - 1} other{" "}
            {app.versions.length - 1 > 1 ? "versions" : "version"} available)
          </span>
        )}
      </div>
    );
  };

  return (
    <li
      key={app._id}
      // onClick={handleAppSelect}
      className={`${styles.single} ${selected ? styles.selected : ""}`}
    >
      <div>
        <h3>
          <AppIcon name={app.name} icon={app.icon} />
          <Link href="/apps/[id]" as={`/apps/${app._id}`}><a>{app.name}</a></Link>
        </h3>

        <Description desc={app.desc} />

        <ul className={styles.metaData}>
          <li className={ styles.noHover}>
            <FiClock />
            <span>Last updated {moment(app.updatedAt).fromNow()}</span>
          </li>

          <li className={app.versions.length === 1 ? styles.noHover : ""}>
            <FiPackage />
            {app.versions.length > 1 ? (
              <VersionSelector />
            ) : (
              <span>v{app.selectedVersion}</span>
            )}
          </li>

          <li>
            <Link href={`/publishers?name=${app.publisher}`}>
              <a>
                <FiCode />
                by {app.publisher}
              </a>
            </Link>
          </li>

          {app.homepage && (
            <li>
              <a
                href={`${app.homepage}?ref=winstall`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <FiExternalLink />
                View Site
              </a>
            </li>
          )}

          <li>
            <a
              href={`${
                app.versions.find((i) => i.version === app.selectedVersion)
                  .installers[0]
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <FiDownload />
              Download{" "}
              {app.versions[0].installerType
                ? `.${app.versions[0].installerType.toLowerCase()}`
                : "App"}
            </a>
          </li>
        </ul>

        <button className={styles.selectApp} onClick={handleAppSelect}>
          {selected ? <FiX /> : <FiPlus />}
          {selected ? "Unselect" : "Select"} app
        </button>
      </div>
    </li>
  );
};

const Description = ({ desc }) => {
  const [descTrimmed, setDescTrimmed] = useState(desc.length > 140);

  let toggleDescription = (e, status) => {
    e.stopPropagation();
    setDescTrimmed(status);
  };

  if(!desc) return <p>No description available for this app.</p>


  return (
    <>
      <p>
        {desc.length > 140
          ? !descTrimmed
            ? desc
            : `${desc.substr(0, 140).replace(/(^[\s]+|[\s]+$)/g, "")}...`
          : desc}
      </p>

      {desc.length > 140 && (
        <button
          onClick={(e) => toggleDescription(e, !descTrimmed)}
          className={styles.subtle}
        >
          {descTrimmed ? (
            <>
              Full Description
              <FiChevronDown />
            </>
          ) : (
            <>
              Hide Description
              <FiChevronUp />
            </>
          )}
        </button>
      )}
    </>
  );
};

export default SingleApp;