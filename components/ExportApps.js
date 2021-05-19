import { useState, useEffect, useMemo } from "react";
import styles from "../styles/exportApps.module.scss";
import { FiChevronDown, FiCopy, FiDownload, FiInfo } from "react-icons/fi";
import generateWingetImport from "../utils/generateWingetImport";

let handleCopy = ( fileContent, setCopyText ) => {
    navigator.clipboard.writeText(fileContent).then(() => setCopyText("Copied!")).catch((err) => {
        document.querySelector("textarea").select();
    })
}

let handleDownload = ( fileContent, fileExtension, downloadId ) => {
    let dl = document.querySelector("#gsc");
    dl.setAttribute("download", `winstall-${downloadId}${fileExtension}`)
    dl.href = "data:text/plain;base64," + btoa(fileContent);
    dl.click();
}

const GenericExport = ({ fileContent, displayedCommand, fileExtension, prioritiseDownload=false }) => {
    const [copyText, setCopyText] = useState("Copy to clipboard");
    const [textboxContent, setTextboxContent] = useState();
    const [downloadId, setDownloadId] = useState(Math.floor(1000 + Math.random() * 9000));

    useEffect(() => {
        setCopyText("Copy to clipboard");

        setTextboxContent(displayedCommand ? displayedCommand.replace("$fileName", `winstall-${downloadId}.json`) : fileContent);
    }, [fileContent, displayedCommand, downloadId])

    return (
        <div className={styles.generate}>
            <textarea
                value={ textboxContent }
                onChange={(e) => { setTextboxContent(e.target.value) }}
                onFocus={(e) => e.target.select()}
            />

            <div className={`box ${prioritiseDownload ? styles.reverse : ''}`}>
                <button className={`button ${!prioritiseDownload ? 'accent' : ''}`} onClick={() => handleCopy(textboxContent, setCopyText)}>
                    <FiCopy />
                    {copyText}
                </button>

                <button className={`button dl ${prioritiseDownload ? 'accent' : ''}`}  onClick={() => {
                    handleDownload(fileContent, fileExtension, downloadId);
                    setDownloadId(Math.floor(1000 + Math.random() * 9000));
                }}>
                    <FiDownload />
                    Download {fileExtension}
                </button>
            </div>
        </div>
    )
}

