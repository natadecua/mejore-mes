// Design I: "The Recursive Forge" — High-Detail Component Tracking
// Focus: Tracking the "Smallest parts" (Railing, Handles, Rails) inside a deep hierarchy.

import React, { useState, useEffect } from 'react'
import { 
  Network, Box, Settings, Scan, 
  ChevronRight, ChevronDown, CheckCircle2,
  Clock, Timer, AlertOctagon, Camera,
  HardDrive, ArrowUpRight
} from 'lucide-react'

// Mock Data: The Deep "Tree" structure Miguel needs
const BOMS = [
  {
    id: 'FG-100',
    name: "Rashida Bed (King)",
    type: 'Finished Good',
    progress: 45,
    children: [
      {
        id: 'ASM-101',
        name: "Headboard Assembly",
        type: 'Assembly',
        children: [
          { name: "Oak Panel Main", type: 'Part', status: 'Machining', progress: 80 },
          { name: "Side Trim Left", type: 'Part', status: 'Ready', progress: 0 },
        ]
      },
      {
        id: 'ASM-102',
        name: "Drawer Unit (L)",
        type: 'Assembly',
        children: [
          { name: "Drawer Shell", type: 'Part', status: 'Sanding', progress: 40 },
          { name: "Soft-Close Railing", type: 'Hardware', status: 'In Stock', progress: 100 },
          { name: "Aluminum Handle", type: 'Hardware', status: 'Pending', progress: 0 },
        ]
      }
    ]
  }
]

