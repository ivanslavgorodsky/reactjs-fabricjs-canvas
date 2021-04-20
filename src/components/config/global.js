import React, { createContext, useContext, useState } from "react";

export const GlobalContext = createContext();
export default function GlobalProvider({ children }) {

  const [valGlobal, setGlobal] = useState({
    // Fabric.js Object
    uid: null,
    canvas: null,
    app: {
      name: "Canvas",
      package: "br.com.natancabral.gnnc",
    },
  });

  return (
    <GlobalContext.Provider value={{ valGlobal, setGlobal }}>
      {children}
    </GlobalContext.Provider>
  );

}

// created a personal hook
// this call context inside file
export function useGlobal() {
  const context = useContext( GlobalContext );
  //if(!context) throw new Error('useGlobal need privider. useGlobal must be used within a GlobalProvider');
  const { valGlobal, setGlobal } = context;
  return { valGlobal, setGlobal };
}
