// Design E: "Mejore Industrial Forge" — Rugged, brand-aligned, machine-first
// Best for: CNC & Assembly stations on the factory floor.
// Theme: High-contrast Dark, "Burnt Amber" (Mejore logo), Industrial Steel Grey.

import { useState, useEffect } from 'react'
import { 
  Cpu, Activity, CheckSquare, AlertOctagon, 
  Camera, FileText, Timer, ChevronRight,
  Settings, User, Box, ArrowRight
} from 'lucide-react'

const BRAND = {
  amber: '#D97706', // Deep wood/burnt amber
  steel: '#1E293B', // Slate steel
  danger: '#EF4444',
  success: '#10B981'
}

const mockJob = {
  stationId: 'CNC-R01',
  operator: 'Nathan H.',
  orderId: 'ORD-2024-MEJ-88',
  sku: 'RASHIDA-LEG-OAK',
  description: 'Rashida Collection - Sculptural Oak Leg',
  totalUnits: 50,
  completedUnits: 22,
  startTime: '07:30 AM',
  cncProgram: 'RASHIDA_L4_V3.nc',
  notes: 'Check for wood grain alignment on the taper. Mirror pieces every 2 units.'
}

function ProgressShield({ value, total }) {
  const pct = Math.round((value / total) * 100)
  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Outer Ring */}
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="96" cy="96" r="88"
          stroke="currentColor" strokeWidth="12"
          fill="transparent" className="text-slate-800"
        />
        <circle
          cx="96" cy="96" r="88"
          stroke="currentColor" strokeWidth="12"
          fill="transparent"
          strokeDasharray={552.9}
          strokeDashoffset={552.9 - (552.9 * pct) / 100}
          className="text-amber-600 transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-black text-white">{pct}%</span>
        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Progress</span>
      </div>
    </div>
  )
}

