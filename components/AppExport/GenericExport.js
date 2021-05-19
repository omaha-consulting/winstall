import { useState, useEffect } from 'react';
import { FiCopy, FiDownload, FiInfo } from "react-icons/fi";
import styles from "../../styles/exportApps.module.scss";

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

const GenericExport = ({ fileContent, displayedCommand, fileExtension, prioritiseDownload=false, tip }) => {
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

            { tip && (
                <div className={styles.tipContainer}>
                    <FiInfo/>
                    <p>{tip}</p>
                </div>
            )}

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

export default GenericExport;