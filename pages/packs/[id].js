import styles from "../../styles/home.module.scss";

import SingleApp from "../../components/SingleApp";
import SelectionBar from "../../components/SelectionBar";

import Footer from "../../components/Footer";
import Error from "../../components/Error";

import Skeleton from "react-loading-skeleton";

import { useRouter } from "next/router";
import MetaTags from "../../components/MetaTags";
import { useEffect, useState } from "react";

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

function PackDetail({ pack, creator }) {
    const router = useRouter();

    const fallbackMessage = {
        title: "Sorry! We could not load this pack.",
        subtitle: "Unfortunately, this pack could not be loaded. Either it does not exist, or something else went wrong. Please try again later."
    }

    if(!router.isFallback && !pack){
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
                  title={`${pack.title} - winstall`}
                />
                <h1>{pack.title}</h1>
                <p>{pack.desc}</p>
                <p>{pack.apps}</p>
                <p>{pack.creator}</p>
                <p>{creator ? creator.screen_name : ""}</p>
              </div>
            )}
        
          </div>
        </div>

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
      let pack = await fetch(`https://api.winstall.app/packs/${params.id}`).then(res => res.json());

      let creator = await fetch(`https://api.twitter.com/1.1/users/show.json?user_id=${pack.creator}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TWITTER_BEARER}`
        }
      }).then(res => res.json())

      return { props: pack ? { pack, creator } : {} }
    } catch(err) {
        return { props: {} };
    }
}

export default PackDetail;