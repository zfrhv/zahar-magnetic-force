function openNav() {
  document.getElementById("mySidenav").style.width = "350px";
}

window.addEventListener('click', function (e) {
  if (!document.getElementById('mySidenav').contains(e.target) && !document.getElementById('myMenu').contains(e.target)) {
    document.getElementById("mySidenav").style.width = "0px";
  }
})

const sidebar = document.createElement("div")
sidebar.id = "SideBar"

sidebar.innerHTML = `
<span id="myMenu" onclick="openNav()">&#9776;</span>
<div id="mySidenav" class="sidenav">
  <link rel="stylesheet" type="text/css" href="sidebar/sidebar.css" />
  <a href="physics.html">Main Page</a>
  <a href="discovering_equation.html">Discovering Equation</a>
  <a href="sensing_equation.html">Sensing Equation</a>
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

const selected = sidebar.querySelector('[href="'+window.location.pathname.match(/[^/]+$/g)[0]+'"]')
selected.style.backgroundColor = "#383636"
selected.style.color = "#d6d5d2"