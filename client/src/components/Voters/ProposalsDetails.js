
import {useRef, useState} from "react"
import classes from "./ProposalForm.module.css"
import useEth from "../../contexts/EthContext/useEth"
import Card from "../UI/Card"

function ProposalsDetails() {

    const { state: { contract, accounts } } = useEth()
    const [details, setDetails] = useState()

    const proposalIdRef = useRef()

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        const proposalId = proposalIdRef.current.value
        if (isNaN(proposalId)) {
            alert("please enter an integer, can't exceed the highest proposal Id")
            return;
        }
        const proposal = (await contract.methods.getOneProposal(proposalId).call({ from: accounts[0] }))
        if (!proposal) {
            alert("there is no proposal with this id")
            return;
        }
        let votes = proposal.voteCount
        setDetails(`this proposal has ${votes} votes`)
    }

    return (
        <Card>
            <p> You can use the search tool below to check how many votes a proposal got</p>
            <form className={classes.form} onSubmit={onSubmitHandler}>
                <div className={classes.control}>
                    <label htmlFor='proposalId'>Proposal Id</label>
                    <input type='text' id='proposalId' ref={proposalIdRef} />
                </div>
                <div className={classes.actions}>
                    <button className='btn'>Check proposal details</button>
                </div>
                <div>
                    {details}
                </div>
            </form>
        </Card>
    )
}

export default ProposalsDetails