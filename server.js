// dotenv 모듈 사용 (인증정보를 다른 파일에 저장해서 사용하기 위함)
require('dotenv').config();
const port = process.env.PORT;
const user_name = process.env.USER_NAME;
const password = process.env.PASSWORD;
const db_name = process.env.DB_NAME;
const collection_post = process.env.COLLECTION_POST
const collection_counter = process.env.COLLECTION_COUNTER

const express = require('express');
const app = express();

// form에서 넘어온 데이터를 사용하기 위해서 작성
app.use(express.urlencoded({ extended: true }));
// ejs를 사용하기 위해서 작성
app.set('view engine', 'ejs');

// MongoDB와 연결하기 위해서 작성
var db;
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect(`mongodb+srv://${user_name}:${password}@cluster0.lbrjt.mongodb.net/${db_name}?retryWrites=true&w=majority`,
    (err, client) => {
        // 에러 발생시, 콘솔로 출력하도록 설정
        if (err) return console.log(err);

        db = client.db(db_name);

        // 성공적으로 연결 되었다면 아래 코드를 실행
        app.listen(port, function () {
            console.log(`listening on ${port}`);
        });
    }
);

// app.get('/pet', function(req, res){
//     res.send('pet page');
// });

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/write', function (req, res) {
    res.sendFile(__dirname + '/write.html');
});

app.post('/add', function (req, res) {
    res.send('전송완료');
    console.log(req.body);

    db.collection(collection_counter).findOne(
        { name: 'postCounter' },
        (err, result) => {
            var totalPost = result.totalPost;

            db.collection(collection_post).insertOne(
                {
                    _id: totalPost,
                    title: req.body.title,
                    date: req.body.date
                }, (err, result) => {
                    if (err) return console.log(`/add insertOne err: ${err}`);
                }
            );
        }
    );
});

app.get('/list', function (req, res) {
    db.collection(collection_post).find().toArray((err, result) => {
        if(err) return console.log(`/list find err: ${err}`);

        res.render('list.ejs', { posts: result });
    })
});