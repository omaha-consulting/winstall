import React from "react";
import popularAppsList from "../data/popularApps.json";
import { shuffleArray } from "../utils/helpers";

const PopularContext = React.createContext(shuffleArray(Object.values(popularAppsList)).slice(0, 6));

export default PopularContext;