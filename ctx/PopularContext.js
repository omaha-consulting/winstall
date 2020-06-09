import React from "react";


const PopularContext = React.createContext({
  popular: [],
  setPopular: () => {},
});


export default PopularContext;