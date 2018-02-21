const req = require('request')
const cio = require('cheerio')
const fs = require('fs')
const iconv = require('iconv-lite');

const baseUrl = 'http://actress.dmm.co.jp'
const topUrl = baseUrl + '/-/top/';


main()

function get$(body) {
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


  let pageUrlList = []


  for (let i = 0; i < 20; i++) {
    //index単位で取得
    getUrl = indexULRList[i]
    body = await doReq(getUrl)

    $ = get$(body)
    let maxPage = Number($("td.header").eq(1).text().match(new RegExp("全(.*)ページ中"))[1])

    pageUrlList.push(getUrl)
    for (let p = 2; p <= maxPage; p++) {
      let pageUrl = getUrl + "page=" + p
      pageUrlList.push(pageUrl)
    }
  }
  console.log(pageUrlList)
}

function doReq(url) {
  return new Promise(function (resolve, reject) {
    req({url: url, encoding: null}, function (e, res, body) {
      if (e) {
        reject(e)
      } else {
        resolve(body)
      }
    })
  })
}
