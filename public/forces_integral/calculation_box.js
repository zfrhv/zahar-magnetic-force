// TODO change let into const

// Append css
const calculation_box_css = document.createElement( "link" );
calculation_box_css.href = "forces_integral/calculation_box.css";
calculation_box_css.type = "text/css";
calculation_box_css.rel = "stylesheet";
calculation_box_css.media = "screen,print";

document.getElementsByTagName("head")[0].appendChild(calculation_box_css);


// Main

function input_value_on_button(input, button, value_change) {
  let button_content;
  input.addEventListener('input', () => {
    if (!button_content) {
      button_content = button.innerHTML;
    }

    let value;
    if (value_change) {
      value = value_change(input);
    } else {
      value = input.value;
    }

    if (typeof value == 'number' && !Number.isInteger(value)) {
      value = value.toFixed(2);
    }

    button.textContent = value;
  });
  input.addEventListener('change', () => {
    if (button_content) {
      button.innerHTML = button_content;
      button_content = null;
    }
  });
  input.addEventListener('mouseup', () => {
    if (button_content) {
      button.innerHTML = button_content;
      button_content = null;
    }
  });
}

// TODO instead of creating empty arrow here and then drawing the path there, straight draw the path here.
// also dont pass the classes and colors, just return the arrow, if he needs some classes or append colors he can do that by his own
function create_arrow(class_name, color) {
    let arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arrow.classList.add(class_name);
    arrow.setAttributeNS(null, 'stroke', color);
    arrow.setAttributeNS(null, 'fill', color);
    arrow.setAttributeNS(null, 'stroke-linejoin', "round");
    arrow.setAttributeNS(null, 'stroke-linecap', "round");
    arrow.setAttributeNS(null, 'stroke-width', "0.7");
    return arrow;
}

// TODO combine it with previous function
function arrow_head_path(direction, size) {
  let path = "m 0,0";
  path += " l "+(-Math.cos(direction)*size)+","+(-Math.sin(direction)*size)+" l " + (Math.cos(direction + Math.PI/2)*size/1.5) +","+(Math.sin(direction + Math.PI/2)*size/1.5) + " z";
  path += " l "+(-Math.cos(direction)*size)+","+(-Math.sin(direction)*size)+" l " + (Math.cos(direction - Math.PI/2)*size/1.5) +","+(Math.sin(direction - Math.PI/2)*size/1.5) + " z";
  return path;
}

