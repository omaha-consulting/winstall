import styles from "../../styles/packPage.module.scss";

import Error from "../../components/Error";

import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { useRouter } from "next/router";
import MetaTags from "../../components/MetaTags";
import { useEffect, useState, useContext } from "react";
import PageWrapper from "../../components/PageWrapper";
import PackAppsList from "../../components/PackAppsList";
import SelectionBar from "../../components/SelectionBar";
import SelectedContext from "../../ctx/SelectedContext";
import { timeAgo } from "../../utils/helpers";
import { FiCodepen, FiPackage, FiCopy, FiDownload } from "react-icons/fi";
import Toggle from "react-toggle";

function AppSkeleton() {
    return (
      <div>
        <Skeleton count={1} height={30} width={250}/>

        <div className="skeleton-group centre">
          <Skeleton circle={true} height={28} width={28} />
          <Skeleton count={1} height={25} width={80}/>
        </div>
        <Skeleton count={3} height={20} width="80%"/>
        <div className="skeleton-button">
          <Skeleton count={1} width={140} height={45} />&nbsp;
          <Skeleton count={1} width={140} height={45} />
        </div>
        <div className="skeleton-list left">
          <Skeleton count={2} height={120}/>
        </div>
        <Skeleton count={1} height={120}   />
      </div>
    );
}

function ScriptCode({apps}){
  const [copyText, setCopyText] = useState("Copy to clipboard");
  const [script, setScript] = useState("");
  const [showPS, setShowPS] = useState(false);

  let handleScriptChange = () => {
    let installs = [];

    apps.map((app) => {
      installs.push(
        `winget install --id=${app._id} ${
        app.selectedVersion !== app.latestVersion
          ? `-v "${app.selectedVersion}" `
          : ""
        }-e`
      );

      return app;
    });

    let newScript = installs.join(showPS ? " ; " : " && ");

    if (script !== newScript) {
      setCopyText("Copy to clipboard");
    }

    setScript(newScript);
  };

  useEffect(() => {
    handleScriptChange();
  }, [handleScriptChange]);

  let handleCopy = () => {
    navigator.clipboard.writeText(script).then(() => setCopyText("Copied!")).catch((err) => {
      document.querySelector("textarea").select();
    })
  }

  let handleBat = () => {
    let dl = document.querySelector("#gsc");
    dl.setAttribute("download", `winstall${showPS ? ".ps1" : ".bat"}`)
    dl.href = "data:text/plain;base64," + btoa(script);
    dl.click();
  }

  let handleScriptSwitch = () => {
    setShowPS(!showPS);

    if (!showPS) {
      setScript(script.replace(/&&/g, ";"));
    } else {
      setScript(script.replace(/;/g, "&&"));
    }

    setCopyText("Copy to clipboard")
  }

  return (
    <div className={styles.getScript} id="packScript">

      <div className={styles.scriptHeader}>
        <h3>Get the pack script</h3>
        <div className="switch min">
          <Toggle
            id="biscuit-status"
            defaultChecked={showPS}
            aria-labelledby="biscuit-label"
            onChange={handleScriptSwitch}
          />
          <span id="biscuit-label">Show PowerShell script</span>
        </div>
      </div>
      
      <p>You can copy-paste the following script into a terminal window to get all the apps in this pack. Alternatively, you can download the .bat or .ps1 file to quickly install this pack.</p>

      <textarea
        value={script}
        onChange={() => { }}
        onFocus={(e) => e.target.select()}
      />

      <div className="box">
        <button className="button accent" onClick={handleCopy}>
          <FiCopy />
          {copyText}
        </button>

        <button className="button dl" onClick={handleBat}>
          <FiDownload />
                Download {showPS ? ".ps1" : ".bat"}
        </button>
      </div>
    </div>
  )
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
              <MetaTags title={`${pack.title} - winstall`} />

              <h1>{pack.title}</h1>

              <Link
                href="/users/[id]"
                as={`/users/${creator.id_str}`}
                prefetch={false}
              >
                <a className={styles.author} title="View other packs by this user">
                  <img
                    src={creator.profile_image_url}
                    alt="pack creator image"
                  />
                  @{creator.screen_name}
                </a>
              </Link>

              <p>{pack.desc}</p>
              <p>Created {timeAgo(pack.createdAt)} </p>

              <div className={styles.packGet}>
                <a
                  className="button lightText"
                  href="#packScript"
                  id={pack.accent}
                >
                  <FiCodepen /> Get Pack
                </a>
                <a className="button" onClick={handleSelectAll}>
                  <FiPackage /> Select Apps
                </a>
              </div>

              <PackAppsList providedApps={pack.apps} reorderEnabled={false} />

              <ScriptCode apps={pack.apps} />
            </div>
          )}

          {/* <PackAppsList providedApps={packApps} reorderEnabled={false}/> */}
        </div>

        <SelectionBar />
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

      const appsList = pack.apps;

      const getIndividualApps = appsList.map(async (app, index) => {
        return new Promise(async (resolve) => {
          let appData = await fetch(`https://api.winstall.app/apps/${app._id}`).then(res => res.json());
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