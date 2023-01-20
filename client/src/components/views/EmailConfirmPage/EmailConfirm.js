import React, { useState } from "react";
import axios from "axios";

var state = {
    createdAuthCode: "",
    authCodeCheck: false,
};
function EmailConfirmPage(props) {
    const [Email, setEmail] = useState("");
    const [AuthCode, setAuthCode] = useState("");

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    };
    const onAuthCodeHandler = (event) => {
        setAuthCode(event.currentTarget.value);
    };

    const onSendMailHandler = (event) => {
        event.preventDefault();
        state.createdAuthCode = Math.random().toString(36).substring(2, 8);

        const dataToSubmit = {
            email: Email,
            auth: state.createdAuthCode,
        };
        axios.post("/api/users/sendEmail", dataToSubmit).then((response) => {
            alert("인증코드가 발송되었습니다");
        });
    };

    const onCheckHandler = (event) => {
        event.preventDefault();

        if (state.createdAuthCode === AuthCode) {
            state.authCodeCheck = true;
            alert("이메일 인증에 성공하셨습니다.");
        } else {
            state.authCodeCheck = false;
            alert("인증코드가 일치하지 않습니다.");
        }
    };
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100vh",
            }}
        >
            <div>
                <form
                    style={{ display: "flex", flexDirection: "column" }}
                    onSubmit={onSendMailHandler}
                >
                    <h2> EmailConfirmPage</h2>
                    <br />
                    <label>Email</label>
                    <div>
                        <input
                            type="email"
                            value={Email}
                            onChange={onEmailHandler}
                            required
                        />
                        <button type="submit">send code</button>
                    </div>
                </form>
                <form
                    style={{ display: "flex", flexDirection: "column" }}
                    onSubmit={onCheckHandler}
                >
                    <label> Authentication Code</label>
                    <div>
                        <input
                            type="text"
                            value={AuthCode}
                            onChange={onAuthCodeHandler}
                            required
                        />
                        <button type="submit">check</button>
                    </div>
                </form>
            </div>
            <a href="/register">회원가입</a>
        </div>
    );
}
export default EmailConfirmPage;