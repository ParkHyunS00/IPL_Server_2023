const db = require('../config/db.js');
const sharp = require('sharp');
const path = require('path');

module.exports = {
    // 게시물 조회
    getBoardList: async (userId) => {
        return new Promise((resolve, reject) => {
            let query = `select * from board`; // 전체 게시물

            if (userId){
                query = `select * from board where user_id='${userId}'`; // 나의 게시물 조회시
            }

            db.query(query, (err, results) => {
                if (err){
                    console.log('Error : ', err.message);
                    reject(err);
                    return;
                }

                const boardList = {boardList: results};
                resolve(boardList);
            });
        });
    },

    // 게시물 등록
    insertPost: async (postData) => {
        return new Promise((resolve, reject) => {
            const query = `insert into board values (null, '${postData.title}', '${postData.content}',
                        '${postData.image_name}', now(), '${postData.user_id}')`;

            db.query(query, (err, result) => {
                if (err){
                    console.log('Error while insert into board table : ', err.message);
                    reject(err);
                    return;
                }

                // TODO: 클라이언트에서 보낸 이미지를 먼저 저장하기.
                
                // 리사이즈된 이미지 구분하기 위해 이름 형식 지정 => {클라이언트가 보낸 이미지 이름}_{DB에 저장된 PK}.확장자
                const renaming = `${postData.image_name.split(".")[0]}_${result.insertId}.jpg`;

                sharp(path.join(__dirname, '..', 'public', postData.image_name))
                    .resize(300, 300, {fit: 'contain'})  // fit : contain 가로 세로 비율 강제 유지
                    .withMetadata()  // 원본 이미지 메타데이터 포함
                    .toFormat('jpeg', {quality: 100}) // 포맷, 퀄리티 지정
                    .toFile(path.join(__dirname, '..', 'public', renaming), (err, info) => { // 저장 경로를 첫번째 인수에 지정
                        // 리사이즈 이미지 로컬에 저장
                        if (err) {
                            console.log('Error while resizing - saving image: ', err.message);
                            reject(err);
                            return;
                        }
                        
                        console.log(`Resize Image Info : ${JSON.stringify(info, null, 2)}`);
                    })
                    .toBuffer(); // 리사이즈 이미지를 노드에서 읽을 수 있도록 변환

                
                resolve(result.insertId); // auto_increment에 따라 생성된 최근 id값
            });
        });
    },

    // 게시물 클릭시 상세보기 -> PK로 검색
    selectPost: async (postNum) => {
        return new Promise((resolve, reject) => {
            const query = `select * from board where num='${postNum}'`;

            db.query(query, (err, result) => {
                if (err){
                    console.log('Error while select from board with num : ', err.message);
                    reject(err);
                    return;
                }

                resolve(result[0]);
            })
        })
    }
}