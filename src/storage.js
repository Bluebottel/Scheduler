
// A resource in this case is just a person
function loadResources() {

  let resourceList = window.localStorage.getItem('schedule_resources')

  try {
    resourceList = JSON.parse(resourceList)

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

function storeData(data, type) {
  window.localStorage
    .setItem(`schedule_${type}`, JSON.stringify(data))
}

export {
  loadResources,
  loadEvents,
  loadShifts,
  loadMetaData,
  storeData,
}
