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
var conv=new Converter({
  toArrayString:true,
  trim:true,
  checkType:true,
});

conv.on('end_parsed',(jsonArray)=>{
  console.log(jsonArray)
  fs.writeFileSync('./actress.json',JSON.stringify(jsonArray,null))
  console.log('finish writefile')
})

fs.createReadStream('./actress.csv').pipe(conv)