export default function DesignE() {
  const [units, setUnits] = useState(mockJob.completedUnits)
  const [isPaused, setIsPaused] = useState(false)
  const [time, setTime] = useState(new Date().toLocaleTimeString())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-300 font-sans p-4 flex flex-col gap-4 overflow-hidden">
      
      {/* 🛠 INDUSTRIAL HEADER */}
      <header className="flex items-center justify-between bg-slate-900 border-b-4 border-amber-600 rounded-t-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="bg-amber-600 p-3 rounded-lg shadow-lg shadow-amber-600/20">
            <Cpu size={28} className="text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase">Mejore Forge <span className="text-amber-600">v1.0</span></h1>
            <div className="flex gap-4 items-center mt-1">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Activity size={14} className="text-emerald-500" /> {mockJob.stationId}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-700"></span>
              <span className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <User size={14} /> {mockJob.operator}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right font-mono">
          <div className="text-3xl font-black text-white tracking-widest tabular-nums">{time}</div>
          <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">System Synchronized</div>
        </div>
      </header>

      {/* 📦 MAIN PRODUCTION HUB */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1">
        
        {/* LEFT: JOB SPEC (1/4) */}
        <div className="lg:col-span-1 space-y-4">
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 h-full flex flex-col">
            <h3 className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <FileText size={14} className="text-amber-600" /> Current Work Order
            </h3>
            
            <div className="mb-8">
              <p className="text-amber-600 font-mono text-sm font-bold mb-1">{mockJob.orderId}</p>
              <h2 className="text-3xl font-black text-white tracking-tight leading-none mb-2">{mockJob.sku}</h2>
              <p className="text-slate-400 text-sm italic font-medium">"{mockJob.description}"</p>
            </div>

            <div className="space-y-4 flex-1">
              <div className="bg-black/40 rounded-xl p-4 border border-slate-800/50">
                <p className="text-slate-500 text-[10px] uppercase font-bold mb-2">CNC Program</p>
                <p className="text-emerald-400 font-mono text-sm bg-black px-3 py-1 rounded border border-emerald-900/30 w-fit">{mockJob.cncProgram}</p>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-slate-800/50">
                <p className="text-slate-500 text-[10px] uppercase font-bold mb-2">Instruction Log</p>
                <p className="text-slate-300 text-xs leading-relaxed font-medium">{mockJob.notes}</p>
              </div>
            </div>

            <button className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black tracking-widest py-4 rounded-xl border border-slate-600 uppercase transition-all">
              View Full BOM Details
            </button>
          </section>
        </div>

        {/* CENTER: PROGRESS & CONTROLS (2/4) */}
        <div className="lg:col-span-2 space-y-4 flex flex-col">
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex-1 flex flex-col items-center justify-between shadow-2xl relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            
            <div className="w-full flex justify-between items-start z-10">
              <div>
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Production Batch</p>
                <p className="text-6xl font-black text-white tracking-tighter">
                  {units} <span className="text-slate-700 text-4xl">/ {mockJob.totalUnits}</span>
                </p>
              </div>
              <div className="bg-emerald-600/10 text-emerald-500 border border-emerald-600/20 px-4 py-2 rounded-xl flex items-center gap-2">
                <Timer size={18} />
                <span className="font-mono font-black text-lg">04:12 <span className="text-xs">cycle</span></span>
              </div>
            </div>

            <ProgressShield value={units} total={mockJob.totalUnits} />

            <div className="w-full grid grid-cols-2 gap-6 mt-8 z-10">
              <button 
                onClick={() => setIsPaused(!isPaused)}
                className={`py-8 rounded-3xl font-black text-2xl tracking-tighter flex items-center justify-center gap-4 transition-all shadow-xl active:scale-95 border-b-8
                  ${isPaused 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-black border-emerald-800' 
                    : 'bg-amber-600 hover:bg-amber-500 text-black border-amber-800'}`}
              >
                {isPaused ? 'RESUME STATION' : 'PAUSE MACHINE'}
              </button>
              <button 
                onClick={() => setUnits(u => Math.min(u + 1, mockJob.totalUnits))}
                className="bg-white hover:bg-slate-100 text-black py-8 rounded-3xl font-black text-2xl tracking-tighter flex items-center justify-center gap-4 transition-all shadow-xl active:scale-95 border-b-8 border-slate-300"
              >
                LOG COMPLETED UNIT
              </button>
            </div>
          </section>
        </div>

        {/* RIGHT: QUALITY & INCIDENTS (1/4) */}
        <div className="lg:col-span-1 space-y-4">
          {/* QC ACTION */}
          <section className="bg-indigo-600 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden group cursor-pointer active:scale-95 transition-transform">
            <div className="absolute top-[-20%] right-[-10%] opacity-10 group-hover:scale-110 transition-transform">
              <Camera size={160} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest mb-2 flex items-center gap-2">
              <Camera size={20} /> Quality Control
            </h3>
            <p className="text-indigo-100 text-xl font-bold leading-tight mb-6">
              Visual Inspection Required in <span className="text-white underline decoration-amber-400">3 units</span>
            </p>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-white/30">
              <span className="text-xs font-black uppercase tracking-tighter">Capture Photo</span>
              <ArrowRight size={20} />
            </div>
          </section>

          {/* INCIDENT REPORTING */}
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex-1 shadow-inner">
            <h3 className="text-red-500 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <AlertOctagon size={16} /> Report Error
            </h3>
            <div className="grid gap-2">
              {['Material Fault', 'Tool Breakdown', 'Software Bug'].map(err => (
                <button key={err} className="w-full text-left bg-black/40 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/40 p-4 rounded-2xl transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 group-hover:text-red-400 text-sm font-bold uppercase tracking-tight">{err}</span>
                    <ChevronRight size={16} className="text-slate-700 group-hover:text-red-400" />
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* SYNC STATUS */}
          <div className="bg-[#101318] border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Order Time Live-Sync</span>
            </div>
            <Box size={14} className="text-slate-700" />
          </div>

        </div>

      </div>
    </div>
  )
}
