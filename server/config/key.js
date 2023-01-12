// 배포용인 경우 헤로쿠에 저장
if (process.env.NODE_ENV === 'production') {
    module.exports = require('./prod');
} else {
    // process.env.NODE_ENV === 'development'인 경우
    // 어차피 헤로쿠 가입 안해도, 로컬에서 하고 있기 때문에 여기에 걸리게 되고, 에러없이 실행 가능
    module.exports = require('./dev');
}