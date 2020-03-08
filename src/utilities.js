import Moment from 'moment'
import { extendMoment } from 'moment-range'

const moment = extendMoment(Moment)

// type = 'shifts' | 'resources'
function create(element, type, state) {

  if (!(type === 'resources' || type === 'shifts'))
    throw new TypeError('Invalid type: ', type)
  

  // make sure that the new ID is unique by making it larger than every other ID
  // including removed resources/shifts since those can still have events tied to them
  let newId = 0
  state[type].forEach(ele => { if (ele.id >= newId) { newId = ele.id }})
  state.metaData.archive[type]
    .forEach(ele => { if (ele.id >= newId) { newId = ele.id }})
  newId++;

  element.id = newId

  const newList = state[type].concat(element).sort(sortComparer(type))
  
  return {
    newElementList: newList,
    newElement: element,
  }
}

function archive(argElement, type, state) {

  if (type !== 'resources' && type !== 'shifts')
    throw new TypeError('Invalid type: ', type)


  const index = state[type].findIndex(ele => ele.id === argElement.id)
  state.metaData.archive[type] = state.metaData.archive[type].concat(argElement)
  state[type].splice(index, 1)

  return {
    [type]: state[type],
    metaData: state.metaData,
  }
}

function timePad(number)
{
  if (number.toString().length === 2) return number.toString()
  return (number < 10) ? "0" + number : number.toString()
}

function shiftComparer(first, second) {
  if (first.startHour === second.startHour) {
    return first.startMinute - second.startMinute
  }
  
  else return first.startHour - second.startHour
}

function resourceComparer(first, second) {

  // the same as the default method used by sort()
  return first.title > second.title
}

function sortComparer(type) {
  if (type === 'resources') return resourceComparer
  else if (type === 'shifts') return shiftComparer

  else throw new Error('Invalid sort type: ', type)
}

// overlap time in ms
function timeOverlap(first, second) {
  const firstRange = moment.range(first.start, first.end)
  const secondRange = moment.range(second.start, second.end)

  if (!firstRange.overlaps(secondRange)) return 0
  return firstRange.intersect(secondRange).valueOf()
  
}

export {
  create,
  archive,
  timePad,
  sortComparer,
  timeOverlap
}
