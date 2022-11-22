import { NavLink } from "react-router-dom"
import { useEffect, useState } from "react"
import classes from "./Navigation.module.css"
import useEth from "../../contexts/EthContext/useEth";

function Navigation() {

    const { state: { contract, accounts } } = useEth()
    const [isOwner, setIsOwner] = useState()

    const checkOwnerAddress = async () => {
        if (accounts && contract) {
            const ownerAddy = await contract.methods.owner().call()
            setIsOwner(ownerAddy === accounts[0])
        }
    }

    useEffect(() => {
        checkOwnerAddress()
    }, [checkOwnerAddress])

    return (
        <header className={classes.header}>
            <nav className={classes.nav}>
                <ul>
                    <li>
                        <NavLink activClassName={classes.active} to="/voters">
                            Voters
                        </NavLink>
                    </li>
                    {(isOwner) &&
                        <li>
                            <NavLink activClassName={classes.active} to="/admin">
                                Admin
                            </NavLink>
                        </li>
                    }
                </ul>
            </nav>
        </header>
    )
}

export default Navigation