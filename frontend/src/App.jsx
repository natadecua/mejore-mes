import { useState, useEffect } from 'react'
import DesignA from './designs/DesignA'
import DesignB from './designs/DesignB'
import DesignC from './designs/DesignC'
import DesignD from './designs/DesignD'
import DesignE from './designs/DesignE'
import DesignF from './designs/DesignF'
import DesignG from './designs/DesignG'
import DesignH from './designs/DesignH'
import DesignI from './designs/DesignI'

const designs = [
  {
    id: 'I',
    name: 'Recursive Forge',
    desc: 'v4.0 Hierarchy-First. Track small parts inside deep assemblies.',
    best: 'Complex Furniture (Bed/Drawer/Cabinet)',
    tags: ['Nesting', 'Tree View'],
  },
  {
    id: 'H',
    name: 'Production Terminal',
    desc: 'v3.2 Industrial UI. Barcode-driven queue.',
    best: 'General Machining Stations',
    tags: ['Barcodes', 'Rugged'],
  },
  {
    id: 'E',
    name: 'Mejore Forge',
    desc: 'Rugged branding. General factory floor visibility.',
    best: 'Wall-mounted Displays',
    tags: ['Branding', 'High-Contrast'],
  },
]

export default function App() {
  const [selected, setSelected] = useState(null)

  const renderDesign = () => {
    switch (selected) {
      case 'A': return <DesignA />
      case 'B': return <DesignB />
      case 'C': return <DesignC />
      case 'D': return <DesignD />
      case 'E': return <DesignE />
      case 'F': return <DesignF />
      case 'G': return <DesignG />
      case 'H': return <DesignH />
      case 'I': return <DesignI />
      default: return null
    }
  }

  const activeView = renderDesign()
  if (activeView) return activeView

  return (
    <div className="min-h-screen bg-[#05070a] text-white flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <div className="bg-amber-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
               <path d="M12 2v10"/>
               <path d="M18.4 4.6a10 10 0 1 1-12.8 0"/>
             </svg>
          </div>
          <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter italic">Mejore <span className="text-amber-600 not-italic">MES</span></h1>
          <p className="text-slate-500 font-medium uppercase tracking-widest leading-none">Factory Hierarchy v4.0</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {designs.map(d => (
            <button key={d.id} onClick={() => setSelected(d.id)}
              className={`text-left transition-all group relative overflow-hidden rounded-3xl p-8 border 
                ${d.id === 'I' 
                  ? 'bg-zinc-900 border-amber-600/50 hover:border-amber-600' 
                  : 'bg-zinc-900/40 border-slate-800 hover:border-slate-600'}`}>
              
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity text-white font-black italic text-7xl pointer-events-none">
                {d.id}
              </div>

              <h2 className="text-white font-black text-2xl mb-2 tracking-tight uppercase leading-none">{d.name}</h2>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed font-medium">{d.desc}</p>
              
              <div className="space-y-4">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${d.id === 'I' ? 'bg-amber-600 animate-pulse' : 'bg-slate-700'}`}></span> Deploy: {d.best}
                </p>
                <div className="flex flex-wrap gap-2">
                  {d.tags.map(t => (
                    <span key={t} className="text-[10px] uppercase font-black bg-black/40 text-slate-400 px-3 py-1 rounded-lg border border-slate-800">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className={`mt-8 text-sm font-black flex items-center gap-2 transition-colors 
                ${d.id === 'I' ? 'text-amber-500 group-hover:text-amber-400' : 'text-zinc-400 group-hover:text-white'}`}>
                INITIALIZE <div className="ml-2 font-bold font-mono">-{'>'}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
