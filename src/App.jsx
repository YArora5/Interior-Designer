import { useState, useRef, Suspense, useEffect, useMemo, useCallback } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Sky, Html, Stars } from '@react-three/drei'
import * as THREE from 'three'

// Simplified but complete furniture base
const FurnitureBase = ({ children, position, rotation, scale, isSelected, onSelect, onUpdate, id, showMeasurements, label }) => {
  const { gl, controls } = useThree()
  const [isDragging, setIsDragging] = useState(false)

  const handlePointerDown = (e) => {
    e.stopPropagation()
    setIsDragging(true)
    onSelect(id)
    if (controls) controls.enabled = false
    gl.domElement.style.cursor = 'grabbing'
  }

  const handlePointerUp = () => {
    setIsDragging(false)
    if (controls) controls.enabled = true
    gl.domElement.style.cursor = 'pointer'
  }

  const handlePointerMove = (e) => {
    if (isDragging && onUpdate) {
      e.stopPropagation()
      onUpdate(id, [e.point.x, position[1], e.point.z])
    }
  }

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} onPointerOver={() => !isDragging && (gl.domElement.style.cursor = 'pointer')} onPointerOut={() => !isDragging && (gl.domElement.style.cursor = 'default')}>
        {children}
      </group>
      {isSelected && showMeasurements && label && (
        <Html position={[0, 1.5, 0]} center>
          <div className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg">{label}</div>
        </Html>
      )}
    </group>
  )
}

// All furniture components (simplified versions for space)
function Sofa(props) { return <FurnitureBase {...props} label={`${(2*props.scale).toFixed(1)}m`}><mesh position={[0,0.25,0]} castShadow receiveShadow><boxGeometry args={[2,0.5,0.9]}/><meshStandardMaterial color={props.color||(props.isSelected?'#3b82f6':'#4a5568')} roughness={0.8}/></mesh><mesh position={[0,0.65,-0.4]} castShadow><boxGeometry args={[2,0.8,0.15]}/><meshStandardMaterial color={props.color||(props.isSelected?'#3b82f6':'#4a5568')}/></mesh></FurnitureBase> }
function Chair(props) { return <FurnitureBase {...props}><mesh position={[0,0.4,0]} castShadow receiveShadow><boxGeometry args={[0.5,0.1,0.5]}/><meshStandardMaterial color={props.color||(props.isSelected?'#3b82f6':'#718096')}/></mesh><mesh position={[0,0.75,-0.2]} castShadow><boxGeometry args={[0.5,0.6,0.1]}/><meshStandardMaterial color={props.color||(props.isSelected?'#3b82f6':'#718096')}/></mesh></FurnitureBase> }
function Table(props) { return <FurnitureBase {...props}><mesh position={[0,0.35,0]} castShadow receiveShadow><boxGeometry args={[1.2,0.05,0.6]}/><meshStandardMaterial color={props.color||(props.isSelected?'#3b82f6':'#8b4513')}/></mesh></FurnitureBase> }
function Bed(props) { return <FurnitureBase {...props}><mesh position={[0,0.35,0]} castShadow receiveShadow><boxGeometry args={[2,0.3,2.2]}/><meshStandardMaterial color={props.color||(props.isSelected?'#3b82f6':'#f0f0f0')}/></mesh><mesh position={[0,0.6,-1.1]} castShadow><boxGeometry args={[2.1,0.8,0.1]}/><meshStandardMaterial color={props.isSelected?'#2563eb':'#8b7355'}/></mesh></FurnitureBase> }
function Wardrobe(props) { return <FurnitureBase {...props}><mesh position={[0,1,0]} castShadow receiveShadow><boxGeometry args={[1.5,2,0.6]}/><meshStandardMaterial color={props.color||(props.isSelected?'#3b82f6':'#5a4a3a')}/></mesh></FurnitureBase> }
function TVStand(props) { return <FurnitureBase {...props}><mesh position={[0,0.25,0]} castShadow receiveShadow><boxGeometry args={[1.5,0.5,0.4]}/><meshStandardMaterial color={props.color||(props.isSelected?'#3b82f6':'#2d3748')}/></mesh></FurnitureBase> }
function Bookshelf(props) { return <FurnitureBase {...props}><mesh position={[0,1,0]} castShadow receiveShadow><boxGeometry args={[1,2,0.05]}/><meshStandardMaterial color={props.color||(props.isSelected?'#3b82f6':'#8b4513')}/></mesh></FurnitureBase> }
function Desk(props) { return <FurnitureBase {...props}><mesh position={[0,0.7,0]} castShadow receiveShadow><boxGeometry args={[1.4,0.05,0.7]}/><meshStandardMaterial color={props.color||(props.isSelected?'#3b82f6':'#8b4513')}/></mesh></FurnitureBase> }
function Window(props) { return <FurnitureBase {...props}><mesh castShadow><boxGeometry args={[1.2,1.5,0.1]}/><meshStandardMaterial color={props.isSelected?'#60a5fa':'#87CEEB'} transparent opacity={0.4}/></mesh></FurnitureBase> }
function Door(props) { return <FurnitureBase {...props}><mesh castShadow><boxGeometry args={[1,2.2,0.1]}/><meshStandardMaterial color={props.isSelected?'#60a5fa':'#8B4513'}/></mesh></FurnitureBase> }
function Painting(props) { return <FurnitureBase {...props}><mesh castShadow><boxGeometry args={[1,0.8,0.05]}/><meshStandardMaterial color="#8B7355"/></mesh></FurnitureBase> }
function Plant(props) { return <FurnitureBase {...props}><mesh position={[0,0.15,0]} castShadow><cylinderGeometry args={[0.15,0.15,0.3,16]}/><meshStandardMaterial color={props.isSelected?'#60a5fa':'#8B4513'}/></mesh><mesh position={[0,0.5,0]} castShadow><sphereGeometry args={[0.25,16,16]}/><meshStandardMaterial color="#228B22"/></mesh></FurnitureBase> }
function Lamp(props) { return <FurnitureBase {...props}><mesh position={[0,0.25,0]} castShadow><cylinderGeometry args={[0.02,0.02,0.5,8]}/><meshStandardMaterial color="#4a5568"/></mesh><mesh position={[0,0.5,0]} castShadow><coneGeometry args={[0.15,0.2,16]}/><meshStandardMaterial color={props.isSelected?'#60a5fa':'#f0f0f0'}/></mesh><pointLight position={[0,0.45,0]} intensity={0.5} distance={3} color="#ffe4b3"/></FurnitureBase> }
function Rug(props) { return <mesh position={[props.position[0],0.01,props.position[2]]} rotation={[-Math.PI/2,0,props.rotation]} scale={props.scale} receiveShadow><planeGeometry args={[2,1.5]}/><meshStandardMaterial color={props.color||(props.isSelected?'#60a5fa':'#8B4513')}/></mesh> }

