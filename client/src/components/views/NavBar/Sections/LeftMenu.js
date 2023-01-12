// 메인 화면의 좌측 상단 버튼은 관리하는 페이지

import React from 'react';
import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

// 각 코드는 메인 화면의 좌측 상단 버튼처럼 보이게 하므로, 이렇게 코드를 짜는구나 라고 알면 될 듯
function LeftMenu(props) {
  // RightMenu에서 return되는 형식과 동일하지만
  // favorite 대신에 ...이 뜨는 이유는 아마 좌측 상단의 칸이 부족해서 그런게 아닐까 하는 추측 (근데 Navbar.css를 봐도 정확한 원인은 모르겠음)
  return (
    <Menu mode={props.mode}>
      <Menu.Item key="mail">
        {/* Home 버튼 누르면 LandingPage로 갈 수 있도록 href지정 */}
        <a href="/">Home</a>
      </Menu.Item>
      <Menu.Item key="favorite">
        {/* Favorite 버튼 누르면 /favorite endpointer에 해당하는 페이지로 갈 수 있도록 href지정 */}
        <a href="/favorite">Favorite</a>
      </Menu.Item>
    </Menu>
  )
}

export default LeftMenu