function TreeNode({ node, level = 0, activeId, onSelect }) {
  const [isOpen, setIsOpen] = useState(level < 1)
  const isHardware = node.type === 'Hardware'
  const isActive = activeId === node.name
  
  return (
    <div className="select-none">
      <div 
        onClick={() => {
          if (node.children) setIsOpen(!isOpen)
          onSelect(node)
        }}
        className={"flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-1 " +
          (isActive ? 'bg-amber-600 text-black shadow-lg' : 'hover:bg-white/5 text-slate-400')}
        style={{ marginLeft: level * 16 + "px" }}
      >
        <div className="w-4 flex-shrink-0 flex justify-center">
          {node.children ? (
            <ChevronDown size={14} className={"transition-transform " + (isOpen ? '' : '-rotate-90')} />
          ) : (
            <div className="w-[14px]" />
          )}
        </div>
        
        <div className="flex-shrink-0">
          {isHardware ? <Settings size={14} className="text-blue-400" /> : <Box size={14} className={isActive ? 'text-black' : 'text-amber-500'} />}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className={"text-xs font-bold truncate " + (isActive ? 'text-black' : 'text-slate-200')}>{node.name}</p>
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-black uppercase tracking-tighter opacity-60">{node.type}</span>
            {node.progress !== undefined && (
              <span className={"text-[8px] font-bold " + (isActive ? 'text-black/60' : 'text-emerald-500')}>{node.progress}%</span>
            )}
          </div>
        </div>
      </div>
      
      {isOpen && node.children && (
        <div className="border-l border-slate-800 ml-4">
          {node.children.map((child, i) => (
            <TreeNode key={i} node={child} level={level + 1} activeId={activeId} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function DesignI() {
  const [activeItem, setActiveItem] = useState(null)
  const [workState, setWorkState] = useState('idle')
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    if (!activeItem) {
      setActiveItem(BOMS[0].children[1].children[0])
    }
  }, [])

  useEffect(() => {
    let interval
    if (workState === 'running') {
      interval = setInterval(() => setTimer(t => t + 1), 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [workState])

  const formatTime = (s) => {
    const mins = Math.floor(s / 60)
    const secs = s % 60
    return mins + ":" + secs.toString().padStart(2, '0')
  }

  if (!activeItem) return null

  return (
    <div className="min-h-screen bg-[#050608] text-slate-300 font-sans flex h-screen overflow-hidden p-2 gap-2">
      
      {/* 🌲 LEFT: THE COMPONENT TREE */}
      <aside className="w-96 bg-[#0f1116] border border-slate-800/50 rounded-3xl flex flex-col shadow-2xl overflow-hidden shrink-0">
        <div className="p-6 bg-slate-900/50 border-b border-slate-800">
           <h2 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
             <Network size={14} className="text-amber-500" /> Project Tree
           </h2>
           <div className="bg-black/40 border border-slate-800 p-4 rounded-2xl">
              <p className="text-[9px] font-black text-amber-600 uppercase mb-1">Manila Hotel</p>
              <h3 className="text-white font-black text-lg leading-tight uppercase tracking-tight">{BOMS[0].name}</h3>
           </div>
        </div>

        <div className="flex-1 overflow-auto p-4 scrollbar-hide">
          {BOMS.map((root, i) => (
            <TreeNode key={i} node={root} onSelect={setActiveItem} activeId={activeItem.name} />
          ))}
        </div>

        <div className="p-4 bg-black/40 flex items-center justify-between border-t border-slate-800">
           <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black py-3 px-6 rounded-xl transition-all w-full justify-center">
             <Scan size={14} /> SCAN COMPONENT
           </button>
        </div>
      </aside>

      {/* 🛠 RIGHT: WORKSTATION TERMINAL */}
      <main className="flex-1 bg-[#0f1116] border border-slate-800/50 rounded-3xl flex flex-col shadow-2xl overflow-hidden min-w-0">
        
        <div className="h-14 bg-slate-900/80 border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
           <div className="flex items-center gap-4">
             <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest whitespace-nowrap">Station: <span className="text-white">CNC-R01</span></span>
             <div className="w-1 h-1 rounded-full bg-slate-700 hidden sm:block"></div>
             <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest whitespace-nowrap hidden sm:block">Op: <span className="text-white">Nathan H.</span></span>
           </div>
           <div className="flex gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 whitespace-nowrap">BOM Verified</span>
           </div>
        </div>

        <div className="flex-1 p-6 md:p-8 overflow-auto flex flex-col gap-6 scrollbar-hide">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shrink-0">
              <div className="space-y-1 min-w-0">
                 <span className="bg-amber-600/10 text-amber-600 text-[10px] font-black px-2 py-1 rounded border border-amber-600/20 uppercase tracking-widest">
                   {activeItem.type} Focus
                 </span>
                 <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase truncate">{activeItem.name}</h1>
                 <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Drawing: RASH_DRW_V4.PDF</p>
              </div>
              <div className="text-right flex flex-col items-end shrink-0">
                <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden mb-2 shadow-inner">
                  <div className="h-full bg-amber-600 transition-all duration-500" style={{ width: activeItem.progress + "%" }}></div>
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Part Completion: <span className="text-white">{activeItem.progress}%</span></p>
              </div>
           </div>

           <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1">
              
              <div className="xl:col-span-7 flex flex-col gap-4 min-h-[300px]">
                 <div className="bg-black/60 border border-slate-800 rounded-[2.5rem] p-10 flex-1 flex flex-col justify-between items-center text-center shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none"><HardDrive size={120}/></div>
                    
                    <div className="space-y-2 relative z-10">
                       <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Work Session Timer</p>
                       <div className="text-6xl md:text-[8rem] font-black text-white leading-none tabular-nums tracking-tighter">
                         {formatTime(timer)}
                       </div>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-4 md:gap-6 relative z-10">
                       {workState !== 'running' ? (
                         <button 
                           onClick={() => setWorkState('running')}
                           className="bg-amber-600 hover:bg-amber-500 text-black py-6 md:py-10 rounded-3xl font-black text-lg md:text-2xl uppercase shadow-2xl shadow-amber-600/20 border-b-8 border-amber-800 active:border-b-0 active:translate-y-2 transition-all"
                         >
                           Start Job
                         </button>
                       ) : (
                         <button 
                           onClick={() => setWorkState('idle')}
                           className="bg-slate-800 hover:bg-slate-700 text-white py-6 md:py-10 rounded-3xl font-black text-lg md:text-2xl uppercase border-b-8 border-slate-900 active:border-b-0 active:translate-y-2 transition-all"
                         >
                           Pause
                         </button>
                       )}
                       
                       <button className="bg-white hover:bg-zinc-100 text-black py-6 md:py-10 rounded-3xl font-black text-lg md:text-2xl uppercase border-b-8 border-slate-300 active:border-b-0 active:translate-y-2 shadow-xl shadow-white/5 transition-all">
                         Complete
                       </button>
                    </div>
                 </div>
              </div>

              <div className="xl:col-span-5 flex flex-col gap-4">
                 <section className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-amber-500 border-b border-slate-800 pb-4 mb-2">
                      <Box size={18} />
                      <h3 className="font-black uppercase text-xs tracking-widest">BOM Specifications</h3>
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between border-b border-slate-800/50 pb-2">
                         <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Machining</span>
                         <span className="text-white text-xs font-black">2mm Runner Gap</span>
                       </div>
                       <div className="flex justify-between border-b border-slate-800/50 pb-2">
                         <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Finishing</span>
                         <span className="text-white text-xs font-black">220 Grit Sanding</span>
                       </div>
                       <div className="bg-black/40 p-4 rounded-xl text-xs text-slate-300 italic border border-slate-800/50 leading-relaxed font-medium text-center">
                         "Check handle alignment with jig H-12 before drilling pilot holes."
                       </div>
                    </div>
                 </section>

                 <div className="grid grid-cols-2 gap-4 flex-1">
                    <button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-3xl p-6 flex flex-col items-center justify-center gap-3 transition-all active:scale-95 shadow-xl group">
                       <Camera size={28} className="group-hover:rotate-12 transition-transform" />
                       <span className="font-black text-[9px] uppercase tracking-widest text-center">Capture Photo</span>
                    </button>
                    <button className="bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-500 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 transition-all active:scale-95 group text-center">
                       <AlertOctagon size={28} className="group-hover:scale-110 transition-transform mx-auto mb-2" />
                       <span className="font-black text-[9px] uppercase tracking-widest">Flag Incident</span>
                    </button>
                 </div>
              </div>
           </div>
        </div>

        <footer className="h-14 bg-slate-900 border-t border-slate-800 px-8 flex items-center justify-between shrink-0">
           <div className="flex items-center gap-3 overflow-hidden">
             <Clock size={16} className="text-slate-500 shrink-0" />
             <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest truncate">Station Duration: <span className="text-white font-mono">04:12:45</span></span>
           </div>
           <div className="flex items-center gap-3 bg-amber-600/10 border border-amber-600/20 px-4 py-2 rounded-xl shrink-0">
              <span className="text-[9px] font-black uppercase text-amber-600 tracking-widest hidden sm:inline">Next Target:</span>
              <span className="text-white font-black text-[10px] uppercase tracking-tighter">Sanding Booth B</span>
              <ChevronRight size={14} className="text-amber-600" />
           </div>
        </footer>
      </main>
    </div>
  )
}
