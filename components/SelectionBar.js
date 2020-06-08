import React, { useContext } from "react";
import Link from 'next/link'
import SelectedContext from "../ctx/SelectedContext";

import { FiTrash, FiCodepen } from "react-icons/fi";
export default function SelectionBar() {
    const { selectedApps, setSelectedApps } = useContext(SelectedContext);

    if(selectedApps.length === 0) return <></>;

    let handleClear = () => {
      // check if confirm exists
      // support for iOS safari
      if ('confirm' in window && typeof window.confirm === 'function'){
        if(window.confirm("Are you sure you want to unselect all the apps?")){
            setSelectedApps([]);
        }
      } else{
        setSelectedApps([]);
      }
    }
    return (
      <div className="bottomBar">
        <div className="container inner">
          <div className="appPreview">
            <p>Selected {selectedApps.length} apps so far</p>
          </div>
          <div className="controls">
            <button className="clear" onClick={() => handleClear()}>
              <FiTrash />
              Clear Selections
            </button>
            <Link href="/generate">
              <button>
                <FiCodepen />
                Generate script
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
}