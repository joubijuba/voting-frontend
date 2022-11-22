import React, { useReducer, useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [nextWFstatus, setNextWFStatus] = useState("")
  const [voters, setVoters] = useState()

  const init = useCallback(
    async artifact => {
      if (artifact) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();
        const { abi } = artifact;
        let address, contract;
        try {
          address = artifact.networks[networkID].address;
          contract = new web3.eth.Contract(abi, address);
        } catch (err) {
          console.error(err);
        }
        dispatch({
          type: actions.init,
          data: { artifact, web3, accounts, networkID, contract }
        });
      }
    }, []);

  const setWFS = async () => {
    if (!state.contract) {
      return
    }
    const WFstatusId = await state.contract.methods.workflowStatus.call().call()
    switch (WFstatusId) {
      case "0":
        setNextWFStatus("startProposalsRegistering")
        break
      case "1":
        setNextWFStatus("endProposalsRegistering")
        break
      case "2":
        setNextWFStatus("startVotingSession")
        break
      case "3":
        setNextWFStatus("endVotingSession")
        break
      case "4":
        setNextWFStatus("tallyVotes")
        break
      case "5":
        setNextWFStatus("sessionIsOver")
        break
    }
  }

  const fetchVoters = async () => {
    if (!state.contract) {
      return;
    }
    const oldEvents = await state.contract.getPastEvents("VoterRegistered",
      {
        fromBlock: 0,
        toBlock: "latest"
      })
    const oldies = oldEvents.map(item => {
      return (item.returnValues.voterAddress)
    })
    setVoters(oldies)
  }

  useEffect(() => {
    const tryInit = async () => {
      try {
        const artifact = require("../../contracts/Voting.json");
        init(artifact);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    setWFS()
  }, [setWFS])

  useEffect(() => {
    fetchVoters()
  }, [fetchVoters])

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifact);
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifact]);

  return (
    <EthContext.Provider value={{
      state,
      dispatch,
      nextWFstatus,
      voters
    }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
