import * as THREE from 'three'
import { Line2 } from 'three/addons/lines/Line2.js'
import { LineMaterial } from 'three/addons/lines/LineMaterial.js'
import { LineGeometry } from 'three/addons/lines/LineGeometry.js'
import { Path3 } from './tools/threejs/path3.js'

const pi = Math.PI
const err_num = 0.00001

const wires_distance_from_center = 200;
const wires_radius = 150

function vec_to_euler(vector) {
  return new THREE.Euler(0,0,0,'XYZ').setFromRotationMatrix(new THREE.Matrix4().lookAt(vector, new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0)))
}

window.calc_two_circles_init = function (toolbar, scene) {
  const points = []
  for ( let degree = 0; degree < 2*Math.PI+err_num; degree += 2*Math.PI/30 ) {
    points.push(Math.sin(degree)*wires_radius, Math.cos(degree)*wires_radius, 0)
  }
  const path = new Path3(points)

  window.calc_force_init(toolbar, scene, path, path)
}

window.calc_two_circles = function (toolbar, scene) {
  window.calc_force(toolbar, scene)
}

window.calc_force_init = function (toolbar, scene, path1, path2) {
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
  wire1.path = path1

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
  const wire1_current = new THREE.Group()
  wire1_current.name = "wire1_current"
  wire1.add(wire1_current)
  for (let arrow_counter = 1/current_arrows/2; arrow_counter < 1; arrow_counter+= 1/current_arrows) {
    const index = Math.floor(arrow_counter*wire1.points_vec.length)
    const position = wire1.points_vec[index].clone()
    const direction = wire1.points_vec[index+1].clone().sub(position).normalize()
    position.add(direction.clone().multiplyScalar(20))
    const speed = new THREE.ArrowHelper( direction, position, 0, wire1_material.color )
    speed.setLength(1, 60, 60)
    wire1_current.add(speed)
  }

  // calculate the mass center
  wire1.mass_center = new THREE.Vector3(0,0,0)
  for (let i=0; i < wire1.points_vec.length; i++) {
    wire1.mass_center.add(wire1.points_vec[i])
  }
  wire1.mass_center.divideScalar(wire1.points_vec.length)

  // transform the whole shape
  wire1.rotation.x = pi/2
  wire1.position.y = wires_distance_from_center
  scene.add(wire1)

  // draw voltage flow
  const voltages1 = new THREE.Group()
  voltages1.name = "voltages1"
  wire1.add(voltages1)
  for (let arrow_counter = 1/(current_arrows-1)/2; arrow_counter < 1; arrow_counter+= 1/(current_arrows-1)) {
    const index = Math.floor(arrow_counter*wire1.points_vec.length)
    const position = wire1.points_vec[index].clone()
    const direction = wire1.points_vec[index+1].clone().sub(position).normalize()
    position.add(direction.clone().multiplyScalar(20))
    const speed = new THREE.ArrowHelper( direction, position, 0, 0xe6763e )
    voltages1.add(speed)
  }

  // draw shapes WIRE2
  const wire2 = new THREE.Group()
  const wire2_material = new THREE.MeshBasicMaterial({ color: 0x6898cc })
  wire2.name = "wire2"
  wire2.points_vec = wire2_points_vec
  wire2.length = wire2_length
  wire2.path = path2

  // draw circle wire
  const wire2_path = new LineGeometry()
  wire2_path.setPositions(wire2_points)
  const wire2_shape_material = new LineMaterial({color: wire2_material.color, linewidth: 15})
  const wire2_shape = new Line2( wire2_path, wire2_shape_material )
  wire2_shape_material.resolution.set( window.innerWidth, window.innerHeight )
  wire2_shape.name = "wire2_shape"
  wire2.add(wire2_shape)

  // draw current flow
  const wire2_current = new THREE.Group()
  wire2_current.name = "wire2_current"
  wire2.add(wire2_current)
  for (let arrow_counter = 1/current_arrows/2; arrow_counter < 1; arrow_counter+= 1/current_arrows) {
    const index = Math.floor(arrow_counter*wire2.points_vec.length)
    const position = wire2.points_vec[index].clone()
    const direction = wire2.points_vec[index+1].clone().sub(position).normalize()
    position.add(direction.clone().multiplyScalar(20))
    const speed = new THREE.ArrowHelper( direction, position, 0, wire2_material.color )
    speed.setLength(1, 60, 60)
    wire2_current.add(speed)
  }

  // calculate the mass center
  wire2.mass_center = new THREE.Vector3(0,0,0)
  for (let i=0; i < wire2.points_vec.length; i++) {
    wire2.mass_center.add(wire2.points_vec[i])
  }
  wire2.mass_center.divideScalar(wire2.points_vec.length)

  // transform the whole shape
  wire2.rotation.x = pi/2
  wire2.position.y = -wires_distance_from_center
  scene.add(wire2)

  // voltage text
  const voltage = document.createElement('div');
  toolbar.parentElement.appendChild(voltage);
  voltage.style.position = 'absolute';
  voltage.innerHTML = "Green wire voltage: 0\nBlue wire voltage: 0";
  voltage.style.height = 'auto';
  voltage.style.top = toolbar.parentElement.children[0].offsetHeight + 'px';
  voltage.style.transform = 'translateY(-100%)';
  voltage.style.left = '5%';
  voltage.style.pointerEvents = 'none';
  voltage.style.whiteSpace = 'pre-wrap';
  wire2.voltage = voltage

  // draw voltage flow
  const voltages2 = new THREE.Group()
  voltages2.name = "voltages2"
  wire2.add(voltages2)
  for (let arrow_counter = 1/(current_arrows-1)/2; arrow_counter < 1; arrow_counter+= 1/(current_arrows-1)) {
    const index = Math.floor(arrow_counter*wire2.points_vec.length)
    const position = wire2.points_vec[index].clone()
    const direction = wire2.points_vec[index+1].clone().sub(position).normalize()
    position.add(direction.clone().multiplyScalar(20))
    const speed = new THREE.ArrowHelper( direction, position, 0, 0xe6763e )
    voltages2.add(speed)
  }
  

  // Check if 2d shape, to be able to use Faraday's law
  function areas_for_faradays_law(wire) {
    is_2d: if (wire.path.points.length >= 9) {
      const main_point = new THREE.Vector3(wire.path.points[0], wire.path.points[1], wire.path.points[2])
      // make sure that the circiot is closed
      if (new THREE.Vector3(wire.path.points[wire.path.points.length-3], wire.path.points[wire.path.points.length-2], wire.path.points[wire.path.points.length-1]).sub(main_point).length() > err_num) {
        break is_2d
      }
      const new_x = new THREE.Vector3(wire.path.points[3], wire.path.points[4], wire.path.points[5]).sub(main_point).normalize()
      const surface_vec = new THREE.Vector3(wire.path.points[6], wire.path.points[7], wire.path.points[8]).sub(main_point).cross(new_x).normalize()
      const new_y = new_x.clone().cross(surface_vec).normalize()
  
      // yea i can probably use here 4D matrix instead of doing "sub(main_point)" and then "add(main_point)". but idk how to use matrixes so maybe in the future
      const to_original_axis = new THREE.Matrix3()
      // to_original_axis.set(new_x.x, new_x.y, new_x.z, new_y.x, new_y.y, new_y.z, surface_vec.x, surface_vec.y, surface_vec.z)
      to_original_axis.set(new_x.x, new_y.x, surface_vec.x, new_x.y, new_y.y, surface_vec.y, new_x.z, new_y.z, surface_vec.z)
      const to_new_axis = to_original_axis.clone().invert()
      // check if each dot is on the surface + get the max and min points of the surface
      const relative_locations = []
      for (let i=0; i < wire.path.points.length; i+=3) {
        relative_locations.push(new THREE.Vector3(wire.path.points[i], wire.path.points[i+1], wire.path.points[i+2]).sub(main_point).applyMatrix3(to_new_axis))
        const tmp = new THREE.Vector3(wire.path.points[i], wire.path.points[i+1], wire.path.points[i+2])
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
      wire.areas = []
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
          wire.areas.push(new THREE.Vector3(width, height, 0).applyMatrix3(to_original_axis).add(main_point))
        }
  
        width += step
        if (width > max.x) {
          width = min.x
          height += step
        }
      }
      wire.area_value = step*step // no need to convert back to original axis because the bases axis are normolized
      wire.surface_vec = surface_vec
    }
  }
  areas_for_faradays_law(wire1)
  areas_for_faradays_law(wire2)

  // speed arrows
  const wire1_speeds = new THREE.Group()
  wire1_speeds.name = "wire1_speeds"
  wire1.add(wire1_speeds)

  for (let arrow_counter = 0; arrow_counter < 1; arrow_counter+= 1/current_arrows) {
    const index = Math.floor(arrow_counter*wire1.points_vec.length)
    const position = wire1.points_vec[index].clone()
    const speed = new THREE.ArrowHelper( new THREE.Vector3(1,0,0), position, 0, 0xcd75d1 )
    wire1_speeds.add(speed)
  }

  // const wire1_spin = new THREE.Group()
  // wire1_spin.name = "wire1_spin"
  // wire1.add(wire1_spin)
  // for (let arrow_counter = 0; arrow_counter < 1; arrow_counter+= 1/current_arrows) {
  //   const index = Math.floor(arrow_counter*wire1.points_vec.length)
  //   const position = wire1.points_vec[index].clone()
  //   const direction = wire1.points_vec[index+1].clone().sub(position).normalize()
  //   position.add(direction.clone().multiplyScalar(20))
  //   const spin_arrow = new THREE.ArrowHelper( direction, position, 0, 0xcd75d1 )
  //   wire1_spin.add(spin_arrow)
  // }

  // const wire2_spin = new THREE.Group()
  // wire2_spin.name = "wire2_spin"
  // wire2.add(wire2_spin)
  // for (let arrow_counter = 0; arrow_counter < 1; arrow_counter+= 1/current_arrows) {
  //   const index = Math.floor(arrow_counter*wire2.points_vec.length)
  //   const position = wire2.points_vec[index].clone()
  //   const direction = wire2.points_vec[index+1].clone().sub(position).normalize()
  //   position.add(direction.clone().multiplyScalar(20))
  //   const spin_arrow = new THREE.ArrowHelper( direction, position, 0, 0xcd75d1 )
  //   wire2_spin.add(spin_arrow)
  // }

  // total force arrows
  const force_on_1 = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), wire1.position, 0, wire2_material.color)
  force_on_1.name = "force_on_1"
  scene.add(force_on_1)

  const force_on_2 = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), wire2.position, 0, wire1_material.color)
  force_on_2.name = "force_on_2"
  scene.add(force_on_2)

  // rotation force arrows
  const circle = new THREE.EllipseCurve(0, 0, 80, 80, 0, 3/2 * pi, false)
  const curve_1_body = new THREE.Line(new THREE.BufferGeometry().setFromPoints( circle.getSpacedPoints(10) ))
  const curve_1_head = new THREE.Mesh(new THREE.ConeGeometry( 15, 40, 32 ))
  curve_1_head.position.y = -80
  curve_1_head.rotation.z = -pi / 2

  const curve_1 = new THREE.Group()
  curve_1.add(curve_1_body)
  curve_1.add(curve_1_head)
  const curve_2 = curve_1.clone()
  curve_2.traverse((node) => { if (node.isMesh) { node.material = node.material.clone() } })

  curve_1.name = "curve_1"
  curve_2.name = "curve_2"

  curve_1.position.set(wire1.position.x, wire1.position.y, wire1.position.z)
  curve_2.position.set(wire2.position.x, wire2.position.y, wire2.position.z)

  curve_1.children.forEach(child => { child.material.color.set(wire2_material.color) })
  curve_2.children.forEach(child => { child.material.color.set(wire1_material.color) })

  curve_1.scale.setScalar(0)
  curve_2.scale.setScalar(0)

  scene.add(curve_1)
  scene.add(curve_2)

  // create force toggle
  const toggle_force = document.createElement('label');
  toggle_force.style.width = "60%";
  toggle_force.style.height = "0";
  toggle_force.style.paddingBottom = "30%";
  toggle_force.classList.add("switch");
  toolbar.children[0].append(toggle_force);

  const toggle_force_text = document.createElement('div');
  toggle_force_text.innerHTML = "New method";
  toggle_force_text.style.textAlign = "center";
  toggle_force_text.style.fontWeight = "bold";
  toggle_force_text.style.fontSize = toggle_force.offsetWidth/3 + "px";
  toolbar.children[0].append(toggle_force_text);

  const input = document.createElement('input');
  input.classList.add("force_type");
  input.type = "checkbox";
  input.checked = true;
  toggle_force.append(input);

  const span = document.createElement('span');
  span.classList.add("slider");
  span.classList.add("round");
  toggle_force.append(span);
  
  const p = document.createElement('p');
  span.append(p);


  // create slidebars
  toolbar.style.height = "auto";
  toolbar.style.width = "auto";
  toolbar.style.padding = "3%";

  const slidebars = document.createElement('div');
  slidebars.style.width = "85%";
  slidebars.style.height = "100%";
  slidebars.style.textAlign = "center";
  slidebars.style.marginLeft = '2%';
  toolbar.append(slidebars);

  // update speeds
  wire1.speed = new THREE.Vector3(0,0,0);
  function update_speeds(wire) {
    const length = wire.speed.length()*25
    wire.getObjectByName(`${wire.name}_speeds`).children.forEach(speed => {
      speed.setLength(length, length*0.2, length*0.2)
      speed.setDirection(wire.speed.clone().normalize())
    })
  }

  // update cuurents
  wire1.current = 0;
  wire2.current = 0;
  function update_wire_current(wire) {
    // keep the arrow with easy to see size
    const size = Math.sqrt(Math.abs(wire.current))*Math.sign(wire.current)
    wire.getObjectByName(`${wire.name}_current`).children.forEach(arrow => {
      arrow.setLength(1, 60*size, 60*size)
    })
  }

  // // update spins
  // wire1.spin = 0;
  // wire2.spin = 0;
  // function update_wire_spins(wire) {
  //   // keep the arrow with easy to see size
  //   const spin = wire.spin / 5
  //   const size = Math.sqrt(Math.abs(spin))*Math.sign(spin)
  //   wire.getObjectByName(`${wire.name}_spin`).children.forEach(arrow => {
  //     arrow.setLength(1, 60*size, 60*size)
  //   })
  // }

  const inputs = {
    Current: {
      G: function () { wire1.current = (this.value-50)/50; update_wire_current(wire1) },
      B: function () { wire2.current = (this.value-50)/50; update_wire_current(wire2) },
    },
    Orientation: {
      G_X: function () { wire1.rotation.x = this.value/100*pi*2 + pi/2 },
      G_Y: function () { wire1.rotation.y = this.value/100*pi*2 },
      B_Y: function () { wire2.rotation.y = this.value/100*pi*2 }
    },
    Speed: {
      G_X: function () { wire1.speed.x = (this.value-50)/10; update_speeds(wire1) },
      G_Y: function () { wire1.speed.y = (this.value-50)/10; update_speeds(wire1) },
      G_Z: function () { wire1.speed.z = (this.value-50)/10; update_speeds(wire1) }
    },
    // Spin: {
    //   G: function () { wire1.spin = (this.value-50)/10; update_wire_spins(wire1) },
    //   B: function () { wire2.spin = (this.value-50)/10; update_wire_spins(wire2) }
    // }
  }
  for(const subj in inputs) {
    const subj_part = document.createElement('details');
    subj_part.style.textAlign = 'left';
    subj_part.style.marginBottom = '3%';
    const subj_title = document.createElement('summary');
    subj_title.innerText = subj;
    subj_title.style.fontWeight = "bold";
    subj_part.append(subj_title);
    slidebars.append(subj_part);
    if (subj == "Current") {
      subj_title.click()
    }
    for(const name in inputs[subj]) {
      const part = document.createElement('div');
      part.style.marginLeft = '5%';
      part.style.marginBottom = '2%';
      const text = document.createElement('span');
      text.innerText = name + ":";
      text.style.float = "left";
      text.style.width = "auto";
      part.append(text);
      subj_part.append(part);
  
      const slidebar = document.createElement('input');
      slidebar.type = 'range';
      switch(subj) {
        case "Current":
          slidebar.value = 100
          break;
        case "Orientation":
          slidebar.value = 0
          break;
        case "Speed":
          slidebar.value = 50
          break;
        default:
          slidebar.value = 50
      }
      slidebar.min = 0;
      slidebar.max = 100;
      // add style
      slidebar.style.width = "75%";
      slidebar.style.verticalAlign = "middle";
      slidebar.classList.add("measure_slide");

      // add classes for easy searching
      slidebar.classList.add(subj.toLowerCase());
      name.split("_").forEach(symbol => slidebar.classList.add(symbol.toLowerCase()))
      part.append(slidebar);

      const datalist = document.createElement('datalist');
      datalist.id = `${name}_datalist`
      slidebar.setAttribute('list', datalist.id);
      const options_numbers = [25,50,75]
      options_numbers.forEach(options_number => {
        const option = document.createElement('option');
        option.innerText = options_number
        datalist.append(option);
      })
      part.append(datalist);
  
      slidebar.onchange = inputs[subj][name];
      slidebar.oninput = inputs[subj][name];

      slidebar.onchange();
    }
  }
}

