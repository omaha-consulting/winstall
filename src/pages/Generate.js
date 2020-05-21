import React, { useContext, useState, useEffect } from "react";
import styles from "../styles/home.module.scss";

import Error from "../components/Error";
import ListPackages from "../components/ListPackages";
import SingleApp from "../components/SingleApp";
import SelectedContext from "../ctx/SelectedContext";

import art from "../assets/dl.svg";
import Footer from "../components/Footer";


function Generate() {
    const { selectedApps, setSelectedApps } = useContext(SelectedContext);
    const [copyText, setCopyText] = useState("Copy to clipboard");
    const [script, setScript] = useState("");

    useEffect(() => {
        let installs = [];
        let apps = [];

        selectedApps.map((app) => {
            if (app.id === undefined) return;

            apps.push(app.id);
            installs.push(`winget install --id=${app.id}`);
        });

        let newScript = installs.join(" & ");
        
        if(script !== newScript){
            setCopyText("Copy to clipboard")
        }
 
        setScript(newScript)

    })

    if(selectedApps.length === 0) return <Error title="You have not selected any apps to install!" subtitle="You'll need to select some apps first to be able to generate the script."/>

    let handleCopy = () => {
        navigator.clipboard.writeText(script).then(() => setCopyText("Copied!")).catch((err) => {
            document.querySelector("textarea").select();
        })
    }

    let handleBat = () => {
        document.querySelector("#gsc").href = "data:text/plain;base64," + btoa(script);
        document.querySelector("#gsc").click();
    }

    return (
        <div className="container generate-container">
            <div className="illu-box">
                <div className={styles.generate}>
                    <h1>Your apps are ready to be installed.</h1>
                    <h3>Make sure you have Windows Package Manager installed :)</h3>
                    <p>Just copy the command from the textbox bellow, paste it into Windows Terminal, Command Prompt, or any other terminal on your Windows machine to start installing the apps.</p>

                    <textarea value={script} onChange={() => { }} onFocus={e => e.target.select()} />

                    <button className="button accent" onClick={handleCopy}>{copyText}</button>
                    <button className="button" onClick={handleBat}>Download .bat</button>
                </div>
                <div className="art">
                    <img src={art} draggable={false} />
                </div>
            </div>

            <div className={styles.selectedApps}>
                <h2>Apps you are downloading ({selectedApps.length})</h2>
                <ListPackages showImg={false}>
                    {selectedApps.map((app, index) => (
                        <React.Fragment key={index}>
                            <SingleApp app={app} />
                        </React.Fragment>
                    ))}
                </ListPackages>
            </div>

            <Footer/>
        </div>
    );
}

export default Generate;
