#!/usr/bin/env node
var fs = require('fs')
var path = require('path')
var canvas = require('canvas')
var argv = require('yargs')
  .option('s', {
    alias : 'src',
    demandOption: true,
    describe: '图片所在文件夹路径或单个图片文件路径。如果是文件夹，则会处理该文件夹下的所有jpg, jpeg, png图片。',
    type: 'string'
  })
  .option('d', {
    alias : 'dist',
    describe: '指定处理完成的图片存方的文件夹路径。如果未指定，则使用原图片的路径。',
    type: 'string'
  })
  .option('q', {
    alias : 'quality',
    describe: '指定压缩率，取值范围为区间[0, 100]。如果未指定，则默认为100。',
    type: 'number'
  })
  .option('w', {
    alias : 'width',
    describe: '指定转换宽度，取值范围为正整数。如果未指定，使用等比例转换。',
    type: 'number'
  })
  .option('h', {
    alias : 'height',
    describe: '指定转换高度，取值范围为正数数。如果未指定，使用等比例转换。',
    type: 'number'
  })
  .argv;

const convertImg = (argv) => {
  
}
