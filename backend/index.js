const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {db} = require("./db_connection");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello from the server!' });
});

app.post('/api/getUser', (req,res) => {
    const query = "select * from user where user_id = ? ";
    const { user_id } = req.body;
    const values = [user_id];
    db.query(query, values, (err,results) => {
        if(err){
            console.error("getUser Error",err);
            return res.status(500).json({error:"DB 에러"});
        }
        res.json(results);
    })
})

app.post('/api/setUser', (req,res) => {
    const query = "update user set nickname = ?, referral_user_id = ? where user_id = ? ";
    const { user_id, nickname, referral_user_id } = req.body;
    const values = [ nickname, referral_user_id, user_id];
    db.query(query, values, (err,results) => {
        if(err){
            console.error("getTotalPoint Error",err);
            return res.status(500).json({error:"DB 에러"});
        }
        res.json(results);
    })
})

app.post('/api/getTotalPoint', (req,res) => {
    const query = "select total_point from user where user_id = ? ";
    const { user_id } = req.body;
    const values = [user_id];
    db.query(query, values, (err,results) => {
        if(err){
            console.error("getTotalPoint Error",err);
            return res.status(500).json({error:"DB 에러"});
        }
        res.json(results);
    })
})

app.post('/api/getTotalCount', (req,res) => {
    const query = 'select total_count from user where user_id = ?';
    const { user_id } = req.body;
    const values = [user_id];
    db.query(query, values, (err,results) => {
        if(err){
            console.error("getTotalCount Error",err);
            return res.status(500).json({error:"DB 에러"});
        }
        res.json(results);
    })
})

app.post('/api/getNftPoint', (req,res) => {
    const query = "select nft_point from daily_count where user_id = ? ";
    const { user_id } = req.body;
    const values = [user_id];
    db.query(query, values, (err,results) => {
        if(err){
            console.error("getTotalPoint Error",err);
            return res.status(500).json({error:"DB 에러"});
        }
        res.json(results);
    })
})

app.post('/api/getSlideCount', (req,res) => {
    const query = "select slide_count from daily_count where user_id = ? ";
    const { user_id } = req.body;
    const values = [user_id];
    db.query(query, values, (err,results) => {
        if(err){
            console.error("getSlideCount Error",err);
            return res.status(500).json({error:"DB 에러"});
        }
        res.json(results);
    })
})

app.post('/api/getSpinCount', (req,res) => {
    const query = "select spin_count from daily_count where user_id = ? ";
    const { user_id } = req.body;
    const values = [user_id];
    db.query(query, values, (err,results) => {
        if(err){
            console.error("getSlideCount Error",err);
            return res.status(500).json({error:"DB 에러"});
        }
        res.json(results);
    })
})

app.post('/api/setCount', (req,res) => {
    const query = "update daily_count set slide_count = ?, spin_count = ? where user_id = ?";
    const { user_id, slide_count, spin_count} = req.body;
    const values = [slide_count, spin_count, user_id];
    db.query(query, values, (err,results) => {
        if(err){
            console.error("setCount Error",err);
            return res.status(500).json({error:"DB 에러"});
        }
        res.json(results);
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});