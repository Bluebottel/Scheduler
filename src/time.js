

function dateOverlap(starDateA, startDateA, startDateB, endDateB) {
  if ((endDateA < startDateB) || (startDateA > endDateB)) {
    return -1
  }

  let obj = {}
  obj.startDate = startDateA <= startDateB ? startDateB : startDateA
  obj.endDate = endDateA <= endDateB ? endDateA : endDateB

  return obj.startDate.getTime() - obj.endDate.getTime()
}

