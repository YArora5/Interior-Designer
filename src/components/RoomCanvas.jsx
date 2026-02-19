import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import Furniture from './Furniture'

function Room() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 2.5, -5]} receiveShadow>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#e8e8e8" />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-5, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#e8e8e8" />
      </mesh>

      {/* Right Wall */}
      <mesh position={[5, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#e8e8e8" />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}

function RoomCanvas({ furnitureItems, selectedFurniture, onSelectFurniture }) {
  return (
    <div className="w-full h-full">
      <Canvas shadows>
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[0, 3, 8]} fov={75} />

        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[0, 4, 0]} intensity={0.3} />

        {/* Room */}
        <Room />

        {/* Furniture Items */}
        {furnitureItems.map((item) => (
          <Furniture
            key={item.instanceId}
            furniture={item}
            position={item.position}
            onSelect={onSelectFurniture}
            isSelected={selectedFurniture === item.instanceId}
          />
        ))}

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={3}
          maxDistance={20}
        />

        {/* Grid Helper */}
        <gridHelper args={[10, 10, '#cccccc', '#eeeeee']} position={[0, 0.01, 0]} />
      </Canvas>
    </div>
  )
}

export default RoomCanvas