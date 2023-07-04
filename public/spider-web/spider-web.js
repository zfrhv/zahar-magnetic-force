
let idle = function() {
  let time;
  document.onmousemove = resetTimer;
  document.onkeydown = resetTimer;
  
  const lines = 7;
  const circles = 6;
  const animation_time = '5'; // in seconds, example: animation_time = '3.5'
  const clear_time = '0.4'
    
  
  function resetTimer() {
    clearTimeout(time);
    // after 30 min
    time = setTimeout(draw_web, 3000);

    if (has_web) { clear_web(); }
  }
  
  async function clear_web() {
    let elements = document.getElementById('spider-web').getElementsByTagName('path');
    for (let i=0; i < elements.length; i++) {
      elements[i].style.transition = clear_time + 's';
      elements[i].style.transitionDelay = '0s';
      elements[i].style.strokeDashoffset = '100%';
    }
    await new Promise(r => setTimeout(r, Number(clear_time)*1000));
    svg_element.style.zIndex = -100;
    has_web = false;
  }
  
  async function draw_web() {
    has_web = true;
    svg_element.style.zIndex = 100;
    let elements = document.getElementById('spider-web').getElementsByTagName('path');
    for (let i=0; i < elements.length; i++) {
      elements[i].style.transition = elements[i].style._transition;
      elements[i].style.transitionDelay = elements[i].style._transitionDelay;
      elements[i].style.strokeDashoffset = '0%';
    }
  }
    
  function create_web(svg_element) {
    let lines_paths = [];
    let web_path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let path_string = '';


    // count time for each animation
    const line_time = animation_time / (lines + Math.PI * circles);
    const spiral_time = animation_time - line_time * lines;
    
    // create base lines
    for(let line=0; line < lines; line++) {
      lines_paths[line] = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const degree = Math.PI*line/lines;
      lines_paths[line].setAttributeNS(null, 'd', ' M ' + (98*Math.sin(degree)+100) + ',' + (98*Math.cos(degree)+100) + ' L ' + (-98*Math.sin(degree)+100) + ',' + (-98*Math.cos(degree)+100) );
      lines_paths[line].setAttributeNS(null, 'pathLength', '200');
      lines_paths[line].style._transition = line_time + 's';
      lines_paths[line].style._transitionDelay = line_time*line + 's';
      lines_paths[line].style.strokeDashoffset = '100%';
    }
    path_string += ' M 100,100';

    // create spiral
    for(let circle=0; circle < circles; circle++) {
      for(let line=0; line < lines*2; line++) {
        const length = 100*(circle + line/(lines*2))/circles;
        const degree = Math.PI*2*line/(lines*2);
        path_string += ' L ' + (length*Math.sin(degree)+100) + ',' + (length*Math.cos(degree)+100);
      }
    }

    web_path.setAttributeNS(null, 'd', path_string);
    web_path.setAttributeNS(null, 'pathLength', '100');
    web_path.style._transition = spiral_time + 's';
    web_path.style._transitionDelay = line_time*lines + 's';
    web_path.style.strokeDashoffset = '100%';

    lines_paths.forEach(line => svg_element.appendChild(line));
    svg_element.appendChild(web_path);
  }
  
  
  
  
  let has_web = false;
  let svg_element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg_element.id = 'spider-web';
  svg_element.setAttribute("viewBox", "0,0 200,200");

  create_web(svg_element);
  document.body.appendChild(svg_element);

  resetTimer();
}
  
window.onload = function() {
  idle();
}
  