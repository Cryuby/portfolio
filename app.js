/* Original explanatory visualizations. No patient data or model output. */
"use strict";

function createIllustrationPoints() {
  const points = [];
  const count = 660;
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;
    const defect = x > 0.4 && y > -0.13 && y < 0.42 && z > 0.35;
    points.push({ x, y, z, defect });
  }
  return points;
}

function projectIllustrationPoint(point, stage, query) {
  let { x, y, z } = point;
  if (query && point.defect) { x *= 0.7; z *= 0.72; }
  if (query && stage === "input") {
    const angle = 0.38;
    const nextX = x * Math.cos(angle) - y * Math.sin(angle);
    y = x * Math.sin(angle) + y * Math.cos(angle) - 0.23;
    x = nextX + 0.34;
  }
  const view = 0.4;
  const rx = x * Math.cos(view) - z * Math.sin(view);
  const rz = x * Math.sin(view) + z * Math.cos(view);
  return { x: 320 + rx * 151, y: 160 + y * 106 + rz * 24, depth: rz, defect: point.defect };
}

function drawPointIllustration(stage) {
  const canvas = document.getElementById("point-cloud");
  if (!canvas) return;
  const context = canvas.getContext("2d");
  if (!context) return;
  context.clearRect(0, 0, 640, 340);
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 640, 340);
  context.strokeStyle = "#e4eaed";
  context.lineWidth = 1;
  context.beginPath();
  context.ellipse(320, 282, 185, 17, 0, 0, Math.PI * 2);
  context.stroke();
  const points = createIllustrationPoints();
  const reference = points.map((point) => projectIllustrationPoint(point, stage, false)).sort((a, b) => a.depth - b.depth);
  const query = points.map((point) => projectIllustrationPoint(point, stage, true)).sort((a, b) => a.depth - b.depth);
  if (stage !== "residual") {
    reference.forEach((point) => {
      context.fillStyle = `rgba(76, 104, 121, ${0.19 + (point.depth + 1) * 0.18})`;
      context.beginPath(); context.arc(point.x, point.y, 1.8, 0, Math.PI * 2); context.fill();
    });
  }
  query.forEach((point) => {
    context.fillStyle = stage === "residual" ? (point.defect ? "#cf713d" : `rgba(43, 103, 136, ${0.24 + (point.depth + 1) * 0.25})`) : "rgba(191, 102, 62, .58)";
    context.beginPath(); context.arc(point.x, point.y, point.defect && stage === "residual" ? 3.1 : 1.8, 0, Math.PI * 2); context.fill();
  });
  context.font = "12px ui-monospace, monospace";
  context.fillStyle = "#758b98";
  context.fillText(stage === "residual" ? "LOCAL DIFFERENCE" : "REFERENCE / QUERY", 23, 28);
  context.fillStyle = "#879aa5";
  context.fillText("SCHEMATIC", 530, 320);
  const captions = {
    input: "위치가 다른 두 형상은 결함 외에도 큰 차이를 만들 수 있음",
    aligned: "위치 차이를 줄여 정상 형상과 검사 대상을 같은 조건에서 비교",
    residual: "정합 이후 남은 국소 차이를 잔차로 관측하는 과정의 예시"
  };
  document.getElementById("point-caption").textContent = captions[stage];
}

function selectIllustrationStage(stage) {
  document.querySelectorAll("[data-stage]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.stage === stage)));
  drawPointIllustration(stage);
}

function selectGazeExample(target) {
  const examples = { person: { x: 249, y: 160, label: "person" }, chair: { x: 370, y: 178, label: "chair" }, table: { x: 505, y: 188, label: "dining table" } };
  const example = examples[target];
  if (!example) return;
  document.getElementById("gaze-marker").setAttribute("transform", `translate(${example.x - 249}, ${example.y - 160})`);
  document.getElementById("gaze-target").textContent = example.label;
  document.querySelectorAll("[data-gaze]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.gaze === target)));
}

if (typeof document !== "undefined") {
  document.querySelectorAll("[data-stage]").forEach((button) => button.addEventListener("click", () => selectIllustrationStage(button.dataset.stage)));
  document.querySelectorAll("[data-gaze]").forEach((button) => button.addEventListener("click", () => selectGazeExample(button.dataset.gaze)));
  document.getElementById("print-cv").addEventListener("click", () => window.print());
  drawPointIllustration("aligned");
  if (typeof IntersectionObserver !== "undefined") {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          document.querySelectorAll("nav a").forEach((link) => {
            if (link.getAttribute("href") === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        }
      });
    }, { rootMargin: "-10% 0px -65% 0px", threshold: 0 });
    document.querySelectorAll("#projects, #research, #experience, #contact").forEach((section) => observer.observe(section));
  }
}

if (typeof module !== "undefined" && module.exports) module.exports = { createIllustrationPoints, projectIllustrationPoint };
