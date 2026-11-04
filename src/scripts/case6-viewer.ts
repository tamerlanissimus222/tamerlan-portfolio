import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

type ModelPart = { node: string; label: string; color: number };
type ModelConfig = { file: string; title: string; parts: ModelPart[] };

const models: Record<'left' | 'right' | 'case7', ModelConfig> = {
  left: {
    file: 'case6-left.glb',
    title: 'Left hand · six model elements',
    parts: [
      { node: 'ExtSock', label: 'Outer socket', color: 0x547ee6 },
      { node: 'InnSock', label: 'Inner socket', color: 0x9ad8ec },
      { node: 'Palm', label: 'Palm', color: 0x42b6bf },
      { node: 'Pinch', label: 'Pinch', color: 0x9c80df },
      { node: 'Strape', label: 'Strap', color: 0xb7c5de },
      { node: '№1.obj', label: 'Fingers', color: 0x718ce1 },
    ],
  },
  right: {
    file: 'case6-right.glb',
    title: 'Right hand · six model elements',
    parts: [
      { node: 'Pinch.obj', label: 'Pinch', color: 0xc96775 },
      { node: 'Palm.obj', label: 'Palm', color: 0xe5886d },
      { node: 'ExtSock', label: 'Outer socket', color: 0xf0a458 },
      { node: 'fingers', label: 'Fingers', color: 0xd27b59 },
      { node: 'InnSock', label: 'Inner socket', color: 0xf2cf98 },
      { node: 'Strap', label: 'Strap', color: 0xb9a59b },
    ],
  },
  case7: {
    file: 'case7-assembly.glb',
    title: 'Case 07 · eight model elements',
    parts: [
      { node: 'Fingers', label: 'Fingers', color: 0xde8261 },
      { node: 'FingersBend', label: 'FingersBend', color: 0xf0ad66 },
      { node: 'Fist', label: 'Fist', color: 0xa96e96 },
      { node: 'Forearm IS', label: 'Forearm IS', color: 0x94c7d6 },
      { node: 'Forearm OS', label: 'Forearm OS', color: 0x6187d1 },
      { node: 'Palm', label: 'Palm', color: 0xd4a68a },
      { node: 'Wrist IS', label: 'Wrist IS', color: 0x6dbaba },
      { node: 'Wrist OS', label: 'Wrist OS', color: 0x8f87cc },
    ],
  },
};

const viewer = document.querySelector<HTMLElement>('[data-case-model-viewer]');
const viewport = viewer?.querySelector<HTMLElement>('[data-viewer-canvas]');
const status = viewer?.querySelector<HTMLElement>('[data-viewer-status]');
const title = viewer?.querySelector<HTMLElement>('[data-viewer-title]');
const parts = viewer?.querySelector<HTMLElement>('[data-viewer-parts]');
const reset = viewer?.querySelector<HTMLButtonElement>('[data-viewer-reset]');

