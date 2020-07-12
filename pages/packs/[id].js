import styles from "../../styles/packPage.module.scss";

import Error from "../../components/Error";

import Skeleton from "react-loading-skeleton";

import { useRouter } from "next/router";
import MetaTags from "../../components/MetaTags";
import { useEffect, useState, useContext } from "react";
import PageWrapper from "../../components/PageWrapper";
import PackAppsList from "../../components/PackAppsList";
import SelectionBar from "../../components/SelectionBar";
import SelectedContext from "../../ctx/SelectedContext";

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
    const { selectedApps, setSelectedApps } = useContext(SelectedContext);

    const fallbackMessage = {
        title: "Sorry! We could not load this pack.",
        subtitle: "Unfortunately, this pack could not be loaded. Either it does not exist, or something else went wrong. Please try again later."
    }

    if(!router.isFallback && !pack){
        return <Error {...fallbackMessage}/>
    }

    const handleSelectAll = () => {
      const updatedList = [...selectedApps, ...pack.apps];

      let uniqueList = [...new Map(updatedList.map(item => [item["_id"], item])).values()]

      setSelectedApps(uniqueList);
    }

    return (
      <PageWrapper>

        <div className={styles.content}>
          
          {router.isFallback ? (
            <AppSkeleton />
          ) : (
              <div>
                <MetaTags
                  title={`${pack.title} - winstall`}
                />

                <h1>{pack.title}</h1>
                <p className={styles.author}><img src={creator.profile_image_url} alt="pack creator image"/>@{creator.screen_name}</p>
                <p>{pack.desc}</p>
                <p>{pack.createdAt} </p>
                <button className="button">Get Pack</button>
                <button className="button" onClick={handleSelectAll}>Select Apps</button>

                <PackAppsList providedApps={pack.apps} reorderEnabled={false} />
              </div>
            )}

          {/* <PackAppsList providedApps={packApps} reorderEnabled={false}/> */}
        </div>

        <SelectionBar/>

      </PageWrapper>
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

      const appsList = pack.apps.split(",");

      const getIndividualApps = appsList.map(async (app, index) => {
        return new Promise(async (resolve) => {
          let appData = await fetch(`https://api.winstall.app/apps/${app}`).then(res => res.json());
          appsList[index] = appData;
          resolve();
        })
      })

      await Promise.all(getIndividualApps).then(() => {
        pack.apps = appsList;

      })
      
      return { props: pack ? { pack, creator } : {} }
      
    } catch(err) {
        console.log(err.message)
        return { props: {} };
    }
}

export default PackDetail;