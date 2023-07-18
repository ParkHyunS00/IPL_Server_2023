const db = require('../config/db.js');
const bcrypt = require('bcrypt');
const saltRounds = 5;

module.exports = {

    // 로그인 기능
    login: async (userData) => {
        let existUser = undefined; 
    
        // DB에서 유저 찾기
        db.query(`select * from users where id = '${userData.id}'`, (err, result, fields) => {
            if(err){
                console.log('Find Err');
            } else {
                existUser = result[0];
                const isSame = bcrypt.compareSync(userData.pwd, existUser.pwd); // 암호화된 비밀번호로 비교
    
                if (isSame){
                    console.log('Login Success');
                } else {
                    console.log('Login Fail');
                }
                
            }
        })
    },

    registUser: async (userData) => {
        // 비밀번호 암호화
        const encryptedPwd = bcrypt.hashSync(userData.pwd, saltRounds, (err, hash) => {
            if (err){
                console.log('Encrypt Error');
                return;
            } else {
                console.log('Encrypt Success');
            }
        });

        // DB에 저장
        const query = `insert into users(id, pwd, u_name, nickname, phone_number) values('${userData.id}', '${encryptedPwd}', '${userData.name}', '${userData.nickname}', '${userData.phone_number}')`;
        db.query(query, (err, result, fields) => {
            if (err){
                console.log('User Regist Error');
            } else {
                console.log('User Regist Success');
            }
        });
    }
};

// TODO: 존재하는 유저인지 확인 필요