if (viewer && viewport && status && title && parts && reset) {
  const modelId = viewer.dataset.model === 'case7'
    ? 'case7'
    : new URLSearchParams(location.search).get('hand') === 'right' ? 'right' : 'left';
  const config = models[modelId];
  const assetBase = viewer.dataset.assetBase ?? '/media/case6/';
  const decoderBase = viewer.dataset.decoderBase ?? '/vendor/draco/';
  title.textContent = config.title;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x08192d);
  const camera = new THREE.PerspectiveCamera(36, 1, 0.01, 10000);
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  } catch {
    status.textContent = '3D viewing is not available in this browser.';
    throw new Error('WebGL renderer unavailable');
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;
  viewport.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xe7f0ff, 0x556780, 2.4));
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.9);
  keyLight.position.set(4, 6, 8);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(modelId === 'left' ? 0x74aaff : 0xffad79, 1.8);
  rimLight.position.set(-5, 3, -5);
  scene.add(rimLight);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = true;
  controls.screenSpacePanning = true;

  const homePosition = new THREE.Vector3();
  const homeTarget = new THREE.Vector3();
  const objects = new Map<string, THREE.Object3D>();
  const buttons = new Map<string, HTMLButtonElement>();
  const sliders = new Map<string, HTMLInputElement>();
  const eye = '<svg class="viewer__eye" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12c2.6-4 6-6 10-6s7.4 2 10 6c-2.6 4-6 6-10 6S4.6 16 2 12Z"/><circle cx="12" cy="12" r="3"/><line x1="3" y1="21" x2="21" y2="3"/></svg>';

  config.parts.forEach((part, index) => {
    const isVisible = part.label === 'Palm';
    const row = document.createElement('div');
    row.className = 'viewer__part';
    row.style.setProperty('--part-color', `#${part.color.toString(16).padStart(6, '0')}`);
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-pressed', String(isVisible));
    button.setAttribute('aria-label', `${isVisible ? 'Hide' : 'Show'} ${part.label}`);
    button.innerHTML = `${eye}<span class="viewer__swatch" aria-hidden="true"></span><span>${part.label}</span>`;
    button.addEventListener('click', () => {
      const visible = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(visible));
      button.setAttribute('aria-label', `${visible ? 'Hide' : 'Show'} ${part.label}`);
      const object = objects.get(part.node);
      if (object) object.visible = visible;
    });
    const opacityLabel = document.createElement('label');
    opacityLabel.className = 'viewer__opacity';
    const opacityId = `case-model-opacity-${modelId}-${index}`;
    opacityLabel.htmlFor = opacityId;
    opacityLabel.innerHTML = '<span>Opacity</span>';
    const value = document.createElement('output');
    value.textContent = '100%';
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = opacityId;
    slider.min = '0';
    slider.max = '100';
    slider.step = '5';
    slider.value = '100';
    slider.setAttribute('aria-label', `${part.label} opacity`);
    slider.addEventListener('input', () => {
      const opacity = Number(slider.value) / 100;
      value.textContent = `${slider.value}%`;
      objects.get(part.node)?.traverse((child) => {
        if (!(child instanceof THREE.Mesh) || !(child.material instanceof THREE.MeshStandardMaterial)) return;
        child.material.opacity = opacity;
        child.material.transparent = opacity < 1;
        child.material.depthWrite = opacity === 1;
        child.material.needsUpdate = true;
      });
    });
    opacityLabel.append(value, slider);
    row.append(button, opacityLabel);
    parts.appendChild(row);
    buttons.set(part.node, button);
    sliders.set(part.node, slider);
  });

  const resize = () => {
    const width = viewport.clientWidth || 1;
    const height = viewport.clientHeight || 1;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(viewport);
  resize();

  const frameModel = (root: THREE.Object3D) => {
    const box = new THREE.Box3().setFromObject(root);
    if (box.isEmpty()) return;
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const span = Math.max(size.x, size.y, size.z);
    const distance = span / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    homeTarget.copy(center);
    homePosition.copy(center).add(new THREE.Vector3(distance * 0.6, distance * 0.32, distance * 1.25));
    camera.position.copy(homePosition);
    camera.near = Math.max(span / 10000, 0.01);
    camera.far = Math.max(span * 100, 100);
    camera.updateProjectionMatrix();
    controls.target.copy(homeTarget);
    controls.minDistance = Math.max(span * 0.35, 0.01);
    controls.maxDistance = Math.max(span * 8, 10);
    controls.update();
  };

  reset.addEventListener('click', () => {
    camera.position.copy(homePosition);
    controls.target.copy(homeTarget);
    controls.update();
  });

  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();

  const draco = new DRACOLoader();
  draco.setDecoderPath(decoderBase);
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);
  loader.loadAsync(`${assetBase}${config.file}`, (event) => {
    if (event.total > 0) status.textContent = `Loading 3D model… ${Math.round(100 * event.loaded / event.total)}%`;
  }).then(({ scene: root }) => {
    scene.add(root);
    frameModel(root);
    config.parts.forEach((part, index) => {
      // GLTFLoader normalises punctuation in node names (notably "№1.obj").
      // The exported scene has one top-level node per ordered part.
      const object = root.getObjectByName(part.node) ?? root.children[index];
      if (!object) {
        const button = buttons.get(part.node);
        if (button) button.disabled = true;
        const slider = sliders.get(part.node);
        if (slider) slider.disabled = true;
        return;
      }
      object.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        child.material = new THREE.MeshStandardMaterial({
          color: part.color,
          roughness: 0.52,
          metalness: part.label === 'Fingers' ? 0.23 : 0.08,
          side: THREE.DoubleSide,
        });
      });
      object.visible = part.label === 'Palm';
      objects.set(part.node, object);
    });
    status.hidden = true;
  }).catch(() => {
    status.textContent = 'The 3D model could not be loaded.';
  });
}
