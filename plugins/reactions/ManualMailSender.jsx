import React, { useState, useCallback } from "react";
import styles from "./ReactionsOverview.css";
import Paper from '@material-ui/core/Paper';
import * as request from "superagent";

import getConfig from "./config";
import { useEffect } from "react";
const config = getConfig();
const { sendFeedbackMailEndpoint } = config;

const FormInput = ({ onChange, text, value }) => {
    const handleChange = useCallback((e) => { onChange(e.target.value) }, [onChange]);
    return (
        <div className={styles.manualMailSenderFormInputSet}>
            <label className={styles.manualMailSenderFormInputLabel}>{text}</label>
            <input type="text" value={value} onChange={handleChange} />
        </div>
    )
}

const ManualMailSender = ({ production }) => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [state, setState] = useState();

    const onSend = useCallback(async () => {
        if (!name || !email) {
            return;
        }
        setState("sending");
        await request
            .post(sendFeedbackMailEndpoint)
            .send({
                name,
                email,
                productionID: production.id,
                productionName: production.title,
            });
        setState("success");
        setName("");
        setEmail("");
    }, [name, email, production]);

    const maybeRenderStateMsg = useCallback(() =>
        state === "success" ?
            <label style={{ color: "green" }}>Success!</label> :
            null
        , [state]
    );
    useEffect(() => {
        if (state === "success") {
            setTimeout(() => { setState(undefined) }, 3000);
        }
    }, [state]);

    const renderButton = useCallback(() =>
        state === "sending" ? <label>wordt verstuurd...</label> : (
            <div className={styles.manualMailSenderFormSubmit} onClick={onSend}>Verstuur</div>
        )
        , [onSend, state]
    );

    return (
        <Paper className={styles.manualMailSender}>
            <h6 className={styles.manualMailSenderTitle}>
                Stuur een reactie-uitnodigingsmail voor {production.title}
            </h6>
            <div className={styles.manualMailSenderForm}>
                <FormInput onChange={setName} text="Naam" value={name} />
                <FormInput onChange={setEmail} text="Email" value={email} />
                {renderButton()}
                {maybeRenderStateMsg()}
            </div>
        </Paper>
    )
}
export default ManualMailSender;