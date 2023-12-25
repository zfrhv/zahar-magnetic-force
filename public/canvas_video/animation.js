// Append css
const css_link = document.createElement("link");
css_link.href = "./canvas_video/animation.css";
css_link.type = "text/css";
css_link.rel = "stylesheet";
css_link.media = "screen,print";
document.getElementsByTagName("head")[0].appendChild(css_link);

// Main
window.addEventListener('load', () => {
  document.querySelectorAll('canvas-video').forEach(replace_animation);
});

function replace_animation(looping_animation) {
  const animation_main = document.createElement('div');
  animation_main.id = looping_animation.id;
  animation_main.setAttribute("name", looping_animation.getAttribute("name"));
  animation_main.style.cssText += looping_animation.style.cssText;
  animation_main.className += "animation_box";
  animation_main.replace_animation = replace_animation

  const type = looping_animation.getAttribute("type");

  // replace the element
  looping_animation.parentNode.replaceChild(animation_main, looping_animation);

  if (type === "calculate") {
    calculate(looping_animation, animation_main);
  } else if (type === "obj") {
    insert_obj(looping_animation, animation_main);
  } else {
    create_2d_canvas(looping_animation, animation_main);
  }
}

const calculator_svg = `
<svg viewBox="0 0 512 512" style="width: 100%;">
  <!-- credit: https://www.svgrepo.com/svg/150257/calculator -->
  <g id="calculator">
    <path d="M403.357,512H108.641c-30.498,0-55.309-24.811-55.309-55.309V55.309  C53.333,24.811,78.143,0,108.641,0h294.717c30.497,0,55.307,24.811,55.307,55.309v300.247c0,7.855-6.369,14.222-14.222,14.222  s-14.222-6.367-14.222-14.222V55.309c0-14.812-12.052-26.864-26.864-26.864H108.641c-14.812,0-26.864,12.052-26.864,26.864v401.384  c0,14.811,12.052,26.863,26.864,26.863h294.717c14.812,0,26.864-12.052,26.864-26.864v-30.025c0-7.855,6.369-14.222,14.222-14.222  s14.222,6.367,14.222,14.222v30.025C458.666,487.189,433.855,512,403.357,512z" />
    <path d="M368.355,199.111H143.644c-8.64,0-15.644-7.004-15.644-15.644v-82.489  c0-8.64,7.004-15.644,15.644-15.644h224.711c8.64,0,15.644,7.004,15.644,15.644v82.489  C383.999,192.107,376.995,199.111,368.355,199.111z" />
    <g>
      <path d="M368.355,213.333H143.644c-16.468,0-29.867-13.397-29.867-29.867v-82.489   c0-16.469,13.399-29.867,29.867-29.867h224.711c16.468,0,29.867,13.397,29.867,29.867v82.489   C398.222,199.936,384.823,213.333,368.355,213.333z M143.644,99.556c-0.785,0-1.422,0.639-1.422,1.422v82.489   c0,0.784,0.637,1.422,1.422,1.422h224.711c0.785,0,1.422-0.639,1.422-1.422v-82.489c0-0.784-0.637-1.422-1.422-1.422H143.644z" />
      <path d="M307.819,321.398c-3.641,0-7.279-1.388-10.057-4.166c-5.554-5.554-5.554-14.559,0-20.113   l47.596-47.595c5.558-5.554,14.561-5.552,20.114,0c5.554,5.554,5.554,14.559,0,20.113l-47.596,47.595   C315.098,320.009,311.457,321.398,307.819,321.398z" />
      <path d="M355.414,321.398c-3.641,0-7.279-1.388-10.057-4.166l-47.596-47.595   c-5.554-5.554-5.554-14.559,0-20.113c5.555-5.554,14.558-5.555,20.115,0l47.596,47.595c5.554,5.554,5.554,14.559,0,20.113   C362.694,320.009,359.055,321.398,355.414,321.398z" />
      <path d="M214.037,420.787h-67.31c-7.854,0-14.222-6.367-14.222-14.222s6.369-14.222,14.222-14.222h67.31   c7.854,0,14.222,6.367,14.222,14.222S221.892,420.787,214.037,420.787z" />
      <path d="M180.383,454.443c-7.854,0-14.222-6.367-14.222-14.222v-67.31c0-7.855,6.369-14.222,14.222-14.222   s14.222,6.367,14.222,14.222v67.31C194.605,448.075,188.236,454.443,180.383,454.443z" />
      <path d="M214.037,297.6h-67.31c-7.854,0-14.222-6.367-14.222-14.222s6.369-14.222,14.222-14.222h67.31   c7.854,0,14.222,6.367,14.222,14.222S221.892,297.6,214.037,297.6z" />
      <path d="M365.271,399.454h-67.31c-7.854,0-14.222-6.367-14.222-14.222s6.369-14.222,14.222-14.222h67.31   c7.854,0,14.222,6.367,14.222,14.222S373.125,399.454,365.271,399.454z" />
      <path d="M365.271,442.121h-67.31c-7.854,0-14.222-6.367-14.222-14.222s6.369-14.222,14.222-14.222h67.31   c7.854,0,14.222,6.367,14.222,14.222S373.125,442.121,365.271,442.121z" />
    </g>
  </g>
</svg>
`;

