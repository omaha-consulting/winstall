import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import "./styles/base.scss";
import styles from "./styles/main.module.scss";

import PackageContext from "./utils/PackageContext";
import Home from "./pages/Home";


function App() {
  let [packageData, setPackageData] = useState();

  return (
    <Router>
      <Switch>
        <PackageContext.Provider value={packageData}>
            <Route exact path="/" component={Home} />
        </PackageContext.Provider>
      </Switch>
    </Router>
  );
}

export default App;