function combine(v1, v2) {
  return v1.dot(v2)
}
function parallel_1(v1, v2) {
  const v2_unit = v2.clone().normalize()
  return v2_unit.multiplyScalar(v1.dot(v2_unit))
}
function vertical_1(v1, v2) {
  const v2_unit = v2.clone().normalize()
  return v2_unit.cross( v1.clone().cross(v2_unit) )
  // return v1 - parallel(v1, v2)
}

window.calc_force = function (toolbar, scene) {
  const wire1 = {}
  const wire2 = {}

  const wire1_mesh      = scene.getObjectByName("wire1")
  const wire2_mesh      = scene.getObjectByName("wire2")
  const force_on_1      = scene.getObjectByName("force_on_1")
  const force_on_2      = scene.getObjectByName("force_on_2")
  const curve_1         = scene.getObjectByName("curve_1")
  const curve_2         = scene.getObjectByName("curve_2")
  const wire1_speeds    = scene.getObjectByName("wire1_speeds")
  const voltage1_arrows = scene.getObjectByName("voltages1")
  const voltage2_arrows = scene.getObjectByName("voltages2")

  wire1.name = "Green wire"
  wire1.current = wire1_mesh.current
  wire1.position = wire1_mesh.position
  wire1.rotation = wire1_mesh.rotation
  wire1.mass_center = wire1_mesh.mass_center.clone().applyEuler(wire1.rotation)
  wire1.voltage = 0
  const abs_rotation = new THREE.Euler(wire1_mesh.rotation.x + wire1_speeds.rotation.x, wire1_mesh.rotation.z + wire1_speeds.rotation.z, wire1_mesh.rotation.y + wire1_speeds.rotation.y, "XYZ")
  wire1.speed = wire1_mesh.speed.clone().applyEuler(abs_rotation)
  // wire1.spin = wire1_mesh.spin
  wire1.points_vec = wire1_mesh.points_vec.map(vec => vec.clone().applyEuler(wire1.rotation))
  wire1.length = wire1_mesh.length
  wire1.voltage_arrows = voltage1_arrows

  wire2.name = "Blue wire"
  wire2.current = wire2_mesh.current
  wire2.position = wire2_mesh.position
  wire2.rotation = wire2_mesh.rotation
  wire2.mass_center = wire2_mesh.mass_center.clone().applyEuler(wire2.rotation)
  wire2.voltage = 0
  // wire2.spin = wire2_mesh.spin
  wire2.points_vec = wire2_mesh.points_vec.map(vec => vec.clone().applyEuler(wire2.rotation))
  wire2.length = wire2_mesh.length
  wire2.voltage_arrows = voltage2_arrows

  if (wire1_mesh.areas) {
    wire1.areas = wire1_mesh.areas.map(vec => vec.clone().applyEuler(wire1.rotation).add(wire1.position))
    wire1.area_value = wire1_mesh.area_value
    wire1.surface_vec = wire1_mesh.surface_vec.clone().applyEuler(wire1.rotation)
  }
  if (wire2_mesh.areas) {
    wire2.areas = wire2_mesh.areas.map(vec => vec.clone().applyEuler(wire2.rotation).add(wire2.position))
    wire2.area_value = wire2_mesh.area_value
    wire2.surface_vec = wire2_mesh.surface_vec.clone().applyEuler(wire2.rotation)
  }

  const mine_force = toolbar.children[0].children[1].children[0].checked
  const voltage = wire2_mesh.voltage

  // const mass_of_electron_over_proton = 1/1000

  const F_1_T = new THREE.Vector3(0,0,0)
  const F_2_T = new THREE.Vector3(0,0,0)
  const F_1_rotating_T = new THREE.Vector3(0,0,0)
  const F_2_rotating_T = new THREE.Vector3(0,0,0)

  const parts_1 = wire1.points_vec.length-1
  const parts_2 = wire2.points_vec.length-1

  const speeds_1 = [null]
  for (let point_1 = 1; point_1 < parts_1; point_1++) {
    speeds_1.push(wire1.points_vec[point_1+1].clone().sub(wire1.points_vec[point_1-1]).normalize())
  }
  const speeds_2 = [null]
  for (let point_2 = 1; point_2 < parts_2; point_2++) {
    speeds_2.push(wire2.points_vec[point_2+1].clone().sub(wire2.points_vec[point_2-1]).normalize())
  }
  for (let point_1 = 1; point_1 < parts_1; point_1++) {

    const relative_place_1 = wire1.points_vec[point_1]
    const v_1 = speeds_1[point_1]
    const absolute_place_1 = wire1.position.clone().add(relative_place_1)

    for (let point_2 = 1; point_2 < parts_2; point_2++) {

      const relative_place_2 = wire2.points_vec[point_2]
      const v_2 = speeds_2[point_2]
      const absolute_place_2 = wire2.position.clone().add(relative_place_2)

      const R = absolute_place_1.clone().sub(absolute_place_2)
      const R_hat = R.clone().normalize()

      let f_1 = null
      let f_2 = null

      if (mine_force) {
        // full "mine" force calculation

        f_1 = new THREE.Vector3(0,0,0)
        f_2 = new THREE.Vector3(0,0,0)
        let f_1_rotating = new THREE.Vector3(0,0,0)
        let f_2_rotating = new THREE.Vector3(0,0,0)

        f_2.add(R_hat.clone().multiplyScalar( - combine(v_1, R_hat) * combine(v_2, R_hat) ))
        f_2.add(R_hat.clone().multiplyScalar( combine(vertical_1(v_1, R_hat), vertical_1(v_2, R_hat)) * 4 ))
        f_2.add( vertical_1(v_2, R_hat).multiplyScalar(combine(v_1, R_hat) * 3/2) )
        f_2.add( vertical_1(v_1, R_hat).multiplyScalar(combine(v_2, R_hat) * 3/2) )
        f_2.multiplyScalar(1 / Math.pow(R.length(), 2)) // its 1/L^2 ? cuz in my theory its 1/L^4

        f_1 = f_2.clone().multiplyScalar(-1)

        // ?
        f_2_rotating.add(vertical_1(v_1, R_hat).cross(vertical_1(v_2, R_hat)).multiplyScalar(4.5))
        f_2_rotating.add(vertical_1(v_2, R_hat).cross(parallel_1(v_1, R_hat)).multiplyScalar(9))
        f_2_rotating.add(vertical_1(v_1, R_hat).cross(parallel_1(v_2, R_hat)).multiplyScalar(4.5))
        f_2_rotating.multiplyScalar(1 / Math.pow(R.length(), 3))
        // F_2_rotating_T.add(f_2_rotating)
      } else {
        // "their" force calculation
        f_1 = v_2.clone().cross(R_hat.clone().negate()).cross(v_1).divideScalar(Math.pow(R.length(), 2)).multiplyScalar(wire1.current).multiplyScalar(wire2.current)
        f_2 = v_1.clone().cross(R_hat                 ).cross(v_2).divideScalar(Math.pow(R.length(), 2)).multiplyScalar(wire1.current).multiplyScalar(wire2.current)

        if (wire1.areas && point_1 === 1) {
          for (let i = 0; i < wire1.areas.length; i++) {
            const dt = err_num
            const area_place = wire1.areas[i]
      
            const R_A_old = absolute_place_2.clone().sub(area_place)
            const R_A_hat_old = R_A_old.clone().normalize()
            const old_flux = v_2.clone().multiplyScalar(wire2.current).cross(R_A_hat_old).dot(wire1.surface_vec) / Math.pow(R_A_old.length(), 2) * wire1.area_value
      
            const R_A_new = absolute_place_2.clone().add(wire1.speed.clone().multiplyScalar(dt)).sub(area_place)
            const R_A_hat_new = R_A_new.clone().normalize()
            const new_flux = v_2.clone().multiplyScalar(wire2.current).cross(R_A_hat_new).dot(wire1.surface_vec) / Math.pow(R_A_new.length(), 2) * wire1.area_value
      
            wire1.voltage += -(new_flux - old_flux) / dt
          }
        }
        if (wire2.areas && point_2 === 1) {
          for (let i = 0; i < wire2.areas.length; i++) {
            const dt = err_num
            const area_place = wire2.areas[i]
      
            const R_A_old = absolute_place_1.clone().sub(area_place)
            const R_A_hat_old = R_A_old.clone().normalize()
            const old_flux = v_1.clone().multiplyScalar(wire1.current).cross(R_A_hat_old).dot(wire2.surface_vec) / Math.pow(R_A_old.length(), 2) * wire2.area_value
      
            const R_A_new = absolute_place_1.clone().add(wire1.speed.clone().multiplyScalar(dt)).sub(area_place)
            const R_A_hat_new = R_A_new.clone().normalize()
            const new_flux = v_1.clone().multiplyScalar(wire1.current).cross(R_A_hat_new).dot(wire2.surface_vec) / Math.pow(R_A_new.length(), 2) * wire2.area_value
      
            wire2.voltage += -(new_flux - old_flux) / dt
          } 
        }
      }

      F_1_T.add(f_1)
      F_2_T.add(f_2)

      F_1_rotating_T.add(relative_place_1.clone().sub(wire1.mass_center).cross(f_1))
      F_2_rotating_T.add(relative_place_2.clone().sub(wire2.mass_center).cross(f_2))
    }
  }

  // add dl (doing f/(parts*parts) is the same as doing f*Q1*dl*Q2*dl)
  F_1_T.divideScalar((parts_1-1) * (parts_2-1))
  F_2_T.divideScalar((parts_1-1) * (parts_2-1))
  F_1_rotating_T.divideScalar((parts_1-1) * (parts_2-1))
  F_2_rotating_T.divideScalar((parts_1-1) * (parts_2-1))
  wire2.voltage /= (parts_1-1)
  wire1.voltage /= (parts_2-1)

  // the actual force
  // const equation_constant = Math.pow(10, -7)
  // const actual_F2_force = F_2_T.clone().multiplyScalar(equation_constant)
  // const actual_F1_rotation_force = F_1_T.clone().multiplyScalar(equation_constant)
  // console.log(actual_F1_rotation_force)
  
  // scale for better display
  wire2.voltage   *= 267.079_464_85
  wire1.voltage   *= 267.079_464_85
  let foce_const
  if (mine_force) {
    foce_const = 267_079_464.85 * 0.75
  } else {
    foce_const = 267_079_464.85
  }
  F_1_T.multiplyScalar(foce_const)
  F_2_T.multiplyScalar(foce_const)
  F_1_rotating_T.multiplyScalar(foce_const*2/3)
  F_2_rotating_T.multiplyScalar(foce_const*2/3)

  // update total force arrows
  force_on_1.setDirection(F_1_T.clone().normalize())
  force_on_2.setDirection(F_2_T.clone().normalize())
  force_on_1.setLength(F_1_T.length(), F_1_T.length()*0.2, F_1_T.length()*0.2)
  force_on_2.setLength(F_2_T.length(), F_2_T.length()*0.2, F_2_T.length()*0.2)
  force_on_1.position.set(wire1.position.x + wire1.mass_center.x, wire1.position.y + wire1.mass_center.y, wire1.position.z + wire1.mass_center.z)
  force_on_2.position.set(wire2.position.x + wire2.mass_center.x, wire2.position.y + wire2.mass_center.y, wire2.position.z + wire2.mass_center.z)

  // update rotation force arrows
  curve_1.scale.setScalar(F_1_rotating_T.length() / 20500)
  curve_2.scale.setScalar(F_2_rotating_T.length() / 20500)
  curve_1.position.set(wire1.position.x + wire1.mass_center.x, wire1.position.y + wire1.mass_center.y, wire1.position.z + wire1.mass_center.z)
  curve_2.position.set(wire2.position.x + wire2.mass_center.x, wire2.position.y + wire2.mass_center.y, wire2.position.z + wire2.mass_center.z)
  curve_1.rotation.setFromVector3(vec_to_euler(F_1_rotating_T))
  curve_2.rotation.setFromVector3(vec_to_euler(F_2_rotating_T))

  function update_voltage(wire, message) {
    let value
    let arrow_size
    let wire_name
    if (message) {
      value = message
      arrow_size = 0
    } else {
      value = Math.abs(wire.voltage*10).toFixed(20).match(/^-?\d*\.?0*\d{0,2}/)[0]
      // keep the arrow with easy to see size
      arrow_size = Math.sqrt(Math.abs(wire.voltage))*Math.sign(wire.voltage)
    }
    voltage.innerHTML = voltage.innerHTML.replace( new RegExp(wire.name+" voltage: .*$","gm"),wire.name+" voltage: " + value)
    wire.voltage_arrows.children.forEach(arrow => {
      arrow.setLength(1, 60*arrow_size, 60*arrow_size)
    })
  }

  // update voltages
  [wire1, wire2].forEach(wire => {
    if (!mine_force && !wire.areas) { // if not valid: their method and weird shape
      update_voltage(wire, "can't calc this shape")
    } else { // rest just print the result
      update_voltage(wire)
    }
  })
}
