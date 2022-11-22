
import Card from "../UI/Card"
import useEth from "../../contexts/EthContext/useEth"
import { useEffect, useCallback, useState } from "react"

function Proposals() {

    const { state: { contract, accounts } } = useEth()
    const [proposals, setProposals] = useState([])

    const fetchProposals = async () => {
        if (!contract || !accounts) {
            return
        }
        const proposalsEvents = await contract.getPastEvents("ProposalRegistered",
            {
                fromBlock: 0,
                toBlock: "latest"
            })
        const propsLength = proposalsEvents.length
        const propsList = []
        for (let i = 1 ; i < propsLength+1 ; i ++){
            const proposalObj = await contract.methods.getOneProposal(i).call({from : accounts[0]})
            propsList.push(proposalObj[0])
        }
        setProposals(propsList)
    }

    useEffect(() => {
        fetchProposals()
    }, [])

    return (
        <Card>
            <h2> Proposals : </h2>
            <p> Please refresh from time to time to update the list </p>
            <ul>
                {proposals.map((propal, ind) => (
                    <li> {`${ind + 1} : ${propal}`} </li>
                ))}
            </ul>
        </Card>
    )
}

export default Proposals
