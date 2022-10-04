import * as THREE from 'three'
import { Line2 } from 'three/addons/lines/Line2.js'
import { LineMaterial } from 'three/addons/lines/LineMaterial.js'
import { LineGeometry } from 'three/addons/lines/LineGeometry.js'
import { Path3 } from './tools/threejs/path3.js'
// TODO calculate when current changes
const pi = Math.PI

function vec_to_euler(vector) {
  return new THREE.Euler(0,0,0,'XYZ').setFromRotationMatrix(new THREE.Matrix4().lookAt(vector, new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0)))
}

window.changing_current_circles_init = function (toolbar, scene) {
  const points = []
  const radius = 150
  for ( let degree = 0; degree < 2*Math.PI+0.00001; degree += 2*Math.PI/30 ) {
    points.push(Math.sin(degree)*radius, Math.cos(degree)*radius, 0)
  }
  const path = new Path3(points)

  window.changing_current_init(toolbar, scene, path, path)
}

window.changing_current_circles = function (toolbar, scene) {
  window.changing_current(toolbar, scene)
}

window.changing_current_init = function (toolbar, scene, path1, path2) {
  const wire1_length = path1.getLength()
  const wire2_length = path2.getLength()

  const total_parts = 1000
  const ration = Math.sqrt(wire1_length / wire2_length)
  const parts_1 = Math.round(ration / (ration+1) * total_parts)
  const parts_2 = total_parts - parts_1

  const wire1_points = path1.getPoints(parts_1)
  const wire2_points = path2.getPoints(parts_2)

  const wire1_points_vec = []
  const wire2_points_vec = []

  for (let point_1 = 0; point_1 < wire1_points.length; point_1 += 3) {
    wire1_points_vec.push(new THREE.Vector3(wire1_points[point_1], wire1_points[point_1+1], wire1_points[point_1+2]))
  }
  for (let point_2 = 0; point_2 < wire2_points.length; point_2 += 3) {
    wire2_points_vec.push(new THREE.Vector3(wire2_points[point_2], wire2_points[point_2+1], wire2_points[point_2+2]))
  }

  // draw shapes WIRE1
  const wire1 = new THREE.Group()
  const wire1_material = new THREE.MeshBasicMaterial({ color: 0x3e8207 })
  wire1.name = "wire1"
  wire1.points_vec = wire1_points_vec
  wire1.length = wire1_length

  // draw circle wire
  const wire1_path = new LineGeometry()
  wire1_path.setPositions(wire1_points)
  const wire1_shape_material = new LineMaterial({color: wire1_material.color, linewidth: 15})
  const wire1_shape = new Line2( wire1_path, wire1_shape_material )
  wire1_shape_material.resolution.set( window.innerWidth, window.innerHeight )
  wire1_shape.name = "wire1_shape"
  wire1.add(wire1_shape)

  const current_arrows = 4
  // draw current flow
  for (let arrow_counter = 1/current_arrows/2; arrow_counter < 1; arrow_counter+= 1/current_arrows) {
    const index = Math.floor(arrow_counter*wire1.points_vec.length)
    const position = wire1.points_vec[index].clone()
    const direction = wire1.points_vec[index+1].clone().sub(position).normalize()
    position.add(direction.clone().multiplyScalar(20))
    const speed = new THREE.ArrowHelper( direction, position, 0, wire1_material.color )
    speed.setLength(1, 60, 60)
    wire1.add(speed)
  }

  // calculate the mass center
  wire1.mass_center = new THREE.Vector3(0,0,0)
  for (let i=0; i < wire1.points_vec.length; i++) {
    wire1.mass_center.add(wire1.points_vec[i])
  }
  wire1.mass_center.divideScalar(wire1.points_vec.length)

  // transform the whole shape
  wire1.rotation.x = pi/2
  wire1.position.y = 200
  scene.add(wire1)

  // draw shapes WIRE2
  const wire2 = new THREE.Group()
  const wire2_material = new THREE.MeshBasicMaterial({ color: 0x6898cc })
  wire2.name = "wire2"
  wire2.points_vec = wire2_points_vec
  wire2.length = wire2_length

  // draw circle wire
  const wire2_path = new LineGeometry()
  wire2_path.setPositions(wire2_points)
  const wire2_shape_material = new LineMaterial({color: wire2_material.color, linewidth: 15})
  const wire2_shape = new Line2( wire2_path, wire2_shape_material )
  wire2_shape_material.resolution.set( window.innerWidth, window.innerHeight )
  wire2_shape.name = "wire2_shape"
  wire2.add(wire2_shape)

  // draw current flow
  for (let arrow_counter = 1/current_arrows/2; arrow_counter < 1; arrow_counter+= 1/current_arrows) {
    const index = Math.floor(arrow_counter*wire2.points_vec.length)
    const position = wire2.points_vec[index].clone()
    const direction = wire2.points_vec[index+1].clone().sub(position).normalize()
    position.add(direction.clone().multiplyScalar(20))
    const speed = new THREE.ArrowHelper( direction, position, 0, wire2_material.color )
    speed.setLength(1, 60, 60)
    wire2.add(speed)
  }

  // calculate the mass center
  wire2.mass_center = new THREE.Vector3(0,0,0)
  for (let i=0; i < wire2.points_vec.length; i++) {
    wire2.mass_center.add(wire2.points_vec[i])
  }
  wire2.mass_center.divideScalar(wire2.points_vec.length)

  // transform the whole shape
  wire2.rotation.x = pi/2
  wire2.position.y = -200
  scene.add(wire2)

  // voltage text
  const voltage = document.createElement('div');
  toolbar.parentElement.appendChild(voltage);
  voltage.style.position = 'absolute';
  voltage.innerHTML = "(blue wire) Voltage: 0";
  voltage.style.top = (toolbar.parentElement.children[0].offsetHeight - voltage.offsetHeight)+'px';
  voltage.style.left = '5%';
  voltage.style.pointerEvents = 'none';
  wire2.voltage = voltage

  // draw voltage flow
  const voltages = new THREE.Group()
  voltages.name = "voltages"
  wire2.add(voltages)
  for (let arrow_counter = 1/(current_arrows-1)/2; arrow_counter < 1; arrow_counter+= 1/(current_arrows-1)) {
    const index = Math.floor(arrow_counter*wire2.points_vec.length)
    const position = wire2.points_vec[index].clone()
    const direction = wire2.points_vec[index+1].clone().sub(position).normalize()
    position.add(direction.clone().multiplyScalar(20))
    const speed = new THREE.ArrowHelper( direction, position, 0, 0xe6763e )
    voltages.add(speed)
  }
  

  // Check if 2d shape, to be able to use Faraday's law
  is_2d: if (path2.points.length >= 9) {
    const main_point = new THREE.Vector3(path2.points[0], path2.points[1], path2.points[2])
    // make sure that the circiot is closed
    if (new THREE.Vector3(path2.points[path2.points.length-3], path2.points[path2.points.length-2], path2.points[path2.points.length-1]).sub(main_point).length() > 0.00001) {
      break is_2d
    }
    const new_x = new THREE.Vector3(path2.points[3], path2.points[4], path2.points[5]).sub(main_point).normalize()
    const surface_vec = new THREE.Vector3(path2.points[6], path2.points[7], path2.points[8]).sub(main_point).cross(new_x).normalize()
    const new_y = new_x.clone().cross(surface_vec).normalize()

    // yea i can probably use here 4D matrix instead of doing "sub(main_point)" and then "add(main_point)". but idk how to use matrixes so maybe in the future
    const to_original_axis = new THREE.Matrix3()
    // to_original_axis.set(new_x.x, new_x.y, new_x.z, new_y.x, new_y.y, new_y.z, surface_vec.x, surface_vec.y, surface_vec.z)
    to_original_axis.set(new_x.x, new_y.x, surface_vec.x, new_x.y, new_y.y, surface_vec.y, new_x.z, new_y.z, surface_vec.z)
    const to_new_axis = to_original_axis.clone().invert()
    // check if each dot is on the surface + get the max and min points of the surface
    const relative_locations = []
    for (let i=0; i < path2.points.length; i+=3) {
      relative_locations.push(new THREE.Vector3(path2.points[i], path2.points[i+1], path2.points[i+2]).sub(main_point).applyMatrix3(to_new_axis))
      const tmp = new THREE.Vector3(path2.points[i], path2.points[i+1], path2.points[i+2])
    }
    
    const min = new THREE.Vector2()
    const max = new THREE.Vector2()
    for (let i=1; i < relative_locations.length; i++) {
      if ( relative_locations[i].z != 0 ) {
        break is_2d
      }
      if (relative_locations[i].x > max.x) { max.x = relative_locations[i].x }
      if (relative_locations[i].x < min.x) { min.x = relative_locations[i].x }
      if (relative_locations[i].y > max.y) { max.y = relative_locations[i].y }
      if (relative_locations[i].y < min.y) { min.y = relative_locations[i].y }
    }

    function is_intersecting(a, b, c, d)
    {
        const denominator = ((b.x - a.x) * (d.y - c.y)) - ((b.y - a.y) * (d.x - c.x));
        const numerator1 = ((a.y - c.y) * (d.x - c.x)) - ((a.x - c.x) * (d.y - c.y));
        const numerator2 = ((a.y - c.y) * (b.x - a.x)) - ((a.x - c.x) * (b.y - a.y));

        if (denominator == 0) return numerator1 == 0 && numerator2 == 0;
        
        const r = numerator1 / denominator;
        const s = numerator2 / denominator;

        return (r >= 0 && r <= 1) && (s >= 0 && s <= 1);
    }

    // check which dots are inside the surface
    wire2.areas = []
    const step = Math.sqrt((max.x-min.x) * (max.y-min.y) / parts_2)
    let width = min.x
    let height = min.y

    while (height < max.y) {
      let crosses = 0
      for (let i=0; i < relative_locations.length-1; i++) {
        if ( is_intersecting({x: min.x-1, y: min.y-1}, {x: width, y: height}, relative_locations[i], relative_locations[i+1]) ) {
          crosses++
        }
      }

      if (crosses % 2 == 1) {
        wire2.areas.push(new THREE.Vector3(width, height, 0).applyMatrix3(to_original_axis).add(main_point))
      }

      width += step
      if (width > max.x) {
        width = min.x
        height += step
      }
    }
    wire2.area_value = step*step // no need to convert back to original axis because the bases axis are normolized
    wire2.surface_vec = surface_vec
  }

  // create force toggle
  const toggle_force = document.createElement('label');
  toggle_force.style.width = "60%";
  toggle_force.style.height = "0";
  toggle_force.style.paddingBottom = "30%";
  toggle_force.classList.add("switch");
  toolbar.children[0].append(toggle_force);

  const input = document.createElement('input');
  input.classList.add("force_type");
  input.type = "checkbox";
  toggle_force.append(input);

  const span = document.createElement('span');
  span.classList.add("slider");
  span.classList.add("round");
  toggle_force.append(span);
  
  const p = document.createElement('p');
  span.append(p);


  // create slidebars
  toolbar.style.height = toolbar.offsetWidth/2+"px";

  const slidebars = document.createElement('div');
  slidebars.style.width = "85%";
  slidebars.style.height = "100%";
  slidebars.style.textAlign = "center";
  toolbar.append(slidebars);

  wire1.speed = new THREE.Vector3(0,0,0);
  function update_speeds() {
    const length = wire1.speed.length()*25
    wire1_speeds.children.forEach(speed => {
      speed.setLength(length, length*0.2, length*0.2)
      speed.setDirection(wire1.speed.clone().normalize())
    })
  }

  const inputs = {
    "R_1": function () { wire1.rotation.x = this.value/100*pi*2 + pi/2 },
    "R_2": function () { wire1.rotation.y = this.value/100*pi*2 },
    "R_3": function () { wire2.rotation.y = this.value/100*pi*2 },
    "V": function () { wire1.voltage = (this.value-50)/10 },
  }
  const height = slidebars.offsetHeight / (Object.keys(inputs).length);
  slidebars.style.fontSize = height*0.7 + "px";
  for(const name in inputs) {
    const part = document.createElement('div');
    part.innerText = name + ": ";
    slidebars.append(part);

    const slidebar = document.createElement('input');
    slidebar.type = 'range';
    slidebar.value = /^V$/.test(name) ? 50 : 0;
    slidebar.min = 0;
    slidebar.max = 100;
    slidebar.style.width = "60%";
    slidebar.style.verticalAlign = "middle";
    slidebar.classList.add("measure_slide");
    part.append(slidebar);

    slidebar.onchange = inputs[name];
    slidebar.oninput = inputs[name];
  }
}

