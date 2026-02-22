import { useState } from 'react'
import DesignA from './designs/DesignA'
import DesignB from './designs/DesignB'
import DesignC from './designs/DesignC'
import DesignD from './designs/DesignD'

const designs = [
  {
    id: 'A',
    name: 'Factory Dark',
    desc: 'Dark mode · Amber accent · Tab navigation',
    best: 'Glare-heavy factory floor, tablet or large monitor',
    tags: ['Dark', 'Industrial', 'Tablet'],
  },
  {
    id: 'B',
    name: 'Clean Operations',
    desc: 'Light mode · Sidebar nav · Data table layout',
    best: 'Manager/office view, desktop or tablet landscape',
    tags: ['Light', 'Enterprise', 'Desktop'],
  },
  {
    id: 'C',
    name: 'Floor Card',
    desc: 'Warm off-white · Big tap targets · Bottom nav',
    best: 'Factory workers on tablet, task-first, touch-first',
    tags: ['Warm', 'Touch', 'Worker'],
  },
  {
    id: 'D',
    name: 'Station Terminal',
    desc: 'Utility-first · Machine-level controls · Status sync',
    best: 'CNC / Edge banding / Assembly machine tablets',
    tags: ['Utility', 'Machine', 'Sync'],
  },
]

export default function App() {
  const [selected, setSelected] = useState(null)

  if (selected === 'A') return <DesignA />
  if (selected === 'B') return <DesignB />
  if (selected === 'C') return <DesignC />
  if (selected === 'D') return <DesignD />

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Mejore MES Hierarchy</h1>
          <p className="text-slate-400">Select a dashboard role to preview the specific UX flow.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {designs.map(d => (
            <button key={d.id} onClick={() => setSelected(d.id)}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 rounded-3xl p-6 text-left transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-6xl font-black">{d.id}</span>
              </div>
              <h2 className="text-white font-bold text-xl mb-1">{d.name}</h2>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">{d.desc}</p>
              <p className="text-slate-500 text-xs mb-4 italic flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Best for: {d.best}
              </p>
              <div className="flex flex-wrap gap-2">
                {d.tags.map(t => (
                  <span key={t} className="text-[10px] uppercase font-bold tracking-widest bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-6 text-blue-400 group-hover:text-blue-300 text-sm font-black flex items-center gap-2 transition-colors">
                ENTER STATION <ChevronRight size={16} />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl">
          <p className="text-slate-400 text-sm text-center">
            <span className="text-blue-400 font-bold">Note:</span> Design D represents the machine-specific terminal you asked for. 
            It syncs machine state (CNC programs), BOM instructions, and real-time piece counting.
          </p>
        </div>
      </div>
    </div>
  )
}

function ChevronRight({ size }) {
  return <svg width={size} height={size} viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"3\" strokeLinecap=\"round\" strokeLinejoin=\"round\"><path d=\"m9 18 6-6-6-6\"/></svg>
}
