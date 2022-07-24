// 操作数据库
const db = require('../db/index')
// 加密密码
const bcrypt = require('bcryptjs')
// 导入生成token
const jwt = require('jsonwebtoken')
const config = require('../config')

exports.reguser = (req,res)=>{
    const userinfo = req.body
    if(!userinfo.username || !userinfo.password){
        return console.log('用户名或密码不能为空')
    }
    // 定义sql语句，查询用户名是否被占用
    const sqlstr = 'select * from ev_users where username=?'
    db.query(sqlstr,userinfo.username,(err,results)=>{
        if(err){
            return res.send({status:1,message:err.message})
        }
        // 判断用户名是否占用
        if(results.length > 0){
            return res.send({status:1,message:'用户名被占用，请更换其他用户名'})
        }
        // 用户名可以使用
        // 加密密码
       userinfo.password = bcrypt.hashSync(userinfo.password,10)
        // 定义插入用户
        const sql = 'insert into ev_users set ?'
        db.query(sql,{username:userinfo.username,password:userinfo.password},(err,results)=>{
            if(err) return res.send({status:1,message:err.message})
            // 判断影响行数是否为1
            if(results.affectRows !== 1) return res.send({status:1,message:'注册失败，请稍后再试!'})
            // 注册成功
            res.send({status:0,message:'注册成功!'})
        })
    })

    // res.send('reguser OK')
}
exports.login = (req,res)=>{
    const userinfo = req.body
    const sql = 'select * from ev_users where username=?'
    db.query(sql,userinfo.username,(err,results)=>{
        if(err) return res.send({status:1,message:err.message})
        if(results.length !== 1) return res.send('登录失败')
        // 判断密码是否正确
        const compareResult = bcrypt.compareSync(userinfo.password,results[0].password)
        if(!compareResult) return res.send('密码错误')

        // 登录成功 在服务器端生成token字符串
        const user = {...results[0],password:'',user_pic:''}
        // 加密，生成token字符串
        const tokenstr = jwt.sign(user,config.jwtSecretKey,{expiresIn:config.expiresIn})
        
    })
    // res.send('login OK')
}