window.addEventListener('load', () => {
  document.querySelectorAll('.forces_integral').forEach(looping_animation_box => {
    let looping_animation_input = Array.prototype.filter.call(looping_animation_box.getElementsByTagName("input"), (elm) => {return elm.classList.contains("accuracy")})[0];
    let looping_animation_mine_force = Array.prototype.filter.call(looping_animation_box.getElementsByTagName("input"), (elm) => {return elm.classList.contains("force_type")})[0];
    let looping_animation_button = looping_animation_box.getElementsByTagName("button")[0];
    input_value_on_button(looping_animation_input, looping_animation_button);
    looping_animation_button.onclick = squered_wires;
  
    function squered_wires() {
      const parts = looping_animation_input.value;
      let svg = looping_animation_box.getElementsByTagName('svg')[0];
      let wire1 = svg.getElementsByClassName("wire1")[0];
      let wire2 = svg.getElementsByClassName("wire2")[0];
    
      const wire1_length = wire1.getTotalLength();
      const wire2_length = wire2.getTotalLength();
      const dx = (wire1_length + wire2_length) / parts;
    
      wire1.style.strokeDasharray = dx / 4;
      wire2.style.strokeDasharray = dx / 4;
    
    
      let wire1_animation = document.createElement('style');
      wire1_animation.type = 'text/css';
      wire1_animation.innerHTML = "@keyframes " + looping_animation_box.id + "_wire1 {to {stroke-dashoffset: " + wire1_length + "}}";
      document.head.appendChild(wire1_animation);
      wire1.style.animation = looping_animation_box.id + "_wire1 " + (0.1 * wire1_length) + "s linear infinite";
    
      let wire2_animation = document.createElement('style');
      wire2_animation.type = 'text/css';
      wire2_animation.innerHTML = "@keyframes " + looping_animation_box.id + "_wire2 {to {stroke-dashoffset: " + wire2_length + "}}";
      document.head.appendChild(wire2_animation);
      wire2.style.animation = looping_animation_box.id + "_wire2 " + (0.1 * wire2_length) + "s linear infinite";
    
      let wire1_center = mass_center(wire1, parts);
      let wire2_center = mass_center(wire2, parts);
    
      let total_force = {
        wire1: {
          x: 0,
          y: 0
        },
        wire2: {
          x: 0,
          y: 0
        }
      };
    
      let rotation_force = {
        wire1: 0,
        wire2: 0
      };
    
      let force_equation = looping_animation_mine_force.checked  ? mine_force : their_force
    
      for (let i = 0.0001; i < wire1_length+0.001; i += dx) { // i dont want to use getPointAtLength(0) in case if i have "M x,y m x,y", it will give the M, and i need m
        for (let j = 0.0001; j < wire2_length+0.001; j += dx) {// 0.0001 and 0.001 because i want extra point. because each time i take 2 points, means i loose 1 count. so i return it, its like doing <= instead of <
    
          let wire1_current_point = wire1.getPointAtLength(i);
          let wire1_next_point = wire1.getPointAtLength(i + dx);
    
          let wire2_current_point = wire2.getPointAtLength(j);
          let wire2_next_point = wire2.getPointAtLength(j + dx);
    
          let force = force_equation(wire1_current_point, wire1_next_point, wire2_current_point, wire2_next_point, wire1_center, wire2_center);
          total_force.wire1.x += force.total_force.wire1.x;
          total_force.wire1.y += force.total_force.wire1.y;
          total_force.wire2.x += force.total_force.wire2.x;
          total_force.wire2.y += force.total_force.wire2.y;
          rotation_force.wire1 += force.rotation_force.wire1;
          rotation_force.wire2 += force.rotation_force.wire2;
        }
      }
    
      if (force_equation == their_force) {
        total_force.wire1.x*=2/3;
        total_force.wire1.y*=2/3;
        total_force.wire2.x*=2/3;
        total_force.wire2.y*=2/3;
    
        rotation_force.wire1*=2/3;
        rotation_force.wire2*=2/3;
      }
    
      // console.log("x = "+total_force.wire2.x)
      // console.log("y = "+total_force.wire2.y)
    
      const arrow_head = 1/4;
    
      total_force.wire1.x*=20;
      total_force.wire1.y*=20;
    
      let arrow1 = svg.getElementsByClassName('force_arrow1')[0];
      if (!arrow1) {
        arrow1 = create_arrow('force_arrow1', wire2.getAttributeNS(null, 'stroke'));
        svg.appendChild(arrow1);
      }
      const arrow1_direction = Math.atan2(total_force.wire1.y, total_force.wire1.x);
      const arrow1_length = Math.hypot(total_force.wire1.y, total_force.wire1.x);
      arrow1.setAttributeNS(null, 'd', "M " + wire1_center.x + "," + wire1_center.y + " l " + total_force.wire1.x + "," + total_force.wire1.y + " " + arrow_head_path(arrow1_direction, arrow1_length / 4));
    
      total_force.wire2.x*=20;
      total_force.wire2.y*=20;
    
      let arrow2 = svg.getElementsByClassName('force_arrow2')[0];
      if (!arrow2) {
        arrow2 = create_arrow('force_arrow2', wire1.getAttributeNS(null, 'stroke'));
        svg.appendChild(arrow2);
      }
      const arrow2_direction = Math.atan2(total_force.wire2.y, total_force.wire2.x);
      const arrow2_length = Math.hypot(total_force.wire2.y, total_force.wire2.x);
      arrow2.setAttributeNS(null, 'd', "M " + wire2_center.x + "," + wire2_center.y + " l " + total_force.wire2.x + "," + total_force.wire2.y + " " + arrow_head_path(arrow2_direction, arrow2_length / 4));
    
    
      const r1 = {
        value: Math.abs(rotation_force.wire1)*4,
        sgn: Math.sign(rotation_force.wire1)
      }
    
      let spiral1 = svg.getElementsByClassName('force_spiral1')[0];
      if (!spiral1) {
        spiral1 = create_arrow('force_spiral1', wire2.getAttributeNS(null, 'stroke'));
        spiral1.setAttributeNS(null, 'fill', 'none');
        svg.appendChild(spiral1);
      }
      spiral1.setAttributeNS(null, 'd', "M " + (wire1_center.x - r1.value) + "," + wire1_center.y + " a " + r1.value + "," + r1.value + " 0 0," + ((r1.sgn+1)/2) + " " + (2*r1.value) + ",0 " + arrow_head_path(Math.PI/2*0.85*r1.sgn, r1.value/3));
    
      const r2 = {
        value: Math.abs(rotation_force.wire2)*4,
        sgn: Math.sign(rotation_force.wire2)
      }
      let spiral2 = svg.getElementsByClassName('force_spiral2')[0];
      if (!spiral2) {
        spiral2 = create_arrow('force_spiral2', wire1.getAttributeNS(null, 'stroke'));
        spiral2.setAttributeNS(null, 'fill', 'none');
        svg.appendChild(spiral2);
      }
      spiral2.setAttributeNS(null, 'd', "M " + (wire2_center.x - r2.value) + "," + wire2_center.y + " a " + r2.value + "," + r2.value + " 0 0," + ((r2.sgn+1)/2) + " " + (2*r2.value) + ",0 " + arrow_head_path(Math.PI/2*0.85*r2.sgn, r2.value/3));
    }
  });
})