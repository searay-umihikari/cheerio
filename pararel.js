function wait(msg, msec) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(".." + msg)
      resolve(msg)
    }, msec)
  })
}


async function main() {
  rdata = await wait('msg1', 2000)

  await Promise.all([
    (async () => {
      console.log("----------")
      for (let i = 0; i < 10; i++) {
//        rdata = await wait('msg'+i, 100*i)
      }
      console.log("end")
      console.log("----------")
      return
    })()
  ])

  let data = []

  await Promise.all([
    (async () => {
      console.log("----------")
      rdata = await wait('msg7a', 110).then(function (ret) {
        data.push(ret)
      })

      rdata = await wait('msg8a', 210).then(function (ret) {
        data.push(ret)
      })
      rdata = await wait('msg9a', 310).then(function (ret) {
        data.push(ret)
      })
      rdata = await wait('msg10a', 410).then(function (ret) {
        data.push(ret)
      })
      rdata = await wait('msg11a', 510).then(function (ret) {
        data.push(ret)
      })
      return
    })()
  ])

  console.log(data)


  await Promise.all([
    (async () => {
      console.log("----------")
      rdata = await wait('msg7', 100)
      rdata = await wait('msg8', 200)
      rdata = await wait('msg9', 100)
      rdata = await wait('msg10', 300)
      rdata = await wait('msg11', 300)
      return
    })()
  ])

  console.log("----------")
  rdata = await wait('msg12', 1000)


}

main()

