import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import SelectedContext from "../ctx/SelectedContext";

import { FiTrash, FiCodepen } from "react-icons/fi";
export default function SelectionBar() {
    const history = useHistory();
    const { selectedApps, setSelectedApps } = useContext(SelectedContext);

    if(selectedApps.length === 0) return <></>;

    let handleClear = () => {
        if(window.confirm("Are you sure you want to unselect all the apps?")){
            setSelectedApps([]);
        }
    }

    return (
      <div className="bottomBar">
        <div className="container inner">
          <p>Selected {selectedApps.length} apps so far</p>
          <div className="controls">
            <button className="clear" onClick={() => handleClear()}>
              <FiTrash/>Clear Selections
            </button>
            <button onClick={() => history.push("/generate")}>
              <FiCodepen/>Generate script
            </button>
          </div>
        </div>
      </div>
    );
}