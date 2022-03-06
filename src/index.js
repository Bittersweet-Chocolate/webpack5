/*
 * @Author: czh
 * @Date: 2022-02-20 17:54:21
 * @Description: 
 */
import './index.css'

let title = require('./title.txt')
let logo = require('./images/1.png')
let img = new Image()
img.src = logo
document.body.appendChild(img)
console.log(title)
console.log(1)

let a = name => {
  console.log(name)
}
a('1')

// /**
//  * @param {any} target 装饰的目标
//  * @param {any} key 装饰器的key PI
//  * @param {any} descriptor  属性目标
//  */
function readOnly(target, key, descriptor) {
  descriptor.writable = false
}

class Person {
  @readOnly PI = 3.14
  constructor() {
    this.name = 1
  }
}
let p = new Person()
console.log(p)

// promise
let pro = Promise.resolve()
pro.then(_ => {
  console.log(1)
})

console.log(process.env.NODE_ENV)
console.log(VERSION)