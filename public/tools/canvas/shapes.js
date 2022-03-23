function draw_arrow(ctx, x_i, y_i, x_f, y_f, arrow_length) {
  const arrow_degree = Math.PI / 3; // 60 degrees
  const line_degree = Math.atan2(y_f-y_i, x_f-x_i);
  
  if (!arrow_length) {
    const stick_length = Math.hypot(y_f-y_i, x_f-x_i);
    arrow_length = stick_length < 50 ? stick_length : 50;
  }


  ctx.beginPath();
  ctx.moveTo(x_i, y_i);
  ctx.lineTo(x_f, y_f);

  ctx.moveTo(x_f - arrow_length * Math.cos(line_degree + arrow_degree / 2), y_f - arrow_length * Math.sin(line_degree + arrow_degree / 2));
  ctx.lineTo(x_f, y_f);
  ctx.lineTo(x_f - arrow_length * Math.cos(line_degree - arrow_degree / 2), y_f - arrow_length * Math.sin(line_degree - arrow_degree / 2));

  ctx.stroke();
}

function draw_arrow_filled(ctx, x_i, y_i, x_f, y_f, arrow_length) {
  const arrow_degree = Math.PI / 3; // 60 degrees
  const line_degree = Math.atan2(y_f-y_i, x_f-x_i);

  if (!arrow_length) {
    const stick_length = Math.hypot(y_f-y_i, x_f-x_i);
    arrow_length = stick_length < 50 ? stick_length : 50;
  }

  ctx.beginPath();
  ctx.moveTo(x_i, y_i);
  ctx.lineTo(x_f - arrow_length / 2 * Math.cos(line_degree), y_f - arrow_length / 2 * Math.sin(line_degree));
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x_f, y_f);
  ctx.lineTo(x_f - arrow_length * Math.cos(line_degree + arrow_degree / 2), y_f - arrow_length * Math.sin(line_degree + arrow_degree / 2));
  ctx.lineTo(x_f - arrow_length * Math.cos(line_degree - arrow_degree / 2), y_f - arrow_length * Math.sin(line_degree - arrow_degree / 2));
  ctx.closePath();
  ctx.fill();
  ctx.save();
  ctx.lineWidth = arrow_length/8;
  ctx.stroke();
  ctx.restore();
}

function bracket(ctx, x_i, y_i, x_c, y_c, x_f, y_f) {
  const horizont = Math.atan2(y_f - y_i, x_f - x_i);
  const left_slope = Math.atan2(y_f - y_c, x_f - x_c);

  const left_degree = left_slope - horizont;
  const left_stick = Math.hypot(y_f - y_c, x_f - x_c);

  const height = Math.sin(left_degree) * left_stick;

  const to_move = {
    x: Math.cos(horizont + Math.PI/2)*height,
    y: Math.sin(horizont + Math.PI/2)*height
  }

  ctx.beginPath();
  ctx.moveTo(x_i, y_i);
  ctx.bezierCurveTo(
    x_i - to_move.x, y_i - to_move.y,
    x_c + to_move.x, y_c + to_move.y,
    x_c, y_c
    );
  ctx.bezierCurveTo(
    x_c + to_move.x, y_c + to_move.y,
    x_f - to_move.x, y_f - to_move.y,
    x_f, y_f
    );
  ctx.stroke();
}

function draw_particles(ctx, particle_1, particle_2, force_equation, force_coefficient = 1300, draw_radius = true) {
  const line_color = '#2a2a2c';
  const particle_radius = 35;

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 10;
  ctx.strokeStyle = line_color;


  const forces = force_equation(
    particle_1.place, {x: particle_1.place.x + particle_1.speed.x, y: particle_1.place.y + particle_1.speed.y},
    particle_2.place, {x: particle_2.place.x + particle_2.speed.x, y: particle_2.place.y + particle_2.speed.y},
    particle_1.place, particle_2.place);

  if (draw_radius) {
    // their radius
    ctx.save();
    ctx.setLineDash([30, 40]);
    ctx.beginPath();
    ctx.moveTo(particle_1.place.x, particle_1.place.y);
    ctx.lineTo(particle_2.place.x, particle_2.place.y);
    ctx.stroke();
    ctx.restore();
  }

  ctx.save();
  ctx.translate(particle_1.place.x, particle_1.place.y);

  // on particle_1 force direction
  ctx.save();
  ctx.strokeStyle = 'pink';
  ctx.fillStyle = 'pink';
  draw_arrow_filled(ctx, 0, 0, forces.total_force.wire1.x * force_coefficient, forces.total_force.wire1.y * force_coefficient);
  ctx.restore();

  // particle_1 speed direction
  draw_arrow(ctx, 0, 0, particle_1.speed.x, particle_1.speed.y);


  // particle_1 itself
  ctx.fillStyle = 'green';
  ctx.beginPath();
  ctx.arc(0, 0, particle_radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
  ctx.save();
  ctx.translate(particle_2.place.x, particle_2.place.y);

  // on particle_2 force direction
  ctx.save();
  ctx.strokeStyle = 'pink';
  ctx.fillStyle = 'pink';
  draw_arrow_filled(ctx, 0, 0, forces.total_force.wire2.x * force_coefficient, forces.total_force.wire2.y * force_coefficient);
  ctx.restore();


  // particle_2 speed direction
  draw_arrow(ctx, 0, 0, particle_2.speed.x, particle_2.speed.y);


  // particle_2 itself
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.arc(0, 0, particle_radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();

  ctx.restore();
}