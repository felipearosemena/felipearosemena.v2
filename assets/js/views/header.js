// import {Observable} from 'rxjs/Observable';
// import 'rxjs/add/operator/map';

import * as Rx from 'rxjs-es/Observable'
import { inRange } from '../modules/utils'

const fromEvent = Rx.Observable.fromEvent
const combineLatest = Rx.Observable.combineLatest

const el = document.querySelector('#site-nav')

const scrollY = fromEvent(window, 'scroll')
  .map(e => window.scrollY)

const calcThreshold = () => {
  let t
  el.style.height = 'auto'
  t = window.innerHeight - el.offsetHeight/2
  el.style.height = ''
  return t
}

const threshold = fromEvent(window, 'resize')
  .map(e => calcThreshold()).startWith(calcThreshold())

const foldChange = combineLatest(scrollY, threshold, (y, t) => {
  return y > t
}).distinctUntilChanged()

const toggleBtnClicks = fromEvent(document.querySelectorAll('.js-nav-toggle'), 'click')

const headerView = (el) => {

  foldChange.subscribe((bool) => {
    let method = bool ? 'add' : 'remove'
    document.body.classList[method]('is-below-fold')
  })

  toggleBtnClicks.subscribe((el) => {
    document.body.classList.toggle('is-menu-active')
  })

}

export default headerView