import React from "react";

const UserContext = React.createContext({
  user: [],
  setUser: () => {},
});

export default UserContext;
