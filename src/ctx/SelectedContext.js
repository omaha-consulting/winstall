import React from "react";

const SelectedContext = React.createContext({
  selected: [],
  setSelected: () => {},
});

export default SelectedContext;
