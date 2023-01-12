// 회원가입 관련 페이지
// 전체적인 구조는 LoginPage.js와 유사

import React, { useState } from "react";
import moment from "moment";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../_actions/user_action";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

function Newpassword() {
    window.location.href = "../Newpassword";
}

// props는 로그인 성공 후 홈페이지로 이동하기 위해 설정
function RegisterPage(props) {
    /*const dispatch = useDispatch();
  const navigate = useNavigate();

  // initialState의 처음은 빈 칸이므로 ""
  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
  }

  const onNameHandler = (event) => {
    setName(event.currentTarget.value)
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }

  const onConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value)
  }

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if(Password !== ConfirmPassword){
      return alert('비밀번호와 비밀번호 확인은 같아야 합니다.')
    }

    let body = {
        email: Email,
        name: Name,
        password: Password
    }
    
    // redux를 쓰지 않는 경우, 원래는 다음과 같이 씀
    // Axios.post('.api/users/register', body)

    // 액션의 이름은 registerUser
    dispatch(registerUser(body))
      .then(response => {
        // 회원가입이 성공하면
        if (response.payload.success) {
            // 로그인 페이지로 이동
            navigate('/login');
        } else {
            alert('Failed to Sign up')
        }
      }
    )
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center'
      , width: '100%', height: '100vh'
    }}>
      {/* 이메일이나 비번을 타이핑을할 때, onChange를 통해 Email과 Password 값을 바꿔준다
      <form style={{ display: 'flex', flexDirection: 'column' }} {...formItemLayout}
          onSubmit={onSubmitHandler}
      >
          <label>Email</label>
          <input type="email" value={Email} onChange={onEmailHandler} />

          <label>Name</label>
          <input type="text" value={Name} onChange={onNameHandler} />

          <label>Password</label>
          <input type="password" value={Password} onChange={onPasswordHandler} />

          <label>Confirm Password</label>
          <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />

          <br />
          <Form.Item {...tailFormItemLayout}>
            <button type="submit">
              회원가입
            </button>
          </Form.Item>
      </form>
    </div>
  )*/
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <Formik
            initialValues={{
                email: "",
                lastName: "",
                name: "",
                password: "",
                confirmPassword: "",
            }}
            validationSchema={Yup.object().shape({
                name: Yup.string().required("Name is required"),
                lastName: Yup.string().required("Last Name is required"),
                email: Yup.string()
                    .email("Email is invalid")
                    .required("Email is required"),
                password: Yup.string()
                    .min(6, "Password must be at least 6 characters")
                    .required("Password is required"),
                confirmPassword: Yup.string()
                    .oneOf([Yup.ref("password"), null], "Passwords must match")
                    .required("Confirm Password is required"),
            })}
            onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                    let dataToSubmit = {
                        email: values.email,
                        password: values.password,
                        name: values.name,
                        lastname: values.lastname,
                        image: `http://gravatar.com/avatar/${moment().unix()}?d=identicon`,
                    };

                    dispatch(registerUser(dataToSubmit)).then((response) => {
                        if (response.payload.success) {
                            navigate("/login");
                        } else {
                            alert(response.payload.err.errmsg);
                        }
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
                    dirty,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    handleReset,
                } = props;
                return (
                    <div className="app">
                        <h2>Sign up</h2>
                        <Form
                            style={{ minWidth: "375px" }}
                            {...formItemLayout}
                            onSubmit={handleSubmit}
                        >
                            <Form.Item required label="Name">
                                <Input
                                    id="name"
                                    placeholder="Enter your name"
                                    type="text"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={
                                        errors.name && touched.name
                                            ? "text-input error"
                                            : "text-input"
                                    }
                                />
                                {errors.name && touched.name && (
                                    <div
                                        className="input-feedback"
                                        style={{ paddingTop: "8px" }}
                                    >
                                        {errors.name}
                                    </div>
                                )}
                            </Form.Item>

                            <Form.Item required label="Last Name">
                                <Input
                                    id="lastName"
                                    placeholder="Enter your Last Name"
                                    type="text"
                                    value={values.lastName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={
                                        errors.lastName && touched.lastName
                                            ? "text-input error"
                                            : "text-input"
                                    }
                                />
                                {errors.lastName && touched.lastName && (
                                    <div
                                        className="input-feedback"
                                        style={{ paddingTop: "8px" }}
                                    >
                                        {errors.lastName}
                                    </div>
                                )}
                            </Form.Item>

                            <Form.Item
                                required
                                label="Email"
                                hasFeedback
                                validateStatus={
                                    errors.email && touched.email
                                        ? "error"
                                        : "success"
                                }
                            >
                                <Input
                                    id="email"
                                    placeholder="Enter your Email"
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

                            <Form.Item
                                required
                                label="Password"
                                hasFeedback
                                validateStatus={
                                    errors.password && touched.password
                                        ? "error"
                                        : "success"
                                }
                            >
                                <Input
                                    id="password"
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

                            <Form.Item required label="Confirm" hasFeedback>
                                <Input
                                    id="confirmPassword"
                                    placeholder="Enter your confirmPassword"
                                    type="password"
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={
                                        errors.confirmPassword &&
                                        touched.confirmPassword
                                            ? "text-input error"
                                            : "text-input"
                                    }
                                />
                                {errors.confirmPassword &&
                                    touched.confirmPassword && (
                                        <div
                                            className="input-feedback"
                                            style={{ paddingTop: "8px" }}
                                        >
                                            {errors.confirmPassword}
                                        </div>
                                    )}
                            </Form.Item>

                            <Form.Item {...tailFormItemLayout}>
                                <Button
                                    onClick={handleSubmit}
                                    type="primary"
                                    disabled={isSubmitting}
                                >
                                    Submit
                                </Button>
                                <Button onClick={Newpassword}>
                                    Forget password?
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                );
            }}
        </Formik>
    );
}

export default RegisterPage;
