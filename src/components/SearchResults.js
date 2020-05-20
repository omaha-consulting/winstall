import React, { useState, useEffect } from "react";
import SingleApp from "../components/SingleApp";
import processManifests from "../utils/processManifests";
import { sortArray, sanitize } from "../utils/helpers";
import { useIndexedDB } from "react-indexed-db";

import styles from "../styles/search.module.scss";


let SearchResults = ({results, packages}) => {
    const [appsData, setAppsData] = useState([]);
    const localData = useIndexedDB("packages")

    useEffect(() => {
        if (!results) return;
        results.map(async ({ obj }) => {
            console.log(obj)
            // let app = packages.find((i) => i.path === obj.path);

            // if (!app.contents) {
            //     processManifests(obj).then((newData) => {
            //         app.contents = newData;
            //         localData.update({ ...obj, contents: newData }, obj.path);
            //         setAppsData((oldArray) => sortArray([...oldArray, app]));
            //     });
            // } else {
            //     setAppsData(oldArray => sortArray([...oldArray, app]));
            // }
        });

    }, [])

    if (!results || results.length === 0) return <></>;

    return (
        <ul className={styles.searchResults}>
            {appsData.map((app, index) => (
                <React.Fragment key={index}>
                    <SingleApp app={sanitize(app)} />
                </React.Fragment>
            ))}
        </ul>
    );
}

export default SearchResults;