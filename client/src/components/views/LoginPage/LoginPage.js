// 로그인 및 쿠키 관리(Remember Me 버튼) 페이지

//import  Axios  from 'axios';
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_actions/user_action"; // submitHandler 함수에서 loginUser 함수를 사용하기 위해 필요
import { useNavigate } from "react-router-dom"; // V6로 넘어오면서 history.push가 navigate로 바뀜
// formik과 yup은
// https://velog.io/@roh160308/%EB%A6%AC%EC%95%A1%ED%8A%B8React-Formik-Yup 참고
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Input, Button, Checkbox, Typography } from "antd"; // antd : Ant Design : 중국에서 만든 웹, 앱 디자인 개발을 위한 프레임워크. 대륙의 실수라고 불림
import Icon from "@ant-design/icons";
//import Auth from '../../../hoc/auth';

const { Title } = Typography;
function Password() {
    window.location.href = "../Newpassword";
}

function LoginPage(props) {
    /*const dispatch = useDispatch();
  const navigate = useNavigate();

  // const [Email, setEmail] = useState(initialState)
  // initialState의 처음은 빈 칸이므로 ""
  // "" 안에 문구 입력시, Email을 입력하는 로그인 창에, 해당 문구가 default 값으로 설정 됨 (반투명이 아니므로, 직접 지워야 함!)
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }

  const onSubmitHandler = (event) => {
    // event.preventDefault()를 해주지 않으면, login 버튼 클릭시, 페이지가 refresh됨
    event.preventDefault();

    let body = {
        email: Email,
        password: Password
    }
    
    // 여기있는 loginUser는 src의 actions폴더의 user_action.js에서 구현
    // body에서 email과 password 넣어준 것을 user_action.js에서 parameter로 받음
    // 또한 로그인 후, 메인 페이지로의 이동을 위해 dispatch(loginUser(body)) 다음의 코드를 작성
    dispatch(loginUser(body))
      .then(response => {
        // 로그인이 성공하면
        if (response.payload.loginSuccess) {
          // Favorite.js에서 localStorage가 사용됨. 무비앱 시리즈 9강 13분쯤부터 확인
          window.localStorage.setItem('userId', response.payload.userId);

            navigate('/'); // home 페이지로 이동, V6로 넘어오면서 history.push가 navigate로 바뀜
        } else {
            alert('Error')
        }
      }
    )
  }


  return (
    // 이 부분, <div 안에 css 넣어서 login창의 아래부분이 이상해지지 않도록 구현할 수도 있을 듯?
    // -> 근데 그렇게 해도, 페이지 위쪽의 여백이 사라지지 않음
    <div className="app">

    <Title level={2}>Log In</Title>
      <form style={{ display: 'flex', flexDirection: 'column' }}
          onSubmit={onSubmitHandler}
      >
        {/* 이메일이나 비번을 타이핑을할 때, onChange를 통해 Email과 Password 값을 바꿔준다
          <label>Email</label>
          <input
            type="email"
            value={Email}
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Enter your email"
            onChange={onEmailHandler} />
          <label>Password</label>
          <input
            type="password"
            value={Password}
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Enter your password"
            onChange={onPasswordHandler} />
          <br />
          <button type="submit">
              Login
          </button>
      </form>
    </div>
  ) */

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 저장해야할 데이터가 별로 중요하지 않거나, 유실되도 무방할 데이터라면 서버 단에 데이터를 저장하는 것이 낭비일 수가 있음
    // 클라이언트 단, 즉 브라우저 상에 데이터를 저장할 수 있는 기술인 웹 스토리지 중 하나가 localStorage
    const rememberMeChecked = localStorage.getItem("rememberMe") ? true : false; // 1. rememberMe가 있으면 rememberMeChecked = true, 없으면 false

    const [formErrorMessage, setFormErrorMessage] = useState("");
    const [rememberMe, setRememberMe] = useState(rememberMeChecked); // 2. 현재 상태는 rememberMeChecked(true | false).
    // 여기에 setRememberMe를 통해 rememberMe의 상태를 새롭게 변화시킴
    // handleRememberMe 함수를 통해 setRememberMe함수가 적용되고, rememberMe가 토글됨
    const handleRememberMe = () => {
        setRememberMe(!rememberMe); // rememberMe의 상태를 토글
    };

    const initialEmail = localStorage.getItem("rememberMe")
        ? localStorage.getItem("rememberMe")
        : ""; // 3. rememberMe가 있으면 쿠키에서 가져온다

    return (
        <Formik
            initialValues={{
                email: initialEmail,
                password: "",
            }}
            validationSchema={Yup.object().shape({
                email: Yup.string()
                    .email("Email is invalid")
                    .required("Email is required"),
                password: Yup.string()
                    .min(6, "Password must be at least 6 characters")
                    .required("Password is required"),
            })}
            onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                    let dataToSubmit = {
                        email: values.email,
                        password: values.password,
                    };

                    dispatch(loginUser(dataToSubmit))
                        .then((response) => {
                            if (response.payload.loginSuccess) {
                                // Favorite.js에서 localStorage가 사용됨. 임의로 localSorage에 userId를 넣어놓도록 설정한 코드
                                window.localStorage.setItem(
                                    "userId",
                                    response.payload.userId
                                );
                                if (rememberMe === true) {
                                    //window.localStorage.setItem('rememberMe', values.id);
                                    //!!!!values.id이 아니라 values.email로 바꿔줘야 제대로 remember me 동작!!!!
                                    window.localStorage.setItem(
                                        "rememberMe",
                                        values.email
                                    );
                                } else {
                                    localStorage.removeItem("rememberMe");
                                }
                                navigate("/");
                            } else {
                                setFormErrorMessage(
                                    "Check out your Account or Password again"
                                );
                            }
                        })
                        .catch((err) => {
                            setFormErrorMessage(
                                "Check out your Account or Password again"
                            );
                            setTimeout(() => {
                                setFormErrorMessage("");
                            }, 3000);
                        });
                    setSubmitting(false);
                }, 500);
            }}
        >
            {(props) => {
                const {
                    values,
                    touched,
                    errors,
                    //dirty,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    //handleReset,
                } = props;
                return (
                    <div className="app">
                        <Title level={2}>Log In</Title>
                        <form
                            onSubmit={handleSubmit}
                            style={{ width: "350px" }}
                        >
                            <Form.Item required>
                                <Input
                                    id="email"
                                    prefix={
                                        <Icon
                                            type="user"
                                            style={{ color: "rgba(0,0,0,.25)" }}
                                        />
                                    }
                                    placeholder="Enter your email"
                                    type="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={
                                        errors.email && touched.email
                                            ? "text-input error"
                                            : "text-input"
                                    }
                                />
                                {errors.email && touched.email && (
                                    <div
                                        className="input-feedback"
                                        style={{ paddingTop: "8px" }}
                                    >
                                        {errors.email}
                                    </div>
                                )}
                            </Form.Item>

                            <Form.Item required>
                                <Input
                                    id="password"
                                    prefix={
                                        <Icon
                                            type="lock"
                                            style={{ color: "rgba(0,0,0,.25)" }}
                                        />
                                    }
                                    placeholder="Enter your password"
                                    type="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={
                                        errors.password && touched.password
                                            ? "text-input error"
                                            : "text-input"
                                    }
                                />
                                {errors.password && touched.password && (
                                    <div
                                        className="input-feedback"
                                        style={{ paddingTop: "8px" }}
                                    >
                                        {errors.password}
                                    </div>
                                )}
                            </Form.Item>

                            {formErrorMessage && (
                                <label>
                                    <p
                                        style={{
                                            color: "#ff0000bf",
                                            fontSize: "0.7rem",
                                            border: "1px solid",
                                            padding: "1rem",
                                            borderRadius: "10px",
                                        }}
                                    >
                                        {formErrorMessage}
                                    </p>
                                </label>
                            )}

                            <Form.Item>
                                {/* handleRememberMe는 체크박스 토글 역할, 체크박스가 체크되어있으면 rememberMe 실행 */}
                                <Checkbox
                                    id="rememberMe"
                                    onChange={handleRememberMe}
                                    checked={rememberMe}
                                >
                                    Remember me
                                </Checkbox>
                                <a
                                    className="login-form-forgot"
                                    href="/Newpassword"
                                    style={{ float: "right" }}
                                    onClick={Password}
                                >
                                    forgot password
                                </a>
                                <div>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="login-form-button"
                                        style={{ minWidth: "100%" }}
                                        disabled={isSubmitting}
                                        onSubmit={handleSubmit}
                                    >
                                        Log in
                                    </Button>
                                </div>
                                Or <a href="/register">register now!</a>
                            </Form.Item>
                        </form>
                    </div>
                );
            }}
        </Formik>
    );
}

export default LoginPage;
