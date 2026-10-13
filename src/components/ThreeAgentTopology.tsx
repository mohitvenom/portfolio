import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCcw, Eye, Sparkles } from 'lucide-react';

interface NodeInfo {
  name: string;
  role: string;
  protocol: string;
  latency: string;
  status: string;
  color: string;
  pos: [number, number, number];
}

const NODES_DATA: NodeInfo[] = [
  {
    name: 'LangGraph Core',
    role: 'StateGraph Orchestrator',
    protocol: 'In-Memory Cyclic Graph',
    latency: '45ms cycle',
    status: 'ACTIVE',
    color: '#f59e0b',
    pos: [0, 0, 0]
  },
  {
    name: 'Ingestion Engine',
    role: 'Multi-Marketplace Scrapers',
    protocol: 'AsyncIO / Jitter Polling',
    latency: '850ms fetch',
    status: 'POLLING',
    color: '#38bdf8',
    pos: [-3.2, 1.8, 0.8]
  },
  {
    name: 'MCP Protocol Host',
    role: 'Model Context Protocol Server',
    protocol: 'JSON-RPC 2.0 / SSE',
    latency: '12ms dispatch',
    status: 'READY',
    color: '#38bdf8',
    pos: [3.0, 1.5, -0.6]
  },
  {
    name: 'PostgreSQL Store',
    role: 'ACID Snapshot & Time-Series',
    protocol: 'SQLAlchemy / Alembic',
    latency: '4ms query',
    status: 'SYNCED',
    color: '#a78bfa',
    pos: [2.5, -2.0, 1.2]
  },
  {
    name: 'Policy & Guardrails',
    role: 'Safety & Topic Validation',
    protocol: 'Pydantic v2 / Constrained',
    latency: '18ms gate',
    status: 'VERIFIED',
    color: '#ec4899',
    pos: [-2.6, -1.8, -1.0]
  },
  {
    name: 'Slack & Next.js Sink',
    role: 'Realtime Alert & Webhook UI',
    protocol: 'HTTPS Webhook / SSE',
    latency: '95ms deliver',
    status: 'ONLINE',
    color: '#34d399',
    pos: [0.2, 3.2, -1.4]
  }
];

