
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

  try { eventList = JSON.parse(eventList) }
  catch(_) { return [] }

  if (!eventList instanceof Array) { return [] }
  else return eventList
}


function storeEvents(eventList) {
  window.localStorage
    .setItem('schedule_events', JSON.stringify(eventList))
}

function storeResources(resourceList) {
  window.localStorage
    .setItem('schedule_resources', JSON.stringify(resourceList))
}



export {
  loadResources,
  loadEvents,
  storeResources,
  storeEvents,
}
