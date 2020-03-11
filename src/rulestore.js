let rulesMap = new Map()

rulesMap.set('>', (a, b) => { return a > b })
rulesMap.set('<', (a, b) => { return a < b })
rulesMap.set('>=', (a, b) => { return a >= b })
rulesMap.set('<=', (a, b) => { return a <= b })
rulesMap.set('=', (a, b) => { return parseFloat(a).toFixed(1) === parseFloat(b).toFixed(1) })

function updateCondition(rule) {
  rule.value = parseFloat(rule.value)
  rule.condition = argValue => {
    return rulesMap.get(rule.text)(argValue, rule.value)
  }
  return rule
}

export {
  rulesMap,
  updateCondition,
}
