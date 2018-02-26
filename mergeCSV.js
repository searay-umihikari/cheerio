const csv = require('csv')
const fs = require('fs')

const parser = csv.parse((err, data) => console.log(data));
let csvdata=fs.createReadStream('./actress.csv').pipe(parser)


//"id,name,yomi,img,birth,constellation,blood,T,B,W,H,cap,birthplace,hobby"
