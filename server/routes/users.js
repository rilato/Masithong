const express = require('express');
const router = express.Router();    // 웹페이지의 request를 받기 위해 사용
const { User } = require("../models/User"); // models 폴더에서 스키마를 짜고, 그거를 여기서 라우팅하는 용도
//const { Product } = require("../models/Product");

const { auth } = require("../middleware/auth"); // auth는 middleware로 중간에서 뭔가를 하는 것이다.
//const async = require('async');

// endpointer가 /auth인 경우 인증 확인을 위해 get request 사용
router.get("/auth", auth, (req, res) => {
    // 여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 말.
    res.status(200).json({
        _id: req.user._id,  // req로 날아온 user의 _id를 _id로 하여 res(응답)를 보내는 역할인 듯?
        isAdmin: req.user.role === 0 ? false : true, // role이 0이면 일반유저, role이 0이 아니면 관리자
        isAuth: true, // 인증된 사람인지, 즉 로그인된 사람인지
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        history: req.user.history
    });
});

// endpointer가 /register인 경우 등록을 위해 post request 사용
router.post("/register", (req, res) => {
    // 회원 가입할 때 필요한 정보들을 client에서 가져와서 데이터 베이스에 넣어준다
    // 이를 위해 User.js의 내용을 가져온다.
    const user = new User(req.body);
    //req.body에는 아래와 같은 정보가 담긴다.
    //{
    //    id: "hello"
    //    password: "1234"
    //}

    // user의 내용이 mongodb에 저장
    // 저장에 앞서 비밀번호 암호화 하는 것이 선행되어야 함
    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        // err가 없는 경우 즉, json파일로 보냈는데 성공할 경우, success : true가 뜨도록 함
        // Postman으로 회원가입 정보 보내서 확인 가능
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    // 요청된 이메일을 DB에서 찾는다.
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        // 요청된 이메일이 DB에 있다면 비번이 맞는 비번인지 확인한다. User.js에서 이 함수에 대해 정의했음
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });
            // 비번까지 맞다면, 토큰을 생성한다. User.js에서 이 함수에 대해 정의했음
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token) // user.token(토큰)을 쿠키에 저장한다.
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id // 로그인 성공시, loginSuccess: true를 보여주고, userID를 보여준다. 크롬 확장도구인 Redux_devTools의 State를 통해 확인 가능
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    // 로그아웃을 위해 기존에 있던 토큰을 지운다.
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

// router이므로, exports는 router로 한다.
module.exports = router;