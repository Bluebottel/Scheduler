import { timePad, sortComparer,
	 create } from '../utilities'
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
 


test('Create new resource', () => {
  let state = {
    shifts: [],
    resources: [],
    selected : {
      shift: undefined,
      resource: undefined,
    },
    meta: {
      archive: {
        shifts: [],
      }
    }
  }

  let setState = (obj) => { this.state = obj }
  let newShift = {
    title: 'newShift',
    startHour: 1,
    startMinute: 2,
    minuteLength: 60,
  }

  test(create(newShift, 'shifts').bind(this))
    .toBe({
      ...newShift,
      id: 0,
    })


})
