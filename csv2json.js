/*
const csv = require('csvtojson')
csv().fromFile('./actress.csv').on('json',(json)=>{
  console.log(json)
}).on('done',()=>{
  console.log('finish')
})
*/

const fs =require('fs')
const Converter=require('csvtojson').Converter
var conv=new Converter({});

conv.on('end_parsed',(jsonArray)=>{
  fs.writeFileSync('./actress.json',JSON.stringify(jsonArray,null))
  console.log('finish writefile')
})

fs.createReadStream('./actress.csv').pipe(conv)
