import React, { useContext } from "react";
import PackageContext from "../utils/PackageContext";

function Home() {
    
  const packageData = useContext(PackageContext)
  return (
    <div>
        <h1>{packageData.hi.n}</h1>
    </div>
      
  );
}

export default Home;
