
import Card from "../UI/Card"
import useEth from "../../contexts/EthContext/useEth"
import classes from "./ProposalForm.module.css"
import { useRef, useState, useEffect } from "react"

function VotersDetails() {

    const addressZero = "0x0000000000000000000000000000000000000000"

    const { state: { contract, accounts, web3 } } = useEth()

    const addressRef = useRef()
    const [voterDetails, setVoterDetails] = useState()

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        const address = addressRef.current.value
        if (!web3.utils.isAddress(address) || address === addressZero) {
            alert("please enter a valid address")
            return;
        }
        const details = (await contract.methods.getVoter(address).call({ from: accounts[0] }))
        if (!details.isRegistered) {
            alert("this user wasn't participating to the vote")
            return;
        }
        let votedId = details.votedProposalId
        setVoterDetails(`this address voted for ${votedId}`)
    }

    return (
        <Card>
            <p> You can use the search tool below to know what a certain address voted for</p>
            <form className={classes.form} onSubmit={onSubmitHandler}>
                <div className={classes.control}>
                    <label htmlFor='address'>Address</label>
                    <input type='text' id='address' ref={addressRef} />
                </div>
                <div className={classes.actions}>
                    <button className='btn'>Check voter details</button>
                </div>
                <div>
                    {voterDetails}
                </div>
            </form>
        </Card>
    )
}

export default VotersDetails