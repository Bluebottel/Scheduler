
// A resource in this case is just a person
function loadResources() {

  let resourceList = window.localStorage.getItem('schedule_resources')

  try { resourceList = JSON.parse(resourceList) }
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
    eventList.forEach((event, i) => {
      eventList[i].start = new Date(event.start)
      eventList[i].end = new Date(event.end)
    })
  }
  catch(_) { return [] }

  if (!eventList instanceof Array) { return [] }
  else return eventList
}

function loadShifts() {
  let shiftList = window.localStorage.getItem('schedule_shifts')

  try {
    shiftList = JSON.parse(shiftList)

    // The dates get stored as strings and the parsing
    // doesn't turn them back into date objects automatically
    shiftList.forEach((shift, i) => {
      shiftList[i].start = new Date(shift.start)
      shiftList[i].end = new Date(shift.end)
    })
  }
  catch(_) { return [] }

  if (!shiftList instanceof Array) { return [] }
  else return shiftList
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



export {
  loadResources,
  loadEvents,
  loadShifts,
  storeResources,
  storeEvents,
  storeShifts,  
}
