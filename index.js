const req = require('request')
const cio = require('cheerio')
const fs = require('fs')
const iconv = require('iconv-lite');

const baseUrl='http://actress.dmm.co.jp'
const topUrl=baseUrl+'/-/top/';

req({url:topUrl, encoding: null }, (e,res,body)=>{

    if(e){
        console(e)
    }

    try{

        let buf = new Buffer(body);
        body = iconv.decode(buf,'euc-jp');
        const $ = cio.load(body)

        // fs.writeFileSync('out.txt',body)

        $('.menu_aiueo td>a').each( function(d,elm){

            //fs.appendFileSync('out.txt',$(elm).text())
            console.log( $(elm).text() )
            console.log( baseUrl+$(elm).attr('href') )
        })


    }catch(e){
        console.log(e)
    }


})