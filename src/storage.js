const ALLOWED_TYPES = [ 'shifts', 'events', 'resources', 'metaData' ]


// A resource in this case is just a person
function loadResources(resourceList = window
		       .localStorage
		       .getItem('schedule_resources'),
		       parseJSON = true) {

  try {
    if (parseJSON) resourceList = JSON.parse(resourceList)

    // in case there are no resources stored at all
    if (!resourceList) return []
  }
  catch(_) { return [] }

  if (!resourceList instanceof Array) { return [] }
  else return resourceList
}

function loadEvents(eventList = window
		    .localStorage
		    .getItem('schedule_events'),
		    parseJSON = true) {

  try {
    if (parseJSON) eventList = JSON.parse(eventList)

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

function loadShifts(shiftList = window
		    .localStorage
		    .getItem('schedule_shifts'),
		    parseJSON = true) {

  if (!shiftList) return []

  try { if(parseJSON) shiftList = JSON.parse(shiftList) }
  catch(_) { return [] }

  if (!shiftList instanceof Array) { return [] }
  else return shiftList
}

function loadMetaData(metaData = window
		      .localStorage
		      .getItem('schedule_metaData'),
		      parseJSON = true) {

  try {
    if (parseJSON) metaData = JSON.parse(metaData)

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

// type = 'resources' | 'shifts' | 'metaData'
function storeData(data, type) {
  if (!ALLOWED_TYPES.includes(type)) {
    throw new TypeError('Invalid type: ', type)
  }
      
  window.localStorage
    .setItem(`schedule_${type}`, JSON.stringify(data))
}

// a blob with all data that is saved in the localStorage
// meant for the save-to-file anchor tag
function saveBlob() {
  const allData = {
    metaData: loadMetaData(),
    shifts: loadShifts(),
    events: loadEvents(),
    resources: loadResources(),
    created: new Date(),
  }

  return new Blob([JSON.stringify(allData)],
		  { type: 'json' })
}

function loadBlob(blob) {
  try {
    blob = JSON.parse(blob)
    blob.resources = loadResources(blob.resources, false)
    console.log('resources: ', blob.resources)
    blob.shifts = loadShifts(blob.shifts, false)
    blob.events = loadEvents(blob.events, false)
    blob.metaData = loadMetaData(blob.metaData, false)
  }
  catch(err) { return undefined  }

  storeData(blob.resources, 'resources')
  storeData(blob.shifts, 'shifts')
  storeData(blob.events, 'events')
  storeData(blob.metaData, 'metaData')

  blob.created = new Date(blob.created)

  return blob
}

export {
  loadResources,
  loadEvents,
  loadShifts,
  loadMetaData,
  loadBlob,
  storeData,
  saveBlob,
}
