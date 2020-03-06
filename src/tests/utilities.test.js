import { timePad, sortComparer,
	 create, archive } from '../utilities'
import { shallow } from 'enzyme'

describe('timePad', () => {
  test('Zero', () => {
    expect(timePad(0)).toBe('00')
  })

  test('Double zero', () => {
    expect(timePad('00')).toBe('00')
  })

  test('> 9', () => {
    expect(timePad(11)).toBe('11')
  })
})

describe('sortComparer', () => {
  test('Resources 1 before 2', () => {
    expect(sortComparer('resources')(
      { title: 'a' }, { title: 'b' }
    ))
      .toBeFalsy()
  })

  test('Resources 1 after 2', () => {
    expect(sortComparer('resources')(
      { title: 'b' }, { title: 'a' }
    ))
      .toBeTruthy()
  })

  test('Shifts 1 before 2 by hour', () => {
    expect(sortComparer('shifts')(
      {
	startHour: 1,
	startMinute: 0,
      },
      {
	startHour: 2,
	startMinute: 0,
      }
    ))
      .toBeLessThan(0)
  })

  test('Shifts 1 same as 2', () => {
    expect(sortComparer('shifts')(
      {
	startHour: 1,
	startMinute: 0,
      },
      {
	startHour: 1,
	startMinute: 0,
      }
    ))
      .toBe(0)
  })

  test('Shifts 2 before 1 minutes', () => {
    expect(sortComparer('shifts')(
      {
	startHour: 1,
	startMinute: 0,
      },
      {
	startHour: 1,
	startMinute: 5,
      }
    ))
      .toBeLessThan(0)
  })
})


// TODO: more complex states to see if off by one in slice and such
describe('Create new shifts and resources', () => {
  describe('From empty state', () => {
    let emptyState = {
      shifts: [],
      resources: [],
      events: [],
      selected : {
	shift: undefined,
	resource: undefined,
      },
      metaData: {
	archive: {
          shifts: [],
	  resources: [],
	}
      }
    }
    
    test('New shift', () => {
      const newShift = {
	title: 'newShift',
	startHour: 1,
	startMinute: 2,
	minuteLength: 60,
      }

      let newData = create(newShift, 'shifts', emptyState)

      expect(newData).toStrictEqual({
	newElementList: [{
	  ...newShift,
	  id: 1,
	}],
	newElement: {
	  ...newShift,
	  id: 1,
	}
      })
    })

    test('New resource', () => {
      const newResource = {
	title: 'realPerson',
      }

      expect(create(newResource, 'resources', emptyState))
	.toStrictEqual({
	  newElementList: [{
	    ...newResource,
	    id: 1,
	  }],
	  newElement: {
	    ...newResource,
	    id: 1,
	  },
	})
      
    })

    test('Invalid name', () => {
      expect(() => {
	create({ title: 'Person' }, 'invalidType', emptyState)	
      }).toThrow()
    })
    
  }) // from empty state
})

describe('Archive shifts and resources', () => {

  const resource = {
    title: 'Person',
    id: 1,
  }

  const shift = {
    title: 'shiftTitle',
    id: 1,
    startMinute: 2,
    startHour: 21,
    minuteLength: 100,
  }
  
  const state = {
    resources: [ resource ],
    shifts: [ shift ],
    metaData: {
      archive: {
	shifts: [],
	resources: [],
      }
    }
  }

  test('Invalid type', () => {
    expect(() => {
      archive(resource, 'invalidType', state)
    }).toThrow()
  })
  
  test('Resource', () => {
    expect(archive(resource, 'resources', state))
      .toStrictEqual({
	resources: [],
	metaData: {
	  archive: {
	    shifts: state.metaData.archive.shifts,
	    resources: [ resource ],
	  }
	}
      })
  })

    test('Shift', () => {
    expect(archive(shift, 'shifts', state))
      .toStrictEqual({
	shifts: [],
	metaData: {
	  archive: {
	    shifts: [ shift ],
	    resources: state.metaData.archive.resources,
	  }
	}
      })
  })
  
})