const AdvancedConfig = ({ refreshConfig, activeTab }) => {
    const [ expanded, setExpnaded ] = useState(false);

    const [ config, setConfig ] = useState({
        "--scope": "user",
        "-i": false,
        "-h": false,
        "-o": "",
        "--override": false,
        "-l": "",
        "--force": false,
        "--ignore-unavailable": false
    });

    const [ hiddenOptions, setHiddenOptions ] = useState([]);

    const updateConfig = async (key, val) => {
        const existingConfig = { ...config };
        const newConfig = { ...existingConfig, [key]: val};

        setConfig(newConfig);
        refreshConfig(newConfig, hiddenOptions);

        await localStorage.setItem("winstall-advanced-config", JSON.stringify(newConfig));
    }

    useEffect(() => {
        const loadExistingConfig = async (unavailableOptions) => {
            let previousConfig = await localStorage.getItem("winstall-advanced-config")

            if(previousConfig){
                previousConfig = JSON.parse(previousConfig);
            } else{
                previousConfig = { ...config };
            }

            refreshConfig(previousConfig, unavailableOptions);
            setConfig(previousConfig);
            setExpnaded(true);
        }


        let unavailableOptions = ["--ignore-unavailable"];

        if(activeTab === ".json"){
            unavailableOptions = ["--scope", "-i", "-h", "-o", "--override", "-l", "--force"];
        } 

        setHiddenOptions(unavailableOptions);
        loadExistingConfig(unavailableOptions);

    }, [ activeTab ]);


    return (
        <div className={styles.expandBlock}>
            <h3 className={`${styles.expandHeader} ${ expanded ? styles.expandedHeader : ''}`} onClick={() => setExpnaded(e => !e)}>
                <FiChevronDown size={22} className={expanded ? styles.expandedIcon : ''}/>
                Advanced Options
            </h3>

            { expanded && (
                <div>
                    <p className={styles.center}><FiInfo/> All of the following options are persisted locally in your browser.</p>

                    { !hiddenOptions.includes("--scope") && (
                        <label className={styles.radioContainer}>
                            <p>Installation scope <code>--scope</code></p>

                            <div>
                                <label htmlFor="user">
                                    <input type="radio" id="user" name="--scope" value="user" onChange={(e) => updateConfig("--scope", e.target.value)} defaultChecked={config["--scope"] === "user"}/>
                                    <p>User</p>
                                </label>

                                <label htmlFor="machine">
                                    <input type="radio" id="machine" name="--scope" value="machine" onChange={(e) => updateConfig("--scope", e.target.value)} defaultChecked={config["--scope"] === "machine"}/>
                                    <p>Machine</p>
                                </label>
                            </div>
                        </label>
                    )}

                    { !hiddenOptions.includes("-i") && (
                        <label htmlFor="-i">
                            <input type="checkbox" id="-i" defaultChecked={config["-i"]} onChange={(e) => updateConfig("-i", e.target.checked)}/>
                            <p>Request interactive installation; user input may be needed <code>-i</code></p>
                        </label>
                    )}
                    
                    { !hiddenOptions.includes("-h") && (
                        <label htmlFor="-h">
                            <input type="checkbox" id="-h" defaultChecked={config["-h"]} onChange={(e) => updateConfig("-h", e.target.checked)}/>
                            <p>Request silent installation <code>-h</code></p>
                        </label>
                    )}

                    { !hiddenOptions.includes("--override") && (
                        <label htmlFor="--override">
                            <input type="checkbox" id="--override" defaultChecked={config["--override"]} onChange={(e) => updateConfig("--override", e.target.checked)}/>
                            <p>Override arguments to be passed on to the installer <code>--override</code></p>
                        </label>
                    )}

                    { !hiddenOptions.includes("--force") && (
                        <label htmlFor="--force">
                            <input type="checkbox" id="--force" defaultChecked={config["--force"]} onChange={(e) => updateConfig("--force", e.target.checked)}/>
                            <p>Override the installer hash check <code>--force</code></p>
                        </label>
                    )}

                    { !hiddenOptions.includes("-o") && (
                        <label htmlFor="-o" className={styles.text}>
                            <p>Log location (if supported) <code>-o</code></p>
                            <input type="text" id="-o" value={config["-o"]} onChange={(e) => updateConfig("-o", e.target.value)} placeholder="Enter a valid path for your local machine"/>
                        </label>
                    )}

                    { !hiddenOptions.includes("-l") && (
                        <label htmlFor="-l" className={styles.text}>
                            <p>Location to install to (if supported) <code>-l</code></p>
                            <input type="text" id="-l" value={config["-l"]} onChange={(e) => updateConfig("-l", e.target.value)} placeholder="Enter a valid path for your local machine"/>
                        </label>
                    )}

                    { !hiddenOptions.includes("--ignore-unavailable") && (
                        <label htmlFor="--ignore-unavailable">
                            <input type="checkbox" id="--ignore-unavailable" defaultChecked={config["--ignore-unavailable"]} onChange={(e) => updateConfig("--ignore-unavailable", e.target.checked)}/>
                            <p>Ignore unavailable packages <code>--ignore-unavailable</code></p>
                        </label>
                    )}
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
  const [ wingetImportCommand, setWingetImportCommand ] = useState("");

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
                element: <GenericExport fileContent={wingetScript} displayedCommand={wingetImportCommand} fileExtension=".json" prioritiseDownload={true}/>
            }
        ]
  }, [ batScript, psScript, wingetScript, wingetImportCommand, apps ])

  const [active, setActive] = useState(".bat");

  let handleScriptChange = async () => {
    if(!apps) return;

    let installs = [];

    let advancedFilters = "";

    if(filters){
        advancedFilters = Object.entries({ ...filters} ).filter(i => i[1] === true).map(i => i[0]).join(" ");

        if(filters["-o"]) advancedFilters += ` -o "${filters["-o"]}"`;
        if(filters["-l"]) advancedFilters += ` -l "${filters["-l"]}"`;
        if(filters["--scope"]) advancedFilters += ` --scope "${filters["--scope"]}"`;
    } 

    apps.map((app) => {
      installs.push(
        `winget install --id=${app._id}${app.selectedVersion !== app.latestVersion ? ` -v "${app.selectedVersion}"` : ""} -e ${advancedFilters}`
      );

      return app;
    });

    let newBatchScript = installs.join(" && ");
    let newPSScript = installs.join(" ; ");


    setBatScript(newBatchScript);
    setPsScript(newPSScript);
    setWingetScript(JSON.stringify(await generateWingetImport(apps), 2));

    setWingetImportCommand(`winget import --import-file "$fileName" ${advancedFilters}`);

  };

  useEffect(() => {
    const restoreDefaultTab = async () => {
        const defaultExportTab = await localStorage.getItem("winstall-default-export-tab");

        if(defaultExportTab !== null){
            setActive(defaultExportTab);
        }
    }

    restoreDefaultTab();
    handleScriptChange();
  }, [handleScriptChange]);

  const changeTab = async ( tabKey ) => {
        setActive(tabKey);
        await localStorage.setItem("winstall-default-export-tab", tabKey);
  }

  const refreshFilters = async ( newConfig, unavailableOptions ) => {
        let availableConfig = { ...newConfig }

        await unavailableOptions.map(opt => {
            delete availableConfig[opt]
        });

        setFilters(availableConfig);
  }

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
                return <li key={index} className={ tab.key === active ? styles.active : ''} onClick={() => changeTab(tab.key)}>{tab.title}</li>
            }) }
        </ul>

        <AdvancedConfig refreshConfig={refreshFilters} activeTab={active}/>

        { tabs.map((tab, index) => {
            return <section key={index} className={ tab.key === active ? styles.displaySection : styles.hideSection }>{ tab.element }</section>
        }) }  

    </div>
  )
}

export default ExportApps;