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
import processManifests from "../utils/processManifests";
import { sortArray, sanitize } from "../utils/helpers";

function All() {
    let localData = useIndexedDB("packages")
    const { selectedApps, setSelectedApps } = useContext(SelectedContext);
    const packageData = useContext(PackageContext);
    const [apps, setApps] = useState([])
    const [searchInput, setSearchInput] = useState();
    const [totalApps, setTotalApps] = useState([])

    useEffect(() => {
        if(apps.length !== 0) return;

        getApps();
    })

    const getApps = () => {
        localData.getAll().then(async (items) => {
            items.map((i) => {
                if(!i.loaded){ // if it already doesn't have a laoded value, we set it to false
                    i.loaded = false;
                }

                // if there is content, that means we have it in cache
                if (i.contents !== ""){
                    i.loaded = true;
                }

                i.loading = false;
            });

            // we put the items that are loaded first, and then by alphabetical order
            items.sort((a, b) => ((a.loaded === b.loaded) ? 0 : a.loaded ? -1 : 1) || (a.path.split("/")[1].localeCompare(b.path.split("/")[1])))

            setApps(items);
            setTotalApps(items);
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

    const selectivePull = (obj) => {
        let app = totalApps.find((i) => i.path === obj.path);

        if (!app.contents) {
            processManifests(obj).then((newData) => {
                app.contents = newData;
                localData.update({ ...obj, contents: newData }, obj.path);
                app.loaded = true;
                app.loading = false;
                setTotalApps((oldArray) => sortArray([...oldArray, app]));
            });
        }  else{
            app.loaded = true;
            app.loading = false;
            setTotalApps((oldArray) => sortArray([...oldArray, app]));
        }

       
    }

    let LoadApp = ({ app }) => {
        const [loading, setLoading] = useState(false);


        return (
            <li>
                <h3>{app.path.split("/")[1]}</h3>
                <p>{app.path.split("/")[0]}</p>
                <button className="button" disabled={loading} onClick={() => {
                    setLoading(true)
                    selectivePull(app)
                }}>{loading ? "Loading..." : "Load details"}</button>
            </li>
        )
    }
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
    
            <ul className={styles.all}>
                {apps.map((app) => app.loaded ? (
                    <SingleApp app={sanitize(app)} key={app.contents.Id}/>
                ) : (
                    <LoadApp app={app} key={app.path}/>
                ))}
            </ul>
             
        </div>
    );
}

export default All;
