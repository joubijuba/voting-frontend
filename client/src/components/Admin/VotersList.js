import React, { useState, useEffect } from "react"
import useEth from "../../contexts/EthContext/useEth"
import Card from '../UI/Card'

function VotersList() {

    const { voters } = useEth()

    return (
        <Card>
            <p> Whitelisted addresses : </p>
            <ul>
                {voters.map(address => (
                    <li> {address} </li>
                ))}
            </ul>
        </Card>
    )
}

export default VotersList