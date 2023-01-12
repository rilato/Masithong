// 현재 이용중인 사용자의 권한에 맞게 특정 페이지를 출입할 수 있도록 하기 위한 페이지

import React, { useEffect } from 'react';
//import Axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';
import { useNavigate } from 'react-router-dom';

export default function (SpecificComponent, option, adminRoute = null) {
    // App.js와 관련있는 함수

    // 위의 parameter에서 SpecificComponent가 App.js의 LandingPage 컴포넌트

    // parameter에서 option은 세 가지 옵션이 존재
    // null => 아무나 출입이 가능한 페이지
    // true => 로그인한 유저만 출입이 가능한 페이지
    // false => 로그인한 유저는 출입 불가능한 페이지

    // parameter에서 adminRoute가 true로 들어오면, 관리자만 관리할 수 있는 페이지가 된다.
    // true를 지정하지 않으면, 기본 값으로 null을 지정하므로, 인자를 쓸 때 생략 가능하다.
    function AuthenticationCheck(props) {

        let user = useSelector(state => state.user);
        const dispatch = useDispatch();
        const navigate = useNavigate();

        useEffect(() => {
            // Axios.get('/api/users/auth)를 쓸 수 있지만, 대신에 react-redux를 사용한다.
            dispatch(auth()).then(response => {
                console.log(response);
                //로그인 하지 않은 상태
                if (!response.payload.isAuth) {
                    // 로그인하지 않은 상태인데, 로그인한 유저만 출입 가능한 페이지로 들어가려 하는 경우
                    // login페이지로 강제로 이동시킨다.
                    if (option === true) {
                        navigate('/login')
                    }
                } else {
                    //로그인 한 상태 
                    // !response.payload.isAdmin, 즉 관리자가 아닌 사람이
                    // adminRoute === true, 즉 관리자만 들어갈 수 있는 페이지를 들어가려 하는 경우
                    // 못들어가게 한다 (LandingPage로 보낸다)
                    if (adminRoute && !response.payload.isAdmin) {
                        navigate('/')
                    } 
                    else {
                        // 로그인한 유저가 출입 불가능한 페이지를 들어가는 경우
                        // 강제로 LandingPage로 보낸다.
                        if (option === false)
                            navigate('/')
                    }
                }
            })
        }, [])

        // export할 함수의 첫번째 인자인 SpecificComponent 관련 리턴
        return (
            <SpecificComponent {...props} user={user} />
        );
    }

    // export할 함수 내부의 또다른 함수의 이름을 리턴
    return <AuthenticationCheck />
}