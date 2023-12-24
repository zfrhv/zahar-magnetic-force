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
<img id="myMenu" onclick="openNav()" src="./sidebar/gear.svg" />
<div id="mySidenav" class="sidenav sidebar-closed">
  <link rel="stylesheet" type="text/css" href="sidebar/sidebar.css" />
  <a id="close_sidebar" style="cursor: pointer;"><<</a>
  <a href="physics.html">Main Page</a>
  <a href="discovering_equation.html">Discovering Equation</a>
  <a href="different_situations.html">Different Situations</a>
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