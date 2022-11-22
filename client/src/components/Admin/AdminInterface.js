
import NoticeNoArtifact from "../Errors/NoticeNoArtifact";
import NoticeWrongNetwork from "../Errors/NoticeWrongNetwork";
import NoticeNoAccConnected from "../Errors/NoticeNoAccConnected"
import AddVoter from "./AddVoter"
import VotersList from "./VotersList"
import NextVotingStep from "./NextVotingStep"
import SessionWinner from "../Voters/SessionWinner"
import Card from "../UI/Card"
import useEth from "../../contexts/EthContext/useEth"
import { useHistory } from "react-router-dom"
import React, { useState, useEffect, useCallback } from "react"

function AdminInterface() {

    const { state: { contract, accounts, artifact }, nextWFstatus } = useEth()
    const [isOwner, setIsOwner] = useState()
    const history = useHistory()

    const checkOwnerAddress = async () => {
        if (accounts && contract) {
            const ownerAddy = await contract.methods.owner().call()
            setIsOwner(ownerAddy === accounts[0])
        }
    }

    const goBackThere = () => {
        history.push("/welcome")
    }

    useEffect(() => {
        checkOwnerAddress()
    }, [checkOwnerAddress])

    let content = (
        <div>
            <Card>
                <h2> Hello admin </h2>
                <NextVotingStep />
            </Card>
            <AddVoter />
            <VotersList />
        </div>

    )

    if (!isOwner) {
        content =
            <div>
                <p> Only the administrator can access this page, please go back
                    to the welcome page </p>
                <button className='btn' onClick={goBackThere}> Welcome page </button>
            </div>
    }

    if (nextWFstatus === "sessionIsOver") {
        content =
            <div>
                <Card>
                    <h2> Hello admin </h2>
                    <NextVotingStep />
                </Card>
                <SessionWinner/>
                <VotersList />
            </div>
    }

    return (
        <React.Fragment>
            {!accounts ? <NoticeNoAccConnected /> :
                !artifact ? <NoticeNoArtifact /> :
                    !contract ? <NoticeWrongNetwork /> :
                        content
            }
        </React.Fragment>
    )
}

export default AdminInterface