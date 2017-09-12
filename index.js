#!/usr/bin/env node
var fs = require('fs')
var path = require('path')
var { createCanvas, Image } = require('canvas')

var argv = require('yargs')
  .option({
    'src': {
      alias : 's',
      demandOption: true,
      describe: '图片所在文件夹路径或单个图片文件路径。如果是文件夹，则会处理该文件夹下的所有jpg, jpeg, png图片。',
      type: 'string'
    },
    'dist': {
      alias : 'd',
      describe: '指定处理完成的图片存方的文件夹路径。如果未指定，则使用原图片的路径。',
      type: 'string'
    },
    'quality': {
      alias : 'q',
      describe: '指定压缩率，取值范围为区间[0, 100]。如果未指定，则默认为100。',
      default: 100,
      type: 'number'
    },
    'width': {
      alias : 'w',
      describe: '指定转换宽度，取值范围为正整数。如果未指定，使用等比例转换。',
      type: 'number'
    },
    'height': {
      alias : 'h',
      describe: '指定转换高度，取值范围为正数数。如果未指定，使用等比例转换。',
      type: 'number'
    }
  })
  .argv;

const readFile = (argv) => {
  if (argv.w <= 0 || argv.h <= 0 || Number.isNaN(argv.w) || Number.isNaN(argv.h)) {
    console.log('指定的宽度或者高度必须为正整数，请重试！')
    return
  }
  if (argv.q < 0 || argv.q > 100) {
    console.log('指定的压缩率范围是[0, 100]，请重试！')
    return
  }
  fs.stat(argv.s, (err, stats) => {
    if (err) throw err;
    if (stats.isFile()) {
      if (path.extname(argv.s) === '.jpg' || path.extname(argv.s) === '.jpeg' || path.extname(argv.s) === '.png') {
        fs.readFile(argv.s, (err, squid) => {
          if (err) throw err;
          var pathInfo = path.parse(argv.s)
          handleImg(pathInfo, argv, squid)
        });
      }
    } else if (stats.isDirectory ()) {
      fs.readdir(argv.s, (err, files) => {
        if (err) throw err;
        files.forEach((file) => {
          if (path.extname(file) === '.jpg' || path.extname(file) === '.jpeg' || path.extname(file) === '.png') {
            fs.readFile(argv.s + file, (err, squid) => {
              if (err) throw err;
              var pathInfo = path.parse(argv.s + file)
              handleImg(pathInfo, argv, squid)
            })
          }
        })
      })
    }
  })
}

const handleImg = (pathInfo, argv, squid) => {
  var img = new Image, out
  img.onerror = (err) => {
    throw err
  }
  img.onload = async () => {
    var w = img.width
    var h = img.height
    if (!argv.w && !argv.h) {
      argv.w = w
      argv.h = h
    }
    if (!argv.w && argv.h) {
      argv.w = (argv.h * w) / h
    }
    if (argv.w && !argv.h) {
      argv.h = (argv.w * h) / w
    }
    var canvas = createCanvas(w, h)
    var ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, argv.w, argv.h)
    if (argv.d) {
      await new Promise((resolve, reject) => {
        fs.stat(argv.d, (err, stats) => {
          if (err) throw err
          if (stats.isFile()) {
            console.log('存放图片的路径必须是文件夹，请重试！');
            return
          } else if (stats.isDirectory()) {
            out = fs.createWriteStream(path.join(argv.d, `${pathInfo.name}_${argv.q}_${argv.w}_${argv.h}${pathInfo.ext}`))
            resolve(out)
          }
        })
      })
    } else {
      out = fs.createWriteStream(path.join(pathInfo.dir, `${pathInfo.name}_${argv.q}_${argv.w}_${argv.h}${pathInfo.ext}`))
    }
    var stream = canvas.createJPEGStream({
      quality: argv.q
    })
    stream.pipe(out)
    stream.on('end', () => {
      console.log('转换图片成功！')
    });
  }
  img.src = squid;
}

readFile(argv)