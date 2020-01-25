
function storeTestData() {

  const events = [
    {
      title: 'Alice, FM',
      start: new Date(),
      end: new Date(),
      allDay: false,
      id: 0,
      resource: '0',
    },
    {
      title: 'Bob, EM',
      start: new Date(),
      end: new Date(),
      id: 1
    },
    {
      title: 'Chloe, Natt',
      start: new Date(),
      end: new Date(new Date().getTime()+20*1000*3600),
      id: 2
    }
  ]

  const resources = [
    {
      resourceIdAccessor: 0,
      resourceTitleAccessor: 'Alice',    			    
    },
    {
      resourceIdAccessor: 1,
      resourceTitleAccessor: 'Bob',    			    
    },
    {
      resourceIdAccessor: 0,
      resourceTitleAccessor: 'Chloe',    			    
    },  
  ]

  const shifts = [
    {
      title: 'FM',
      startHour: 7,
      startMinute: 0,
      minuteLength: 600,
    },
    {
      title: 'EM',
      startHour: 12,
      startMinute: 30,
      minuteLength: 540,
    },
    {
      title: 'Natt',
      startHour: 21,
      startMinute: 30,
      minuteLength: 570,
    }
  ]

  console.log('resources: ', resources)
  console.log('shifts: ', shifts)
  
  window.localStorage.setItem('schedule_shifts',
			      JSON.stringify(shifts))

  window.localStorage.setItem('schedule_resources',
			      JSON.stringify(resources))

  window.localStorage.setItem('schedule_events',
			      JSON.stringify(events))

  console.log('wrote testdata to localstorage')

}

export {
  storeTestData,
}
