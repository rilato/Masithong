import React, { useState } from "react";
import axios from "axios";

var state = {
    createdAuthCode: "",
    authCodeCheck: false,
};

/*
기본 아이디어
    1. button 태그와 submit속성을 사용
    2. 아래 두개의 이벤트 사용
       onchange : 값이 변경되었을 때 발생하는 이벤트
       onsubmit : 폼의 입력값이 서버로 제출될 때 발생하는 이벤트

    
    


*/

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

        if (
            Email.substring(Email.length - 14, Email.length) ===
            "g.hongik.ac.kr"
        ) {
            axios
                .post("/api/users/sendEmail", dataToSubmit)
                .then((response) => {
                    alert("인증코드가 발송되었습니다");

                    var cast = {
                        email: Email,
                    };
                    localStorage.setItem("cast", JSON.stringify(cast));
                });
        } else {
            alert(
                "이메일 형식이 다릅니다! \n학생 인증을 위해 g.hongik.ac.kr 형식으로 해주세요."
            );
        }
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
