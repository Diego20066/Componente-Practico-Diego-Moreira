function calcularCargas() {
  const q1 = parseFloat(document.getElementById('q1').value);
  const q2 = parseFloat(document.getElementById('q2').value);
  const q3 = parseFloat(document.getElementById('q3').value);
  const u1 = parseFloat(document.getElementById('unidad-q1').value);
  const u2 = parseFloat(document.getElementById('unidad-q2').value);
  const u3 = parseFloat(document.getElementById('unidad-q3').value);
  const d12 = parseFloat(document.getElementById("d12").value);
  const d13 = parseFloat(document.getElementById("d13").value);
  const d23 = parseFloat(document.getElementById("d23").value);

  const k = 8.9875e9;
  const q1_si = q1 * u1;
  const q2_si = q2 * u2;
  const q3_si = q3 * u3;

  const calcularFuerza = (qA, qB, d) => (k * Math.abs(qA * qB)) / (d ** 2);
  const f13 = calcularFuerza(q1_si, q3_si, d13);
  const f23 = calcularFuerza(q2_si, q3_si, d23);

  const tipo13 = (q1 * q3) > 0 ? "repulsión" : "atracción";
  const tipo23 = (q2 * q3) > 0 ? "repulsión" : "atracción";

  const signo13 = tipo13 === "repulsión" ? 1 : -1;
  const signo23 = tipo23 === "repulsión" ? 1 : -1;

  const cos_alpha = (d13 ** 2 + d12 ** 2 - d23 ** 2) / (2 * d13 * d12);
  const cos_beta = (d23 ** 2 + d12 ** 2 - d13 ** 2) / (2 * d23 * d12);
  const angulo13 = Math.acos(cos_alpha); // en q1
  const angulo23 = Math.PI - Math.acos(cos_beta); // en q2
  const angulo12 = Math.PI - angulo13 - (Math.PI - angulo23); // en q3

  const ang13_deg = (angulo13 * 180 / Math.PI).toFixed(1);
  const ang23_deg = (angulo23 * 180 / Math.PI).toFixed(1);
  const ang12_deg = (angulo12 * 180 / Math.PI).toFixed(1);

  const f13x = signo13 * f13 * Math.cos(angulo13);
  const f13y = signo13 * f13 * Math.sin(angulo13);
  const f23x = signo23 * f23 * Math.cos(angulo23);
  const f23y = signo23 * f23 * Math.sin(angulo23);

  const FRx = f13x + f23x;
  const FRy = f13y + f23y;
  const FR = Math.sqrt(FRx ** 2 + FRy ** 2);
  let theta = Math.atan2(FRy, FRx) * 180 / Math.PI;
  if (theta < 0) theta += 360;

  const formatearNumero = num => (Math.abs(num) < 0.0001 ? num.toExponential(2) : num.toFixed(4));
  const notacionCientifica = num => `${num.toExponential(2).replace('e', '×10^')} C`;

  document.getElementById("resultado").innerHTML = `
    <h3>Datos ingresados:</h3>
    <ul>
      <li>Constante k = 8.9875 × 10<sup>9</sup> N·m²/C²</li>
      <li>Carga q1 =  ${notacionCientifica(q1_si)}</li>
      <li>Carga q2 =  ${notacionCientifica(q2_si)}</li>
      <li>Carga q3 =  ${notacionCientifica(q3_si)}</li>
      <li>d<sub>12</sub> = ${d12} m, d<sub>13</sub> = ${d13} m, d<sub>23</sub> = ${d23} m</li>
    </ul>
    <h3>Resultados:</h3>
    <p>F13 = ${formatearNumero(f13)} N → (${tipo13})</p>
    <p>F23 = ${formatearNumero(f23)} N → (${tipo23})</p>
    <p>F13x = ${formatearNumero(f13x)} N, F13y = ${formatearNumero(f13y)} N</p>
    <p>F23x = ${formatearNumero(f23x)} N, F23y = ${formatearNumero(f23y)} N</p>
    <hr>
    <p>FRx = ${formatearNumero(FRx)} N</p>
    <p>FRy = ${formatearNumero(FRy)} N</p>
    <p><strong>FR = ${formatearNumero(FR)} N</strong></p>
    <p><strong>&theta; = ${formatearNumero(theta)}&deg;</strong></p>
    <hr>
    <h4>Ángulos del triángulo:</h4>
    <ul>
      <li>Ángulo en q1 (∠q1) = ${ang13_deg}°</li>
      <li>Ángulo en q2 (∠q2) = ${ang23_deg}°</li>
      <li>Ángulo en q3 (∠q3) = ${ang12_deg}°</li>
    </ul>
    <h4>Fórmulas utilizadas:</h4>
    <ul>
      <li>F = k × |q₁ × q₂| / r²</li>
      <li>Fx = F × cos(&theta;), Fy = F × sin(&theta;)</li>
      <li>FR = √(FRx² + FRy²)</li>
      <li>&theta; = tan-1(FRy, FRx)</li>
    </ul>
  `;

  const canvas = document.getElementById("grafico");
  const ctx = canvas.getContext("2d");
  canvas.width = 600;
  canvas.height = 600;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const scale = 100;
  const center = { x: canvas.width / 2, y: canvas.height / 2 };
  const posQ1 = { x: center.x - d12 * scale / 2, y: center.y + 100 };
  const posQ2 = { x: center.x + d12 * scale / 2, y: center.y + 100 };
  const posQ3 = { x: center.x, y: center.y - 150 };

  function drawCharge(pos, label, value, color) {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 15, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.font = "bold 14px Arial";
    ctx.fillText(label, pos.x, pos.y - 25);
    ctx.fillText(value > 0 ? "+" : "–", pos.x, pos.y + 5);
  }

  function drawLineWithLabel(p1, p2, label) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = "gray";
    ctx.stroke();
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    ctx.fillStyle = "black";
    ctx.fillText(label, midX, midY);
  }

  function drawAngleLabel(pos, angleText) {
    ctx.fillStyle = "black";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`∠${angleText}°`, pos.x, pos.y + 35);
  }

  drawCharge(posQ1, "q1", q1, "red");
  drawCharge(posQ2, "q2", q2, "blue");
  drawCharge(posQ3, "q3", q3, "green");

  drawLineWithLabel(posQ1, posQ2, `${d12} m`);
  drawLineWithLabel(posQ1, posQ3, `${d13} m`);
  drawLineWithLabel(posQ2, posQ3, `${d23} m`);

  drawAngleLabel(posQ1, ang13_deg);
  drawAngleLabel(posQ2, ang23_deg);
  drawAngleLabel(posQ3, ang12_deg);
}

