import Card from "../UI/Card"
import classes from "./ProposalForm.module.css"
import {useRef} from "react"
import useEth from "../../contexts/EthContext/useEth"

function VotingForm() {

    const {state : {contract, accounts}} = useEth()

    const textInputRef = useRef()

    const submitFormHandler = async (e) => {
        if (!contract){
            return
        }
        e.preventDefault()
        const id = textInputRef.current.value
        if (isNaN(id)){
            alert ("you must enter a number")
        }
        const tx = await contract.methods.setVote(id).send({from : accounts[0]})
        if (!tx.status){
            alert (`your transaction failed, no vote counted`)
            return ;
        }
        alert (`your voted is casted ! you voted for the proposal ${id} `)
    }

    return (
        <Card>
            <h2> It's time to cast your vote now </h2>
            <li> Please vote for a proposal by entering its Id in the field below </li>
            <li> Your vote must be included inside  </li>
            <li> You can't vote twice </li>
            <p> </p>
            <form className={classes.form} onSubmit={submitFormHandler}>
                <div className={classes.control}>
                    <label htmlFor='id'>Proposal Id</label>
                    <input id='id' rows='5' ref={textInputRef} ></input>
                </div>
                <div className={classes.actions}>
                    <button className='btn'> Vote </button>
                </div>
            </form>
        </Card>
    )
}

export default VotingForm 