// Color the headers
function num_to_color(num) {
  if (num < 0 || num > 1) {
    return "gold"
  }
  const color_limit = 100 // from 0 to 255
  const color_offset = 155 // color_offset + color_limit <= 255
  return "#" + [
      Math.floor(color_offset + color_limit / 2 * (Math.sin((num      ) * 2*Math.PI) + 1)),
      Math.floor(color_offset + color_limit / 2 * (Math.sin((num + 1/3) * 2*Math.PI) + 1)),
      Math.floor(color_offset + color_limit / 2 * (Math.sin((num + 2/3) * 2*Math.PI) + 1))
    ].map(num => {
      const hex = num.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
}
document.querySelectorAll(".page").forEach(page => {
  const headers = page.querySelectorAll(".auto_color")
  headers.forEach((span, i) => {
    const color = num_to_color(i/headers.length)
    span.style.color = color
    if (span.tagName.toLowerCase() === "summary") {
      const border_el = span.nextElementSibling
      border_el.style.borderLeft = border_el.style.borderLeft.replace("white", color)
    }
  })
})