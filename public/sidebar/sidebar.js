function openNav() {
  const sidebar = document.getElementById("mySidenav")
  sidebar.style.width = "320px";
  sidebar.style.borderRight = "4px solid #363643";
  // sidebar.style.borderRight = "4px solid #3a3a3d";
}

window.addEventListener('click', function (e) {
  if (!document.getElementById('mySidenav').contains(e.target) && !document.getElementById('myMenu').contains(e.target)) {
    const sidebar = document.getElementById("mySidenav")
    sidebar.style.width = "0px";
    sidebar.style.border = "";
  }
})

const sidebar = document.createElement("div")
sidebar.id = "SideBar"

sidebar.innerHTML = `
<span id="myMenu" onclick="openNav()">&#9776;</span>
<div id="mySidenav" class="sidenav">
  <link rel="stylesheet" type="text/css" href="sidebar/sidebar.css" />
  <a id="close_sidebar" style="cursor: pointer;"><<</a>
  <a href="physics.html">Main Page</a>
  <a href="discovering_equation.html">Discovering Equation</a>
  <a href="different_situations.html">Different Situations</a>
  <a href="sensing_equation.html">Sensing Equation</a>
  <a href="comparing_equations.html">Comparing Equations</a>
  <a href="discussion.html">Discussion</a>
</div>
`
document.getElementById("SideBar").replaceWith(sidebar)

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
  // true for mobile device
}else{
  // false for not mobile device
  openNav()
}

document.getElementById("close_sidebar").addEventListener('click', function () {
  const sidebar = document.getElementById("mySidenav")
  sidebar.style.width = "0px";
  sidebar.style.border = "";
})

// hightlight current page
const selected = sidebar.querySelector('[href="'+window.location.pathname.match(/[^/]+$/g)[0]+'"]')
if (selected) {
  selected.style.backgroundColor = "#688c24"
  selected.style.color = "#d6d5d2"
}