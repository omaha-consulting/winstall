import { useState, useEffect } from "react";
import styles from "../styles/apps.module.scss";

import { DebounceInput } from "react-debounce-input";

import Fuse from "fuse.js";

import SelectionBar from "../components/SelectionBar";

import SingleApp from "../components/SingleApp";
import Footer from "../components/Footer";
import ListSort from "../components/ListSort";
import MetaTags from "../components/MetaTags";

import {
  FiChevronLeft,
  FiChevronRight,
  FiArrowLeftCircle,
  FiArrowRightCircle,
} from "react-icons/fi";

import Router from "next/router";

function Store({ data }) {
    const [apps, setApps] = useState([])
    const [results, setResults] = useState([])
    const [searchInput, setSearchInput] = useState();
    const [offset, setOffset] = useState(0);
    const [sort, setSort] = useState();  

    const appsPerPage = 60;

    const totalPages = Math.ceil(apps.length / appsPerPage);

    const fuse = new Fuse(apps, {
      minMatchCharLength: 3,
      threshold: 0.3,
      keys: [{ name: "name", weight: 2 }, "path", "desc", "publisher", "tags"]
    })

    useEffect(() => {
      if (Router.query.sort && Router.query.sort === "update-desc") {
        setSort(Router.query.sort);
        setApps(data.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
      } else {
        setSort("name-desc");
        setApps(data.sort((a, b) => a.name.localeCompare(b.name)));
      }

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

        if(e.target.value.length <= 3) return;
        
        Router.replace("/apps");

        let results = fuse.search(
          e.target.value.toLowerCase().replace(/\s/g, "")
        );

        setResults([...results.map(r => r.item)])
    };


    let handleNext = () => {
      window.scrollTo(0, 0)
      setOffset(offset => offset + appsPerPage);

      Router.replace({
        pathname: "/apps",
        query: {
          page: Math.round((offset + appsPerPage - 1) / appsPerPage) + 1,
        },
      });
    }

    let handlePrevious = () => {
      window.scrollTo(0, 0)
      setOffset(offset => offset - appsPerPage);

      Router.replace({
        pathname: "/apps",
        query: {
          page: Math.round((offset + appsPerPage - 1) / appsPerPage) - 1,
        },
      });
    }
    
    

    let Pagination = ({ small, disable }) => {

      return (
        <div className={small ? styles.minPagination : styles.pagbtn}>
          <button
            className={`button ${small ? styles.smallBtn : null}`}
            id={!small ? "previous": ""}
            onClick={handlePrevious}
            title="Previous page of apps"
            disabled={offset > 0 ? (disable ? "disabled" : null) : "disabled"}
          >
            <FiChevronLeft />
            {!small ? "Previous" : ""}
          </button>
          <button
            className={`button ${small ? styles.smallBtn : null}`}
            id={!small ? "next" : ""}
            title="Next page of apps"
            onClick={handleNext}
            disabled={offset + appsPerPage < apps.length ? ( disable ? "disabled" : null ) : "disabled"}
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
        <MetaTags title="Apps - winstall"/>
        <h1>All Apps {`(${apps.length})`}</h1>

        <div className={styles.controls}>
          <div className={styles.searchLabel}>
            <label htmlFor="search">Search for apps</label>
            <DebounceInput
              minLength={2}
              debounceTimeout={200}
              onChange={(e) => handleSearchInput(e)}
              value={searchInput}
              placeholder="Enter a search term"
              className="search"
              id="search"
            />
          </div>

          <Pagination small disable={searchInput ? true : false} />
        </div>

        <div className={styles.controls}>
          {!searchInput && (
            <>
              <p>
                Showing {apps.slice(offset, offset + appsPerPage).length} apps
                (page {Math.round((offset + appsPerPage - 1) / appsPerPage)} of{" "}
                {totalPages}).
              </p>
              <ListSort
                apps={apps}
                defaultSort={sort}
                onSort={(sort) => setSort(sort)}
              />
            </>
          )}
          {searchInput && (
            <p>
              Showing {results.length} search{" "}
              {results.length === 1 ? "result" : "results"}.
            </p>
          )}
        </div>

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
          <Pagination disable={searchInput ? true : false} />
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
      data: apps,
    },
  };
}

export default Store;
