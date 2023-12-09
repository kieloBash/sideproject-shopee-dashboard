"use client";
import { Miner } from "@/lib/interfaces";
import * as React from "react";

export type MinerContextType = {
  selectedMiner: Miner | undefined;
  setSelectedMiner: (temp: Miner | undefined) => void;

  // toggleAdd: boolean;
  // setToggleAdd: (temp: boolean) => void;
  toggleView: boolean;
  setToggleView: (temp: boolean) => void;
  toggleEdit: boolean;
  setToggleEdit: (temp: boolean) => void;
  toggleDelete: boolean;
  setToggleDelete: (temp: boolean) => void;
};

export const MinerContext = React.createContext<MinerContextType>({
  selectedMiner: undefined,
  setSelectedMiner: (temp: Miner | undefined) => {},

  // toggleAdd: false,
  // setToggleAdd: (temp: boolean) => {},
  toggleView: false,
  setToggleView: (temp: boolean) => {},
  toggleEdit: false,
  setToggleEdit: (temp: boolean) => {},
  toggleDelete: false,
  setToggleDelete: (temp: boolean) => {},
});

export const useMinerContext = () => React.useContext(MinerContext);

const MinerProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedMiner, setSelectedMiner] = React.useState<Miner | undefined>();

  // const [toggleAdd, setToggleAdd] = React.useState<boolean>(false);
  const [toggleView, setToggleView] = React.useState<boolean>(false);
  const [toggleEdit, setToggleEdit] = React.useState<boolean>(false);
  const [toggleDelete, setToggleDelete] = React.useState<boolean>(false);

  return (
    <MinerContext.Provider
      value={{
        selectedMiner,
        setSelectedMiner,
        // toggleAdd,
        toggleView,
        toggleEdit,
        toggleDelete,
        // setToggleAdd,
        setToggleView,
        setToggleEdit,
        setToggleDelete,
      }}
    >
      {children}
    </MinerContext.Provider>
  );
};

export default MinerProvider;
