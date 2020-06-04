import React, { useState, useEffect } from "react";
import styles from "../styles/store.module.scss";

import { DebounceInput } from "react-debounce-input";

import fuzzysort from "fuzzysort"
import qs from "qs";

import SelectionBar from "../components/SelectionBar";

import SingleApp from "../components/SingleApp";
import Footer from "../components/Footer";

import {
  FiChevronLeft,
  FiChevronRight,
  FiArrowLeftCircle,
  FiArrowRightCircle,
} from "react-icons/fi";

import Router from "next/router";

function Store({ apps }) {
    const [results, setResults] = useState([])
    const [searchInput, setSearchInput] = useState();
    const [offset, setOffset] = useState(0);
    const appsPerPage = 60;

    const totalPages = Math.ceil(apps.length / appsPerPage);


    useEffect(() => {
      let handlePagination = (e) => {
        if (e.keyCode === 39) {
          let nextBtn = document.getElementById("next");

          if (nextBtn) {
            document.getElementById("next").click();
          }
        } else if (e.keyCode === 37) {
          let previousBtn = document.getElementById("previous");

          if (previousBtn) {
            document.getElementById("previous").click();
          }
        }
      }

      document.addEventListener("keydown", handlePagination)

      setPagination(apps.length)

      return () => document.removeEventListener("keydown", handlePagination)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setPagination = (appCount) => {
      let requestedPage = parseInt(Router.query.page); 
      if (requestedPage) { 
        let maxPages = Math.round(appCount / appsPerPage) + 1;

        // we check if its a valid page number
        if (requestedPage > maxPages || requestedPage < 2) return;

        // if it is, we continue
        let calculateOffset = appsPerPage * (requestedPage-1);
        setOffset(calculateOffset)

      }
    }


    const handleSearchInput = (e) => {
        setSearchInput(e.target.value);

        setOffset(0);
        
        Router.replace("/store");

        let results = fuzzysort.go(e.target.value.toLowerCase().replace(/\s/g, ""), apps, {
            limit: Infinity,
            allowTypo: true,
            threshold: -10000,
            key: "path",
        })

        results = [...results.map(r => r.obj)];

        results.sort((a, b) => a.path.localeCompare(b.path))
        
        setResults(results)
    };


    let handleNext = () => {
      window.scrollTo(0, 0)
      setOffset(offset => offset + appsPerPage);

      Router.replace({
        pathname: "/store",
        query: {
          page: Math.round((offset + appsPerPage - 1) / appsPerPage) + 1,
        },
      });
    }

    let handlePrevious = () => {
      window.scrollTo(0, 0)
      setOffset(offset => offset - appsPerPage);

      Router.replace({
        pathname: "/store",
        query: {
          page: Math.round((offset + appsPerPage - 1) / appsPerPage) - 1,
        },
      });
    }

    let Pagination = ({ small }) => {
      return (
        <div className={small ? styles.minPagination : styles.pagbtn}>
          <button
            className={`button ${small ? styles.smallBtn : null}`}
            id="previous"
            onClick={handlePrevious}
            title="Previous page of apps"
            disabled={offset > 0 ? null : "disabled"}
          >
            <FiChevronLeft />
            {!small ? "Previous" : ""}
          </button>
          <button
            className={`button ${small ? styles.smallBtn : null}`}
            id="next"
            title="Next page of apps"
            onClick={handleNext}
            disabled={offset + appsPerPage < apps.length ? null : "disabled"}
          >
            {!small ? "Next" : ""}
            <FiChevronRight />
          </button>
        </div>
      );
    }

  
    if(!apps) return <></>;

    return (
      <div className="container">
        <h1>All Apps {`(${apps.length})`}</h1>
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

          <Pagination small/>
        </div>

        {!searchInput && (
          <p>
            Showing {apps.slice(offset, offset + appsPerPage).length} apps (page{" "}
            {Math.round((offset + appsPerPage - 1) / appsPerPage)} of{" "}
            {totalPages}).
          </p>
        )}
        {searchInput && (
          <p>
            Showing {results.length} search{" "}
            {results.length === 1 ? "result" : "results"}.
          </p>
        )}

        {searchInput && (
          <ul className={`${styles.all} ${styles.storeList}`}>
            {results.map((app) => (
              <SingleApp app={app} showDesc={true} key={app._id} />
            ))}
          </ul>
        )}

        {!searchInput && (
          <ul className={`${styles.all} ${styles.storeList}`}>
            {apps.slice(offset, offset + appsPerPage).map((app) => (
              <SingleApp app={app} showDesc={true} key={app._id} />
            ))}
          </ul>
        )}

        <div className={styles.pagination}>
          <Pagination />
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

export async function getStaticProps() {
  let apps = await fetch(`https://api.winstall.app/apps`).then((res) =>
    res.json()
  );

  return {
    props: {
      apps,
    },
  };
}

export default Store;
