import React,{useState,useEffect} from "react";
import { USER_SERVER } from "../../Config";
import axios from "axios";

function MyPage(){

    const [username, setUsername] = useState("");
    const [userlastname, setUserlastname] = useState("");
    const [useremail, setUseremail] = useState("");
    const [usernickname, setUsernickname] = useState("");
    const [userimage, setUserimage] = useState([]);

    useEffect(() => {
        axios.get(`${USER_SERVER}/auth`)
        .then(res=>{
            console.log(res.data)
            setUserimage(res.data.images[0])
            setUsername(res.data.name)
            setUserlastname(res.data.lastname)
            setUseremail(res.data.email)
            setUsernickname(res.data.nickname)
            console.log(username)
            console.log(userlastname)
            console.log(useremail)
            console.log(usernickname)
            console.log(userimage)
        })
    },[username,userlastname,useremail,usernickname])
   


    return(
        <div>
            <img src={userimage} alt="사용자 이미지"/>
            <h5>이름: {username}</h5>
            <h5>성: {userlastname}</h5>
            <h5>이메일: {useremail}</h5>
            <h5>닉네임: {usernickname}</h5>
        </div>
    )
}

export default MyPage;