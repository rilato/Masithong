// Navigation Bar (링크를 사용한 리스트 메뉴 등, 다른 페이지로 넘어갈 수 있는 하이퍼링크(클릭 메뉴)를 지정하는 페이지)
// 페이지 상단에 로고를 포함한 모든 버튼들을 관리한다고 보면 됨

import React, { useState } from 'react';
import LeftMenu from './Sections/LeftMenu';
import RightMenu from './Sections/RightMenu';
import { Drawer, Button } from 'antd';
import Icon from '@ant-design/icons';
import './Sections/Navbar.css';

function NavBar() {
  //const [visible, setVisible] = useState(false)
  // visible 속성이 없어지고 open 속성을 쓰도록 바뀜
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
      setOpen(true);
  };

  // const showDrawer = () => {
  //   setVisible(true)
  // };

  const onClose = () => {
    setOpen(false)
  };

  return (
    // menu__logo, menu__container 등은 Sections/Navbar.css에서 정의해 놓았음
    <nav className="menu" style={{ position: 'fixed', zIndex: 5, width: '100%' }}>
      <div className="menu__logo">
        <a href="/">홍수저</a>
      </div>
      <div className="menu__container">
        <div className="menu_left">
          {/* LeftMenu, RightMenu는 모두 Sections/ 내부의 파일에서 가져온 것들 */}
          <LeftMenu mode="horizontal" />
        </div>
        <div className="menu_rigth">
          <RightMenu mode="horizontal" />
        </div>
        <Button
          className="menu__mobile-button"
          type="primary"
          onClick={showDrawer}
        >
          <Icon type="align-right" />
        </Button>
        <Drawer
          title="Basic Drawer"
          placement="right"
          className="menu_drawer"
          closable={false}
          onClose={onClose}
          open={open}
          //visible={visible}
        >
          <LeftMenu mode="inline" />
          <RightMenu mode="inline" />
        </Drawer>
      </div>
    </nav>
  )
}

export default NavBar