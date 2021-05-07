import { useState, useEffect, useMemo } from "react";
import styles from "../styles/exportApps.module.scss";
import { FiChevronDown, FiChevronUp, FiCopy, FiDownload } from "react-icons/fi";
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

const GenericExport = ({ fileContent, fileExtension, prioritiseDownload=false }) => {
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

            <div className={`box ${prioritiseDownload ? styles.reverse : ''}`}>
                <button className={`button ${!prioritiseDownload ? 'accent' : ''}`} onClick={() => handleCopy(fileContent, setCopyText)}>
                    <FiCopy />
                    {copyText}
                </button>

                <button className={`button dl ${prioritiseDownload ? 'accent' : ''}`}  onClick={() => handleDownload(fileContent, fileExtension)}>
                    <FiDownload />
                    Download {fileExtension}
                </button>
            </div>
        </div>
    )
}

const AdvancedConfig = ({ refreshConfig }) => {
    const [ expanded, setExpnaded ] = useState(false);

    const [ config, setConfig ] = useState({
        "-i": false,
        "-h": false,
        "-o": "",
        "--override": false,
        "-l": "",
        "--force": false
    });

    const updateConfig = (key, val) => {
       setConfig(c => {
        const newConfig = { ...c, [key]: val };;

        refreshConfig(newConfig);

        localStorage.setItem("winstall-advanced-config", JSON.stringify(newConfig));

        return newConfig;
       });
    }

    useEffect(() => {
        const loadExistingConfig = async () => {
            let previousConfig = await localStorage.getItem("winstall-advanced-config")

            if(previousConfig){
                previousConfig = JSON.parse(previousConfig);
                refreshConfig(previousConfig);
                setConfig(previousConfig);
            }
        }

        loadExistingConfig();
    }, [ config ]);

    return (
        <div className={styles.expandBlock}>
            <h3 className={styles.expandHeader} onClick={() => setExpnaded(e => !e)}>
                <FiChevronDown size={25} className={expanded ? styles.expandedIcon : ''}/>
                Advanced Options
            </h3>

            { expanded && (
                <div>
                    <label htmlFor="-i">
                        <input type="checkbox"  id="-i" onChange={(e) => updateConfig("-i", e.target.checked)}/>
                        <p>Request interactive installation; user input may be needed.</p>
                    </label>
                    
                    <label htmlFor="-h">
                        <input type="checkbox" id="-h" onChange={(e) => updateConfig("-h", e.target.checked)}/>
                        <p>Request silent installation.</p>
                    </label>
                    
                    <label htmlFor="--override">
                        <input type="checkbox" id="--override" onChange={(e) => updateConfig("--override", e.target.checked)}/>
                        <p>Override arguments to be passed on to the installer.</p>
                    </label>
                    
                    <label htmlFor="--force">
                        <input type="checkbox" id="--force" onChange={(e) => updateConfig("--force", e.target.checked)}/>
                        <p>Override the installer hash check.</p>
                    </label>
                </div>
            )}
        </div>
    )
}


const ExportApps = ({ apps, title, subtitle }) => {
  const [ batScript, setBatScript ] = useState("");
  const [ psScript, setPsScript ] = useState("");
  const [ wingetScript, setWingetScript ] = useState("");
  const [ filters, setFilters ] = useState({});

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
                element: <GenericExport fileContent={wingetScript} fileExtension=".json" prioritiseDownload={true}/>
            }
        ]
  }, [ batScript, psScript, wingetScript, apps ])

  const [active, setActive] = useState(".bat");

  let handleScriptChange = async () => {
    if(!apps) return;

    let installs = [];

    let advancedFilters = "";

    if(filters){
        advancedFilters = Object.entries(filters).filter(i => i[1] === true).map(i => i[0]).join(" ");
    } 

    apps.map((app) => {
      installs.push(
        `winget install --id=${app._id} ${app.selectedVersion !== app.latestVersion ? `-v "${app.selectedVersion}"` : ""} -e ${advancedFilters}`
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

        <AdvancedConfig refreshConfig={setFilters}/>

        { tabs.map((tab, index) => {
            return <section key={index} className={ tab.key === active ? styles.displaySection : styles.hideSection }>{ tab.element }</section>
        }) }  
    </div>
  )
}

export default ExportApps;