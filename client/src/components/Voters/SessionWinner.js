import { useEffect, useState } from "react"
import useEth from "../../contexts/EthContext/useEth"
import Card from "../UI/Card"

const SessionDetails = () => {

    const {state : {contract}} = useEth()
    const [winnerId, setWinnerId] = useState ()

    const determineWinner = async () => {
        if (!contract){
            return
        }
        const winnerIdd = await contract.methods.winningProposalID.call().call()
        setWinnerId(winnerIdd)
    }

    useEffect(() => {
        determineWinner()
    }, [])

    return (
        <Card>
            <p> Who is the winner ?? </p>
            <p>{`the proposal`}  <span> <strong> {winnerId} </strong></span> {`is the winner`} </p>
        </Card>)
}

export default SessionDetails