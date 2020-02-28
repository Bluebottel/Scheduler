function timePad(number)
{
  if (number.toString().length === 2) return number
  return (number < 10) ? "0" + number : number
}

export {
  timePad,
}
