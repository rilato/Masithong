import React, { useState} from "react";
import moment from "moment";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../_actions/user_action";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";
import axios from "axios";
import Dropzone from "react-dropzone";
import {PlusOutlined} from '@ant-design/icons';


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


function jsonfunc() {
    let json = JSON.parse(localStorage.getItem("cast"));
    let txt = json.email;
    return txt;
}


function Newpassword() {
    window.location.href = "../Newpassword";
}

function FileUpload(props) {
    
    const [Images, setImages] = useState([])

   
    const dropHandler = (files) => {
      
        let formData = new FormData();

        const config = {
            header: { 'content-type': 'multipart/fomr-data' }
        }

        formData.append("file", files[0])

        
        axios.post('/api/users/image', formData, config)
           
            .then(response => {
                if (response.data.success) {
                  
                    setImages([...Images, response.data.filePath])
                    props.refreshFunction([...Images, response.data.filePath]) 
                } else {
                    alert('파일을 저장하는데 실패했습니다.')
                }
            })
    }

    
    const deleteHandler = (image) => {
        const currentIndex = Images.indexOf(image);
        let newImages = [...Images]
       
        newImages.splice(currentIndex, 1)
        setImages(newImages)
        props.refreshFunction(newImages) 
    }


    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Dropzone onDrop={dropHandler}>
                {({ getRootProps, getInputProps }) => (
                    <div
                        style={{
                            width: 300, height: 240, border: '1px solid lightgray',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        {...getRootProps()}>
                        <input {...getInputProps()} />
                        <PlusOutlined style={{ fontSize: '3rem' }}/>
                    </div>
                )}
            </Dropzone>

            <div style={{ display: 'flex', width: '350px', height: '240px', overflowX: 'scroll' }}>
                {Images.map((image, index) => (
                    <div onClick={() => deleteHandler(image)} key={index}>
                        <img style={{ minWidth: '300px', width: '300px', height: '240px' }}
                            src={`http://localhost:5000/${image}`}
                        />
                    </div>
                ))}


            </div>


        </div>
    )
}


// props는 로그인 성공 후 홈페이지로 이동하기 위해 설정
function RegisterPage() {
  
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [Images, setImages] = useState([]);
   
   
    const updateImages = (Images) => {
        setImages(Images)
    }

   

    const SUPPORTED_FORMATS =["image/jpg", "image/png"];
    return (
        <Formik
            initialValues={{
                image: null,
                email: "",
                lastName: "",
                name: "",
                password: "",
                confirmPassword: "",
                nickname: "",
            }}
            validationSchema={Yup.object().shape({
                image: Yup.mixed().nullable().required("Required Field")
                 .test("size", "File size is too big", (value) =>value && value.size <= 1024 * 1024)
                 .test("type", "Invalid file format selection", (value) => !value || (value && SUPPORTED_FORMATS.includes(value?.type))),
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
                nickname: Yup.string()
                .required("Nickname is required"),
            })}
            onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                    let dataToSubmit = {
                        email: values.email,
                        password: values.password,
                        name: values.name,
                        lastname: values.lastname,
                        nickname: values.nickname,
                        image: values.image,
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
                            <Form.Item required label = "Image">
                               <FileUpload refreshFunction={updateImages} />
                            </Form.Item>
                            <Form.Item required label = "Name">
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
                                    value={jsonfunc()}
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
                            <Form.Item required label="nickname" hasFeedback>
                              <Input id ="nickname" placeholder = "Enter your nickname"
                                type="text" value ={values.nickname} onChange={handleChange}
                                onBlur={handleBlur} className ={errors.nickname && touched.nickname 
                                ? "text-input error" : "text-input"}/>
                                {errors.nickname && touched.nickname && (
                                    <div
                                        className ="input-feedback"
                                        style= {{paddingTop: "8px"}}
                                    >
                                        {errors.nickname}
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
                )
        }}
    </Formik>
    )};

export default RegisterPage;
                    