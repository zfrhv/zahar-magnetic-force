import * as THREE from 'three'
import { Line2 } from 'three/addons/lines/Line2.js'
import { LineMaterial } from 'three/addons/lines/LineMaterial.js'
import { LineGeometry } from 'three/addons/lines/LineGeometry.js'
import { Path3 } from './tools/threejs/path3.js'
    
const pi = Math.PI
const parts_start = 428
let parts = parts_start

function vec_to_euler(vector) {
  return new THREE.Euler(0,0,0,'XYZ').setFromRotationMatrix(new THREE.Matrix4().lookAt(vector, new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0)))
}

window.calc_two_circles_init = function (toolbar, scene) {
  const points = []
  const radius = 150
  for ( let degree = 0; degree <= 2*Math.PI; degree += 2*Math.PI/parts ) {
    points.push(Math.sin(degree)*radius, Math.cos(degree)*radius, 0)
  }
  const path = new Path3(points)

  window.calc_force_init(toolbar, scene, path, path, true)
}

window.calc_two_circles = function (toolbar, scene) {
  window.calc_force(toolbar, scene)
}

window.calc_force_init = function (toolbar, scene, path1, path2, is_circle) {
  // draw shapes
  const wire1 = new THREE.Group()
  const wire1_material = new THREE.MeshBasicMaterial({ color: 0x3e8207 })
  wire1.name = "wire1"
  wire1.path = path1

  // draw circle wire
  const wire1_path = new LineGeometry()
  const wire1_points = path1.getPoints(parts)
  wire1_path.setPositions(wire1_points)
  const wire1_shape_material = new LineMaterial({color: wire1_material.color, linewidth: 15})
  const wire1_shape = new Line2( wire1_path, wire1_shape_material )
  wire1_shape_material.resolution.set( window.innerWidth, window.innerHeight )
  wire1_shape.name = "wire1_shape"
  wire1.add(wire1_shape)

  const speed_length = 300
  const current_arrows = 4
  // draw current flow
  for (let arrow_counter = 1/current_arrows/2; arrow_counter < 1; arrow_counter+= 1/current_arrows) {
    const index = Math.floor(arrow_counter*(parts+1))*3
    const position = new THREE.Vector3(
      wire1_points[index],
      wire1_points[index+1],
      wire1_points[index+2]
    )
    const direction = new THREE.Vector3(
      wire1_points[index+3],
      wire1_points[index+4],
      wire1_points[index+5]
    )
    direction.sub(position).normalize()
    position.add(direction.clone().multiplyScalar(20))
    const speed = new THREE.ArrowHelper( direction, position, 0, wire1_material.color )
    speed.setLength(direction.length(), speed_length*0.2, speed_length*0.2)
    wire1.add(speed)
  }

  // transform the whole shape
  wire1.rotation.x = pi/2
  wire1.position.y = 200
  scene.add(wire1)

  // draw shapes
  const wire2 = new THREE.Group()
  const wire2_material = new THREE.MeshBasicMaterial({ color: 0x6898cc })
  wire2.name = "wire2"
  wire2.path = path2
  if (is_circle) {
    wire2.radius = 150
  }

  // draw circle wire
  const wire2_path = new LineGeometry()
  const wire2_points = path2.getPoints(parts)
  wire2_path.setPositions(wire2_points)
  const wire2_shape_material = new LineMaterial({color: wire2_material.color, linewidth: 15})
  const wire2_shape = new Line2( wire2_path, wire2_shape_material )
  wire2_shape_material.resolution.set( window.innerWidth, window.innerHeight )
  wire2_shape.name = "wire2_shape"
  wire2.add(wire2_shape)

  // draw current flow
  for (let arrow_counter = 1/current_arrows/2; arrow_counter < 1; arrow_counter+= 1/current_arrows) {
    const index = Math.floor(arrow_counter*(parts+1))*3
    const position = new THREE.Vector3(
      wire2_points[index],
      wire2_points[index+1],
      wire2_points[index+2]
    )
    const direction = new THREE.Vector3(
      wire2_points[index+3],
      wire2_points[index+4],
      wire2_points[index+5]
    )
    direction.sub(position).normalize()
    position.add(direction.clone().multiplyScalar(20))
    const speed = new THREE.ArrowHelper( direction, position, 0, wire2_material.color )
    speed.setLength(direction.length(), speed_length*0.2, speed_length*0.2)
    wire2.add(speed)
  }

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

  // speed arrows
  const wire1_stable = new THREE.Group()
  wire1_stable.name = "wire1_stable"
  wire1_stable.rotation.copy(wire1.rotation.clone().set(-wire1.rotation.x, -wire1.rotation.y, -wire1.rotation.z))
  wire1.add(wire1_stable)

  const speed_1 = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,150), 0, wire1_material.color)
  wire1_stable.add(speed_1)

  const speed_2 = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,-150), 0, wire1_material.color)
  wire1_stable.add(speed_2)

  const speed_3 = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(150,0,0), 0, wire1_material.color)
  wire1_stable.add(speed_3)

  const speed_4 = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(-150,0,0), 0, wire1_material.color)
  wire1_stable.add(speed_4)

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

  wire1.speed = new THREE.Vector3( );
  function update_speeds() {
    const length = wire1.speed.length()*25
    speed_1.setLength(length, length*0.2, length*0.2)
    speed_2.setLength(length, length*0.2, length*0.2)
    speed_3.setLength(length, length*0.2, length*0.2)
    speed_4.setLength(length, length*0.2, length*0.2)
    speed_1.setDirection(wire1.speed.clone().normalize())
    speed_2.setDirection(wire1.speed.clone().normalize())
    speed_3.setDirection(wire1.speed.clone().normalize())
    speed_4.setDirection(wire1.speed.clone().normalize())
  }

  const inputs = {
    "R_1": function () { wire1.rotation.x = this.value/100*pi*2 + pi/2 },
    "R_2": function () { wire1.rotation.y = this.value/100*pi*2 },
    "R_3": function () { wire2.rotation.y = this.value/100*pi*2 },
    "V_x": function () { wire1.speed.x = (this.value-50)/10; update_speeds() },
    "V_y": function () { wire1.speed.y = (this.value-50)/10; update_speeds() },
    "V_z": function () { wire1.speed.z = (this.value-50)/10; update_speeds() }
  }
  const height = slidebars.offsetHeight / (Object.keys(inputs).length);
  slidebars.style.fontSize = height*0.8 + "px";
  for(const name in inputs) {
    const part = document.createElement('div');
    part.innerText = name + ": ";
    slidebars.append(part);

    const slidebar = document.createElement('input');
    slidebar.type = 'range';
    slidebar.value = /^V_.$/.test(name) ? 50 : 0;
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

window.calc_force = function (toolbar, scene) {
  const wire1 = {}
  const wire2 = {}

  const wire1_mesh   = scene.getObjectByName("wire1")
  const wire2_mesh   = scene.getObjectByName("wire2")
  const force_on_1   = scene.getObjectByName("force_on_1")
  const force_on_2   = scene.getObjectByName("force_on_2")
  const curve_1      = scene.getObjectByName("curve_1")
  const curve_2      = scene.getObjectByName("curve_2")
  const wire1_stable = scene.getObjectByName("wire1_stable")

  wire1.path = wire1_mesh.path
  wire1.position = wire1_mesh.position
  wire1.rotation = wire1_mesh.rotation
  const abs_rotation = new THREE.Euler(wire1_mesh.rotation.x + wire1_stable.rotation.x, wire1_mesh.rotation.z + wire1_stable.rotation.z, wire1_mesh.rotation.y + wire1_stable.rotation.y, "XYZ")
  wire1.speed = wire1_mesh.speed.clone().applyEuler(abs_rotation)

  wire2.path = wire2_mesh.path
  wire2.position = wire2_mesh.position
  wire2.rotation = wire2_mesh.rotation
  wire2.voltage = 0

  wire2.radius = wire2_mesh.radius
  wire2.rotation_vec = new THREE.Vector3(0, 0, 1).applyEuler(wire2.rotation)

  const mine_force = toolbar.children[0].children[1].children[0].checked
  const voltage = wire2_mesh.voltage

  const F_1_T = new THREE.Vector3()
  const F_2_T = new THREE.Vector3()
  const F_1_rotating_T = new THREE.Vector3()
  const F_2_rotating_T = new THREE.Vector3()
  parts = parts_start

  const points_1 = wire1.path.getPoints(parts)
  const points_2 = wire2.path.getPoints(parts)

  const length_1 = wire1.path.getLength()
  const length_2 = wire2.path.getLength()

  let area_value = 0
  const areas = []
  if (!mine_force && wire2.radius) {
    // calculate which parts are in the circle
    const new_x_2 = Math.round(wire2.rotation_vec.x, 4) == 0 ? wire2.rotation_vec.clone().cross(new THREE.Vector3(1,0,0)) : wire2.rotation_vec.clone().cross(new THREE.Vector3(0,1,0))
    new_x_2.normalize()
    const new_y_2 = wire2.rotation_vec.clone().cross(new_x_2)

    // step = sqrt(circle area / square area) * whole distance to make / in how much steps
    const step = Math.sqrt((wire2.radius*wire2.radius*pi) / (2*wire2.radius*2*wire2.radius)) * (2*wire2.radius) / Math.sqrt(parts+1)
    let height = -wire2.radius
    let width = -wire2.radius

    while (height < wire2.radius) {
      if (Math.hypot(width, height) <= wire2.radius) {
        areas.push(new_x_2.clone().multiplyScalar(width).add(new_y_2.clone().multiplyScalar(height)).add(wire2.position))
      }

      width += step
      if (width > wire2.radius) {
        width = -wire2.radius
        height += step
      }
    }
    parts = areas.length
    area_value = step*step
  }
  for (let point_1 = 0; point_1 < points_1.length-3; point_1 += 3) {
    for (let point_2 = 0; point_2 < points_2.length-3; point_2 += 3) {

      const relative_place_1 = new THREE.Vector3(points_1[point_1], points_1[point_1+1], points_1[point_1+2]).applyEuler(wire1.rotation)
      const relative_place_2 = new THREE.Vector3(points_2[point_2], points_2[point_2+1], points_2[point_2+2]).applyEuler(wire2.rotation)

      const next_place_1 = new THREE.Vector3(points_1[point_1+3], points_1[point_1+4], points_1[point_1+5]).applyEuler(wire1.rotation)
      const next_place_2 = new THREE.Vector3(points_2[point_2+3], points_2[point_2+4], points_2[point_2+5]).applyEuler(wire2.rotation)

      const v_1 = next_place_1.sub(relative_place_1).normalize()
      const v_2 = next_place_2.sub(relative_place_2).normalize()

      const absolute_place_1 = wire1.position.clone().add(relative_place_1)
      const absolute_place_2 = wire2.position.clone().add(relative_place_2)

      const R = absolute_place_1.clone().sub(absolute_place_2)
      const R_hat = R.clone().normalize()

      let f_1 = null
      let f_2 = null

      if (mine_force) {
        // full "mine" force calculation
        const v_1_n = v_1.clone().add(wire1.speed)
        const v_2_n = v_2
        const v_1_p = wire1.speed.clone()
        const v_2_p = new THREE.Vector3()

        const top_p_n = + Math.pow(v_1_p.clone().sub(v_2_n).length(), 2) - 3/2*Math.pow(v_1_p.clone().dot(R_hat) - v_2_n.clone().dot(R_hat), 2)
        const top_n_p = + Math.pow(v_1_n.clone().sub(v_2_p).length(), 2) - 3/2*Math.pow(v_1_n.clone().dot(R_hat) - v_2_p.clone().dot(R_hat), 2)
        const top_n_n = - Math.pow(v_1_n.clone().sub(v_2_n).length(), 2) + 3/2*Math.pow(v_1_n.clone().dot(R_hat) - v_2_n.clone().dot(R_hat), 2)
        const top_p_p = - Math.pow(v_1_p.clone().sub(v_2_p).length(), 2) + 3/2*Math.pow(v_1_p.clone().dot(R_hat) - v_2_p.clone().dot(R_hat), 2)

        f_2 = R_hat.clone().multiplyScalar( (top_p_n + top_n_p + top_n_n + top_p_p) / (Math.pow(R.length(), 2)) )
        f_1 = f_2.clone().negate()

        // check whats f_positive_2 - f_positive_1 to know the forces difference for the voltage
        // const field_difference = R_hat.clone().multiplyScalar( ((top_p_n + top_n_n) - (top_n_p + top_p_p)) / (Math.pow(R.length(), 2)) )
        const field_difference = R_hat.clone().multiplyScalar( (top_p_n + top_n_n) / (Math.pow(R.length(), 2)) )
        // check its vlue in the wire direction because on other directions the electricity cant flow
        const field_difference_in_wire_direction = field_difference.clone().dot(v_2.clone().normalize())
        const distance = length_2 / (parts)
        // voltage = how much energy it takes to move a 1 charge from point A to point B
        wire2.voltage += field_difference_in_wire_direction * distance
      } else {
        // "their" force calculation
        f_1 = v_2.clone().cross(R_hat.clone().negate()).cross(v_1).divideScalar(Math.pow(R.length(), 2))
        f_2 = v_1.clone().cross(R_hat                 ).cross(v_2).divideScalar(Math.pow(R.length(), 2))

        if (wire2.radius) {
          const dt = 0.00001
          const index = Math.round(point_2/(points_2.length-3)*parts)
          const area_place = areas[index]

          const R_A_old = absolute_place_1.clone().sub(area_place)
          const R_A_hat_old = R_A_old.clone().normalize()
          const old_flux = v_1.clone().cross(R_A_hat_old).dot(wire2.rotation_vec) / Math.pow(R_A_old.length(), 2) * area_value

          const R_A_new = absolute_place_1.clone().add(wire1.speed.clone().multiplyScalar(dt)).sub(area_place)
          const R_A_hat_new = R_A_new.clone().normalize()
          const new_flux = v_1.clone().cross(R_A_hat_new).dot(wire2.rotation_vec) / Math.pow(R_A_new.length(), 2) * area_value

          wire2.voltage += -(new_flux - old_flux) / dt
        }
      }

      F_1_T.add(f_1)
      F_2_T.add(f_2)

      F_1_rotating_T.add(relative_place_1.clone().cross(f_1))
      F_2_rotating_T.add(relative_place_2.clone().cross(f_2))
    }
  }

  // add dx (doing f/(parts*parts) is the same as doing f*q1*q2)
  F_1_T.divideScalar(parts*parts)
  F_2_T.divideScalar(parts*parts)
  F_1_rotating_T.divideScalar(parts*parts)
  F_2_rotating_T.divideScalar(parts*parts)
  wire2.voltage /= parts

  // scale for better display
  wire2.voltage   *= 2_670.7946485
  const foce_const = 267_079_464.85
  F_1_T.multiplyScalar(foce_const)
  F_2_T.multiplyScalar(foce_const)
  F_1_rotating_T.multiplyScalar(foce_const*2/3)
  F_2_rotating_T.multiplyScalar(foce_const*2/3)

  // update total force arrows
  force_on_1.setDirection(F_1_T.clone().normalize())
  force_on_1.setLength(F_1_T.length(), F_1_T.length()*0.2, F_1_T.length()*0.2)
  force_on_2.setDirection(F_2_T.clone().normalize())
  force_on_2.setLength(F_2_T.length(), F_2_T.length()*0.2, F_2_T.length()*0.2)

  // update rotation force arrows
  curve_1.scale.setScalar(F_1_rotating_T.length() / 20500)
  curve_2.scale.setScalar(F_2_rotating_T.length() / 20500)
  curve_1.rotation.setFromVector3(vec_to_euler(F_1_rotating_T))
  curve_2.rotation.setFromVector3(vec_to_euler(F_2_rotating_T))

  // update voltage
  if (!mine_force && !wire2.radius) {
    voltage.innerHTML = voltage.innerHTML.replace( new RegExp(": .*$","gm"),": idk to calculate")
  } else {
    voltage.innerHTML = voltage.innerHTML.replace( new RegExp(": .*$","gm"),": " + (wire2.voltage).toFixed(2))
  }
}