function mine_force_particle(
  wire1_place_i, wire1_place_f,
  wire2_place_i, wire2_place_f,
  wire1_center, wire2_center) {

  const current1 = Math.hypot(wire1_place_f.x - wire1_place_i.x, wire1_place_f.y - wire1_place_i.y);
  const current2 = Math.hypot(wire2_place_f.x - wire2_place_i.x, wire2_place_f.y - wire2_place_i.y);

  const radius_slope = Math.atan2(wire2_place_i.y-wire1_place_i.y, wire2_place_i.x-wire1_place_i.x); // from now on the degrees here will be measured compared to the radius direction (radius = line between the particles)
  const v1_slope = Math.atan2(wire1_place_f.y-wire1_place_i.y, wire1_place_f.x-wire1_place_i.x) - radius_slope;
  const v2_slope = Math.atan2(wire2_place_f.y-wire2_place_i.y, wire2_place_f.x-wire2_place_i.x) - radius_slope;
  const v1_value = Math.hypot(wire1_place_f.y-wire1_place_i.y, wire1_place_f.x-wire1_place_i.x);
  const v2_value = Math.hypot(wire2_place_f.y-wire2_place_i.y, wire2_place_f.x-wire2_place_i.x);

  const force_value = current1 * current2 / (Math.pow(wire1_place_i.x - wire2_place_i.x, 2) + Math.pow(wire1_place_i.y - wire2_place_i.y, 2));
  const f_r = ( Math.pow(Math.hypot((wire1_place_f.y-wire1_place_i.y)-(wire2_place_f.y-wire2_place_i.y), (wire1_place_f.x-wire1_place_i.x)-(wire2_place_f.x-wire2_place_i.x)),2) - 3/2*Math.pow(Math.cos(v1_slope)*v1_value - Math.cos(v2_slope)*v2_value,2) ) * force_value;
  // TODO whats wrong? why f_r is so big?

  const total_force = {
    x: f_r * Math.cos(radius_slope),
    y: f_r * Math.sin(radius_slope)
  }

  const wire1_slope_from_center = Math.atan2(wire1_place_i.y-wire1_center.y, wire1_place_i.x-wire1_center.x) - radius_slope;
  const wire2_slope_from_center = Math.atan2(wire2_place_i.y-wire2_center.y, wire2_place_i.x-wire2_center.x) - radius_slope;

  return {
    total_force: {
      wire1: {
        x: total_force.x,
        y: total_force.y
      },
      wire2: {
        x: -total_force.x,
        y: -total_force.y
      }
    },
    rotation_force: {
      wire1:-f_r * Math.sin(wire1_slope_from_center) * Math.hypot(wire1_place_i.x-wire1_center.x, wire1_place_i.y-wire1_center.y), // cos(90 - center) = sin(center)
      wire2: f_r * Math.sin(wire2_slope_from_center) * Math.hypot(wire2_place_i.x-wire2_center.x, wire2_place_i.y-wire2_center.y)
    }
  };
}

function rotation(place, center, force) {
  const force_value = Math.hypot(force.x, force.y);
  const force_slope = Math.atan2(force.y, force.x);

  const distance_value = Math.hypot(place.x-center.x, place.y-center.y);
  const distance_slope = Math.atan2(place.y-center.y, place.x-center.x);

  const force_degree_from_distance = force_slope - distance_slope;

  return force_value * Math.sin(force_degree_from_distance) * distance_value
}

