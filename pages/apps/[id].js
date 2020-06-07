import styles from "../../styles/home.module.scss";

import SingleApp from "../../components/SingleApp";
import PopularApps from "../../components/PopularApps";
import SelectionBar from "../../components/SelectionBar";

import Footer from "../../components/Footer";
import Error from "../../components/Error";
import { shuffleArray } from "../../utils/helpers";
import popularAppsList from "../../data/popularApps.json";

import Skeleton from "react-loading-skeleton";

import {FiArrowLeft} from "react-icons/fi";

import { useRouter } from "next/router";
import MetaTags from "../../components/MetaTags";

function AppSkeleton() {
    return (
      <div>
        <div className="skeleton-group">
          <Skeleton circle={true} height={30} width={30} />
          <Skeleton count={1} height={25} />
        </div>
        <Skeleton count={5} height={20} />
        <div className="skeleton-list">
          <Skeleton count={5} width={250} />
        </div>
        <div className="skeleton-button">
          <Skeleton count={1} width={140} height={50} />
        </div>
      </div>
    );
}

function AppDetail({ app }) {
    const router = useRouter();
    const fallbackMessage = {
        title: "Sorry! We could not load this app.",
        subtitle: "Unfortunately, this app could not be loaded. Either it does not exist, or something else went wrong. Please try again later."
    }

    if(!router.isFallback && !app){
        return <Error {...fallbackMessage}/>
    }

    return (
      <div className="container">
        <div className={styles.intro}>
          <div className="illu-box">
            {router.isFallback ? (
              <AppSkeleton/>
            ) : (
              <div>
                <MetaTags
                  title={`${app.name} by ${app.publisher} - winstall`}
                />
                <SingleApp app={app} large={true} />
              </div>
            )}
            <div className="art">
              <img
                src="/assets/logo.svg"
                draggable={false}
                alt="winstall logo"
              />
            </div>
          </div>
        </div>

        {/* <PopularApps apps={popular} all={apps} /> */}

        <SelectionBar />

        <Footer />
      </div>
    );
}

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: true,
    };
}

export async function getStaticProps({ params }) {
    console.log("Getting content from API")

    try{
        let app = await fetch(`https://api.winstall.app/apps/${params.id}`).then(res => res.json());
        return { props: app ? { app } : {} }
    } catch(err) {
        return { props: {} };
    }
}

export default AppDetail;