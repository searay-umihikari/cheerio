const req = require('request')
const cio = require('cheerio')
const fs = require('fs')
const iconv = require('iconv-lite');

const baseUrl = 'http://actress'
const topUrl = baseUrl + '/-/top/';


main()


function get$(body){
  let buf = new Buffer(body)
  body = iconv.decode(buf, 'euc-jp')
  const $ = cio.load(body)
  return $;
}


async function main() {
  let indexULRList = []

  //get index URL List
  let body = await doReq(topUrl)
  let $ = get$(body)
  $('.menu_aiueo td>a').each(function (d, elm) {
    let url = baseUrl + $(elm).attr('href')
    indexULRList.push(url)
  })


//  for(let i=0; i<indexULRList.length; i++){

    //index単位で取得

    body =  req({url: indexULRList[0], encoding: null}, (e, res, body) => {

      $ = get$(body)

      let maxPage = Number ($("td.header").eq(1).text().match( new RegExp("全(.*)ページ中") )[1])
      console.log(maxPage)

      //for(let a=0; a<$('.list').length; a++){
        let actUrl = $('.list').eq(0).find('.pic a').attr('href')
        req({url: actUrl, encoding: null}, (e, res, body) => {




          $ = get$(body)
          let link = $("link[rel=canonical]").attr('href')
          let names = $(".t1 h1").text().match( new RegExp("(.*)（(.*)）") )
          let name = names[1]
          let yomi = names[2]
          let img = $('.area-av30 td').eq('0').find("img").attr('src')
          let birth = $('.area-av30 table tr').eq('0').find("td").eq('1').text()
          let constellation = $('.area-av30 table tr').eq('1').find("td").eq('1').text()
          let blood = $('.area-av30 table tr').eq('2').find("td").eq('1').text()
          let size = $('.area-av30 table tr').eq('3').find("td").eq('1').text()
          let birthplace = $('.area-av30 table tr').eq('4').find("td").eq('1').text()
          let hobby = $('.area-av30 table tr').eq('5').find("td").eq('1').text()

          let infoData={
            name:name,
            yomi:yomi,
            url:link,
            img:img,
            birth:birth,
            constellation:constellation,
            blood:blood,
            size:size,
            birthplace:birthplace,
            hobby:hobby
          }
          console.log(infoData)

        })
      //}
    })

// }

}

function doReq(url) {
  return new Promise(function (resolve, reject) {
    req({url: url, encoding: null}, (e, res, body) => {
      if (e) {
        reject(e)
      } else {
        console.log("body get")
        resolve(body)
      }
    })
  })
}
