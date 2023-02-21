import React, {useState} from "react";
import moment from "moment";
import {useDispatch} from "react-redux";
import {registerUser} from "../../../_actions/user_action";
import { useNavigate } from "react-router-dom";
import {Form, Input, Button, Upload} from "antd";
import axios from "axios";
import UploadImage from "./Sections/UploadImage";

const formItemLayout={
    labelCol:{
        xs: {span: 24},
        sm: {span: 8},
    },

    wrapperCol:{
        xs: {span: 24},
        sm: {span: 16},
    },
};

const tailFormItemLayout ={
    wrapperCol: {
        xs:{
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

function jsonfunc(){
    let json = JSON.parse(localStorage.getItem("cast"));
    let txt = json.email;
    return txt;
}

function Newpassword(){
    window.location.href="../Newpassword";
}

function RegisterPage(props){
    const navigate = useNavigate();
    const [name, setname] = useState("");
    const [lastname, setlastname] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [nickname, setnickname] = useState("");
    const [Images, setImages] = useState([]);
    
    const updateName = (name) => {
        setname(name.currentTarget.value)
    }

    const updateLastname = (Lastname) => {
        setlastname(Lastname.currentTarget.value)
    }

    const updateEmail = (email) => {
        setemail(email.currentTarget.value)
    }

    const updatePassword = (password) => {
        setpassword(password.currentTarget.value)
    }

    const updateNickname = (nickname) => {
        setnickname(nickname.currentTarget.value)
    }

    const updateImages = (newImages) => {
        setImages(newImages)
    }

    const submitHandler = (event) => {
        event.preventDefault();

        if(!name || !lastname || !email || !password || !nickname || Images.length === 0)
        {
            alert("모든 값을 넣어주셔야 합니다.")
        }

        const body ={
            name : name,
            lastname: lastname,
            email : email,
            password : password,
            nickname : nickname,
            images : Images,
        }

        axios.post('api/users',body)
        .then(response => {
            if (response.data.success) {
                alert('회원가입에 성공 했습니다.')
                navigate('/') 
            } else {
                alert('회원가입에 실패 했습니다.')
            }
        })
        .catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log("server responded");
            } else if (error.request) {
              console.log("network error");
            } else {
              console.log(error);
            }
        });    
    }

    return(
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2>Sign up</h2>
            </div>
            <Form onSubmitCapture={submitHandler}>
                {/* DropZone */}
                {/* FileUpload.js의 이미지를 함께 업로드하기 위해 필요한 props */}
                <UploadImage refreshFunction={updateImages} />
                <br />
                <br />
                <label>Name</label>
                {/* Input 다음에 나오는 코드는 onChange가 발생하면 value가 변하도록 함 */}
                <Input onChange={updateName} value={name} />
                <br />
                <br />
                <label>LastName</label>
                <Input onChange={updateLastname} value={lastname} />
                <br />
                <br />
                <label>Email</label>
                <Input onChange={updateEmail} value={jsonfunc()} />
                <br />
                <br />
                <label>Password</label>
                <Input onChange={updatePassword} value={password} />
                <br />
                <br />
                <label>Nickname</label>
                <Input onChange={updateNickname} value={nickname} />
                <br />
                <br />
                <Button htmlType="submit">
                    Submit!
                </Button>
                <br />
                <br />
            </Form>
        </div>
    )
}

export default RegisterPage;