import React from 'react'
import enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';

import App from '../App'
import PickerPanel from '../pickerpanel'

// TODO: real tests, this is for reference
describe('Simulated user events, full mount', () => {

  enzyme.configure({ adapter: new Adapter() })
  
  describe('No shifts or resources added', () => {
    test('Switching to week mode', () => {
      const wrapper = mount(<App />)

      expect(wrapper.containsMatchingElement(<PickerPanel />))
	.toBe(true)

      // think: find('DOM-search')[index]
      //wrapper.find('button').at(0).text())
      wrapper.find('button').at(4).simulate('click')

      expect(wrapper.containsMatchingElement(<PickerPanel />))
	.toBe(false)
    })
  })
})