window.changing_current = function (toolbar, scene) {
  const wire1 = {}
  const wire2 = {}

  const wire1_mesh     = scene.getObjectByName("wire1")
  const wire2_mesh     = scene.getObjectByName("wire2")
  const voltage_arrows = scene.getObjectByName("voltages")

  wire1.position = wire1_mesh.position
  wire1.rotation = wire1_mesh.rotation
  wire1.mass_center = wire1_mesh.mass_center.clone().applyEuler(wire1.rotation)
  wire1.points_vec = wire1_mesh.points_vec.map(vec => vec.clone().applyEuler(wire1.rotation))
  wire1.length = wire1_mesh.length

  wire2.position = wire2_mesh.position
  wire2.rotation = wire2_mesh.rotation
  wire2.mass_center = wire2_mesh.mass_center.clone().applyEuler(wire2.rotation)
  wire2.voltage = 0
  wire2.points_vec = wire2_mesh.points_vec.map(vec => vec.clone().applyEuler(wire2.rotation))
  wire2.length = wire2_mesh.length

  if (wire2_mesh.areas) {
    wire2.areas = wire2_mesh.areas.map(vec => vec.clone().applyEuler(wire2.rotation).add(wire2.position))
    wire2.area_value = wire2_mesh.area_value
    wire2.surface_vec = wire2_mesh.surface_vec.clone().applyEuler(wire2.rotation)
  }

  const mine_force = toolbar.children[0].children[1].children[0].checked
  const voltage = wire2_mesh.voltage

  const parts_1 = wire1.points_vec.length-1
  const parts_2 = wire2.points_vec.length-1

  const speeds_1 = []
  for (let point_1 = 0; point_1 < parts_1; point_1++) {
    speeds_1.push(wire1.points_vec[point_1+1].clone().sub(wire1.points_vec[point_1]).normalize())
  }
  const speeds_2 = []
  for (let point_2 = 0; point_2 < parts_2; point_2++) {
    speeds_2.push(wire2.points_vec[point_2+1].clone().sub(wire2.points_vec[point_2]).normalize())
  }
  for (let point_1 = 0; point_1 < parts_1; point_1++) {

    const relative_place_1 = wire1.points_vec[point_1]
    const v_1 = speeds_1[point_1]
    const absolute_place_1 = wire1.position.clone().add(relative_place_1)

    for (let point_2 = 0; point_2 < parts_2; point_2++) {

      const relative_place_2 = wire2.points_vec[point_2]
      const v_2 = speeds_2[point_2]
      const absolute_place_2 = wire2.position.clone().add(relative_place_2)

      const R = absolute_place_1.clone().sub(absolute_place_2)
      const R_hat = R.clone().normalize()

      if (mine_force) {
        // full "mine" force calculation
        const v_1_n = v_1
        const v_2_n = v_2
        const v_1_p = new THREE.Vector3(0,0,0)
        const v_2_p = new THREE.Vector3(0,0,0)

        const top_p_n = + Math.pow(v_1_p.clone().sub(v_2_n).length(), 2) - 3/2*Math.pow(v_1_p.clone().dot(R_hat) - v_2_n.clone().dot(R_hat), 2)
        const top_n_p = + Math.pow(v_1_n.clone().sub(v_2_p).length(), 2) - 3/2*Math.pow(v_1_n.clone().dot(R_hat) - v_2_p.clone().dot(R_hat), 2)
        const top_n_n = - Math.pow(v_1_n.clone().sub(v_2_n).length(), 2) + 3/2*Math.pow(v_1_n.clone().dot(R_hat) - v_2_n.clone().dot(R_hat), 2)
        const top_p_p = - Math.pow(v_1_p.clone().sub(v_2_p).length(), 2) + 3/2*Math.pow(v_1_p.clone().dot(R_hat) - v_2_p.clone().dot(R_hat), 2)

        // check whats f_positive_2 - f_positive_1 to know the forces difference for the voltage
        // const field_difference = R_hat.clone().multiplyScalar( ((top_p_n + top_n_n) - (top_n_p + top_p_p)) / (Math.pow(R.length(), 2)) )
        const field_difference = R_hat.clone().multiplyScalar( (top_p_n + top_n_n) / (Math.pow(R.length(), 2)) )
        // check its vlue in the wire direction because on other directions the electricity cant flow
        const field_difference_in_wire_direction = field_difference.clone().dot(v_2.clone().normalize())
        const distance = wire2.length / parts_2
        // voltage = how much energy it takes to move a 1 charge from point A to point B
        wire2.voltage += field_difference_in_wire_direction * distance
      }
    }

    if (!mine_force && wire2.areas) {
      for (let i = 0; i < wire2.areas.length; i++) {
        const dt = 0.00001
        const area_place = wire2.areas[i]
  
        const R_A_old = absolute_place_1.clone().sub(area_place)
        const R_A_hat_old = R_A_old.clone().normalize()
        const old_flux = v_1.clone().cross(R_A_hat_old).dot(wire2.surface_vec) / Math.pow(R_A_old.length(), 2) * wire2.area_value
  
        const R_A_new = absolute_place_1.clone().add(wire1.speed.clone().multiplyScalar(dt)).sub(area_place)
        const R_A_hat_new = R_A_new.clone().normalize()
        const new_flux = v_1.clone().cross(R_A_hat_new).dot(wire2.surface_vec) / Math.pow(R_A_new.length(), 2) * wire2.area_value
  
        wire2.voltage += -(new_flux - old_flux) / dt
      }
    }
  }

  // add dl (doing f/(parts*parts) is the same as doing f*Q1*dl*Q2*dl)
  wire2.voltage /= parts_2

  // scale for better display
  wire2.voltage   *= 267.079_464_85

  // update voltage
  if (!mine_force && !wire2.areas) {
    voltage.innerHTML = voltage.innerHTML.replace( new RegExp(": .*$","gm"),": can't calc this shape")
    voltage_arrows.children.forEach(arrow => {
      arrow.setLength(1, 0, 0)
    })
  } else {
    voltage.innerHTML = voltage.innerHTML.replace( new RegExp(": .*$","gm"),": " + Math.abs(wire2.voltage*10).toFixed(20).match(/^-?\d*\.?0*\d{0,2}/)[0])
    // keep the arrow with easy to see size
    const size = Math.sqrt(Math.abs(wire2.voltage))*Math.sign(wire2.voltage)
    voltage_arrows.children.forEach(arrow => {
      arrow.setLength(1, 60*size, 60*size)
    })
  }
}