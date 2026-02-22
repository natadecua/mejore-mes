// Design B: "Clean Operations" — Light mode, sidebar layout, enterprise-grade
// Best for: office/manager use, desktop + tablet
// Color: pure white + deep navy + teal accent — calm, professional

import { useState } from 'react'
import {
  LayoutDashboard, ClipboardList, Package, DollarSign,
  Camera, Settings, ChevronRight, ArrowUpRight,
  AlertTriangle, CheckCircle2, Timer, Upload, BarChart3, Menu, X
} from 'lucide-react'

const mockOrders = [
  { id: 'WO-101', item: 'Dining Chair CHAIR-001',    qty: 10, status: 'In Production', due: 'Mar 1',  pct: 60 },
  { id: 'WO-102', item: 'Oak Table TABLE-002',        qty: 5,  status: 'Open',          due: 'Mar 5',  pct: 0  },
  { id: 'WO-103', item: 'Sliding Wardrobe W-003',     qty: 3,  status: 'Finished',      due: 'Feb 28', pct: 100},
  { id: 'WO-104', item: 'Kitchen Cabinet CABINET-004',qty: 8,  status: 'In Production', due: 'Mar 8',  pct: 35 },
]

const nav = [
  { icon: LayoutDashboard, label: 'Dashboard',     id: 'dashboard' },
  { icon: ClipboardList,   label: 'Work Orders',   id: 'orders' },
  { icon: Package,         label: 'BOM Imports',   id: 'bom' },
  { icon: DollarSign,      label: 'Invoices',      id: 'invoices' },
  { icon: Camera,          label: 'QC Photos',     id: 'qc' },
]

const statusConfig = {
  'In Production': { color: 'text-amber-700 bg-amber-50 border-amber-200',     dot: 'bg-amber-400' },
  'Open':          { color: 'text-blue-700 bg-blue-50 border-blue-200',         dot: 'bg-blue-400'  },
  'Finished':      { color: 'text-emerald-700 bg-emerald-50 border-emerald-200',dot: 'bg-emerald-400' },
}

function Stat({ label, value, delta, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex justify-between items-start mb-4">
        <p className="text-slate-500 text-sm font-medium">{label}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={16} className="text-white" />
        </div>
      </div>
      <p className="text-slate-900 text-3xl font-bold">{value}</p>
      {delta && (
        <p className="text-emerald-600 text-xs mt-1 flex items-center gap-1 font-medium">
          <ArrowUpRight size={12} /> {delta}
        </p>
      )}
    </div>
  )
}

export default function DesignB() {
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} bg-[#0f172a] flex flex-col transition-all duration-200 sticky top-0 h-screen`}>
        <div className="p-4 flex items-center gap-3 border-b border-slate-700">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <BarChart3 size={15} className="text-white" />
          </div>
          {sidebarOpen && <span className="text-white font-bold text-sm whitespace-nowrap">Mejore MES</span>}
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map(({ icon: Icon, label, id }) => (
            <button key={id} onClick={() => setActive(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${active === id
                  ? 'bg-teal-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
              <Icon size={18} className="flex-shrink-0" />
              {sidebarOpen && <span className="whitespace-nowrap">{label}</span>}
            </button>
          ))}
        </nav>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-4 text-slate-500 hover:text-white border-t border-slate-700 flex justify-center">
          {sidebarOpen ? <X size={16}/> : <Menu size={16}/>}
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-slate-900 font-bold text-xl">
              {nav.find(n => n.id === active)?.label || 'Dashboard'}
            </h1>
            <p className="text-slate-400 text-xs">Last synced: just now</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-500 text-xs">Order Time connected</span>
          </div>
        </header>

        <main className="p-6 space-y-6">
          {active === 'dashboard' && (
            <>
              {/* Stat grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Stat label="Active Work Orders" value="3"     delta="+1 this week"  icon={ClipboardList} color="bg-amber-500" />
                <Stat label="BOM Imports"        value="12"    delta="2 pending"     icon={Package}       color="bg-teal-500" />
                <Stat label="Open Invoices"      value="₱4.2M" delta="3 unpaid"      icon={DollarSign}    color="bg-indigo-500" />
                <Stat label="QC Photos Today"    value="28"    delta="↑ 5 from avg"  icon={Camera}        color="bg-rose-500" />
              </div>

              {/* Orders table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
                  <h2 className="text-slate-800 font-semibold text-base">Work Orders</h2>
                  <button className="text-teal-600 text-sm font-medium hover:text-teal-700 flex items-center gap-1">
                    View all <ChevronRight size={14} />
                  </button>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 text-xs uppercase tracking-wide bg-slate-50">
                      <th className="px-5 py-3 text-left font-medium">Order</th>
                      <th className="px-5 py-3 text-left font-medium">Item</th>
                      <th className="px-5 py-3 text-left font-medium">Status</th>
                      <th className="px-5 py-3 text-left font-medium">Progress</th>
                      <th className="px-5 py-3 text-left font-medium">Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mockOrders.map(wo => {
                      const s = statusConfig[wo.status]
                      return (
                        <tr key={wo.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                          <td className="px-5 py-3.5 font-mono text-teal-600 font-medium">{wo.id}</td>
                          <td className="px-5 py-3.5 text-slate-700">{wo.item}</td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border font-medium ${s.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                              {wo.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 w-32">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${wo.pct === 100 ? 'bg-emerald-400' : 'bg-teal-500'}`}
                                  style={{ width: `${wo.pct}%` }}
                                />
                              </div>
                              <span className="text-slate-400 text-xs w-7">{wo.pct}%</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-slate-500 flex items-center gap-1">
                            <Timer size={12} /> {wo.due}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Bottom row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <h3 className="font-semibold text-slate-800 mb-3">Recent BOM Imports</h3>
                  <div className="space-y-2">
                    {[
                      { f: 'chair-001-bom.xml',    s: 'parsed',       i: 5, t: '2m ago' },
                      { f: 'wardrobe-003-bom.csv', s: 'pushed_to_ot', i: 6, t: '1h ago' },
                      { f: 'table-002-bom.xml',    s: 'error',        i: 0, t: '3h ago' },
                    ].map((b,i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                        <div className="flex items-center gap-2">
                          {b.s === 'error'
                            ? <AlertTriangle size={14} className="text-red-400" />
                            : <CheckCircle2 size={14} className="text-emerald-400" />}
                          <span className="text-slate-700 text-sm font-mono">{b.f}</span>
                        </div>
                        <span className="text-slate-400 text-xs">{b.t}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-indigo-500 to-teal-500 rounded-2xl p-5 text-white">
                  <h3 className="font-semibold mb-1">QuickBooks Online</h3>
                  <p className="text-white/70 text-sm mb-4">Connect to sync invoices and payments</p>
                  <button className="bg-white text-indigo-600 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-white/90 transition-colors">
                    Connect QBO →
                  </button>
                </div>
              </div>
            </>
          )}

          {active !== 'dashboard' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
              <p className="text-slate-400">Select a section to view its content</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
