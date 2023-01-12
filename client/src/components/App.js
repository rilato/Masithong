// app.js는 node module을 로딩하고 초기 initialize해야 하는 변수나 Object를 선언하고 Router에 유입이 이루어지는 그 유입점의 역할을 하는 JavaScript

import React, { Suspense } from "react";
import {
    BrowserRouter as Router,
    // Switch는 v5버전이고, 현재는 v6이므로 Routes를 씀
    Routes,
    Route,
    Link,
} from "react-router-dom";

// 필요한 모든 페이지의 컴포넌트를 추가
import LandingPage from "./views/LandingPage/LandingPage";
import LoginPage from "./views/LoginPage/LoginPage";
import RegisterPage from "./views/RegisterPage/RegisterPage";
import Auth from "../hoc/auth";
import NavBar from "./views/NavBar/NavBar";
import UploadProductPage from "./views/UploadProductPage/UploadProductPage.js";
import DetailProductPage from "./views/DetailProductPage/DetailProductPage";
import FavoritePage from "./views/FavoritePage/FavoritePage";
import Newpassword from "./views/Newpassword/Newpassword";

//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {
    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <NavBar />
                <div style={{ paddingTop: "69px" }}></div>
                <div>
                    <Routes>
                        {
                            // path는 app 내부의 경로를 설정하는 endpointer를 정하는거고
                            // element={<LandingPage />}에서 LandingPage는 내가 만든 페이지 이름으로, 실제 코드가 작동하는 부분
                        }
                        {
                            // higier order component, 즉 hoc(특별한 목적)인 Auth가 LandingPage 등을 감싸도록 한다.
                            // 즉, 인증 여부를 거쳐야 페이지를 사용할 수 있는 권한을 부여하는 것이다.
                            // Auth 함수는 auth.js와 관련 있는 함수다.
                            // 해당 유저가 어떤 사람인지 파악하여, null, true, false 값을 지정한다.
                            // null => 아무나 출입이 가능한 페이지
                            // true => 로그인한 유저만 출입이 가능한 페이지
                            // false => 로그인한 유저는 출입 불가능한 페이지
                            // LandingPage는 아무나 들어갈 수 있으므로 null
                            // LoginPage는 로그인한 유저는 출입할 수 없으므로 false
                            // RegisterPage도 로그인한 유저는 출입할 수 없으므로 false
                            // UploadProductPage는 로그인한 유저가 출입할 수 있으므로 true
                            // DetailProductPage는 아무나 들어갈 수 있으므로 null
                            // FavoritePage는 로그인한 유저만 볼 수 있으므로 true
                            // admin한 유저(관리자)만 들어갈 수 있는 페이지를 만들기 위해서는 다음과 같이 코딩한다.
                            // <Route  path="/" element={Auth(LandingPage, null, true)} />
                        }
                        <Route path="/" element={Auth(LandingPage, null)} />
                        <Route path="/login" element={Auth(LoginPage, false)} />
                        <Route
                            path="/register"
                            element={Auth(RegisterPage, false)}
                        />
                        <Route
                            path="/product/upload"
                            element={Auth(UploadProductPage, true)}
                        />
                        {/* product의 _id를 endpointer로 넣기 위해서는 :를 꼭 포함시켜야함!
            그래야 product/_id형식의 endpointer로 인식 */}
                        <Route
                            path="/product/:productId"
                            element={Auth(DetailProductPage, null)}
                        />
                        <Route
                            path="/favorite"
                            element={Auth(FavoritePage, true)}
                        />
                        <Route
                            path="/Newpassword"
                            element={Auth(Newpassword, null)}
                        />
                    </Routes>
                </div>
            </Suspense>
        </Router>
    );
}

// es6에서는 내보낼 단일객체를 위해 export를 사용하고, 그 이전 버전의 CommonJS에서는 module.exports를 사용한다.
// https://www.daleseo.com/js-module-import/
export default App;

// export default :
// 코딩 중 export할 파일소스 내 제일 처음 export default로 정의한 클래스(함수, 변수등 모든 정의되것들)로 가지고옴
// 같은 소스 내에 export default로 정의한 것들이 여러 개 있다 하더라도 제일 처음 정의한 것만 가능

// export : export할 파일소스내의 클래스(함수, 변수등 모든 정의되것들)들 중 “import {그안에 들어있는 것들중1, 것들중2,것들중3, 계속추가} from 파일.js” 처럼 특정해서 사용됨
