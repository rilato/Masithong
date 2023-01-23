import React, { useState } from "react";
import axios from "axios";

function onSame() {
    var EmailBox = document.getElementById("my_email");

    if (
        EmailBox.substring(EmailBox.length - 14, EmailBox.length) ===
        "g.hongik.ac.kr"
    ) {
        alert(EmailBox.value + "님 안녕하세요!");
    }
}

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
            document
                .getElementById("authorizedConfirm")
                .setAttribute("onClick", "location.href='/register'");
        } else {
            state.authCodeCheck = false;
            alert("인증코드가 일치하지 않습니다.");
        }
    };

    const Authentication = (event) => {
        event.preventDefault();

        if (!state.authCodeCheck) {
            alert("먼저 이메일 인증을 해주세요.");
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
                            onInput={onSame}
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

                <form onSubmit={Authentication}>
                    <button id="authorizedConfirm" type="submit">
                        회원가입
                    </button>
                </form>
            </div>
        </div>
    );
}
export default EmailConfirmPage;
