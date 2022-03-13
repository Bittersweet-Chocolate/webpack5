/*
 * @Author: czh
 * @Date: 2022-03-05 19:39:31
 * @Description: 
 */
const express = require('express')
const app = express()
app.get('/api', function(req, res) {
  res.json({ custom: 'response' });
});
app.listen(3000, () => {
  console.log("服务开启成功"); //yellow
})