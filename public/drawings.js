
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

  ctx.fillText("v1", 200, 300);
  ctx.fillText("v2", 850, 300);

  draw_particles(
    ctx,
    {place: {x: 250, y: 500}, speed: {x: -120, y: -200}},
    {place: {x: 750, y: 500}, speed: {x: 70, y: -250}},
    () => {return {total_force: { wire1: {x: 0, y: 0}, wire2: {x: 0, y: 0}}}},
    1300,
    false
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

  ctx.beginPath();
  ctx.moveTo(750, 450);
  ctx.lineTo(573, 595);
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

  ctx.strokeStyle = "GoldenRod";
  draw_arrow(
    ctx,
    500, 500,
    573, 595
  );
}