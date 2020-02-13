import update from 'immutability-helper'


// A resource in this case is just a person
function loadResources() {

  let resourceList = window.localStorage.getItem('schedule_resources')

  try {
    resourceList = JSON.parse(resourceList)

    console.log('storage resourcelist: ', resourceList)

    // in case there are no resources store at all
    if (!resourceList) return []

    resourceList.forEach((res, i) => {
      resourceList[i].resourceTitleAccessor = () => this.title
      resourceList[i].resourceIdAccessor = () => this.id
    })
  }
  catch(_) { return [] }

  if (!resourceList instanceof Array) { return [] }
  else return resourceList
}

function loadEvents() {
  let eventList = window.localStorage.getItem('schedule_events')

  try {
    eventList = JSON.parse(eventList)

    // The dates get stored as strings and the parsing
    // doesn't turn them back into date objects automatically
    eventList.map(event => {
      event.start = new Date(event.start)
      event.end = new Date(event.end)
     
      return event
    })
  }
			     
  catch(_) { return [] }

  if (!eventList instanceof Array) { return [] }
  else return eventList
}

function loadShifts() {
  let shiftList = window.localStorage.getItem('schedule_shifts')

  if (!shiftList) return []

  try { shiftList = JSON.parse(shiftList) }
  catch(_) { return [] }

  if (!shiftList instanceof Array) { return [] }
  else return shiftList
}

function loadMetaData() {
  let metaData = window.localStorage.getItem('schedule_metaData')

  try {
    metaData = JSON.parse(metaData)

    if (!metaData.archive.resources)
      metaData.archive.resources = []

    if (!metaData.archive.shifts)
      metaData.archive.shifts = []

    console.log('storage meta: ', metaData)
  }
  catch(_) {
    return {
      archive: {
	resources: [],
	shifts: [],
      }
    }
  }

  return metaData
}

function storeEvents(eventList) {
  window.localStorage
    .setItem('schedule_events', JSON.stringify(eventList))
}

function storeResources(resourceList) {
  window.localStorage
    .setItem('schedule_resources', JSON.stringify(resourceList))
}

function storeShifts(shiftList) {
  window.localStorage
    .setItem('schedule_shifts', JSON.stringify(shiftList))
}

function storeMetaData(metaData) {
  window.localStorage
    .setItem('schedule_metaData', JSON.stringify(metaData))
}

export {
  loadResources,
  loadEvents,
  loadShifts,
  loadMetaData,
  storeResources,
  storeEvents,
  storeShifts,
  storeMetaData,
}
