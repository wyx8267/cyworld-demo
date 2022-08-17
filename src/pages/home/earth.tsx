import { useEffect, useRef } from "react";
import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function randInt(min: number, max?: number) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return (Math.random() * (max - min) + min) | 0;
}

let renderRequested = false;

const Earth = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }

    const canvas = canvasRef.current;
    const renderer = new Three.WebGLRenderer({ canvas });
    const camera = new Three.PerspectiveCamera(45, 2, 0.1, 100);
    camera.position.set(0, 2, 7);
    const scene = new Three.Scene();

    const bgloader = new Three.CubeTextureLoader();
    const bgtexture = bgloader.load([
      require("@/assets/images/px.jpg"),
      require("@/assets/images/nx.jpg"),
      require("@/assets/images/py.jpg"),
      require("@/assets/images/ny.jpg"),
      require("@/assets/images/pz.jpg"),
      require("@/assets/images/nz.jpg"),
    ]);
    scene.background = bgtexture;

    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new Three.AmbientLight(color, intensity);
    scene.add(light);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.update();

    const loader = new Three.TextureLoader();
    const texture = loader.load(require("@/assets/images/world.jpg"));
    const material = new Three.MeshBasicMaterial({ map: texture });
    const geometry = new Three.SphereBufferGeometry(1.3, 64, 32);
    const earth = new Three.Mesh(geometry, material);
    scene.add(earth);

    const planeWidth = 1.6
    const lonHelper = new Three.Object3D();
    scene.add(lonHelper);
    const positionHelper = new Three.Object3D();
    positionHelper.position.z = (planeWidth / 2) / Math.tan(Math.PI / 10);
    lonHelper.add(positionHelper)
    const planes: Three.Mesh[] = []
    for (let i = 0; i < 10; i++) {
      // const loader = new Three.TextureLoader();
      // const texture = loader.load(
      //   require(`@/assets/images/em00${i}.png`)
      // );

      const geometry = new Three.PlaneBufferGeometry(planeWidth, planeWidth / 2)
      const material = new Three.MeshBasicMaterial({
        color: new Three.Color(parseInt(randInt(0x1000000).toString(16).padStart(6, '0'), 16)),
        side: Three.DoubleSide
      })
      const plane = new Three.Mesh(geometry, material)
      lonHelper.rotation.y = Three.MathUtils.degToRad(i * 36)
      positionHelper.updateWorldMatrix(true, false)
      plane.applyMatrix4(positionHelper.matrixWorld)
      planes.push(plane)
      scene.add(plane)
    }

    function resizeRendererToDisplaySize() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }

    function render(time: number) {
      time *= 0.0001
      scene.rotation.y = -time

      if (resizeRendererToDisplaySize()) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    function requestRenderIfNotRequested() {
      if (!renderRequested) {
        renderRequested = true;
        requestAnimationFrame(render);
      }
    }

    requestAnimationFrame(render);
    controls.addEventListener("change", requestRenderIfNotRequested);
    window.addEventListener("resize", requestRenderIfNotRequested);

    return () => {
      controls.removeEventListener("change", requestRenderIfNotRequested);
      window.removeEventListener("resize", requestRenderIfNotRequested);
    };
  }, [canvasRef]);
  return <canvas ref={canvasRef} className="full-screen" />;
};

export default Earth;
