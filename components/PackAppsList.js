import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import styles from "../styles/packsAppList.module.scss";
import SingleApp from "./SingleApp";

import { FiPlus } from "react-icons/fi";

const AppsList = ({ apps, onListUpdate }) => {

  return apps.map((app, index) => (
    <App app={app} index={index} key={app._id} onListUpdate={onListUpdate}/>
  ));
};

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

function App({ app, index, onListUpdate }) {
  return (
    <Draggable draggableId={app._id} index={index}>
      {(provided) => (
        <div
          className={styles.appCard}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <SingleApp app={app} pack={true}/>
          <button
            className={styles.unselectApp}
            onClick={() => onListUpdate(app._id)}
            aria-label={"Remove app from pack"}
          >
            <FiPlus />
          </button>
        </div>
      )}
    </Draggable>
  );
}

function PackAppsList({ notLoggedIn=false, providedApps, reorderEnabled, onListUpdate }){
    if (providedApps.length < 5) return <></>;

    const [apps, setApps] = useState([]);

    useEffect(() => {
        setApps(providedApps)
    }, [])
    
    if(!reorderEnabled){
        return (
          <ul className={styles.appsList}> 
            {apps.map((app) => (
              <div className={styles.appCard}>
                <SingleApp app={app} key={app._id} pack={true} />
              </div>
            ))}
          </ul>
        );
    }

    const onDragEnd = (result) => {
      if (!result.destination) {
        return;
      }

      if (result.destination.index === result.source.index) {
        return;
      }

      const updatedApps = reorder(
        apps,
        result.source.index,
        result.destination.index
      );


      onListUpdate(updatedApps)

      setApps(updatedApps);
    }

    const manageUpdates = (id) => {
      const updatedApps = apps.filter(i => i._id !== id);
      setApps(updatedApps);
      onListUpdate(updatedApps);
    }

    return (
      <>
        <h2>Apps in this pack</h2>
        {!notLoggedIn && <p>Tip! Drag and drop any app to re-order how they appear in your pack.</p>}
        
        {notLoggedIn ? <p>You need to login first before you can view the apps in this pack.</p> : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="list">
              {(provided) => (
                <ul
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={styles.appsList}
                >
                  <AppsList apps={apps} onListUpdate={manageUpdates} />
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        ) }
      </>
    );

}

export default PackAppsList;