import classes from "./ProposalForm.module.css"
import useEth from "../../contexts/EthContext/useEth"
import React, { useRef } from "react"


function ProposalForm() {

    const { state: { accounts, contract } } = useEth()

    const textInputRef = useRef()

    const submitFormHandler = async (e) => {
        e.preventDefault()
        const proposal = textInputRef.current.value
        if (proposal.trim().length === 0) {
            alert("you can't leave it empty")
            return;
        }
        const addedProposal = await contract.methods.addProposal(proposal).send({ from: accounts[0] })
        if (!addedProposal.status) {
            alert("proposal hasn't been added ser")
        }
        alert ("your proposal has been added !")
    }

    return (
        <React.Fragment>
            <form className={classes.form} onSubmit={submitFormHandler}>
                <div className={classes.control}>
                    <label htmlFor='text'>Text</label>
                    <textarea id='text' rows='5' ref={textInputRef} ></textarea>
                </div>
                <div className={classes.actions}>
                    <button className='btn'>Add Proposal</button>
                </div>
            </form>
            <p> Please respect some rules : </p>
            <ul>
                <li> Don't try to add empty proposals, they won't be accepted </li>
                <li> Don't submit a dozens of proposals too </li>
            </ul>
        </React.Fragment>
    )
}

export default ProposalForm