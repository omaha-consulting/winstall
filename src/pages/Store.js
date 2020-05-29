import React, { useState, useEffect } from "react";
import styles from "../styles/store.module.scss";

import { useIndexedDB } from "react-indexed-db";
import { DebounceInput } from "react-debounce-input";
import { useHistory } from "react-router-dom";

import fuzzysort from "fuzzysort"
import qs from "qs";

import SelectionBar from "../components/SelectionBar";

import SingleApp from "../components/SingleApp";
import processManifests from "../utils/processManifests";
import { sanitize } from "../utils/helpers";
import Footer from "../components/Footer";

import PropagateLoader from "react-spinners/PropagateLoader";

import {
  FiRotateCcw,
  FiInfo,
  FiChevronLeft,
  FiChevronRight,
  FiArrowLeftCircle,
  FiArrowRightCircle,
} from "react-icons/fi";

function Store({ location }) {
    let localData = useIndexedDB("packages")
    const history = useHistory();

    const [apps, setApps] = useState([])
    const [searchInput, setSearchInput] = useState();
    const [totalApps, setTotalApps] = useState([])
    const [loading, setLoading] = useState(true);
    const [appCount, setAppCount] = useState(0);
    const [offset, setOffset] = useState(0);
    const appsPerPage = 60;
    
    useEffect(() => {
      getApps();   

      document.addEventListener("keydown", (e) => {
        if(e.keyCode === 39){
          let nextBtn = document.getElementById("next");

          if (nextBtn) {
            document.getElementById("next").click();
          }
        } else if(e.keyCode === 37){
          let previousBtn = document.getElementById("previous");

          if(previousBtn){
            document.getElementById("previous").click();
          }
        }
      })

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setPagination = (appCount) => {
      if (location) {
        let requestedPage = qs.parse(location.search, {
          ignoreQueryPrefix: true,
        }).page;

        if (requestedPage) {
          let maxPages = Math.round(appCount / appsPerPage) + 1;

          // we check if its a valid page number
          if (requestedPage > maxPages || requestedPage < 2) return;

          // if it is, we continue
          let calculateOffset = appsPerPage * (requestedPage-1);
          setOffset(calculateOffset)
        }
      }
    }

    const getApps = () => {
        localData.getAll().then(async (items) => {
            
            setAppCount(items.length)

            if(items.length === 0 ){
                getApps();
                return;
            }

          
            items.map((i) => {
                if(!i.loaded){ // if it already doesn't have a laoded value, we set it to false
                    i.loaded = false;
                }

                // if there is content, that means we have it in cache
                if (i.contents !== ""){
                    i.loaded = true;
                }

                i.loading = false;

                return i;
            });

            // we put the items that are loaded first, and then by alphabetical order
            items.sort((a, b) => ((a.loaded === b.loaded) ? 0 : a.loaded ? -1 : 1) || (a.path.split("/")[1].localeCompare(b.path.split("/")[1])))
            setTotalApps(items);
            setApps(items);
            setLoading(false);
            setPagination(items.length);
        })
    }

    const handleSearchInput = (e) => {
        setSearchInput(e.target.value);

        setOffset(0);
        history.replace("/store")

        if(e.target.value === ""){
            getApps();
            return;
        }

        let results = fuzzysort.go(e.target.value.toLowerCase().replace(/\s/g, ""), totalApps, {
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
                
                let items = [...totalApps, app];
                items.sort((a, b) => ((a.loaded === b.loaded) ? 0 : a.loaded ? -1 : 1) || (a.path.split("/")[1].localeCompare(b.path.split("/")[1])))
                setTotalApps(items);
            });
        }  else{
            app.loaded = true;
            app.loading = false;
            let items = [...totalApps, app];
            items.sort((a, b) => ((a.loaded === b.loaded) ? 0 : a.loaded ? -1 : 1) || (a.path.split("/")[1].localeCompare(b.path.split("/")[1])))
            setTotalApps(items);
        }
    }

    const clearCache = () => {
      if(window.confirm("Are you sure you want to clear the local cache and reload all app data?")){
        setLoading(true);
        localData.clear().then(async () => {
          await localStorage.setItem("winstallRehydro", new Date());
          window.location.reload()
        });
      }
    }

    let handleNext = () => {
      window.scrollTo(0, 0)
      setOffset(offset => offset + appsPerPage);
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        history.replace(
          `/store?page=${Math.round((offset + appsPerPage) / appsPerPage) + 1}`
        );
      }, 200);
    }

    let handlePrevious = () => {
      window.scrollTo(0, 0)
      setOffset(offset => offset - appsPerPage);
      setLoading(true)

      setTimeout(() => {
        setLoading(false);

        history.replace(
          `/store?page=${Math.round((offset + appsPerPage) / appsPerPage) - 1}`
        );
      }, 200);
    }

    let LoadApp = ({ app }) => {
        const [loading, setLoading] = useState(false);

        return (
          <li
            className={styles.notReady}
            onClick={() => {
              setLoading(true);
              selectivePull(app);
            }}
          >
            <h3>{app.path.split("/")[1]}</h3>
            <h4>{app.path.split("/")[0]}</h4>
            <button
              className="subtle"
              disabled={loading}
            
            >
              <FiInfo/>{loading ? "Loading..." : "Click to view"}
            </button>
          </li>
        );
    }
    if(!apps) return <></>;

    return (
      <div className="container">
        <h1>All Apps {`(${appCount})`}</h1>
        <h3>
          You can browse all the apps available on the Windows Package Manager
          below. Click an app to view more details about it.
        </h3>

        <div className={styles.controls}>
          <DebounceInput
            minLength={2}
            debounceTimeout={200}
            onChange={(e) => handleSearchInput(e)}
            value={searchInput}
            placeholder="Search for apps here"
            className="search"
          />
          <button className={styles.btn} onClick={clearCache}>
            <FiRotateCcw />
            Clear cache
          </button>
        </div>

        {!searchInput && (
          <p>
            Showing {apps.slice(offset, offset + appsPerPage).length} apps (page{" "}
            {Math.round(offset / appsPerPage) + 1} of{" "}
            {Math.round(appCount / appsPerPage) + 1}).
          </p>
        )}
        {searchInput && (
          <p>
            Showing {apps.length} search{" "}
            {apps.length === 1 ? "result" : "results"}.
          </p>
        )}

        {loading ? (
          <div className={styles.loader}>
            <PropagateLoader color="#9b2eff" />
          </div>
        ) : (
          <>
            <ul className={styles.all}>
              {apps
                .slice(offset, offset + appsPerPage)
                .map((app) =>
                  app.loaded ? (
                    <SingleApp app={sanitize(app)} key={app.contents.Id} />
                  ) : (
                    <LoadApp app={app} key={app.path} />
                  )
                )}
            </ul>

            <div className={styles.pagination}>
              <div className={styles.pagbtn}>
                <button
                  className="button"
                  id="previous"
                  onClick={handlePrevious}
                  disabled={offset > 0 ? null : "disabled"}
                >
                  <FiChevronLeft />
                  Previous
                </button>
                <button
                  className="button"
                  id="next"
                  onClick={handleNext}
                  disabled={
                    offset + appsPerPage < totalApps.length ? null : "disabled"
                  }
                >
                  Next
                  <FiChevronRight />
                </button>
              </div>
              <em>
                Tip! Hit the <FiArrowLeftCircle /> and <FiArrowRightCircle />{" "}
                keys on your keyboard to navigate between pages quickly.
              </em>
            </div>
          </>
        )}

        <Footer />
        <SelectionBar />
      </div>
    );
}

export default Store;