export const ThreeAgentTopology = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<NodeInfo>(NODES_DATA[0]);
  const [isRotating, setIsRotating] = useState(true);
  const [burstCount, setBurstCount] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const width = container.clientWidth;
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for all elements
    const sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    // Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xf59e0b, 3, 20);
    pointLight.position.set(0, 2, 4);
    scene.add(pointLight);

    const pointLightCyan = new THREE.PointLight(0x38bdf8, 2, 20);
    pointLightCyan.position.set(-3, -2, 2);
    scene.add(pointLightCyan);

    // Subtle 3D background coordinate ring
    const ringGeo = new THREE.RingGeometry(4.8, 4.85, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.06,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.3;
    sceneGroup.add(ring);

    // Create 3D Nodes
    const nodeMeshes: { mesh: THREE.Mesh; halo: THREE.Mesh; data: NodeInfo }[] = [];

    NODES_DATA.forEach((info) => {
      const isCore = info.name === 'LangGraph Core';
      const nodeRadius = isCore ? 0.7 : 0.42;

      // Inner sphere
      const sphereGeo = new THREE.SphereGeometry(nodeRadius, 24, 24);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(info.color),
        emissive: new THREE.Color(info.color),
        emissiveIntensity: isCore ? 0.4 : 0.25,
        roughness: 0.2,
        metalness: 0.8
      });
      const nodeMesh = new THREE.Mesh(sphereGeo, sphereMat);
      nodeMesh.position.set(...info.pos);

      // Outer wireframe halo
      const haloGeo = new THREE.IcosahedronGeometry(nodeRadius * 1.45, 1);
      const haloMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(info.color),
        wireframe: true,
        transparent: true,
        opacity: isCore ? 0.35 : 0.2
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.set(...info.pos);

      sceneGroup.add(nodeMesh);
      sceneGroup.add(halo);

      nodeMeshes.push({ mesh: nodeMesh, halo, data: info });
    });

    // Create Curved Connection Lines between Core and Peripheral Nodes
    const corePos = new THREE.Vector3(...NODES_DATA[0].pos);
    const curvePaths: THREE.CatmullRomCurve3[] = [];

    NODES_DATA.slice(1).forEach((info) => {
      const targetPos = new THREE.Vector3(...info.pos);
      const midPoint = new THREE.Vector3()
        .addVectors(corePos, targetPos)
        .multiplyScalar(0.5)
        .add(new THREE.Vector3(0, 0.4, 0.3));

      const curve = new THREE.CatmullRomCurve3([corePos, midPoint, targetPos]);
      curvePaths.push(curve);

      const points = curve.getPoints(40);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(info.color),
        transparent: true,
        opacity: 0.22
      });
      const line = new THREE.Line(lineGeo, lineMat);
      sceneGroup.add(line);
    });

    // Animated Traveling Data Packets (Glowing Spheres traveling along curves)
    const packets: { mesh: THREE.Mesh; curveIndex: number; progress: number; speed: number }[] = [];
    curvePaths.forEach((curve, idx) => {
      for (let i = 0; i < 2; i++) {
        const packetGeo = new THREE.SphereGeometry(0.08, 12, 12);
        const packetMat = new THREE.MeshBasicMaterial({
          color: 0xffffff
        });
        const packet = new THREE.Mesh(packetGeo, packetMat);
        const initialProgress = (i * 0.5 + idx * 0.15) % 1;
        const pt = curve.getPoint(initialProgress);
        packet.position.copy(pt);

        sceneGroup.add(packet);
        packets.push({
          mesh: packet,
          curveIndex: idx,
          progress: initialProgress,
          speed: 0.006 + Math.random() * 0.004
        });
      }
    });

    // Mouse Interaction / Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        targetRotationY += deltaX * 0.005;
        targetRotationX += deltaY * 0.005;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      } else {
        // Gentle tilt parallax
        targetRotationY = mouse.x * 0.35;
        targetRotationX = -mouse.y * 0.25;
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };

      // Raycast click
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map(n => n.mesh));
      if (intersects.length > 0) {
        const hit = nodeMeshes.find(n => n.mesh === intersects[0].object);
        if (hit) setSelectedNode(hit.data);
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousemove', handlePointerMove);
    dom.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Rotation
      if (isRotating && !isDragging) {
        sceneGroup.rotation.y += 0.003;
      }
      sceneGroup.rotation.y += (targetRotationY - sceneGroup.rotation.y) * 0.06;
      sceneGroup.rotation.x += (targetRotationX - sceneGroup.rotation.x) * 0.06;

      // Rotate Wireframe Halos
      nodeMeshes.forEach(({ halo, data }, i) => {
        halo.rotation.y += 0.01 * (i % 2 === 0 ? 1 : -1);
        halo.rotation.x += 0.008;

        // Subtle floating pulse
        const hoverAmp = data.name === 'LangGraph Core' ? 0.04 : 0.06;
        halo.position.y = data.pos[1] + Math.sin(elapsedTime * 2 + i) * hoverAmp;
      });

      // Advance Data Packets
      packets.forEach((p) => {
        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;
        const curve = curvePaths[p.curveIndex];
        const pt = curve.getPoint(p.progress);
        p.mesh.position.copy(pt);
      });

      // Hover glow on mouse raycast
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map(n => n.mesh));
      if (intersects.length > 0) {
        dom.style.cursor = 'pointer';
        const hit = nodeMeshes.find(n => n.mesh === intersects[0].object);
        if (hit) {
          hit.halo.scale.set(1.15, 1.15, 1.15);
        }
      } else {
        dom.style.cursor = isDragging ? 'grabbing' : 'grab';
        nodeMeshes.forEach(n => n.halo.scale.set(1, 1, 1));
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 360;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousemove', handlePointerMove);
      dom.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      resizeObserver.disconnect();
      if (container.contains(dom)) {
        container.removeChild(dom);
      }
      renderer.dispose();
    };
  }, [isRotating, burstCount]);

  return (
    <div 
      className="architectural-card"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #121622 0%, #0c0f16 100%)',
        border: '1px solid var(--border-medium)',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7)'
      }}
    >
      {/* 3D Viewport Header Overlay */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.875rem 1.25rem',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(12, 15, 22, 0.7)',
        backdropFilter: 'blur(8px)',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            3D Autonomous Agent Topology
          </span>
          <span style={{ fontSize: '0.6875rem', padding: '2px 6px', borderRadius: '4px', background: 'var(--accent-soft)', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
            WebGL Active
          </span>
        </div>

        {/* 3D Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setBurstCount(c => c + 1)}
            className="filter-tab-button"
            style={{ padding: '4px 8px', fontSize: '0.6875rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            title="Simulate runtime data packet burst"
          >
            <Sparkles size={12} color="var(--accent-primary)" />
            <span>Pulse Flow</span>
          </button>
          <button
            type="button"
            onClick={() => setIsRotating(r => !r)}
            className="filter-tab-button"
            style={{ padding: '4px 8px', fontSize: '0.6875rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            title="Toggle continuous auto-rotation"
          >
            <RotateCcw size={12} />
            <span>{isRotating ? 'Pause Orbit' : 'Rotate Orbit'}</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div 
        ref={containerRef} 
        style={{ 
          width: '100%', 
          height: '380px', 
          position: 'relative',
          cursor: 'grab' 
        }}
      />

      {/* Floating 3D Node Spec Inspector Card */}
      <div style={{
        padding: '1rem 1.25rem',
        background: 'rgba(17, 20, 28, 0.85)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-canvas)',
            border: `1px solid ${selectedNode.color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: selectedNode.color,
            boxShadow: `0 0 16px ${selectedNode.color}20`
          }}>
            <Eye size={18} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                {selectedNode.name}
              </h4>
              <span style={{ 
                fontSize: '0.625rem', 
                fontWeight: 700, 
                padding: '2px 6px', 
                borderRadius: '3px',
                background: `${selectedNode.color}20`,
                color: selectedNode.color,
                fontFamily: 'var(--font-mono)'
              }}>
                {selectedNode.status}
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
              {selectedNode.role} · <span style={{ color: 'var(--text-secondary)' }}>{selectedNode.protocol}</span>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Latency / Telemetry
            </div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
              {selectedNode.latency}
            </div>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', paddingLeft: '0.75rem', borderLeft: '1px solid var(--border-subtle)' }}>
            Drag to rotate 360°<br />Click nodes to inspect
          </div>
        </div>
      </div>
    </div>
  );
};
