document.querySelectorAll('.random_flower').forEach(el => {
  const randomNumber = Math.floor(Math.random() * 3) + 1;
  el.src = `svg/flowers/flower${randomNumber}.svg`
})