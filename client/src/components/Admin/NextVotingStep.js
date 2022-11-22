import { useEffect, useState, useCallback } from "react"
import useEth from "../../contexts/EthContext/useEth"


function NextVotingStep() {

    const { state: { contract, accounts }, nextWFstatus } = useEth()

    const goToNextStep = async () => {
        switch (nextWFstatus) {
            case ("startProposalsRegistering"):
                await contract.methods.startProposalsRegistering().send({ from: accounts[0] })
                break
            case ("endProposalsRegistering"):
                await contract.methods.endProposalsRegistering().send({ from: accounts[0] })
                break
            case ("startVotingSession"):
                await contract.methods.startVotingSession().send({ from: accounts[0] })
                break
            case ("endVotingSession"):
                await contract.methods.endVotingSession().send({ from: accounts[0] })
                break
            case ("tallyVotes"):
                await contract.methods.tallyVotes().send({ from: accounts[0] })
                break
            case ("sessionIsOver"):
                const emptyFunc = () => {}
        }
    }

    let content =
        <span>
            <p> Go to next voting step : </p>
            <button className="btn" onClick={goToNextStep}> {`${nextWFstatus}`}  </button>
        </span>


return (
    <div>
        {(nextWFstatus !== "sessionIsOver") && content}
        {(nextWFstatus === "sessionIsOver") && <h2> The voting session is over </h2>}
    </div>
)
}

export default NextVotingStep