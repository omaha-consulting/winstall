import { useState, useEffect, useMemo } from "react";
import styles from "../styles/exportApps.module.scss";
import { FiCopy, FiDownload } from "react-icons/fi";
import generateWingetImport from "../utils/generateWingetImport";

let handleCopy = ( fileContent, setCopyText ) => {
    navigator.clipboard.writeText(fileContent).then(() => setCopyText("Copied!")).catch((err) => {
        document.querySelector("textarea").select();
    })
}

let handleDownload = ( fileContent, fileExtension ) => {
    let dl = document.querySelector("#gsc");
    dl.setAttribute("download", `winstall${fileExtension}`)
    dl.href = "data:text/plain;base64," + btoa(fileContent);
    dl.click();
}

const GenericExport = ({ fileContent, fileExtension }) => {
    const [copyText, setCopyText] = useState("Copy to clipboard");

    useEffect(() => {
        setCopyText("Copy to clipboard")
    }, [fileContent])

    return (
        <div className={styles.generate}>
            <textarea
                value={ fileContent }
                onChange={() => { }}
                onFocus={(e) => e.target.select()}
            />

            <div className="box">
                <button className="button accent" onClick={() => handleCopy(fileContent, setCopyText)}>
                    <FiCopy />
                    {copyText}
                </button>

                <button className="button dl" onClick={() => handleDownload(fileContent, fileExtension)}>
                    <FiDownload />
                    Download {fileExtension}
                </button>
            </div>
        </div>
    )
}


const ExportApps = ({ apps, title, subtitle }) => {
  const [ batScript, setBatScript ] = useState("");
  const [ psScript, setPsScript ] = useState("");
  const [ wingetScript, setWingetScript ] = useState("");

  const tabs = useMemo(() => {
        return [
            {
                title: "Batch",
                key: ".bat",
                element: <GenericExport fileContent={batScript} fileExtension=".bat"/>
            },
            {
                title: "PowerShell",
                key: ".ps1",
                element: <GenericExport fileContent={psScript} fileExtension=".ps1"/>
            },
            {
                title: "Winget Import",
                key: ".json",
                element: <GenericExport fileContent={wingetScript} fileExtension=".json"/>
            }
        ]
  }, [ batScript, psScript, wingetScript, apps ])

  const [active, setActive] = useState(".bat");

  let handleScriptChange = async () => {
    if(!apps) return;
    
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

    let newBatchScript = installs.join(" && ");
    let newPSScript = installs.join(" ; ");


    setBatScript(newBatchScript);
    setPsScript(newPSScript);
    setWingetScript(JSON.stringify(await generateWingetImport(apps), 2));
  };

  useEffect(() => {
    handleScriptChange();
  }, [handleScriptChange]);

  return (
    <div className={styles.getScript} id="packScript">

        { title && (
            <div className={styles.scriptHeader}>
                <h3>{title}</h3>
            </div>
        )}
      
        { subtitle && <p>{subtitle}</p> }

        <ul className={styles.tabHeader}>
            { tabs.map((tab, index) => {
                return <li key={index} className={ tab.key === active ? styles.active : ''} onClick={() => setActive(tab.key)}>{tab.title}</li>
            }) }
        </ul>

        { tabs.map((tab, index) => {
            return <section key={index} className={ tab.key === active ? styles.displaySection : styles.hideSection }>{ tab.element }</section>
        }) }  
    </div>
  )
}

export default ExportApps;