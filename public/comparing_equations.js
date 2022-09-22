function spin_around_mine_particle(animation_element) {
  spin_around(animation_element, mine_force_particle)
}
function spin_around_mine_wire(animation_element) {
  spin_around(animation_element, mine_force_wire)
}
function spin_around_their(animation_element) {
  spin_around(animation_element, their_force)
}
function spin_around(animation_element, equation) {
  const input = animation_element.getElementsByTagName("input")[0];

  const rotation_degree = input.value / input.max * Math.PI * 2;
  const speed = 180;

  const ctx = animation_element.getElementsByTagName("canvas")[0].getContext("2d");
  ctx.clearRect(0, 0, 1000, 1000);
  draw_particles(
    ctx,
    {place: {x: 500, y: 500}, speed: {x: 0, y: -speed}},
    {place: {x: 500 + Math.sin(rotation_degree) * 350, y: 500 + Math.cos(rotation_degree) * 350}, speed: {x: 0, y: -speed}},
    equation,
    570)

  if (parseInt(input.value) >= parseInt(input.max)) {
    input.value = 0;
  } else {
    input.value++;
  }

  if (animation_element.getElementsByTagName("button")[0].getAttribute("playing") == "true") {
    window.requestAnimationFrame(() => {
      spin_around(animation_element, equation)
    });
  }
}

function rotate_sync_mine_particle(animation_element) {
  rotate_sync(animation_element, mine_force_particle)
}
function rotate_sync_mine_wire(animation_element) {
  rotate_sync(animation_element, mine_force_wire)
}
function rotate_sync_their(animation_element) {
  rotate_sync(animation_element, their_force)
}
function rotate_sync(animation_element, equation) {
  const input = animation_element.getElementsByTagName("input")[0];

  const rotation_degree = input.value / input.max * Math.PI * 2;
  const speed = 180;

  const ctx = animation_element.getElementsByTagName("canvas")[0].getContext("2d");
  ctx.clearRect(0, 0, 1000, 1000);
  draw_particles(
    ctx,
    {place: {x: 250, y: 500}, speed: {x: Math.sin(rotation_degree) * speed, y: -Math.cos(rotation_degree) * speed}},
    {place: {x: 750, y: 500}, speed: {x: Math.sin(rotation_degree) * speed, y: -Math.cos(rotation_degree) * speed}},
    equation)


  if (parseInt(input.value) >= parseInt(input.max)) {
    input.value = 0;
  } else {
    input.value++;
  }

  if (animation_element.getElementsByTagName("button")[0].getAttribute("playing") == "true") {
    window.requestAnimationFrame(() => {
      rotate_sync(animation_element, equation)
    });
  }
}

function rotate_mirror_mine_particle(animation_element) {
  rotate_mirror(animation_element, mine_force_particle)
}
function rotate_mirror_mine_wire(animation_element) {
  rotate_mirror(animation_element, mine_force_wire)
}
function rotate_mirror_their(animation_element) {
  rotate_mirror(animation_element, their_force)
}
function rotate_mirror(animation_element, equation) {
  const input = animation_element.getElementsByTagName("input")[0];

  const rotation_degree = input.value / input.max * Math.PI * 2;
  const speed = 180;

  const ctx = animation_element.getElementsByTagName("canvas")[0].getContext("2d");
  ctx.clearRect(0, 0, 1000, 1000);
  draw_particles(
    ctx,
    {place: {x: 250, y: 500}, speed: {x: Math.sin(rotation_degree) * speed, y: -Math.cos(rotation_degree) * speed}},
    {place: {x: 750, y: 500}, speed: {x: -Math.sin(rotation_degree) * speed, y: -Math.cos(rotation_degree) * speed}},
    equation)


  if (parseInt(input.value) >= parseInt(input.max)) {
    input.value = 0;
  } else {
    input.value++;
  }

  if (animation_element.getElementsByTagName("button")[0].getAttribute("playing") == "true") {
    window.requestAnimationFrame(() => {
      rotate_mirror(animation_element, equation)
    });
  }
}

function speed_rotation_1_mine_particle(animation_element) {
  speed_rotation_1(animation_element, mine_force_particle)
}
function speed_rotation_1_mine_wire(animation_element) {
  speed_rotation_1(animation_element, mine_force_wire)
}
function speed_rotation_1_their(animation_element) {
  speed_rotation_1(animation_element, their_force)
}
function speed_rotation_1(animation_element, equation) {
  const input = animation_element.getElementsByTagName("input")[0];

  const rotation_degree = input.value / input.max * Math.PI * 2;
  const speed = 180;

  const ctx = animation_element.getElementsByTagName("canvas")[0].getContext("2d");
  ctx.clearRect(0, 0, 1000, 1000);
  draw_particles(
    ctx,
    {place: {x: 250, y: 500}, speed: {x: 0, y: -speed}},
    {place: {x: 750, y: 500}, speed: {x: Math.sin(rotation_degree) * speed, y: -Math.cos(rotation_degree) * speed}},
    equation)


  if (parseInt(input.value) >= parseInt(input.max)) {
    input.value = 0;
  } else {
    input.value++;
  }

  if (animation_element.getElementsByTagName("button")[0].getAttribute("playing") == "true") {
    window.requestAnimationFrame(() => {
      speed_rotation_1(animation_element, equation)
    });
  }
}