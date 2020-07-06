import { useContext, useState, useEffect } from "react";
import Link from "next/link";

import styles from "../styles/home.module.scss";

import ListPackages from "../components/ListPackages";
import SingleApp from "../components/SingleApp";
import SelectedContext from "../ctx/SelectedContext";

import Footer from "../components/Footer";

import { FiCopy, FiDownload, FiHome } from "react-icons/fi";
import Toggle from "react-toggle";
import MetaTags from "../components/MetaTags";

function Generate() {
    const { selectedApps } = useContext(SelectedContext);
    const [copyText, setCopyText] = useState("Copy to clipboard");
    const [script, setScript] = useState("");
    const [showPS, setShowPS] = useState(false);

    let handleScriptChange = () => {
      let installs = [];

      selectedApps.map((app) => {
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

    if(selectedApps.length === 0){
      return (
        <div className="container generate-container">
          <MetaTags title="winstall - GUI for Windows Package Manager" />
          <div className="illu-box">
            <div className={styles.generate}>
              <h1>Your don't have any apps selected.</h1>
              <h3>
                Make sure you select some apps first to be able to generate a
                script :)
              </h3>
              <Link href="/">
                <a className="button">
                  <FiHome />
                  Go home
                </a>
              </Link>
            </div>
            <div className="art">
              <img
                src="/assets/dl.svg"
                draggable={false}
                alt="download icon"
              />
            </div>
          </div>
        </div>
      );
    }

    

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
      <div className="container generate-container">
        <MetaTags title="winstall - GUI for Windows Package Manager" />
        <div className="illu-box">
          <div className={styles.generate}>
            <h1>Your apps are ready to be installed.</h1>
            <h3>Make sure you have <a href="https://docs.microsoft.com/en-us/windows/package-manager/winget/#install-winget">Windows Package Manager installed</a> :)</h3>
            <p>
              Just copy the command from the textbox below, paste it into
              Windows Terminal, Command Prompt, or any other terminal on your
              Windows machine to start installing the apps.
            </p>

            <div className="switch">
              <Toggle
                id="biscuit-status"
                defaultChecked={showPS}
                aria-labelledby="biscuit-label"
                onChange={handleScriptSwitch}
              />
              <span id="biscuit-label">Show PowerShell script</span>
            </div>

            <textarea
              value={script}
              onChange={() => {}}
              onFocus={(e) => e.target.select()}
            />

            <div className="box">
              <button className="button accent" onClick={handleCopy}>
                <FiCopy />
                {copyText}
              </button>

              <button className="button" onClick={handleBat}>
                <FiDownload />
                Download {showPS ? ".ps1" : ".bat"}
              </button>
            </div>
          </div>
          <div className="art">
            <img src="/assets/dl.svg" draggable={false} alt="download icon" />
          </div>
        </div>

        <div className={styles.selectedApps}>
          <h2>Apps you are downloading ({selectedApps.length})</h2>
          <ListPackages showImg={true}>
            {selectedApps.map((app) => (
              <SingleApp app={app} key={app._id} onVersionChange={handleScriptChange}/>
            ))}
          </ListPackages>
        </div>

        <Footer />
      </div>
    );
}

export default Generate;
