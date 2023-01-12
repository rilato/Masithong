// 메인 화면의 우측 상단 버튼은 관리하는 페이지

/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Menu } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

// 각 코드는 메인 화면의 우측 상단 버튼처럼 보이게 하므로, 이렇게 코드를 짜는구나 라고 알면 될 듯
function RightMenu(props) {
  const user = useSelector(state => state.user)
  const navigate = useNavigate();

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(response => {
      if (response.status === 200) {
        navigate("/login");
      } else {
        alert('Log Out Failed')
      }
    });
  };
  
  // 쿠키에 저장 X. 로그아웃 안하고 껐다가 다시 켜면 로그아웃된 상태로 시작. 다만 UI가 이상해서, 로그아웃 상태인데 마치 로그인 된 상태처럼 우측 상단에 업로드와 로그아웃이 뜸
  // => 그래서 /login endpointer를 쳐주지 않으면, 로그인을 할 수 없는 상황 발생
  /*if (user.userData && !user.userData.isAuth) { // userData는 user_reducer.js와 연관, isAuth는 client의 !response.payload.isAuth에서도 등장.
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <a href="/login">로그인</a>
        </Menu.Item>
        <Menu.Item key="app">
          <a href="/register">회원가입</a>
        </Menu.Item>
      </Menu>
    )
  } else {  // 로그인 했을 때 우측 상단에 보이는 메뉴들
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="upload">
          <a href="/product/upload">업로드</a>
        </Menu.Item>
        <Menu.Item key="logout">
          <a onClick={logoutHandler}>로그아웃</a>
        </Menu.Item>
      </Menu>
    )
  }*/

  // 위 코드의 문제를 해결하기 위해, 로그아웃 안하고 껐다가 다시 켜면 이미 로그인 된 상태로 시작. 쿠키에 로그인 데이터 저장
  // userData가 존재하고, isAuth(로그인)된 상태라면
  if (user.userData && user.userData.isAuth) { // userData는 user_reducer.js와 연관, isAuth는 client의 !response.payload.isAuth에서도 등장.
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="upload">
          {/* a href를 통해, 업로드를 누르면 어느 endpointer로 이동할지 경로 설정 */}
          <a href="/product/upload">업로드</a>
        </Menu.Item>
        <Menu.Item key="logout">
          <a onClick={logoutHandler}>로그아웃</a>
        </Menu.Item>
      </Menu>
    )
  } else {  // 로그인 안했을 때 우측 상단에 보이는 메뉴들
    return (
      <Menu mode={props.mode}>
      <Menu.Item key="mail">
        <a href="/login">로그인</a>
      </Menu.Item>
      <Menu.Item key="app">
        <a href="/register">회원가입</a>
      </Menu.Item>
    </Menu>
    )
  }
}

export default RightMenu;