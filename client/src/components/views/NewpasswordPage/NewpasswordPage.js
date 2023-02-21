import React from "react";
import moment from "moment";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
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

function Login() {
    window.location.href = "../login";
}

function Newpassword(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <Formik
            initialValues={{
                email: "",
                password: "",
                confirmPassword: "",
            }}
            validationSchema={Yup.object().shape({
                email: Yup.string()
                    .email("Email is invaild")
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
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            height: "100vh",
                        }}
                    >
                        <Form
                            style={{ minWidth: "375px" }}
                            {...formItemLayout}
                            onSubmit={handleSubmit}
                        >
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
                                    placeholder="Enter Your Email"
                                    type="email"
                                    value={values.email}
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
                                    placeholder="Enter Your New Password"
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
                                    placeholder="confirm your Password"
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

                            <br />
                            <Form.Item {...tailFormItemLayout}>
                                <Button type="submit" onClick={Login}>
                                    변경완료
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                );
            }}
        </Formik>
    );
}

export default Newpassword;
