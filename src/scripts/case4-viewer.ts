import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const viewer = document.querySelector<HTMLElement>('[data-case4-viewer]');
const viewport = viewer?.querySelector<HTMLElement>('[data-viewer-canvas]');
const status = viewer?.querySelector<HTMLElement>('[data-viewer-status]');
const title = viewer?.querySelector<HTMLElement>('[data-viewer-title]');
const parts = viewer?.querySelector<HTMLElement>('[data-viewer-parts]');
const reset = viewer?.querySelector<HTMLButtonElement>('[data-viewer-reset]');

if (viewer && viewport && status && title && parts && reset) {
  const isScan = new URLSearchParams(location.search).get('mode') === 'scan';
  const assetBase = viewer.dataset.assetBase ?? '/media/case4/';
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x08192d);
  const camera = new THREE.PerspectiveCamera(36, 1, 0.01, 10000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.5;
  viewport.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xdce8ff, 0x49627e, 2.3));
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
  keyLight.position.set(3, 6, 8);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0x768fff, 1.5);
  rimLight.position.set(-5, 2, -6);
  scene.add(rimLight);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = true;
  controls.screenSpacePanning = true;

  const modelGroups = new Map<string, THREE.Group>();
  const homePosition = new THREE.Vector3();
  const homeTarget = new THREE.Vector3();
  const partList = [
    { id: '2', file: 'case4-part-2.glb', color: 0xb4c0d1 },
    { id: '3', file: 'case4-part-3.glb', color: 0x8798b2 },
    { id: '4', file: 'case4-part-4.glb', color: 0xd9e3ef },
    { id: '5', file: 'case4-part-5.glb', color: 0x7487a2 },
  ];
  const loader = new GLTFLoader();

  const resize = () => {
    const width = viewport.clientWidth || 1;
    const height = viewport.clientHeight || 1;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(viewport);
  resize();

  const frameModels = () => {
    const box = new THREE.Box3();
    modelGroups.forEach((group) => box.expandByObject(group));
    if (box.isEmpty()) return;
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const span = Math.max(size.x, size.y, size.z);
    const distance = span / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    homeTarget.copy(center);
    homePosition.copy(center).add(new THREE.Vector3(distance * 0.62, distance * 0.4, distance * 1.3));
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

  parts.querySelectorAll<HTMLButtonElement>('[data-part]').forEach((button) => {
    button.addEventListener('click', () => {
      const visible = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(visible));
      button.setAttribute('aria-label', `${visible ? 'Hide' : 'Show'} ${button.textContent?.trim() ?? 'model part'}`);
      const group = modelGroups.get(button.dataset.part ?? '');
      if (group) group.visible = visible;
    });
  });

  const loadPart = async (id: string, file: string, color: number) => {
    const gltf = await loader.loadAsync(`${assetBase}${file}`);
    const group = gltf.scene;
    group.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.material = new THREE.MeshStandardMaterial({
        color,
        roughness: id === 'scan' ? 0.46 : 0.54,
        metalness: id === '5' ? 0.28 : 0.08,
        side: THREE.DoubleSide,
      });
    });
    modelGroups.set(id, group);
    const toggle = parts.querySelector<HTMLButtonElement>(`[data-part="${id}"]`);
    group.visible = toggle?.getAttribute('aria-pressed') !== 'false';
    scene.add(group);
  };

  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();

  if (isScan) {
    title.textContent = 'EliScan · residual-limb scan';
    loadPart('scan', 'case4-scan.glb', 0x474cf3)
      .then(() => {
        frameModels();
        status.hidden = true;
      })
      .catch(() => { status.textContent = 'The 3D scan could not be loaded.'; });
  } else {
    title.textContent = 'Modular assembly · four parts';
    parts.hidden = false;
    let completed = 0;
    Promise.allSettled(partList.map(async (part) => {
      try {
        await loadPart(part.id, part.file, part.color);
      } finally {
        completed += 1;
        status.textContent = `Loading model parts ${completed} / ${partList.length}…`;
      }
    })).then((results) => {
      if (modelGroups.size > 0) frameModels();
      if (results.every((result) => result.status === 'fulfilled')) {
        status.hidden = true;
      } else {
        status.textContent = 'Some model parts could not be loaded.';
      }
    });
  }
}
