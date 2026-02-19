import { useRef } from 'react'

function Furniture({ furniture, position, onSelect, isSelected }) {
  const meshRef = useRef()

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(furniture.instanceId)
      }}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[furniture.width, furniture.height, furniture.depth]} />
      <meshStandardMaterial 
        color={isSelected ? '#3b82f6' : furniture.color}
        emissive={isSelected ? '#1e40af' : '#000000'}
        emissiveIntensity={isSelected ? 0.2 : 0}
      />
    </mesh>
  )
}

export default Furniture