function openNav() {
  document.getElementById("mySidenav").classList.replace("sidebar-closed", "sidebar-open")
}
function closeNav() {
  document.getElementById("mySidenav").classList.replace("sidebar-open", "sidebar-closed")
}

window.addEventListener('click', function (e) {
  if (!document.getElementById('mySidenav').contains(e.target) && !document.getElementById('myMenu').contains(e.target)) {
    closeNav()
  }
})

const sidebar = document.createElement("div")
sidebar.id = "SideBar"

{/* <span id="myMenu" onclick="openNav()">&#9776;</span> */}
sidebar.innerHTML = `
<svg id="myMenu" onclick="openNav()" viewBox="0,0 416,416" xmlns="http://www.w3.org/2000/svg">
  <path style="fill: #7f6742;" d="M181.6,377c0,0-9.1,19.4-23.1,39.5c0,0-29.5-6.2-61.5-25.5c0,0,2.8-19.5,11.4-44.5c0,0-20.9-14.3-38.1-38c0,0-20.1,7.3-44.3,11.6c0,0-16.5-25.3-25.5-61.5c0,0,15.7-11.8,39.5-23.4c0,0-4.7-24.9,0-53.8c0,0-19.4-9.1-39.5-23.1c0,0,6.2-29.5,25.5-61.5c0,0,19.5,2.8,44.5,11.4c0,0,14.3-20.9,38-38.1c0,0-7.3-20.1-11.6-44.3c0,0,25.3-16.5,61.5-25.5c0,0,11.8,15.7,23.4,39.5c0,0,24.9-4.7,53.8,0c0,0,9.1-19.4,23.1-39.5c0,0,29.5,6.2,61.5,25.5c0,0-2.8,19.5-11.4,44.5c0,0,20.9,14.3,38.1,38c0,0,20.1-7.3,44.3-11.6c0,0,16.5,25.3,25.5,61.5c0,0-15.7,11.8-39.5,23.4c0,0,4.7,24.9,0,53.8c0,0,19.4,9.1,39.5,23.1c0,0-6.2,29.5-25.5,61.5c0,0-19.5-2.8-44.5-11.4c0,0-14.3,20.9-38,38.1c0,0,7.3,20.1,11.6,44.3c0,0-25.3,16.5-61.5,25.5c0,0-11.8-15.7-23.4-39.5C235.4,377,210.5,381.7,181.6,377z M208.6,158.7c-27.5,0-49.8,22.3-49.8,49.8c0,27.5,22.3,49.8,49.8,49.8c27.5,0,49.8-22.3,49.8-49.8C258.4,181.1,236,158.7,208.6,158.7z M137.5,169.5c11.5-21,32-36.4,56.3-40.9V75.8c-47.5,5.3-87.5,35.6-106.5,77.4L137.5,169.5z M149.8,263.8c-16.4-17.4-24.7-41.7-21.5-66.1l-50.2-16.3c-9.6,46.8,6.8,94.2,40.7,125.2L149.8,263.8z M243.3,281.2c-21.6,10.2-47.3,10.6-69.6,0l-31,42.7c41.5,23.6,91.7,22.6,131.6,0L243.3,281.2z M279.6,169.5l50.2-16.3c-19-41.8-59-72.1-106.5-77.4v52.8C247.7,133.1,268.2,148.5,279.6,169.5z M267.3,263.8l31,42.7c33.9-31,50.3-78.4,40.7-125.2l-50.2,16.3C292,222.2,283.7,246.4,267.3,263.8z"></path>
</svg>
<div id="mySidenav" class="sidenav sidebar-closed">
  <link rel="stylesheet" type="text/css" href="sidebar/sidebar.css" />
  <a id="close_sidebar" style="cursor: pointer;"><<</a>
  <a href="physics.html">Main Page</a>
  <a href="discovering_equation.html">Discovering Equation</a>
  <a href="different_situations.html">Different Situations</a>
  <a href="sensing_equation.html">Sensing Equation</a>
  <a href="comparing_equations.html">Comparing Equations</a>
  <a href="discussion.html">Discussion</a>
  <a href="https://github.com/zfrhv/zahar-magnetic-force/issues" target="_blank"><img src="./svg/feedback.svg" style="height: 18px;"/> Feedback</a>
</div>
`
document.getElementById("SideBar").replaceWith(sidebar)

if(!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))){
  openNav()
}

document.getElementById("close_sidebar").addEventListener('click', function () {
  closeNav()
})

// hightlight current page
const selected = sidebar.querySelector('[href="'+window.location.pathname.match(/[^/]+$/g)[0]+'"]')
if (selected) {
  selected.style.backgroundColor = "#688c24"
  selected.style.color = "#d6d5d2"
}