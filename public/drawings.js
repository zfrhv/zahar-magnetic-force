
function draw_symbols_explanation() {
  const ctx = document.getElementById("equation_anatomy").getElementsByTagName("canvas")[0].getContext("2d");
  ctx.fillStyle = "pink";
  ctx.strokeStyle = "pink";
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  draw_arrow(
    ctx,
    50, 500,
    950, 500
  );
  bracket(
    ctx,
    250, 570,
    500, 650,
    750, 570
  );
  ctx.font = "70px Comic Sans MS";
  ctx.fillText("r", 488, 710);

  ctx.beginPath();
  ctx.arc(250, 500, 100, -Math.PI*0.66, 0);
  ctx.stroke();
  ctx.fillText("α", 300, 400);

  ctx.beginPath();
  ctx.arc(750, 500, 100, -Math.PI*0.4, 0);
  ctx.stroke();
  ctx.fillText("β", 840, 400);

  draw_particles(
    ctx,
    {place: {x: 250, y: 500}, speed: {x: -120, y: -200}},
    {place: {x: 750, y: 500}, speed: {x: 70, y: -250}},
    () => {return {total_force: { wire1: {x: 0, y: 0}, wire2: {x: 0, y: 0}}}},
    1300,
    false
  );
}

function draw_experiment() {
  const ctx = document.getElementById("experiment_anatomy").getElementsByTagName("canvas")[0].getContext("2d");
  ctx.strokeStyle = '#2a2a2c';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(485, 800);
  ctx.lineTo(485, 900);
  ctx.moveTo(515, 820);
  ctx.lineTo(515, 880);
  ctx.stroke();

  ctx.save();
  ctx.setLineDash([30, 20]);
  ctx.beginPath();
  ctx.moveTo(485, 850);
  ctx.lineTo(250, 850);
  ctx.lineTo(250, 300);
  ctx.moveTo(750, 300);
  ctx.lineTo(750, 850);
  ctx.lineTo(515, 850);
  ctx.stroke();
  ctx.restore();

  ctx.strokeStyle = '#7f6742';
  ctx.beginPath();
  ctx.moveTo(120, 300);
  ctx.lineTo(880, 300);
  ctx.stroke();

  ctx.strokeStyle = 'pink';
  draw_arrow(
    ctx,
    400, 300,
    401, 300,
    50
  );
  draw_arrow(
    ctx,
    600, 300,
    601, 300,
    50
  );


  ctx.fillStyle = 'gray';
  ctx.beginPath();
  ctx.arc(250, 230, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(250, 230, 30, Math.PI, 0);
  ctx.stroke();
  draw_arrow(
    ctx,
    280, 230,
    270, 260,
    30
  );

  ctx.beginPath();
  ctx.arc(250, 370, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(250, 370, 30, 0, Math.PI);
  ctx.stroke();
  draw_arrow(
    ctx,
    280, 370,
    270, 340,
    30
  );

  ctx.beginPath();
  ctx.arc(750, 230, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(750, 230, 30, Math.PI, 0);
  ctx.stroke();
  draw_arrow(
    ctx,
    720, 230,
    730, 260,
    30
  );

  ctx.beginPath();
  ctx.arc(750, 370, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(750, 370, 30, 0, Math.PI);
  ctx.stroke();
  draw_arrow(
    ctx,
    720, 370,
    730, 340,
    30
  );
}

function draw_vertical_symbol() {
  const ctx = document.getElementById("vertical_symbol").getElementsByTagName("canvas")[0].getContext("2d");
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.strokeStyle = "gray";
  ctx.beginPath();
  ctx.moveTo(470, 460);
  ctx.lineTo(511, 430);
  ctx.lineTo(540, 464);
  ctx.stroke();

  ctx.save();
  ctx.setLineDash([10, 20]);
  ctx.beginPath();
  ctx.moveTo(750, 450);
  ctx.lineTo(684, 362);
  ctx.stroke();
  ctx.restore();

  ctx.strokeStyle = "MediumSeaGreen";
  draw_arrow(
    ctx,
    500, 500,
    350, 300
  );

  ctx.strokeStyle = "Tomato";
  draw_arrow(
    ctx,
    500, 500,
    750, 450
  );

  ctx.strokeStyle = "DodgerBlue";
  draw_arrow(
    ctx,
    500, 500,
    684, 362
  );
}