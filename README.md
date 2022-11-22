# React client

This project is bootstraped with [Create React App](https://create-react-app.dev).

# General

This app is the front-end of the following contract address deployed on goerli : 0xc51c71cA6EB67Ff4C0C409FcE7366d454Ff3dF62

This app can be used by two users only : the administrator of the voting session (the wallet that has deployed the above contract)
and by the users that are whitelisted by the administrator. Those users are called voters

The using of this app is very simple. The administrator will in the firstplace whitelist some addresses, then will authorize
those addresses to sumbit proposals. After this, the administrator will run a voting session during which every voter 
will be able to vote for its favourite proposal. Finally, the administrator will end this session and the results will be
made accessible to the voters.

# React architecture

We used a routing approach, by using "links" instead of "only components rendering" depending of some states / conditions.

Three main pages : 
1) Welcome page (accessible to everybody) --> components in "../components/Welcome" 
2) Voters page (accessible to voters) --> components in "../components/Voters" 
3) Admin page (accessible to admin) --> components in "../components/Admin" 

the other components folders are for non-special components (error messages, UI, layout...)

the shared logic is located inside contexts/EthContext/EthProvider