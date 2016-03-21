/** 
*
* Branding Color Hover Change
*
*/

const sections = document.querySelectorAll('[data-inverse-section]')

function calcInverseAreas() {
  return map(sections, (el) => {
    let top = el.getBoundingClientRect().top + document.body.scrollTop;
    return [top - el.offsetHeight, top + el.offsetHeight]
  })
}

const inverseAreas = fromEvent(window, 'resize')
  .map(e => calcInverseAreas()).startWith(calcInverseAreas())

const overInverseArea = combineLatest(scrollY, inverseAreas, (y, arr) => {
  return reduce(arr, (bool, range) => {
    if(bool || inRange(y, range) {
      bool = true;
    }
    return bool;
  }, false)
}).distinctUntilChanged()