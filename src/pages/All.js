import React, { useContext, useState, useEffect } from "react";
import styles from "../styles/all.module.scss";

import { useIndexedDB } from "react-indexed-db";
import SelectedContext from "../utils/SelectedContext";
import { DebounceInput } from "react-debounce-input";
import fuzzysort from "fuzzysort"

import Error from "../components/Error";
import ListPackages from "../components/ListPackages";
import SingleApp from "../components/SingleApp";
import PackageContext from "../utils/PackageContext";

function All() {
    const { selectedApps, setSelectedApps } = useContext(SelectedContext);
    const packageData = useContext(PackageContext);
    let localData = useIndexedDB("packages")
    let [apps, setApps] = useState()
    const [searchInput, setSearchInput] = useState();
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        if(apps) return;

        getApps();
    })

    const getApps = () => {
        localData.getAll().then(async (items) => {
            setApps(items);
            setTotalCount(items.length);
        })
    }

    const handleSearchInput = (e) => {
        setSearchInput(e.target.value);

        if(e.target.value === ""){
            getApps();
            return;
        }

        let results = fuzzysort.go(e.target.value.toLowerCase().replace(/\s/g, ""), apps, {
            limit: Infinity,
            allowTypo: true,
            threshold: -10000,
            key: "path",
        })

        results = [...results.map(r => r.obj)];

        results.sort((a, b) => a.path.localeCompare(b.path))
        
        setApps(results)
    };

    if(!apps) return <></>;

    return (
        <div className="container">
             <h1>All Apps</h1>
             <h3>Due to API limitations, you will not be able to see the details of all of the apps below right away.</h3>
            <DebounceInput
                minLength={2}
                debounceTimeout={100}
                onChange={(e) => handleSearchInput(e)}
                placeholder="Search for apps here"
            />
            {
                apps.length === totalCount ? <p>Showing a total of {totalCount} apps.</p> : <p>Showing {apps.length} out of {totalCount} apps.</p>
            }
             <ul className={styles.all}>
                {apps.map((app) => (
                    <li key={app.path}>
                        <h3>{app.path.split("/")[1]}</h3>
                        <p>{app.path.split("/")[0]}</p>
                        <button className="button">Select</button>
                    </li>
                ))}
             </ul>
             
        </div>
    );
}

export default All;
