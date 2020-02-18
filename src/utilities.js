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

    storeData(newList, type)
    return {
      [type]: newList,
    }
  })

  return element
}


function archive(element, type) {

  if (type !== 'resources' && type !== 'shifts') {
    console.log('Wrong type: ', type, element)
    return {}
  }


  const index = this.state[type].findIndex(ele => ele.id === element.id)
  const newMeta = update(this.state.meta,
			 { archive: { [type]: { $push: [ element ]}}})


  this.setState((state, _) => {
    storeData(newMeta, 'metaData')

    return { meta: newMeta }
  })

  this.setState((state, _) => {
    const newList = update(state[type],
			   {$splice: [[index, 1]]})

    storeData(newList, type)

    return { [type]: newList, }
  })

  return element
}

export {
  create,
  archive,
}
