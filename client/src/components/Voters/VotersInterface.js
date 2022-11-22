
import NoticeNoArtifact from "../Errors/NoticeNoArtifact";
import NoticeWrongNetwork from "../Errors/NoticeWrongNetwork";
import NoticeNoAccConnected from "../Errors/NoticeNoAccConnected"
import ProposalForm from "./ProposalForm"
import Proposals from "./Proposals"
import VotingForm from "./VotingForm"
import SessionDetails from "./SessionWinner"
import NotAVoter from "./NotAVoter"
import VotersList from "../Admin/VotersList"
import VotersDetails from "./VotersDetails"
import ProposalsDetails from "./ProposalsDetails"
import React, { useState, useEffect } from "react"
import Card from "../UI/Card"
import useEth from "../../contexts/EthContext/useEth"

function VotersInterface() {

    const { state: { accounts, artifact, contract }, nextWFstatus, voters } = useEth()
    const [isVoter, setIsVoter] = useState(false)

    const checkIfVoter = () => {
        if (accounts && voters) {
            const isCorrespondingAddy = voters.indexOf(accounts[0])
            setIsVoter(isCorrespondingAddy !== -1 ? true : false)
        }
    }

    useEffect(() => {
        checkIfVoter()
    }, [checkIfVoter])

    let content

    if (nextWFstatus === "startProposalsRegistering") {
        content =
            <h2> Hello voter, get ready to submit your proposal ! </h2>
    }

    if (nextWFstatus === "endProposalsRegistering") {
        content =
            <React.Fragment>
                <ProposalForm />
                <Proposals />
            </React.Fragment>
    }

    if (nextWFstatus === "startVotingSession") {
        content =
            <Proposals />
    }

    if (nextWFstatus === "endVotingSession") {
        content =
            <React.Fragment>
                <VotingForm></VotingForm>
                <Proposals />
            </React.Fragment>
    }

    if (nextWFstatus === "tallyVotes") {
        content =
            <Card>
                <h2> Voting session is over, get ready to know the winner </h2>
            </Card>
    }

    if (nextWFstatus === "sessionIsOver") {
        content =
            <React.Fragment>
                <SessionDetails />
                <Proposals />
                <ProposalsDetails />
                <VotersList/>
                <VotersDetails/>
            </React.Fragment>
    }

    return (
        <React.Fragment>
            {!accounts ? <NoticeNoAccConnected /> :
                !isVoter ? <NotAVoter /> :
                    !artifact ? <NoticeNoArtifact /> :
                        !contract ? <NoticeWrongNetwork /> :
                            content
            }
        </React.Fragment>
    )
}

export default VotersInterface