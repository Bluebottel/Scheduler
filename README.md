# Scheduler

A calendar specifically made for small scale shift and worker
scheduling. The emphasis is on speed by making the most common tasks
really easy and keeping the flexibility in check.

There is currently only a Swedish translation available.

Live demo [here](https://bluebottel.github.io/Scheduler).

### Setup
Clone the project with git, install the dependencies with `npm install`
and run the developer server with `npm run`. Point your web browser to
`localhost:3000` and try it out.

### Use
Clicking the calendar slots will do nothing until a resource and shift is added.
Click the gear in the bottom right corner to access the menu and add a shift
and a resource to get started.
In the `week` mode ordinary shift + resource events can't be added but custom
events are added instead.
Right clicking an event will delete it and double clicking it will edit it. Changes
to a shift or resource will propagate to all events that they are associated
however deleting either the resource or the shift will not. Editing an event will
take it out of the propagation automation as well. 

### Dependencies
* [Big calendar](https://github.com/jquense/react-big-calendar) - the calendar itself.
* [React-easy-edit](https://github.com/giorgosart/react-easy-edit) - inline editing of values
* [React-times](https://github.com/ecmadao/react-times) - inline picking of times
* [Rc-color-picker](https://github.com/react-component/color-picker) - picking colors

