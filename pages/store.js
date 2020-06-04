import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/store.module.scss";

import { DebounceInput } from "react-debounce-input";

import fuzzysort from "fuzzysort"
import qs from "qs";

import SelectionBar from "../components/SelectionBar";

import SingleApp from "../components/SingleApp";
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
import PackagesContext from "../ctx/PackagesContext";

function Store({ location }) {

    const [apps, setApps] = useState([])
    const [searchInput, setSearchInput] = useState();
    const { packages, setPackages } = useContext(PackagesContext);
    const [offset, setOffset] = useState(0);
    const appsPerPage = 60;
    
    useEffect(() => {

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

      setPagination(packages.length)

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


    const handleSearchInput = (e) => {
        setSearchInput(e.target.value);

        setOffset(0);
        // history.replace("/store")

        let results = fuzzysort.go(e.target.value.toLowerCase().replace(/\s/g, ""), packages, {
            limit: Infinity,
            allowTypo: true,
            threshold: -10000,
            key: "path",
        })

        results = [...results.map(r => r.obj)];

        results.sort((a, b) => a.path.localeCompare(b.path))
        
        setApps(results)
    };


    let handleNext = () => {
      window.scrollTo(0, 0)
      setOffset(offset => offset + appsPerPage);

      // setTimeout(() => {
      //   history.replace(
      //     `/store?page=${Math.round((offset + appsPerPage - 1) / appsPerPage) + 1}`
      //   );
      // }, 200);
    }

    let handlePrevious = () => {
      window.scrollTo(0, 0)
      setOffset(offset => offset - appsPerPage);

      // setTimeout(() => {

      //   history.replace(
      //     `/store?page=${Math.round((offset + appsPerPage - 1) / appsPerPage)-1}`
      //   );
      // }, 200);
    }

  
    if(!apps) return <></>;

    return (
      <div className="container">
        <h1>All Apps {`(${packages.length})`}</h1>
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
        </div>

        {!searchInput && (
          <p>
            Showing {packages.slice(offset, offset + appsPerPage).length} apps
            (page {Math.round((offset + appsPerPage - 1) / appsPerPage)} of{" "}
            {Math.round((packages.length + appsPerPage - 1) / appsPerPage)}).
          </p>
        )}
        {searchInput && (
          <p>
            Showing {apps.length} search{" "}
            {apps.length === 1 ? "result" : "results"}.
          </p>
        )}

        {searchInput && (
          <ul className={`${styles.all} ${styles.storeList}`}>
            {apps.map((app) => (
              <SingleApp app={app} showDesc={true} key={app._id} />
            ))}
          </ul>
        )}

        {!searchInput && (
          <ul className={`${styles.all} ${styles.storeList}`}>
            {packages.slice(offset, offset + appsPerPage).map((app) => (
              <SingleApp app={app} showDesc={true} key={app._id} />
            ))}
          </ul>
        )}

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
                offset + appsPerPage < packages.length ? null : "disabled"
              }
            >
              Next
              <FiChevronRight />
            </button>
          </div>
          <em>
            Tip! Hit the <FiArrowLeftCircle /> and <FiArrowRightCircle /> keys
            on your keyboard to navigate between pages quickly.
          </em>
        </div>

        <Footer />
        <SelectionBar />
      </div>
    );
}

export default Store;