async function calculate(looping_animation, animation_main) {
  const [THREE, { OrbitControls }] =
  await Promise.all([
    import('three'),
    import('three/addons/controls/OrbitControls.js')
  ]);

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 1, 10000);

  renderer.setSize(1000, 1000);

  // transparent background
  renderer.setClearColor( 0x000000, 0 );

  // let css decide width + height
  renderer.domElement.style.width = null;
  renderer.domElement.style.height = null;

  animation_main.appendChild(renderer.domElement);
  
  camera.position.z = 1000;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.campingFactor = 0.25;
  controls.enableZoom = true;

  const toolbar = document.createElement('div');
  animation_main.append(toolbar);

  const btn_conainer = document.createElement('div');
  btn_conainer.style.width = "20%";
  toolbar.append(btn_conainer);

  const calculate_button = document.createElement('button');
  calculate_button.innerHTML = calculator_svg;
  calculate_button.style.height = "50%";
  calculate_button.style.width = "100%";
  calculate_button.onclick = function () {
    window[looping_animation.getAttribute("function") ? looping_animation.getAttribute("function") : looping_animation.getAttribute("name")](toolbar, scene);
  }
  btn_conainer.append(calculate_button);

  window[looping_animation.getAttribute("function") ? looping_animation.getAttribute("function")+"_init" : looping_animation.getAttribute("name")+"_init"](toolbar, scene);

  function animate() {
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
  }
  animate();
}


async function insert_obj(looping_animation, animation_main) {
  const [THREE, { OrbitControls }, { OBJLoader }, { MTLLoader }] =
  await Promise.all([
    import('three'),
    import('three/addons/controls/OrbitControls.js'),
    import('three/addons/loaders/OBJLoader.js'),
    import('three/addons/loaders/MTLLoader.js')
  ]);

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

  renderer.setSize(1000, 1000);

  // transparent background
  renderer.setClearColor( 0xffffff, 0);

  // let css decide width + height
  renderer.domElement.style.width = null;
  renderer.domElement.style.height = null;

  animation_main.appendChild(renderer.domElement);

  camera.position.z = 1;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.campingFactor = 0.25;
  controls.enableZoom = true;

  // Add light
  const toplight = new THREE.HemisphereLight(0xf5f5f5, 0x0f0f0f, 0.5);
  toplight.position.set(0, 1, 0).normalize();
  scene.add(toplight);

  const frontLight = new THREE.HemisphereLight(0xf5f5f5, 0x0f0f0f, 0.5);
  frontLight.position.set(0.2, 0, 1).normalize();
  scene.add(frontLight);

  // Load obj + mtl
  const mtlLoader = new MTLLoader();
  mtlLoader.load(looping_animation.getAttribute("material"), (material) => {
    material.preload();

    const objLoader = new OBJLoader();
    objLoader.setMaterials(material);
    objLoader.load(looping_animation.getAttribute("object"), (object) => {
      const scale = looping_animation.getAttribute("scale");
      object.scale.set(scale, scale, scale);
      scene.add(object);
    });
  });

  function animation() {
    requestAnimationFrame(animation);

    controls.update();

    renderer.render(scene, camera);
  }
  animation();
}


function update_button(button) {
  if (button.getAttribute("playing") == "false") {
    button.getElementsByTagName('path')[0].setAttribute("d",
      "M 3,32 29,16 3,0 z");
  } else {
    button.getElementsByTagName('path')[0].setAttribute("d",
      "M 3,32 11,32 11,0 3,0 z M 21,32 29,32 29,0 21,0 z");
  }
}

function create_2d_canvas(looping_animation, animation_main) {
  function animate() {
    window[looping_animation.getAttribute("function") ? looping_animation.getAttribute("function") : looping_animation.getAttribute("name")](animation_main);
  }

    const canvas = document.createElement('canvas');
    animation_main.append(canvas);
    canvas.width = 1000;
    canvas.height = 1000;
    canvas.style.cssText += "width: 100%; height: auto;";

    const toolbar = document.createElement('div');
    animation_main.append(toolbar);

      const play_button = document.createElement('button');
      toolbar.append(play_button);
      play_button.setAttribute("playing", "false");
      function toolbar_press() {
        play_button.setAttribute("playing", "false");
        update_button(play_button);
        requestAnimationFrame(animate);
      }
      play_button.onclick = function () {
        if (this.getAttribute("playing") == "true") {
          this.setAttribute("playing", "false");
        } else {
          this.setAttribute("playing", "true");
          requestAnimationFrame(animate);
        }
        update_button(this);
      }

        const play_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        play_button.append(play_svg);
        play_svg.setAttribute("viewBox", "0 0 32 32");
        play_svg.append(document.createElementNS("http://www.w3.org/2000/svg", "path"));

      const play_proccess = document.createElement('input');
      play_proccess.type = 'range';
      play_proccess.classList.add("video_slide");
      play_proccess.value = looping_animation.getAttribute("start");
      play_proccess.min = 0;
      play_proccess.max = 1000;
      play_proccess.onchange = toolbar_press;
      play_proccess.oninput = toolbar_press;
      toolbar.append(play_proccess);
  

  update_button(play_button);

  play_proccess.onkeydown = (event) => {
    if (event.key === "Space") {
      event.preventDefault();
      play_button.click();
    }
  };

  animate();
}
