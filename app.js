const express = require('express')
const app = express()
// 解决跨域
const cors = require('cors')
app.use(cors())
// 配置解析表单数据的中间件，只能解析 application/x-www-form-urlencoded格式表单数据
app.use(express.urlencoded({extended:false}))
// 导入并使用用户路由模块
const userRouter = require('./router/user')
app.use('/api',userRouter)

app.listen(3007,()=>{
    console.log('api_server running at http://127.0.0.1:3007')
})