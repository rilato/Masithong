// 유저가 DB에 있으면 인증 Okay
// 유저가 없으면 인증 No!

// User.js에서는 스키마를 결정
const { User } = require('../models/User');

let auth = (req, res, next) => {
    //인증 처리를 하는곳 
    //클라이언트 쿠키에서 토큰을 가져온다.

    let token = req.cookies.w_auth;
    // 토큰을 복호화 한후 유저를 찾는다. 이 함수는 User.js에서 정의되어있음
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ isAuth: false, error: true });
        
        // index.js에서 req.token 자체를 갖다 쓸 수 있도록 아래처럼 코딩
        req.token = token;
        req.user = user;
        next();
    });
};

// exports를 해줘야 다른 곳에서 이 파일을 import 가능
module.exports = { auth };