import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CosmosBackground = () => {
  const mountRef = useRef();

  useEffect(() => {
    // Setup scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Stars
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 });
    const starVertices = [];
    for (let i = 0; i < 2000; i++) {
      starVertices.push(THREE.MathUtils.randFloatSpread(2000));
      starVertices.push(THREE.MathUtils.randFloatSpread(2000));
      starVertices.push(THREE.MathUtils.randFloatSpread(2000));
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Planets
    const planetGeometry = new THREE.SphereGeometry(20, 32, 32);
    const planetMaterial = new THREE.MeshPhongMaterial({ color: 0x6b48ff, shininess: 100 });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.position.set(-100, -100, -400);
    scene.add(planet);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Camera
    camera.position.z = 400;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      stars.rotation.y += 0.0005;
      planet.rotation.y += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (
        mountRef.current &&
        renderer.domElement &&
        renderer.domElement.parentNode === mountRef.current
      ) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Meteor shower overlay
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = 0;
    mountRef.current.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let meteors = Array.from({ length: 10 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      length: Math.random() * 80 + 20,
      speed: Math.random() * 6 + 4,
      opacity: Math.random() * 0.5 + 0.3
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      meteors.forEach(meteor => {
        ctx.save();
        ctx.globalAlpha = meteor.opacity;
        ctx.strokeStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(meteor.x + meteor.length, meteor.y + meteor.length * 0.5);
        ctx.stroke();
        ctx.restore();

        meteor.x += meteor.speed;
        meteor.y += meteor.speed * 0.5;
        if (meteor.x > canvas.width || meteor.y > canvas.height) {
          meteor.x = Math.random() * canvas.width;
          meteor.y = Math.random() * -canvas.height;
        }
      });
      requestAnimationFrame(draw);
    }
    draw();

    // Cleanup
    return () => {
      if (
        mountRef.current &&
        canvas &&
        canvas.parentNode === mountRef.current
      ) {
        mountRef.current.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        top: 0,
        left: 0,
        pointerEvents: 'none', // Ensures background does not block links/buttons
        background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)',
      }}
    />
  );
};

export default CosmosBackground;