import React from 'react'
import moment from 'moment'
import update from 'immutability-helper'
import { storeResources, storeMetaData } from './storage'


function createResource (title, color) {

  // make sure that the new ID is unique by making it larger than every other ID
  // including removed resources since those can still have events tied to them
  let newId = 0
  this.state.resources.forEach(res => { if (res.id >= newId) { newId = res.id }})
  this.state.meta.archive.resources
    .forEach(res => { if (res.id >= newId) { newId = res.id }})
  newId++;
  
  const newResource = {
    title: title,
    id: newId,
    color: color,
    resourceTitleAccessor: () => title,
    resourceIdAccessor: () => newId,
  }

  this.setState((state, _) => {
    const resourceList = update(state.resources,
				{$push: [ newResource ]})
    storeResources(resourceList)
    return {
      resources: resourceList,
    }
  })

  return newResource
}

// archiving resource so their scheduled events don't break
function archiveResource (resource) {

  // the resource is not archived already
  if (!this.state.meta.archive.resources.
      find(res => res.id === resource.id)) {

    const index = this.state.resources.findIndex(res => res.id === resource.id)
    const newMeta = update(this.state.meta,
			   { archive: { resources: { $push: [ resource ]}}})
    

    this.setState((state, _) => {
      storeMetaData(newMeta)

      return {
	meta: newMeta,
      }
    })

    this.setState((state, _) => {
      const newResourceList = update(state.resources,
				     {$splice: [[index, 1]]})

      console.log('new resourcelist: ', newResourceList)
      storeResources(newResourceList)

      return {
	resources: newResourceList,
      }
    })
  }
  
  // the resource is already archived
  else {
    const index = this.state.resources.findIndex(res => res.id === resource.id)
    this.setState((state, _) => {
      const newResourceList = update(state.resources,
				     {$splice: [[index, 1]]})

      console.log('new resourcelist: ', newResourceList)
      storeResources(newResourceList)

      return {
	resources: newResourceList,
      }
    })
  }
  
}


export {
  createResource,
  archiveResource,
}
