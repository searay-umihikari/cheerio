const req = require('request')
const cio = require('cheerio')
const fs = require('fs')
const iconv = require('iconv-lite');

const baseUrl = 'http://actress'
const topUrl = baseUrl + '/-/top/';
const outPath = './actress/'


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


  // for (let i = 0; i < 1; i++) {
  for (let i = 0; i < indexULRList.length; i++) {

    outFilePath = outPath + 'actress' + i + '_1.csv'

    //index単位で取得
    getUrl = indexULRList[i];
    body = await doReq(getUrl)

    $ = get$(body)
    let maxPage = Number($("td.header").eq(1).text().match(new RegExp("全(.*)ページ中"))[1])
    let actData = []

    if (!isExistFile(outFilePath)) {

      await Promise.all([
        (async () => {
          for (let a = 0; a < $('.list').length; a++) {
            // for (let a = 0; a < 1; a++) {
            let actUrl = $('.list').eq(a).find('.pic a').attr('href')
            await perceActPage(actUrl).then((r) => {
              actData.push(r)
            })
          }
        })()
      ])

      rdata = actData.join('\n') + '\n'
      fs.appendFileSync(outFilePath, rdata)
    }

    // for (let p = 2; p <= 1; p++) {
    for (let p = 2; p <= maxPage; p++) {

      outFilePath = outPath + 'actress' + i + '_' + p + '.csv'
      if (!isExistFile(outFilePath)) {

        actData = []
        let pageUrl = getUrl + "page=" + p
        // body =  req({url: pageUrl, encoding: null}, (e, res, body) => {
        body = await doReq(pageUrl)
        $ = get$(body)
        await Promise.all([
          (async () => {
            for (let a = 0; a < $('.list').length; a++) {
              let actUrl = $('.list').eq(a).find('.pic a').attr('href')
              await perceActPage(actUrl).then((r) => {
                actData.push(r)
              })
            }
          })()
        ])
        rdata = actData.join('\n') + '\n'
        fs.appendFileSync(outFilePath, rdata)

      }
    }


  }
}

function perceActPage(url) {

  return new Promise((resolve, reject) => {
    req({url: url, encoding: null}, (e, res, body) => {

      $ = get$(body)
      let link = $("link[rel=canonical]").attr('href')
      let dmm_id = link.match(new RegExp("actress_id=(.*)/"))[1]

      let _name = $(".t1 h1").text()

      let names = ((_name.match(new RegExp('（', "g")) || []).length == 1) ? _name.match(new RegExp("(.*)（(.*)）")) : _name.match(new RegExp("(.*)（(.*（.*)））", 'm'))


      let name = ""
      let yomi = ""
      if (names instanceof Array) {
        name = (names.length > 0) ? names[1] : _name
        yomi = (names.length > 1) ? names[2].replace("（", "") : ""
      } else {
        name = _name
      }

      // console.log(name)

      let img = $('.area-av30 td').eq('0').find("img").attr('src').replace('http://pics.dmm.co.jp', '')
      let birth = $('.area-av30 table tr').eq('0').find("td").eq('1').text()

      let by = ""
      let bm = ""
      let bd = ""
      if (birth === '----') {
      } else {
        // console.log(birth)
        by = birth.match(new RegExp(/(\d+)年/))
        bm = birth.match(new RegExp(/(\d+)月/))
        bd = birth.match(new RegExp(/(\d+)日/))
        by = (by.length > 0) ? by[1] : ''
        bm = (bm.length > 0) ? bm[1] : ''
        bd = (bd.length > 0) ? bd[1] : ''
      }


      let constellation = $('.area-av30 table tr').eq('1').find("td").eq('1').text()
      let blood = $('.area-av30 table tr').eq('2').find("td").eq('1').text()
      let size = $('.area-av30 table tr').eq('3').find("td").eq('1').text()

      let cap = size.match(new RegExp(/([A-Z])カップ/))
      cap = (cap === null) ? '' : cap[1]

      size = size.replace("Tカップ", "")
      size = size.replace("Bカップ", "")
      size = size.replace("Wカップ", "")
      size = size.replace("Hカップ", "")

      let T = (size.indexOf("T") === -1) ? '' : size.match(new RegExp(/T(\d+)/))[1]
      let B = (size.indexOf("B") === -1) ? '' : size.match(new RegExp(/B(\d+)/))[1]
      let W = (size.indexOf("W") === -1) ? '' : size.match(new RegExp(/W(\d+)/))[1]
      let H = (size.indexOf("H") === -1) ? '' : size.match(new RegExp(/H(\d+)/))[1]


      let birthplace = $('.area-av30 table tr').eq('4').find("td").eq('1').text()
      let hobby = $('.area-av30 table tr').eq('5').find("td").eq('1').text()
      hobby = hobby.replace(new RegExp(/,/, "g"), '、')

      let infoData = {
        dmm_id: dmm_id,
        name: name,
        yomi: yomi,
        url: link,
        img: img,
        birth: birth,
        by: by,
        bm: bm,
        bd: bd,
        constellation: constellation,
        blood: blood,
        T: T,
        B: B,
        W: W,
        H: H,
        cap: cap,
        birthplace: birthplace,
        hobby: hobby
      }

      let data = [dmm_id, name, yomi, img, by, bm, bd, constellation, blood, T, B, W, H, cap, birthplace, hobby].join().replace(new RegExp(/----/, "g"), '')
      console.log(data)
      resolve(data)
    })

  })

}


function doReq(url) {
  return new Promise(function (resolve, reject) {
    req({url: url, encoding: null}, function (e, res, body) {
      if (e) {
        reject(e)
      } else {
        console.log("body get")
        resolve(body)
      }
    })
  })
}

function isExistFile(file) {
  try {
    fs.statSync(file);
    return true
  } catch (err) {
    if (err.code === 'ENOENT') return false
  }
}
