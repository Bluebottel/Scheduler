
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
      get title() { return this.resource.title
			 + ', ' + this.shift.title } ,
      start: new Date(),
      end: new Date(),
      allDay: false,
      id: 0,
      resource: resources[0],
      shift: shifts[0]
    },
    {
      get title() { return this.resource.title
			 + ', ' + this.shift.title } ,
      start: new Date(),
      end: new Date(),
      id: 1,
      resource: resources[1],
      shift: shifts[1]
    },
    {
      get title() { return this.resource.title
			 + ', ' + this.shift.title } ,
      start: new Date(),
      end: new Date(new Date().getTime()+20*1000*3600),
      id: 2,
      resource: resources[2],
      shift: shifts[2]
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
