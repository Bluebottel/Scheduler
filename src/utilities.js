import update from 'immutability-helper'

import { storeData } from './storage'

// accepts both shifts and resources
function create(element, type) {

  if (type !== 'resources' && type !== 'shifts') {
    console.log('Wrong type: ', type, element)
    return {}
  }

  // make sure that the new ID is unique by making it larger than every other ID
  // including removed resources/shifts since those can still have events tied to them
  let newId = 0
  this.state[type].forEach(ele => { if (ele.id >= newId) { newId = ele.id }})
  this.state.meta.archive[type]
    .forEach(ele => { if (ele.id >= newId) { newId = ele.id }})
  newId++;

  element.id = newId

  this.setState((state, _) => {
    const newList = update(state[type],
			   {$push: [ element ]})
	  .sort(sortComparer(type))

    storeData(newList, type)
    return {
      [type]: newList,
    }
  })

  return element
}

// TODO: the bug when removing the selected shift/resource
// is back
function archive(element, type) {

  if (type !== 'resources' && type !== 'shifts')
    throw new Error('Invalid type: ', type)


  this.setState((state, _) => {
    const index = this.state[type].findIndex(ele => ele.id === element.id)
    const newMeta = update(this.state.meta,
			 { archive: { [type]: { $push: [ element ]}}})
    const newList = update(state[type],
			   {$splice: [[index, 1]]})

    storeData(newList, type)
    storeData(newMeta, 'metaData')

    let newSelected = update(this.state.selected,
			     {[type.slice(0,-1)]: {$set: newList[0]}})

    console.log('newSelected: ', newSelected)

    return {
      [type]: newList,
      meta: newMeta,
      selected: newSelected,
    }
  })

  return element
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

export {
  create,
  archive,
  timePad,
  sortComparer,
}