function mine_force_wire(
  wire1_place_i, wire1_place_f,
  wire2_place_i, wire2_place_f,
  wire1_center, wire2_center) {

  const current1 = Math.hypot(wire1_place_f.x - wire1_place_i.x, wire1_place_f.y - wire1_place_i.y);
  const current2 = Math.hypot(wire2_place_f.x - wire2_place_i.x, wire2_place_f.y - wire2_place_i.y);

  const radius_slope = Math.atan2(wire2_place_i.y-wire1_place_i.y, wire2_place_i.x-wire1_place_i.x); // from now on the degrees here will be measured compared to the radius direction (radius = line between the particles)
  const v1_slope = Math.atan2(wire1_place_f.y-wire1_place_i.y, wire1_place_f.x-wire1_place_i.x) - radius_slope;
  const v2_slope = Math.atan2(wire2_place_f.y-wire2_place_i.y, wire2_place_f.x-wire2_place_i.x) - radius_slope;

  const force_value = current1 * current2 / (Math.pow(wire1_place_i.x - wire2_place_i.x, 2) + Math.pow(wire1_place_i.y - wire2_place_i.y, 2));
  const f_r = ( Math.cos(v1_slope-v2_slope) - 3/2*Math.cos(v1_slope)*Math.cos(v2_slope) ) * force_value;

  const total_force = {
    x: f_r * Math.cos(radius_slope),
    y: f_r * Math.sin(radius_slope)
  }

  const wire1_slope_from_center = Math.atan2(wire1_place_i.y-wire1_center.y, wire1_place_i.x-wire1_center.x) - radius_slope;
  const wire2_slope_from_center = Math.atan2(wire2_place_i.y-wire2_center.y, wire2_place_i.x-wire2_center.x) - radius_slope;

  return {
    total_force: {
      wire1: {
        x: total_force.x,
        y: total_force.y
      },
      wire2: {
        x: -total_force.x,
        y: -total_force.y
      }
    },
    rotation_force: {
      wire1:-f_r * Math.sin(wire1_slope_from_center) * Math.hypot(wire1_place_i.x-wire1_center.x, wire1_place_i.y-wire1_center.y), // cos(90 - center) = sin(center)
      wire2: f_r * Math.sin(wire2_slope_from_center) * Math.hypot(wire2_place_i.x-wire2_center.x, wire2_place_i.y-wire2_center.y)
    }
  };
}

function their_force(
  wire1_place_i, wire1_place_f,
  wire2_place_i, wire2_place_f,
  wire1_center, wire2_center) {

  const current1 = Math.hypot(wire1_place_f.x - wire1_place_i.x, wire1_place_f.y - wire1_place_i.y);
  const current2 = Math.hypot(wire2_place_f.x - wire2_place_i.x, wire2_place_f.y - wire2_place_i.y);

  const radius_slope = Math.atan2(wire2_place_i.y-wire1_place_i.y, wire2_place_i.x-wire1_place_i.x);
  const v1_slope = Math.atan2(wire1_place_f.y-wire1_place_i.y, wire1_place_f.x-wire1_place_i.x);
  const v2_slope = Math.atan2(wire2_place_f.y-wire2_place_i.y, wire2_place_f.x-wire2_place_i.x);

  const force_value = current1 * current2 / (Math.pow(wire1_place_i.x - wire2_place_i.x, 2) + Math.pow(wire1_place_i.y - wire2_place_i.y, 2));

  const f_on1 = Math.sin(v2_slope-radius_slope) * force_value;

  const f_on2 =-Math.sin(v1_slope-radius_slope) * force_value;

  const wire1_slope_from_center = Math.atan2(wire1_place_i.y-wire1_center.y, wire1_place_i.x-wire1_center.x);
  const wire2_slope_from_center = Math.atan2(wire2_place_i.y-wire2_center.y, wire2_place_i.x-wire2_center.x);

  return {
    total_force: {
      wire1: {
        x: f_on1 * Math.cos(v1_slope-Math.PI/2),
        y: f_on1 * Math.sin(v1_slope-Math.PI/2)
      },
      wire2: {
        x: f_on2 * Math.cos(v2_slope-Math.PI/2),
        y: f_on2 * Math.sin(v2_slope-Math.PI/2)
      }
    },
    rotation_force: {
      wire1:-f_on1 * Math.cos(v1_slope - wire1_slope_from_center) * Math.hypot(wire1_place_i.x-wire1_center.x, wire1_place_i.y-wire1_center.y), // sin(center-(v1-90)) = sin(center-v1+90) = sin(90-(v1-center)) = cos(v1-center)
      wire2:-f_on2 * Math.cos(v2_slope - wire2_slope_from_center) * Math.hypot(wire2_place_i.x-wire2_center.x, wire2_place_i.y-wire2_center.y)
    }
  };
}


function mass_center(wire, parts) {
  const wire_length = wire.getTotalLength();
  const dx = wire_length / parts;

  let total_distance = {
    x: 0,
    y: 0
  }

  for (let part = 0, distance = 0.0001; part < parts; part++, distance += dx) { // i dont want to use getPointAtLength(0) in case if i have "M x,y m x,y", it will give the M, and i need m
    let point = wire.getPointAtLength(distance);
    
    total_distance.x += point.x;
    total_distance.y += point.y;
  }

  total_distance.x /= parts;
  total_distance.y /= parts;

  return total_distance;
}