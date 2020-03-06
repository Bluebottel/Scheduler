import { moveEvent, addEvent, removeEvent } from '../events'

describe('Move events', () => {

  let event = {
      start: new Date('2020-03-14T12:37:00.000Z'),
      end: new Date('2020-03-14T19:37:00.000Z'),
      isAllDay: false,
      id: 1,
      resourceId: 1,
      shiftId: 1,
    }

    // moved two days later
    let arg = {
      start: new Date('2020-03-16T12:37:00.000Z'),
      end: new Date('2020-03-16T20:42:00.000Z'),
      allDay: false,
      event: event,
    }

    const eventList = [{ ...event, id: 2}, event, { ...event, id: 3 }]
    const movedEvent = {
      ...event,
      start: arg.start,
      end: arg.end,
    }

  
  test('Standard event', () => {
    expect(moveEvent(arg, eventList))
      .toStrictEqual( [eventList[0], movedEvent, eventList[2]] )
    
  })

  // moved one hour later
  test('Custom event', () => {
    let customArg = {
      start: new Date('2020-03-16T14:37:00.000Z'),
      end: new Date('2020-03-16T15:37:00.000Z'),
      event: {
	customTitle: 'theCustomTitle',
	id: 1,
	start: new Date('2020-03-16T13:37:00.000Z'),
	end: new Date('2020-03-16T14:37:00.000Z'),
	isAllDay: false,
      }
    }

    return expect(moveEvent( customArg,
			     [
			       eventList[0],
			       customArg.event,
			       eventList[2]
			     ]) )
    
      .toStrictEqual( [eventList[0],
		       {
			 ...customArg.event,
			 start: customArg.start,
			 end: customArg.end,
		       },
		       eventList[2]] )
  })
})
    

describe('Add events', () => {
  describe('Empty event list', () => {
    const event = {
      title: 'testEvent',
      shiftId: 1,
      resourceId: 1,
    }
    
    test('Standard event', () => {
      expect(addEvent(event, []))
	.toStrictEqual([{ ...event, id: 1 }])
    })

    const customEvent = {
      customTitle: 'theCustomTitle'
    }

    test('Custom event', () => {
      expect(addEvent(customEvent, []))
	.toStrictEqual([{ ...customEvent, id: 1 }])
    })    
  })
})
