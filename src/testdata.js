
function storeTestData() {


  const resources = [
    {
      resourceIdAccessor() { return this.id },
      resourceTitleAccessor() { return this.title }, 
      title: 'Alice',
      id: 0,
      color: '#8f90ff',
    },
    {
      resourceIdAccessor() { return this.id },
      resourceTitleAccessor() { return this.title },
      title: 'Bob',
      id: 1,
      color: '#ff8e8e',
    },
    {
      resourceIdAccessor() { return this.id },
      resourceTitleAccessor() { return this.title },
      title: 'Chloe',
      id: 2,
      color: '#c866c2'
    },
    {
      resourceIdAccessor() { return this.id },
      resourceTitleAccessor() { return this.title },
      title: 'Dari',
      id: 3,
      color: '#8ed979',
    },      
  ]

  const shifts = [
    {
      title: 'FM',
      startHour: 7,
      startMinute: 0,
      minuteLength: 600,
      id: 0,
    },
    {
      title: 'EM',
      startHour: 12,
      startMinute: 30,
      minuteLength: 540,
      id: 1,
    },
    {
      title: 'Natt',
      startHour: 21,
      startMinute: 30,
      minuteLength: 570,
      id: 2,
    }
  ]

  const events = [
    {
      title: '',
      start: new Date(),
      end: new Date(),
      allDay: false,
      id: 0,
      resourceId: 0,
      shiftId: 0,
    },
    {
      title: '',
      start: new Date(),
      end: new Date(),
      id: 1,
      resourceId: 1,
      shiftId: 1,
    },
    {
      title: '',
      start: new Date(),
      end: new Date(new Date().getTime()+20*1000*3600),
      id: 2,
      resourceId: 2,
      shiftId: 2,
    }
  ]

  const metaData = {
    resourceArchive: [
      {
	resourceIdAccessor() { return this.id },
	resourceTitleAccessor() { return this.title },
	title: 'RemovedPerson',
	id: 4,
	color: '#5dde35'	
      }
    ],
    username: 'catperson',
  }

  console.log('resources: ', resources)
  console.log('shifts: ', shifts)
  
  window.localStorage.setItem('schedule_shifts',
			      JSON.stringify(shifts))

  window.localStorage.setItem('schedule_resources',
			      JSON.stringify(resources))

  window.localStorage.setItem('schedule_events',
			      JSON.stringify(events))

  window.localStorage.setItem('schedule_metaData',
			      JSON.stringify(metaData))

  console.log('wrote testdata to localstorage')

}

export {
  storeTestData,
}
