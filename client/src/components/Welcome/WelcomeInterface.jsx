import React, { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import NoticeNoArtifact from "../Errors/NoticeNoArtifact";
import NoticeWrongNetwork from "../Errors/NoticeWrongNetwork";
import NoticeNoAccConnected from "../Errors/NoticeNoAccConnected"
import Card from "../UI/Card"
import classes from "./WelcomeInterface.module.css"

function Demo() {
  const { state } = useEth();

  const welcomeParagraph =
    <section className={classes.summary}>
      <h2> Welcome ser </h2>
      <p>
        If you are here, it means that you are going to participate
        to an amazing voting session, either as a voter or an admin.
        The voters will access the voting session by clicking first
        on the top right, on the Voters link. To be a voter, you need to be
        whitelisted. So if you are not, unfortunately you won't be able
        to participate.
      </p>
      <p>
        As you may know, every voter will be able to submit proposals
        during a certain time span. Then the REAL voting session will
        open and you will have to vote for ONE proposal only, by using
        the proposal ID.
      </p>
      <p>
        Happy voting sers !
      </p>
    </section>

  return (
    <React.Fragment>
      <Card>
        {!state.accounts ? <NoticeNoAccConnected/> :
          !state.artifact ? <NoticeNoArtifact /> :
            !state.contract ? <NoticeWrongNetwork /> :
              welcomeParagraph
        }
      </Card>
    </React.Fragment>
  );
}

export default Demo;