const FurnitureComponents = { sofa:Sofa, chair:Chair, table:Table, bed:Bed, wardrobe:Wardrobe, 'tv stand':TVStand, bookshelf:Bookshelf, desk:Desk, window:Window, door:Door, painting:Painting, plant:Plant, lamp:Lamp, rug:Rug }

function CameraController({cameraView,roomSize}) {
  const {camera} = useThree()
  useEffect(() => {
    const pos = {perspective:[roomSize*0.8,roomSize*0.6,roomSize*0.8],top:[0,roomSize*1.5,0],front:[0,roomSize*0.5,roomSize],side:[roomSize,roomSize*0.5,0]}[cameraView]
    if(pos){camera.position.set(...pos);camera.lookAt(0,0,0)}
  },[cameraView,camera,roomSize])
  return null
}

function App() {
  const [rooms,setRooms]=useState({livingRoom:{furniture:[],name:'Living Room'},bedroom:{furniture:[],name:'Bedroom'},kitchen:{furniture:[],name:'Kitchen'},bathroom:{furniture:[],name:'Bathroom'}})
  const [currentRoom,setCurrentRoom]=useState('livingRoom')
  const [selectedId,setSelectedId]=useState(null)
  const [wallColor,setWallColor]=useState('#f5f5f0')
  const [floorColor,setFloorColor]=useState('#c9b8a0')
  const [roomSize,setRoomSize]=useState(10)
  const [lightIntensity,setLightIntensity]=useState(0.8)
  const [isDayMode,setIsDayMode]=useState(true)
  const [cameraView,setCameraView]=useState('perspective')
  const [showMeasurements,setShowMeasurements]=useState(true)
  const [gridSnap,setGridSnap]=useState(false)
  const [collisionDetection,setCollisionDetection]=useState(true)
  const [history,setHistory]=useState([])
  const [historyIndex,setHistoryIndex]=useState(-1)
  const [copiedItem,setCopiedItem]=useState(null)
  const [activeTab,setActiveTab]=useState('items')
  const [showGrid,setShowGrid]=useState(true)
  const [projectName,setProjectName]=useState('My Design')
  const [notes,setNotes]=useState('')
  const [spaceUtilization,setSpaceUtilization]=useState(0)
  const [sustainabilityScore,setSustainabilityScore]=useState(0)
  const canvasRef=useRef()
  
  const furniture=rooms[currentRoom].furniture
  const setFurniture=useCallback((newFurniture)=>{setRooms(prev=>({...prev,[currentRoom]:{...prev[currentRoom],furniture:newFurniture}}))},[currentRoom])
  
  const prices={sofa:25000,chair:5000,table:8000,bed:30000,wardrobe:40000,'tv stand':12000,bookshelf:15000,desk:18000,window:3000,door:8000,painting:2000,plant:1500,lamp:3000,rug:5000}
  const calculateBudget=useCallback(()=>Object.values(rooms).reduce((t,r)=>t+r.furniture.reduce((s,i)=>s+(prices[i.type]||0)*(i.scale||1),0),0),[rooms])
  const totalItems=useMemo(()=>Object.values(rooms).reduce((s,r)=>s+r.furniture.length,0),[rooms])
  
  const saveToHistory=useCallback((newFurniture)=>{const newHistory=history.slice(0,historyIndex+1);newHistory.push(JSON.parse(JSON.stringify(newFurniture)));setHistory(newHistory);setHistoryIndex(newHistory.length-1)},[history,historyIndex])
  const undo=useCallback(()=>{if(historyIndex>0){setHistoryIndex(historyIndex-1);setFurniture(JSON.parse(JSON.stringify(history[historyIndex-1])))}},[historyIndex,history,setFurniture])
  const redo=useCallback(()=>{if(historyIndex<history.length-1){setHistoryIndex(historyIndex+1);setFurniture(JSON.parse(JSON.stringify(history[historyIndex+1])))}},[historyIndex,history,setFurniture])
  
  const checkCollision=useCallback((item1,item2)=>{if(!collisionDetection)return false;const box1={minX:item1.position[0]-(item1.scale||1),maxX:item1.position[0]+(item1.scale||1),minZ:item1.position[2]-(item1.scale||1),maxZ:item1.position[2]+(item1.scale||1)};const box2={minX:item2.position[0]-(item2.scale||1),maxX:item2.position[0]+(item2.scale||1),minZ:item2.position[2]-(item2.scale||1),maxZ:item2.position[2]+(item2.scale||1)};return!(box1.maxX<box2.minX||box1.minX>box2.maxX||box1.maxZ<box2.minZ||box1.minZ>box2.maxZ)},[collisionDetection])
  
  useEffect(()=>{const handleKeyPress=(e)=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;if(e.key==='r'||e.key==='R'){if(selectedId)rotateFurniture(selectedId)}if(e.key==='Delete'||e.key==='Backspace'){if(selectedId){e.preventDefault();deleteFurniture(selectedId)}}if(e.ctrlKey&&e.key==='z'){e.preventDefault();undo()}if(e.ctrlKey&&e.key==='y'){e.preventDefault();redo()}if(e.ctrlKey&&e.key==='c'){if(selectedId){const item=furniture.find(f=>f.id===selectedId);if(item)setCopiedItem(item)}}if(e.ctrlKey&&e.key==='v'){e.preventDefault();if(copiedItem)pasteItem()}if(e.key==='Escape')setSelectedId(null);if(e.key==='1')setCameraView('perspective');if(e.key==='2')setCameraView('top');if(e.key==='3')setCameraView('front');if(e.key==='4')setCameraView('side')};window.addEventListener('keydown',handleKeyPress);return()=>window.removeEventListener('keydown',handleKeyPress)},[selectedId,furniture,historyIndex,copiedItem])
  
  const furnitureList=[
    {name:'Sofa',icon:'🛋️',type:'sofa',category:'seating',shopLink:'https://amazon.in/s?k=sofa',eco:true},
    {name:'Chair',icon:'🪑',type:'chair',category:'seating',shopLink:'https://amazon.in/s?k=chair'},
    {name:'Table',icon:'🪵',type:'table',category:'tables',shopLink:'https://amazon.in/s?k=table'},
    {name:'Bed',icon:'🛏️',type:'bed',category:'bedroom',shopLink:'https://amazon.in/s?k=bed'},
    {name:'Desk',icon:'🖥️',type:'desk',category:'office',shopLink:'https://amazon.in/s?k=desk'},
    {name:'Wardrobe',icon:'🚪',type:'wardrobe',category:'storage',shopLink:'https://amazon.in/s?k=wardrobe'},
    {name:'TV Stand',icon:'📺',type:'tv stand',category:'entertainment',shopLink:'https://amazon.in/s?k=tv+stand'},
    {name:'Bookshelf',icon:'📚',type:'bookshelf',category:'storage',shopLink:'https://amazon.in/s?k=bookshelf',eco:true},
    {name:'Window',icon:'🪟',type:'window',category:'architectural'},
    {name:'Door',icon:'🚪',type:'door',category:'architectural'},
    {name:'Painting',icon:'🖼️',type:'painting',category:'decor'},
    {name:'Plant',icon:'🪴',type:'plant',category:'decor',eco:true},
    {name:'Lamp',icon:'💡',type:'lamp',category:'lighting'},
    {name:'Rug',icon:'🟥',type:'rug',category:'decor'},
  ]
  
  const templates=[
    {name:'Modern Living',items:[{type:'sofa',position:[0,0,1],rotation:0,scale:1,color:'#f0f0f0'},{type:'table',position:[0,0,-0.5],rotation:0,scale:0.8,color:'#1a1a1a'},{type:'lamp',position:[-2,0,1],rotation:0,scale:1},{type:'plant',position:[2,0,-2],rotation:0,scale:1}]},
    {name:'Bedroom',items:[{type:'bed',position:[0,0,0],rotation:0,scale:1,color:'#8b4513'},{type:'wardrobe',position:[3,0,-3],rotation:Math.PI/2,scale:1},{type:'lamp',position:[1.5,0,1.5],rotation:0,scale:0.8}]},
    {name:'Office',items:[{type:'desk',position:[0,0,-2],rotation:0,scale:1},{type:'chair',position:[0,0,-1],rotation:Math.PI,scale:1},{type:'bookshelf',position:[-3,0,-2],rotation:0,scale:1}]},
  ]
  
  const addFurniture=useCallback((item)=>{const newFurniture={id:Date.now()+Math.random(),type:item.type,position:[0,0,0],rotation:0,scale:1,color:null,name:item.name,category:item.category,shopLink:item.shopLink,eco:item.eco};const updated=[...furniture,newFurniture];setFurniture(updated);saveToHistory(updated);setSelectedId(newFurniture.id)},[furniture,setFurniture,saveToHistory])
  
  const updateFurniturePosition=useCallback((id,newPosition)=>{let pos=newPosition;if(gridSnap){pos=[Math.round(newPosition[0]*2)/2,newPosition[1],Math.round(newPosition[2]*2)/2]}const halfSize=roomSize/2-0.5;pos[0]=Math.max(-halfSize,Math.min(halfSize,pos[0]));pos[2]=Math.max(-halfSize,Math.min(halfSize,pos[2]));const item=furniture.find(f=>f.id===id);if(collisionDetection&&item){const testItem={...item,position:pos};const hasCollision=furniture.some(f=>f.id!==id&&checkCollision(testItem,f));if(hasCollision)return}const updated=furniture.map(f=>f.id===id?{...f,position:pos}:f);setFurniture(updated)},[furniture,setFurniture,gridSnap,roomSize,collisionDetection,checkCollision])
  
  const rotateFurniture=useCallback((id)=>{const updated=furniture.map(f=>f.id===id?{...f,rotation:(f.rotation+Math.PI/4)%(Math.PI*2)}:f);setFurniture(updated);saveToHistory(updated)},[furniture,setFurniture,saveToHistory])
  const scaleFurniture=useCallback((id,newScale)=>{const updated=furniture.map(f=>f.id===id?{...f,scale:Math.max(0.5,Math.min(3,newScale))}:f);setFurniture(updated);saveToHistory(updated)},[furniture,setFurniture,saveToHistory])
  const changeFurnitureColor=useCallback((id,color)=>{const updated=furniture.map(f=>f.id===id?{...f,color}:f);setFurniture(updated);saveToHistory(updated)},[furniture,setFurniture,saveToHistory])
  const deleteFurniture=useCallback((id)=>{const updated=furniture.filter(f=>f.id!==id);setFurniture(updated);saveToHistory(updated);if(selectedId===id)setSelectedId(null)},[furniture,setFurniture,saveToHistory,selectedId])
  
  const pasteItem=useCallback(()=>{if(copiedItem){const newItem={...copiedItem,id:Date.now()+Math.random(),position:[copiedItem.position[0]+0.5,copiedItem.position[1],copiedItem.position[2]+0.5]};const updated=[...furniture,newItem];setFurniture(updated);saveToHistory(updated);setSelectedId(newItem.id)}},[copiedItem,furniture,setFurniture,saveToHistory])
  
  const applyTemplate=useCallback((template)=>{const newItems=template.items.map((item,i)=>({...item,id:Date.now()+i+Math.random(),name:furnitureList.find(f=>f.type===item.type)?.name||item.type}));const updated=[...furniture,...newItems];setFurniture(updated);saveToHistory(updated)},[furniture,setFurniture,saveToHistory])
  
  const aiAutoArrange=useCallback(()=>{const arranged=furniture.map((item,i)=>{const angle=(i/furniture.length)*Math.PI*2;const radius=roomSize*0.25;return{...item,position:[Math.cos(angle)*radius,item.position[1],Math.sin(angle)*radius],rotation:angle+Math.PI/2}});setFurniture(arranged);saveToHistory(arranged)},[furniture,setFurniture,saveToHistory,roomSize])
  
  const resetRoom=useCallback(()=>{if(confirm(`Clear ${rooms[currentRoom].name}?`)){setFurniture([]);setHistory([]);setHistoryIndex(-1);setSelectedId(null)}},[currentRoom,rooms,setFurniture])
  
  const saveDesign=useCallback(()=>{const design={projectName,rooms,settings:{wallColor,floorColor,roomSize,lightIntensity,isDayMode},metadata:{totalBudget:calculateBudget(),totalItems,timestamp:new Date().toISOString()},notes};const blob=new Blob([JSON.stringify(design,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`${projectName.replace(/\s+/g,'-')}-${Date.now()}.json`;a.click();URL.revokeObjectURL(url)},[rooms,wallColor,floorColor,roomSize,lightIntensity,isDayMode,projectName,calculateBudget,totalItems,notes])
  
  const takeScreenshot=useCallback(()=>{if(canvasRef.current){const canvas=canvasRef.current.querySelector('canvas');if(canvas){canvas.toBlob(blob=>{const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`${projectName}-${Date.now()}.png`;a.click();URL.revokeObjectURL(url)})}}},[projectName])
  
  const selectedItem=furniture.find(f=>f.id===selectedId)
  
  useEffect(()=>{const area=furniture.reduce((s,i)=>{const baseArea=i.type==='sofa'?1.8:i.type==='bed'?4.4:i.type==='table'?0.72:0.5;return s+(baseArea*(i.scale||1)*(i.scale||1))},0);setSpaceUtilization(area/(roomSize*roomSize)*100);const ecoItems=furniture.filter(f=>f.eco).length;setSustainabilityScore(Math.min(100,ecoItems*15))},[furniture,roomSize])
  
  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex overflow-hidden">
      <div className="w-96 bg-gray-900/98 text-white overflow-y-auto shadow-2xl border-r border-gray-700/50">
        <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
          <input type="text" value={projectName} onChange={e=>setProjectName(e.target.value)} className="w-full bg-transparent text-2xl font-bold border-b border-gray-600 focus:border-blue-500 outline-none"/>
        </div>
        
        <div className="p-4 border-b border-gray-700/50">
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(rooms).map(k=><button key={k} onClick={()=>setCurrentRoom(k)} className={`p-3 rounded-lg text-sm font-medium ${currentRoom===k?'bg-blue-600':'bg-gray-800 hover:bg-gray-700'}`}>{rooms[k].name}<div className="text-xs text-gray-300 mt-1">{rooms[k].furniture.length} items</div></button>)}
          </div>
        </div>
        
        <div className="p-4 border-b border-gray-700/50 bg-gradient-to-r from-green-900/20 to-blue-900/20">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800/50 p-3 rounded-lg"><div className="text-xs text-gray-400">Budget</div><div className="text-lg font-bold text-green-400">₹{(calculateBudget()/1000).toFixed(0)}K</div></div>
            <div className="bg-gray-800/50 p-3 rounded-lg"><div className="text-xs text-gray-400">Items</div><div className="text-lg font-bold text-blue-400">{totalItems}</div></div>
            <div className="bg-gray-800/50 p-3 rounded-lg"><div className="text-xs text-gray-400">Space</div><div className="text-lg font-bold text-purple-400">{spaceUtilization.toFixed(0)}%</div></div>
            <div className="bg-gray-800/50 p-3 rounded-lg"><div className="text-xs text-gray-400">Eco</div><div className="text-lg font-bold text-green-400">{sustainabilityScore}</div></div>
          </div>
        </div>
        
        <div className="flex border-b border-gray-700/50 bg-gray-800/50">
          {['items','design','ai','pro'].map(tab=><button key={tab} onClick={()=>setActiveTab(tab)} className={`flex-1 py-3 text-xs font-medium uppercase ${activeTab===tab?'bg-gray-700 border-b-2 border-blue-500':'text-gray-400 hover:text-white'}`}>{tab}</button>)}
        </div>
        
        {activeTab==='items'&&<div className="flex-1 overflow-y-auto p-4"><div className="grid grid-cols-2 gap-3">{furnitureList.map((item,i)=><button key={i} onClick={()=>addFurniture(item)} className="p-4 bg-gradient-to-br from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 rounded-xl"><div className="text-4xl mb-2">{item.icon}</div><div className="text-sm font-medium">{item.name}</div><div className="text-xs text-gray-400 mt-1">₹{(prices[item.type]/1000).toFixed(0)}K</div></button>)}</div>{selectedItem&&<div className="mt-6 p-4 bg-blue-900/20 rounded-xl"><h4 className="font-bold mb-3">🎯 {selectedItem.name}</h4><div className="mb-4"><label className="text-xs block mb-2">Size: {selectedItem.scale.toFixed(1)}x</label><input type="range" min="0.5" max="3" step="0.1" value={selectedItem.scale} onChange={e=>scaleFurniture(selectedId,parseFloat(e.target.value))} className="w-full accent-blue-500"/></div><div className="mb-4"><label className="text-xs block mb-2">Color</label><div className="grid grid-cols-4 gap-2">{['#4a5568','#8b4513','#1a1a1a','#f0f0f0','#3b82f6','#10b981','#ef4444','#d4a574'].map(c=><button key={c} onClick={()=>changeFurnitureColor(selectedId,c)} className={`h-10 rounded-lg border-2 ${selectedItem.color===c?'border-white':'border-gray-600'}`} style={{backgroundColor:c}}/>)}</div></div><div className="flex space-x-2"><button onClick={()=>rotateFurniture(selectedId)} className="flex-1 p-2 bg-blue-600 rounded text-sm">🔄</button><button onClick={()=>deleteFurniture(selectedId)} className="flex-1 p-2 bg-red-600 rounded text-sm">🗑️</button></div></div>}<div className="p-4 border-t border-gray-700/50"><h4 className="font-bold mb-3">In Room ({furniture.length})</h4>{furniture.length===0?<div className="text-center py-8 bg-gray-800/50 rounded-xl"><div className="text-4xl mb-2">📦</div><p className="text-sm text-gray-400">Empty room</p></div>:<div className="space-y-2">{furniture.map(item=><div key={item.id} onClick={()=>setSelectedId(item.id)} className={`flex justify-between items-center p-3 rounded-lg cursor-pointer ${selectedId===item.id?'bg-blue-600/40 border-2 border-blue-500':'bg-gray-800/50 hover:bg-gray-700/50'}`}><span className="text-sm capitalize">{item.name}</span><span className="text-xs text-gray-400">₹{((prices[item.type]||0)*item.scale/1000).toFixed(0)}K</span></div>)}</div>}</div></div>}
        
        {activeTab==='design'&&<div className="p-6 space-y-6"><div><label className="text-xs block mb-2">Size: {roomSize}m×{roomSize}m</label><select value={roomSize} onChange={e=>setRoomSize(parseInt(e.target.value))} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"><option value="6">Small (6×6m)</option><option value="8">Compact (8×8m)</option><option value="10">Medium (10×10m)</option><option value="15">Large (15×15m)</option><option value="20">XL (20×20m)</option></select></div><div><label className="text-xs block mb-2">Wall Color</label><div className="grid grid-cols-4 gap-2">{['#f5f5f0','#ffffff','#e5e7eb','#f5f5dc','#e0f2fe','#d1fae5','#fed7d7','#e9d5ff'].map(c=><button key={c} onClick={()=>setWallColor(c)} className={`h-12 rounded-lg border-2 ${wallColor===c?'border-blue-400':'border-gray-600'}`} style={{backgroundColor:c}}/>)}</div></div><div><label className="text-xs block mb-2">Floor</label><div className="grid grid-cols-3 gap-2">{[{c:'#deb887'},{c:'#c9b8a0'},{c:'#8b7355'},{c:'#f8f8f8'},{c:'#9ca3af'},{c:'#b8a89f'}].map(p=><button key={p.c} onClick={()=>setFloorColor(p.c)} className={`h-12 rounded-lg border-2 ${floorColor===p.c?'border-blue-400':'border-gray-600'}`} style={{backgroundColor:p.c}}/>)}</div></div><div><label className="text-xs block mb-2">Light: {(lightIntensity*100).toFixed(0)}%</label><input type="range" min="0.2" max="2" step="0.1" value={lightIntensity} onChange={e=>setLightIntensity(parseFloat(e.target.value))} className="w-full accent-yellow-500"/></div><button onClick={()=>setIsDayMode(!isDayMode)} className="w-full p-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg font-semibold">{isDayMode?'🌞 Day':'🌙 Night'}</button><div className="space-y-2"><label className="flex items-center space-x-2"><input type="checkbox" checked={gridSnap} onChange={e=>setGridSnap(e.target.checked)} className="w-4 h-4"/><span className="text-sm">Grid Snap</span></label><label className="flex items-center space-x-2"><input type="checkbox" checked={collisionDetection} onChange={e=>setCollisionDetection(e.target.checked)} className="w-4 h-4"/><span className="text-sm">Collision Detection</span></label><label className="flex items-center space-x-2"><input type="checkbox" checked={showMeasurements} onChange={e=>setShowMeasurements(e.target.checked)} className="w-4 h-4"/><span className="text-sm">Measurements</span></label><label className="flex items-center space-x-2"><input type="checkbox" checked={showGrid} onChange={e=>setShowGrid(e.target.checked)} className="w-4 h-4"/><span className="text-sm">Grid</span></label></div></div>}
        
        {activeTab==='ai'&&<div className="p-6 space-y-4"><div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-4 rounded-xl"><h3 className="font-bold mb-3">🤖 AI Assistant</h3><div className="space-y-3"><button onClick={aiAutoArrange} className="w-full p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold">✨ Auto Arrange</button><div className="space-y-2">{templates.map((t,i)=><button key={i} onClick={()=>applyTemplate(t)} className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-left text-sm">{t.name}<div className="text-xs text-gray-400">{t.items.length} items</div></button>)}</div></div></div><div className="bg-green-900/20 p-4 rounded-xl"><h4 className="font-bold mb-3 text-sm">📊 Analytics</h4><div className="space-y-3"><div><div className="flex justify-between text-xs mb-1"><span>Space</span><span className="text-blue-400">{spaceUtilization.toFixed(0)}%</span></div><div className="h-2 bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{width:`${Math.min(100,spaceUtilization)}%`}}/></div></div><div><div className="flex justify-between text-xs mb-1"><span>Sustainability</span><span className="text-green-400">{sustainabilityScore}%</span></div><div className="h-2 bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{width:`${sustainabilityScore}%`}}/></div></div></div></div></div>}
        
        {activeTab==='pro'&&<div className="p-6 space-y-4"><h3 className="font-bold mb-4 text-lg">⚙️ Professional</h3><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Project notes..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm min-h-32"/><div className="text-xs text-gray-400 space-y-1 mt-4"><h4 className="font-bold mb-2">⌨️ Shortcuts</h4><div className="grid grid-cols-2 gap-1"><div><kbd className="bg-gray-800 px-2 py-1 rounded">R</kbd> Rotate</div><div><kbd className="bg-gray-800 px-2 py-1 rounded">Del</kbd> Delete</div><div><kbd className="bg-gray-800 px-2 py-1 rounded">Ctrl+Z</kbd> Undo</div><div><kbd className="bg-gray-800 px-2 py-1 rounded">Ctrl+Y</kbd> Redo</div><div><kbd className="bg-gray-800 px-2 py-1 rounded">Ctrl+C</kbd> Copy</div><div><kbd className="bg-gray-800 px-2 py-1 rounded">Ctrl+V</kbd> Paste</div><div><kbd className="bg-gray-800 px-2 py-1 rounded">1-4</kbd> Cameras</div></div></div></div>}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-gray-900/98 text-white p-4 flex justify-between items-center shadow-xl border-b border-gray-700/50">
          <div><h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{rooms[currentRoom].name}</h1><p className="text-xs text-gray-400 mt-1 flex space-x-3"><span>📐 {totalItems}</span><span>💰 ₹{(calculateBudget()/1000).toFixed(0)}K</span><span>♻️ {sustainabilityScore}</span></p></div>
          <div className="flex items-center space-x-2">
            <select value={cameraView} onChange={e=>setCameraView(e.target.value)} className="px-3 py-2 bg-gray-700 rounded text-xs"><option value="perspective">📷 Perspective</option><option value="top">⬇️ Top</option><option value="front">👁️ Front</option><option value="side">↔️ Side</option></select>
            <button onClick={undo} disabled={historyIndex<=0} className={`px-3 py-2 rounded ${historyIndex<=0?'bg-gray-700 text-gray-500':'bg-gray-700 hover:bg-gray-600'}`}>↶</button>
            <button onClick={redo} disabled={historyIndex>=history.length-1} className={`px-3 py-2 rounded ${historyIndex>=history.length-1?'bg-gray-700 text-gray-500':'bg-gray-700 hover:bg-gray-600'}`}>↷</button>
            <button onClick={takeScreenshot} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-sm">📸</button>
            <button onClick={saveDesign} className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold text-sm">💾</button>
            {selectedId&&<><button onClick={()=>rotateFurniture(selectedId)} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-semibold text-sm">🔄</button><button onClick={()=>deleteFurniture(selectedId)} className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 rounded-lg font-semibold text-sm">🗑️</button></>}
          </div>
        </div>

        <div ref={canvasRef} className="flex-1 bg-gradient-to-br from-gray-800 to-gray-900 relative">
          <Canvas camera={{position:[roomSize*0.8,roomSize*0.6,roomSize*0.8],fov:50}} shadows gl={{antialias:true,preserveDrawingBuffer:true}}>
            <Suspense fallback={null}>
              <CameraController cameraView={cameraView} roomSize={roomSize}/>
              <ambientLight intensity={isDayMode?0.4:0.2}/>
              <directionalLight position={[roomSize,roomSize*1.5,roomSize*0.5]} intensity={lightIntensity*(isDayMode?1:0.3)} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}/>
              <pointLight position={[-roomSize*0.5,roomSize*0.8,-roomSize*0.5]} intensity={0.3*lightIntensity} color={isDayMode?"#ffd9b3":"#4a5a8a"}/>
              <Sky distance={450000} sunPosition={isDayMode?[10,20,10]:[0,-5,0]} inclination={isDayMode?0.6:0.1}/>
              <mesh rotation={[-Math.PI/2,0,0]} position={[0,0,0]} onClick={()=>setSelectedId(null)} receiveShadow><planeGeometry args={[roomSize,roomSize]}/><meshStandardMaterial color={floorColor} roughness={0.8}/></mesh>
              {[{pos:[0,2.5,-roomSize/2],rot:[0,0,0]},{pos:[-roomSize/2,2.5,0],rot:[0,Math.PI/2,0]},{pos:[roomSize/2,2.5,0],rot:[0,-Math.PI/2,0]}].map((wall,i)=><mesh key={i} position={wall.pos} rotation={wall.rot} receiveShadow><planeGeometry args={[roomSize,5]}/><meshStandardMaterial color={wallColor} side={2} roughness={0.9}/></mesh>)}
              {furniture.map(item=>{const Comp=FurnitureComponents[item.type];return Comp?<Comp key={item.id} position={item.position} rotation={item.rotation||0} scale={item.scale||1} color={item.color} isSelected={selectedId===item.id} onSelect={setSelectedId} onUpdate={updateFurniturePosition} id={item.id} showMeasurements={showMeasurements}/>:null})}
              <ContactShadows position={[0,0.01,0]} opacity={0.5} scale={roomSize} blur={2}/>
              <OrbitControls makeDefault enableDamping dampingFactor={0.05} minDistance={3} maxDistance={roomSize*2} maxPolarAngle={Math.PI/2-0.1} target={[0,1,0]}/>
              {showGrid&&<gridHelper args={[roomSize,roomSize*2,'#666','#888']} position={[0,0.01,0]}/>}
            </Suspense>
          </Canvas>
          <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg text-xs"><div className="flex space-x-4"><span>🖱️ Drag to move</span><span>🔄 Scroll zoom</span><span>⌨️ R to rotate</span></div></div>
        </div>
      </div>
    </div>
  )
}

export default App