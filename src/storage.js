
// A resource in this case is just a person
function loadResources() {

  let resourceList = window.localStorage.getItem('schedule_resources')

  try { resourceList = JSON.parse(resourceList) }
  catch { return [] }

  if (!resourceList instanceof Array) { return [] }
  else return resourceList
}

function loadEvents() {
  let eventList = window.localStorage.getItem('schedule_events')

  try { eventList = JSON.parse(eventList) }
  catch { return [] }

  if (!eventList instanceof Array) { return [] }
  else return eventList
}

// TODO
function storeEvents(eventList) {
  
}
// TODO
function storeResources(resourceList) {
  
}

export {
  loadResources,
  loadEvents,
}
