import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import SelectedContext from "../utils/SelectedContext";

export default function SelectionBar() {
    const history = useHistory();
    const { selectedApps, setSelectedApps } = useContext(SelectedContext);

    if(selectedApps.length === 0) return <></>;

    return (
        <div className="bottomBar">
            <div className="container inner">
                <p>Selected {selectedApps.length} apps so far</p>
                <button onClick={() => history.push("/generate")}>Generate script</button>
            </div>
        </div>
    )
}