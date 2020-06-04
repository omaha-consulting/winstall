import React from "react";

const PackagesContext = React.createContext({
    packages: [],
    setPackages: () => { },
});

export default PackagesContext;
