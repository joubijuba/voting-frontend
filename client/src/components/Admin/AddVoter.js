import React, { useEffect, useRef, useState } from "react"
import useEth from "../../contexts/EthContext/useEth"
import classes from "./AddVoter.module.css"
import Card from "../UI/Card"

function AddVoter() {

    const { state: { contract, accounts, web3 }, nextWFstatus } = useEth()
    const [bool, setBool] = useState()
    const addressZero = "0x0000000000000000000000000000000000000000"

    const address = useRef()

    const addVoter = async (e) => {
        e.preventDefault()
        const voterAddress = address.current.value
        if (!web3.utils.isAddress(voterAddress) || voterAddress === addressZero) {
            alert("please enter a valid address")
            return;
        }
        await contract.methods.addVoter(voterAddress).send({ from: accounts[0] })
    }

    useEffect(() => {
        setBool(nextWFstatus === "startProposalsRegistering")
    }, [nextWFstatus])

    return (
        <Card>
            {bool && <p>time to whitelist some users</p>}
            <form className={classes.form} onSubmit={addVoter}>
                {!bool && <p> !! You can't whitelist addresses anymore !!</p>}
                <div className={classes.control}>
                    <label htmlFor='address'>Address</label>
                    <input type='text' id='address' ref={address} />
                </div>
                <div className={classes.actions}>
                    <button
                        className='btn'
                        disabled={!bool}>Add voter</button>
                </div>
            </form>
        </Card>
    )
}

export default AddVoter