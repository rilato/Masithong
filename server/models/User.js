const mongoose = require('mongoose');   // mongoose는 mongodb와 js를 연결하기 위한 라이브러리
const bcrypt = require('bcrypt');   // pw를 암호화하기 위한 해시 기능 제공 라이브러리
const saltRounds = 10   // 10자리의 비밀번호인 솔트라운즈
const jwt = require('jsonwebtoken');    // 토큰을 통한 회원 인증과 정보 교류에 사용되는 라이브러리
const moment = require("moment");   // 날짜 데이터를 사용하기 위한 라이브러리

// 몽고디비에 넣을 데이터가 어떻게 생겼는지 여기서 결정
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,  // 공백을 없애주는 역할을 trim이 수행 test 1 -> test1
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    // 어떤 유저가 관리자가 될 수도 있고, 일반 유저가 될 수 있으므로 role 설정
    // 1이면 관리자, 0이면 일반 유저
    role: {
        type: Number,
        default: 0
    }, // image는 뭐에 쓰이길래 string으로 저장한걸까? image string은 지워도 될 듯?
    token: {
        type: String
    },
    // 토큰이 사용할 수 있는 유효기간
    tokenExp: {
        type: Number
    }
})

// pre는 index.js에서 save가 들어가기 전에, 여기서 무언가를 한다는 의미!
// parameter next를 통해, 이 함수가 끝난 후 다음 문장 수행하도록 함.
userSchema.pre('save', function (next) {
    var user = this;    // 여기서 this는 위의 스키마를 가리킨다.

    // 비밀번호 변경 시
    if (user.isModified('password')) {
        // 솔트(salt)를 생성하는데 솔트는 해시 함수에서 암호화된 비밀번호를 생성할 때 추가되는 바이트 단위의 임의의 문자열이다.
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)

            // 첫 번째 인자는 유저가 입력한 원래 비밀번호를 의미, 두 번째 인자는 생성된 salt, 세 번째 인자는 해싱을 위해 사용
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next()  // 해시 완료 후 돌아가기 위해 사용
            })
        })
    } else {
        next()  // 비밀번호를 바꾸지 않는 경우는 그냥 next
    }
})


// plainPassword 1234567
// 암호화된 비밀번호 : $2b$10$..g.GzGNrtogcFlso8Xljesqz88pb85gvecaUMz3P0n95NI0N03w6
// 두 개가 같은지 체크
// 방법은 plainPassword를 다시 암호화해서 암호화된 코드와 비교, routes/users.js에서 사용
userSchema.methods.comparePassword = function (plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}

// 토큰 생성, routes/users.js에서 사용
userSchema.methods.generateToken = function (cb) {
    var user = this;
    // jsonwebtoken을 이용해서 token을 생성하기 
    var token = jwt.sign(user._id.toHexString(), 'secretToken')    //user._id + 'secretToken'을 통해 token을 만들고, 나중에 secretToken을 넣었을 때 user._id를 얻을 수 있도록 함
    var oneHour = moment().add(1, 'hour').valueOf();    // 토큰의 유효기간을 위해 moment() 사용
    user.tokenExp = oneHour;
    user.token = token;
    user.save(function (err, user) {
        if (err) return cb(err)
        cb(null, user);
    })
}

// middleware/auth.js에서 이 함수 사용
userSchema.statics.findByToken = function(token, cb) {
    var user = this;
    // veryfy를 통해 토큰을 decode 한다. 
    jwt.verify(token, 'secretToken', function (err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음에 
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        if(decoded){
            user.findOne({ "_id": decoded, "token": token }, function (err, user) {
                if (err) return cb(err);
                cb(null, user)
            })
        }
        
    })
}

// mongoose.model을 호출할 때 스키마가 등록됨
const User = mongoose.model('User', userSchema) // mongoose는 model의 첫 번째 인자로 컬렉션 이름을 만들음.
// 위와 같이 스키마를 만들었다면 꼭 서버 실행하는 부분에서 require을 해주어야 함.

// exports를 해줘야 다른 곳에서 이 파일을 import 가능
module.exports = { User }