import { useState } from 'react'
import DesignA from './designs/DesignA'
import DesignB from './designs/DesignB'
import DesignC from './designs/DesignC'

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
]

export default function App() {
  const [selected, setSelected] = useState(null)

  if (selected === 'A') return <DesignA />
  if (selected === 'B') return <DesignB />
  if (selected === 'C') return <DesignC />

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white mb-2">Mejore MES — Design Chooser</h1>
          <p className="text-slate-400">3 different design directions. Click to preview each one live.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {designs.map(d => (
            <button key={d.id} onClick={() => setSelected(d.id)}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 rounded-2xl p-5 text-left transition-all group">
              <div className="w-10 h-10 bg-slate-700 group-hover:bg-slate-600 rounded-xl flex items-center justify-center text-xl font-black mb-4 transition-colors">
                {d.id}
              </div>
              <h2 className="text-white font-bold text-lg mb-1">{d.name}</h2>
              <p className="text-slate-400 text-sm mb-3">{d.desc}</p>
              <p className="text-slate-500 text-xs mb-3 italic">Best for: {d.best}</p>
              <div className="flex flex-wrap gap-1">
                {d.tags.map(t => (
                  <span key={t} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
              <div className="mt-4 text-slate-400 group-hover:text-white text-sm font-semibold flex items-center gap-1 transition-colors">
                Preview → 
              </div>
            </button>
          ))}
        </div>

        <p className="text-slate-600 text-sm text-center mt-8">
          Tell me which you like — or mix elements from multiple — and I'll build the full version.
        </p>
      </div>
    </div>
  )
}
