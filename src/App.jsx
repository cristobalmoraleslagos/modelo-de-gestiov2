import { useState, useMemo } from 'react'
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, ZAxis
} from 'recharts'

const formatCLP = (n) => { if (isNaN(n) || n === null || n === undefined) return '$0'; return '$' + Math.round(n).toLocaleString('es-CL') }
const formatPct = (n) => { if (isNaN(n) || n === null || n === undefined) return '0%'; return n.toFixed(1) + '%' }
const COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6']

function Card({ title, subtitle, children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 ${className}`}>
      {title && (
        <div className="mb-4">
          <h3 className="text-slate-800 font-semibold text-lg">{title}</h3>
          {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

function KPI({ label, value, sub, tone = 'default' }) {
  const tones = {
    default: 'bg-white border-slate-200',
    positive: 'bg-emerald-50 border-emerald-200',
    negative: 'bg-rose-50 border-rose-200',
    accent: 'bg-indigo-50 border-indigo-200',
  }
  const valueColor = {
    default: 'text-slate-800',
    positive: 'text-emerald-700',
    negative: 'text-rose-600',
    accent: 'text-indigo-700',
  }
  return (
    <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</div>
      <div className={`text-2xl md:text-3xl font-bold mt-1 ${valueColor[tone]}`}>{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  )
}

function EditableRow({ item, onChange, onRemove, fields = ['nombre', 'monto'] }) {
  return (
    <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-2.5">
      <input
        value={item.nombre}
        onChange={(e) => onChange('nombre', e.target.value)}
        placeholder="Concepto"
        className="flex-1 min-w-0 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        type="number"
        value={item.monto}
        onChange={(e) => onChange('monto', Number(e.target.value))}
        placeholder="0"
        className="w-32 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-right text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button onClick={onRemove} className="text-slate-400 hover:text-rose-500 px-2" title="Eliminar">✕</button>
    </div>
  )
}

function AddButton({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="w-full mt-2 py-2.5 px-4 border-2 border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-500 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-600 transition"
    >
      + {label}
    </button>
  )
}

export default function App() {
  // ---------- Identidad ----------
  const [empresa, setEmpresa] = useState('Modelo Genérico SPA')
  const [tasaImpuesto, setTasaImpuesto] = useState(27)

  // ---------- Estados Financieros ----------
  const [ingresos, setIngresos] = useState([
    { id: 1, nombre: 'Servicios de Consultoría', monto: 6500000 },
    { id: 2, nombre: 'Suscripciones SaaS', monto: 5200000 },
    { id: 3, nombre: 'Licenciamiento', monto: 3300000 },
  ])

  const [costosFijos, setCostosFijos] = useState([
    { id: 1, nombre: 'Nómina y RRHH', monto: 6800000 },
    { id: 2, nombre: 'Arriendo Oficina', monto: 1200000 },
    { id: 3, nombre: 'Infraestructura Cloud', monto: 800000 },
  ])

  const [costosVariables, setCostosVariables] = useState([
    { id: 1, nombre: 'Comisiones de Venta', monto: 1500000 },
    { id: 2, nombre: 'Viáticos', monto: 600000 },
    { id: 3, nombre: 'Insumos Operativos', monto: 400000 },
  ])

  const [activos, setActivos] = useState([
    { id: 1, nombre: 'Caja y Bancos', monto: 8000000 },
    { id: 2, nombre: 'Cuentas por Cobrar', monto: 5500000 },
    { id: 3, nombre: 'Equipos y Hardware', monto: 4000000 },
    { id: 4, nombre: 'Propiedad Intelectual', monto: 12000000 },
  ])
  const [pasivos, setPasivos] = useState([
    { id: 1, nombre: 'Cuentas por Pagar', monto: 2500000 },
    { id: 2, nombre: 'Deuda Bancaria', monto: 6000000 },
    { id: 3, nombre: 'Provisiones Laborales', monto: 1800000 },
  ])

  // ---------- Cartera de Productos / Servicios ----------
  const [productos, setProductos] = useState([
    { id: 1, nombre: 'Consultoría Senior', precio: 180000, costo: 80000, unidadesMes: 30, crecimiento: 18, participacion: 30 },
    { id: 2, nombre: 'SaaS Plan Pro',     precio: 89000,  costo: 12000, unidadesMes: 45, crecimiento: 25, participacion: 40 },
    { id: 3, nombre: 'SaaS Plan Enterprise', precio: 290000, costo: 35000, unidadesMes: 12, crecimiento: 30, participacion: 50 },
    { id: 4, nombre: 'Licencia Anual',    precio: 450000, costo: 60000, unidadesMes: 6,  crecimiento: 5,  participacion: 15 },
    { id: 5, nombre: 'Workshops',         precio: 220000, costo: 90000, unidadesMes: 8,  crecimiento: -5, participacion: 8 },
  ])

  // ---------- Marketing Mix 7P ----------
  const [marketingMix, setMarketingMix] = useState({
    Producto: 78, Precio: 70, Plaza: 65, Promoción: 60, Personas: 80, Procesos: 72, Presencia: 68
  })

  // ---------- RRHH ----------
  const [empleados, setEmpleados] = useState([
    { id: 1, cargo: 'CEO', departamento: 'Gerencia', tipoContrato: 'Indefinido', costoMensual: 3800000 },
    { id: 2, cargo: 'CTO', departamento: 'Tecnología', tipoContrato: 'Indefinido', costoMensual: 3500000 },
    { id: 3, cargo: 'Senior Developer', departamento: 'Tecnología', tipoContrato: 'Indefinido', costoMensual: 2800000 },
    { id: 4, cargo: 'Developer Mid', departamento: 'Tecnología', tipoContrato: 'Indefinido', costoMensual: 1900000 },
    { id: 5, cargo: 'DevOps Engineer', departamento: 'Tecnología', tipoContrato: 'Indefinido', costoMensual: 2400000 },
    { id: 6, cargo: 'Account Manager', departamento: 'Ventas', tipoContrato: 'Indefinido', costoMensual: 1800000 },
    { id: 7, cargo: 'SDR', departamento: 'Ventas', tipoContrato: 'Plazo Fijo', costoMensual: 1100000 },
    { id: 8, cargo: 'Consultor Senior', departamento: 'Consultoría', tipoContrato: 'Indefinido', costoMensual: 2600000 },
    { id: 9, cargo: 'Consultor Junior', departamento: 'Consultoría', tipoContrato: 'Plazo Fijo', costoMensual: 1400000 },
    { id: 10, cargo: 'Marketing Manager', departamento: 'Marketing', tipoContrato: 'Indefinido', costoMensual: 1900000 },
    { id: 11, cargo: 'Content Specialist', departamento: 'Marketing', tipoContrato: 'Honorarios', costoMensual: 900000 },
    { id: 12, cargo: 'Analista Financiero', departamento: 'Finanzas', tipoContrato: 'Indefinido', costoMensual: 1700000 },
  ])
  const [salidasUltimoAno, setSalidasUltimoAno] = useState(2)

  // ---------- Abastecimiento ----------
  const [compras, setCompras] = useState([
    { id: 1, fecha: '2026-01-10', tipoDoc: 'Factura', nDoc: 'F-1234', proveedor: 'AWS Chile', insumo: 'Cloud Hosting', cantidad: 1, unidad: 'mes', precioUnitario: 650000 },
    { id: 2, fecha: '2026-02-05', tipoDoc: 'Factura', nDoc: 'F-1567', proveedor: 'Microsoft Chile', insumo: 'Licencias Office 365', cantidad: 12, unidad: 'lic', precioUnitario: 28000 },
    { id: 3, fecha: '2026-02-12', tipoDoc: 'Factura', nDoc: 'F-1890', proveedor: 'AWS Chile', insumo: 'Cloud Hosting', cantidad: 1, unidad: 'mes', precioUnitario: 720000 },
    { id: 4, fecha: '2026-03-15', tipoDoc: 'Factura', nDoc: 'F-2210', proveedor: 'Notebook World', insumo: 'Laptops', cantidad: 2, unidad: 'un', precioUnitario: 950000 },
    { id: 5, fecha: '2026-03-20', tipoDoc: 'Boleta',  nDoc: 'B-789',  proveedor: 'Marketing Plus', insumo: 'Campaña Digital', cantidad: 1, unidad: 'sv', precioUnitario: 1200000 },
    { id: 6, fecha: '2026-03-25', tipoDoc: 'Factura', nDoc: 'F-2455', proveedor: 'Microsoft Chile', insumo: 'Licencias Office 365', cantidad: 12, unidad: 'lic', precioUnitario: 29500 },
  ])
  const [ratioBenchmark, setRatioBenchmark] = useState(20)

  // ---------- Control Legal ----------
  const [legalItems, setLegalItems] = useState([
    { id: 1, item: 'Inicio de Actividades SII', vigente: true, vence: 'Permanente' },
    { id: 2, item: 'Patente Comercial', vigente: true, vence: '2026-12-31' },
    { id: 3, item: 'Contratos de Trabajo formalizados', vigente: true, vence: 'Vigente' },
    { id: 4, item: 'Política Tratamiento de Datos (Ley 19.628)', vigente: true, vence: '2026-09-15' },
    { id: 5, item: 'Registro de Marca INAPI', vigente: true, vence: '2028-04-22' },
    { id: 6, item: 'Cumplimiento RGPD (clientes UE)', vigente: false, vence: 'Pendiente' },
    { id: 7, item: 'Mutual de Seguridad', vigente: true, vence: 'Vigente' },
    { id: 8, item: 'Cyber-seguro', vigente: false, vence: 'Pendiente' },
  ])

  // ---------- Escenarios ----------
  const [escenario, setEscenario] = useState({ negativo: -20, medio: 0, positivo: 25 })

  // ---------- Tab ----------
  const [tab, setTab] = useState('dashboard')

  // ---------- Cálculos ----------
  const totalIngresos = useMemo(() => ingresos.reduce((s, x) => s + Number(x.monto || 0), 0), [ingresos])
  const totalCostosFijos = useMemo(() => costosFijos.reduce((s, x) => s + Number(x.monto || 0), 0), [costosFijos])
  const totalCostosVariables = useMemo(() => costosVariables.reduce((s, x) => s + Number(x.monto || 0), 0), [costosVariables])
  const totalEgresos = totalCostosFijos + totalCostosVariables
  const utilidadBruta = totalIngresos - totalEgresos
  const utilidadNeta = utilidadBruta * (1 - tasaImpuesto / 100)
  const margenBrutoPct = totalIngresos > 0 ? (utilidadBruta / totalIngresos) * 100 : 0
  const margenNetoPct = totalIngresos > 0 ? (utilidadNeta / totalIngresos) * 100 : 0
  const margenContribucionPct = totalIngresos > 0 ? (totalIngresos - totalCostosVariables) / totalIngresos : 0
  const puntoEquilibrio = margenContribucionPct > 0 ? totalCostosFijos / margenContribucionPct : 0

  const calcEscenario = (factorIngresos, factorCostos) => {
    const ingresosAdj = totalIngresos * (1 + factorIngresos / 100)
    const cvAdj = totalCostosVariables * (1 + factorCostos / 100)
    const egresosAdj = totalCostosFijos + cvAdj
    const ub = ingresosAdj - egresosAdj
    const un = ub * (1 - tasaImpuesto / 100)
    const mc = ingresosAdj > 0 ? (ingresosAdj - cvAdj) / ingresosAdj : 0
    const pe = mc > 0 ? totalCostosFijos / mc : 0
    return { ingresos: ingresosAdj, egresos: egresosAdj, utilidadBruta: ub, utilidadNeta: un, pe }
  }
  const escNeg = calcEscenario(escenario.negativo, Math.abs(escenario.negativo) * 0.4)
  const escMed = calcEscenario(escenario.medio, 0)
  const escPos = calcEscenario(escenario.positivo, escenario.positivo * 0.3)

  const totalActivos = useMemo(() => activos.reduce((s, x) => s + Number(x.monto || 0), 0), [activos])
  const totalPasivos = useMemo(() => pasivos.reduce((s, x) => s + Number(x.monto || 0), 0), [pasivos])
  const patrimonio = totalActivos - totalPasivos
  const ratioEndeudamiento = totalActivos > 0 ? (totalPasivos / totalActivos) * 100 : 0

  // Productos / BCG
  const productosCalc = useMemo(() => productos.map(p => {
    const margenUnitario = p.precio - p.costo
    const margenPct = p.precio > 0 ? (margenUnitario / p.precio) * 100 : 0
    const ingresoMes = p.precio * p.unidadesMes
    const margenTotalMes = margenUnitario * p.unidadesMes
    let bcg = 'Perro'
    if (p.crecimiento >= 10 && p.participacion >= 25) bcg = 'Estrella'
    else if (p.crecimiento < 10 && p.participacion >= 25) bcg = 'Vaca'
    else if (p.crecimiento >= 10 && p.participacion < 25) bcg = 'Interrogante'
    return { ...p, margenUnitario, margenPct, ingresoMes, margenTotalMes, bcg }
  }), [productos])

  // RRHH
  const plantillaTotal = empleados.length
  const costoEmpresaRRHH = useMemo(() => empleados.reduce((s, e) => s + Number(e.costoMensual || 0), 0), [empleados])
  const ingresoPorEmpleado = plantillaTotal > 0 ? totalIngresos / plantillaTotal : 0
  const costoPromedioEmpleado = plantillaTotal > 0 ? costoEmpresaRRHH / plantillaTotal : 0
  const tasaRotacion = plantillaTotal > 0 ? (salidasUltimoAno / plantillaTotal) * 100 : 0
  const ratioRRHHIngresos = totalIngresos > 0 ? (costoEmpresaRRHH / totalIngresos) * 100 : 0

  const headcountPorDepto = useMemo(() => {
    const map = {}
    empleados.forEach(e => { map[e.departamento] = (map[e.departamento] || 0) + 1 })
    return Object.entries(map).map(([departamento, count]) => ({ departamento, count }))
  }, [empleados])

  const costoPorDepto = useMemo(() => {
    const map = {}
    empleados.forEach(e => { map[e.departamento] = (map[e.departamento] || 0) + Number(e.costoMensual || 0) })
    return Object.entries(map).map(([departamento, costo]) => ({ departamento, costo }))
  }, [empleados])

  const headcountPorContrato = useMemo(() => {
    const map = {}
    empleados.forEach(e => { map[e.tipoContrato] = (map[e.tipoContrato] || 0) + 1 })
    return Object.entries(map).map(([tipo, count]) => ({ tipo, count }))
  }, [empleados])

  // Abastecimiento
  const totalCompras = useMemo(() => compras.reduce((s, c) => s + Number(c.cantidad || 0) * Number(c.precioUnitario || 0), 0), [compras])
  const ratioCompraVenta = totalIngresos > 0 ? (totalCompras / totalIngresos) * 100 : 0
  const insumosUnicos = useMemo(() => [...new Set(compras.map(c => c.insumo))], [compras])
  const proveedoresUnicos = useMemo(() => [...new Set(compras.map(c => c.proveedor))], [compras])
  const variacionInsumos = insumosUnicos.map(insumo => {
    const items = compras.filter(c => c.insumo === insumo).sort((a, b) => a.fecha.localeCompare(b.fecha))
    if (items.length < 2) return null
    const inicial = Number(items[0].precioUnitario || 0)
    const actual = Number(items[items.length - 1].precioUnitario || 0)
    const variacionPct = inicial > 0 ? ((actual - inicial) / inicial) * 100 : 0
    return { insumo, precioInicial: inicial, precioActual: actual, variacionPct }
  }).filter(Boolean)
  const variacionPromedio = variacionInsumos.length > 0
    ? variacionInsumos.reduce((s, v) => s + v.variacionPct, 0) / variacionInsumos.length
    : 0
  const gastoPorProveedor = proveedoresUnicos.map(proveedor => ({
    proveedor,
    total: compras.filter(c => c.proveedor === proveedor).reduce((s, c) => s + Number(c.cantidad || 0) * Number(c.precioUnitario || 0), 0)
  }))

  // Legal
  const cumplimientoLegal = legalItems.length > 0
    ? (legalItems.filter(l => l.vigente).length / legalItems.length) * 100
    : 0

  // ---------- Helpers CRUD ----------
  const addItem = (setter, list, template) => {
    const newId = list.length > 0 ? Math.max(...list.map(i => i.id)) + 1 : 1
    setter([...list, { ...template, id: newId }])
  }
  const removeItem = (setter, list, id) => setter(list.filter(i => i.id !== id))
  const updateItem = (setter, list, id, field, value) => {
    setter(list.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '◇' },
    { id: 'ingresos', label: 'Ingresos', icon: '↑' },
    { id: 'cfijos', label: 'Costos Fijos', icon: '⊟' },
    { id: 'cvar', label: 'Costos Variables', icon: '⊠' },
    { id: 'utilidad', label: 'Utilidad & P.E.', icon: '⊙' },
    { id: 'escenarios', label: 'Escenarios', icon: '◊' },
    { id: 'balance', label: 'Balance', icon: '≡' },
    { id: 'cartera', label: 'Cartera', icon: '⊞' },
    { id: 'rrhh', label: 'RRHH', icon: '◯' },
    { id: 'abastecimiento', label: 'Abastecimiento', icon: '⊡' },
    { id: 'marketing', label: 'Marketing 7P', icon: '◈' },
    { id: 'legal', label: 'Compliance', icon: '✓' },
  ]


  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">M</div>
              <div>
                <input
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  className="text-xl md:text-2xl font-bold text-slate-800 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-1"
                />
                <div className="text-slate-500 text-xs md:text-sm">Modelo de Gestión Empresarial · v2.0 · SaaS</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <label className="text-slate-600">Impuesto a la renta:</label>
              <select
                value={tasaImpuesto}
                onChange={(e) => setTasaImpuesto(Number(e.target.value))}
                className="bg-white border border-slate-300 text-slate-700 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={27}>27% (Régimen 14A)</option>
                <option value={25}>25% (Pro-Pyme 14D)</option>
                <option value={0}>0% (Exento)</option>
              </select>
            </div>
          </div>
        </div>

        <nav className="border-t border-slate-200 overflow-x-auto bg-slate-50">
          <div className="max-w-7xl mx-auto px-2 md:px-4 flex gap-1">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 md:px-4 py-3 text-sm font-medium whitespace-nowrap transition border-b-2 ${
                  tab === t.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <span className="mr-1.5 opacity-70">{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Dashboard Ejecutivo</h2>
              <p className="text-slate-500 text-sm mt-1">Visión consolidada · {empresa} · Período mensual</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <KPI label="Ingresos Totales" value={formatCLP(totalIngresos)} tone="default" />
              <KPI label="Egresos Totales" value={formatCLP(totalEgresos)} tone="default" />
              <KPI label="Utilidad Neta" value={formatCLP(utilidadNeta)} sub={`${formatPct(margenNetoPct)} margen`} tone={utilidadNeta >= 0 ? 'positive' : 'negative'} />
              <KPI label="Punto de Equilibrio" value={formatCLP(puntoEquilibrio)} sub="Ingreso mínimo" tone="accent" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Ingresos vs Egresos vs Utilidad" subtitle="Comparativa del ejercicio">
                <div className="h-72">
                  <ResponsiveContainer>
                    <BarChart data={[
                      { name: 'Ingresos', valor: totalIngresos },
                      { name: 'C. Fijos', valor: totalCostosFijos },
                      { name: 'C. Variables', valor: totalCostosVariables },
                      { name: 'Utilidad Neta', valor: utilidadNeta },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => '$' + (v/1000000).toFixed(1) + 'M'} />
                      <Tooltip formatter={(v) => formatCLP(v)} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                      <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
                        {[0,1,2,3].map(i => <Cell key={i} fill={COLORS[i]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card title="Estructura de Costos" subtitle="Distribución del gasto total">
                <div className="h-72">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Costos Fijos', value: totalCostosFijos },
                          { name: 'Costos Variables', value: totalCostosVariables },
                        ]}
                        cx="50%" cy="50%" outerRadius={90} dataKey="value" label={(e) => `${e.name}: ${formatPct((e.value / totalEgresos) * 100)}`}
                      >
                        <Cell fill="#4f46e5" />
                        <Cell fill="#0ea5e9" />
                      </Pie>
                      <Tooltip formatter={(v) => formatCLP(v)} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <KPI label="Margen Bruto" value={formatPct(margenBrutoPct)} tone="accent" />
              <KPI label="Plantilla" value={plantillaTotal} sub={`${headcountPorDepto.length} áreas`} tone="default" />
              <KPI label="Cumplimiento Legal" value={formatPct(cumplimientoLegal)} sub={`${legalItems.filter(l => l.vigente).length} de ${legalItems.length}`} tone={cumplimientoLegal >= 80 ? 'positive' : cumplimientoLegal >= 60 ? 'accent' : 'negative'} />
              <KPI label="Endeudamiento" value={formatPct(ratioEndeudamiento)} sub="Pasivos / Activos" tone={ratioEndeudamiento <= 50 ? 'positive' : 'negative'} />
            </div>

            <Card title="Pilares del Modelo de Gestión" subtitle="Visión integrada · Financiero · Comercial · Operativo · Capital Humano · Legal">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  { t: 'Financiero', d: 'P&L, Balance, P.E., Sensibilidad', c: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
                  { t: 'Comercial', d: 'Cartera, BCG, Marketing 7P', c: 'bg-sky-50 border-sky-200 text-sky-700' },
                  { t: 'Operativo', d: 'Abastecimiento y proveedores', c: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
                  { t: 'Capital Humano', d: 'Plantilla, costos y rotación', c: 'bg-amber-50 border-amber-200 text-amber-700' },
                  { t: 'Legal', d: 'Compliance y normativa vigente', c: 'bg-violet-50 border-violet-200 text-violet-700' },
                ].map(p => (
                  <div key={p.t} className={`p-4 rounded-xl border ${p.c}`}>
                    <div className="font-semibold">{p.t}</div>
                    <div className="text-xs mt-1 opacity-80">{p.d}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* INGRESOS */}
        {tab === 'ingresos' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Ingresos</h2>
              <p className="text-slate-500 text-sm mt-1">Líneas de facturación · Editable</p>
            </div>
            <Card title="Detalle de Ingresos">
              <div className="space-y-2">
                {ingresos.map(item => (
                  <EditableRow
                    key={item.id} item={item}
                    onChange={(field, value) => updateItem(setIngresos, ingresos, item.id, field, value)}
                    onRemove={() => removeItem(setIngresos, ingresos, item.id)}
                  />
                ))}
              </div>
              <AddButton onClick={() => addItem(setIngresos, ingresos, { nombre: '', monto: 0 })} label="Agregar ingreso" />
              <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-slate-600 font-medium">Total Ingresos</span>
                <span className="text-xl font-bold text-emerald-600">{formatCLP(totalIngresos)}</span>
              </div>
            </Card>
            <Card title="Distribución de Ingresos">
              <div className="h-72">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={ingresos} dataKey="monto" nameKey="nombre" outerRadius={100} label={(e) => `${e.nombre}: ${formatPct((e.monto / totalIngresos) * 100)}`}>
                      {ingresos.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => formatCLP(v)} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}

        {/* COSTOS FIJOS */}
        {tab === 'cfijos' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Costos Fijos</h2>
              <p className="text-slate-500 text-sm mt-1">Estructura mensual independiente del nivel de ventas</p>
            </div>
            <Card title="Detalle de Costos Fijos">
              <div className="space-y-2">
                {costosFijos.map(item => (
                  <EditableRow
                    key={item.id} item={item}
                    onChange={(field, value) => updateItem(setCostosFijos, costosFijos, item.id, field, value)}
                    onRemove={() => removeItem(setCostosFijos, costosFijos, item.id)}
                  />
                ))}
              </div>
              <AddButton onClick={() => addItem(setCostosFijos, costosFijos, { nombre: '', monto: 0 })} label="Agregar costo fijo" />
              <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-slate-600 font-medium">Total Costos Fijos</span>
                <span className="text-xl font-bold text-rose-500">{formatCLP(totalCostosFijos)}</span>
              </div>
            </Card>
          </div>
        )}

        {/* COSTOS VARIABLES */}
        {tab === 'cvar' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Costos Variables</h2>
              <p className="text-slate-500 text-sm mt-1">Costos que escalan con el nivel de operación</p>
            </div>
            <Card title="Detalle de Costos Variables">
              <div className="space-y-2">
                {costosVariables.map(item => (
                  <EditableRow
                    key={item.id} item={item}
                    onChange={(field, value) => updateItem(setCostosVariables, costosVariables, item.id, field, value)}
                    onRemove={() => removeItem(setCostosVariables, costosVariables, item.id)}
                  />
                ))}
              </div>
              <AddButton onClick={() => addItem(setCostosVariables, costosVariables, { nombre: '', monto: 0 })} label="Agregar costo variable" />
              <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-slate-600 font-medium">Total Costos Variables</span>
                <span className="text-xl font-bold text-rose-500">{formatCLP(totalCostosVariables)}</span>
              </div>
            </Card>
          </div>
        )}


        {/* UTILIDAD & P.E. */}
        {tab === 'utilidad' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Utilidad & Punto de Equilibrio</h2>
              <p className="text-slate-500 text-sm mt-1">Resultado del ejercicio · Ingreso mínimo para no perder dinero</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card title="Utilidad Bruta" subtitle="Antes de impuestos">
                <div className={`text-3xl font-bold ${utilidadBruta >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>{formatCLP(utilidadBruta)}</div>
                <div className="text-xs text-slate-500 mt-1">Margen: {formatPct(margenBrutoPct)}</div>
              </Card>
              <Card title="Utilidad Neta" subtitle={`Después de ${tasaImpuesto}% impuesto`}>
                <div className={`text-3xl font-bold ${utilidadNeta >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>{formatCLP(utilidadNeta)}</div>
                <div className="text-xs text-slate-500 mt-1">Margen neto: {formatPct(margenNetoPct)}</div>
              </Card>
              <Card title="Punto de Equilibrio" subtitle="Ingreso necesario para no perder">
                <div className="text-3xl font-bold text-indigo-600">{formatCLP(puntoEquilibrio)}</div>
                <div className="text-xs text-slate-500 mt-1">Margen contribución: {formatPct(margenContribucionPct * 100)}</div>
              </Card>
            </div>

            <Card title="Estado de Resultado">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-200"><span className="text-slate-600">Ingresos Totales</span><span className="font-bold text-slate-800">{formatCLP(totalIngresos)}</span></div>
                <div className="flex justify-between py-2 border-b border-slate-200"><span className="text-slate-600">(-) Costos Variables</span><span className="text-rose-500 font-medium">-{formatCLP(totalCostosVariables)}</span></div>
                <div className="flex justify-between py-2 border-b border-slate-200"><span className="text-slate-700 font-medium">Margen de Contribución</span><span className="text-indigo-600 font-bold">{formatCLP(totalIngresos - totalCostosVariables)}</span></div>
                <div className="flex justify-between py-2 border-b border-slate-200"><span className="text-slate-600">(-) Costos Fijos</span><span className="text-rose-500 font-medium">-{formatCLP(totalCostosFijos)}</span></div>
                <div className="flex justify-between py-2 border-b border-slate-200"><span className="text-slate-700 font-medium">Utilidad Bruta</span><span className={`font-bold ${utilidadBruta >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>{formatCLP(utilidadBruta)}</span></div>
                <div className="flex justify-between py-2 border-b border-slate-200"><span className="text-slate-600">(-) Impuesto ({tasaImpuesto}%)</span><span className="text-rose-500 font-medium">-{formatCLP(utilidadBruta * tasaImpuesto / 100)}</span></div>
                <div className="flex justify-between py-3 bg-indigo-50 rounded-lg px-3 mt-2"><span className="text-slate-800 font-semibold">Utilidad Neta</span><span className={`font-bold text-lg ${utilidadNeta >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>{formatCLP(utilidadNeta)}</span></div>
              </div>
            </Card>
          </div>
        )}

        {/* ESCENARIOS */}
        {tab === 'escenarios' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Sensibilización de Escenarios</h2>
              <p className="text-slate-500 text-sm mt-1">Simulación de variaciones en ingresos y su impacto</p>
            </div>

            <Card title="Configurar Variaciones (% sobre escenario base)">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-slate-600 font-medium">Negativo</label>
                  <input type="number" value={escenario.negativo} onChange={(e) => setEscenario({ ...escenario, negativo: Number(e.target.value) })} className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="text-sm text-slate-600 font-medium">Medio (base)</label>
                  <input type="number" value={escenario.medio} disabled className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-right bg-slate-50" />
                </div>
                <div>
                  <label className="text-sm text-slate-600 font-medium">Positivo</label>
                  <input type="number" value={escenario.positivo} onChange={(e) => setEscenario({ ...escenario, positivo: Number(e.target.value) })} className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Negativo', data: escNeg, color: 'rose' },
                { label: 'Medio', data: escMed, color: 'indigo' },
                { label: 'Positivo', data: escPos, color: 'emerald' },
              ].map(e => (
                <Card key={e.label} title={`Escenario ${e.label}`}>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-500">Ingresos</span><span className="font-medium">{formatCLP(e.data.ingresos)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Egresos</span><span className="font-medium">{formatCLP(e.data.egresos)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Util. Bruta</span><span className={`font-bold ${e.data.utilidadBruta >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>{formatCLP(e.data.utilidadBruta)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Util. Neta</span><span className={`font-bold ${e.data.utilidadNeta >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>{formatCLP(e.data.utilidadNeta)}</span></div>
                    <div className="flex justify-between pt-2 border-t border-slate-200"><span className="text-slate-700">P.E.</span><span className="font-bold text-indigo-600">{formatCLP(e.data.pe)}</span></div>
                  </div>
                </Card>
              ))}
            </div>

            <Card title="Comparativa Visual de Escenarios">
              <div className="h-80">
                <ResponsiveContainer>
                  <BarChart data={[
                    { escenario: 'Negativo', Ingresos: escNeg.ingresos, Egresos: escNeg.egresos, Utilidad: escNeg.utilidadNeta },
                    { escenario: 'Medio', Ingresos: escMed.ingresos, Egresos: escMed.egresos, Utilidad: escMed.utilidadNeta },
                    { escenario: 'Positivo', Ingresos: escPos.ingresos, Egresos: escPos.egresos, Utilidad: escPos.utilidadNeta },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="escenario" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => '$' + (v/1000000).toFixed(1) + 'M'} />
                    <Tooltip formatter={(v) => formatCLP(v)} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                    <Legend />
                    <Bar dataKey="Ingresos" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Egresos" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Utilidad" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}

        {/* BALANCE */}
        {tab === 'balance' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Balance General</h2>
              <p className="text-slate-500 text-sm mt-1">Activos · Pasivos · Patrimonio</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KPI label="Total Activos" value={formatCLP(totalActivos)} tone="positive" />
              <KPI label="Total Pasivos" value={formatCLP(totalPasivos)} tone="negative" />
              <KPI label="Patrimonio Neto" value={formatCLP(patrimonio)} sub={`Endeudamiento: ${formatPct(ratioEndeudamiento)}`} tone="accent" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Activos">
                <div className="space-y-2">
                  {activos.map(item => (
                    <EditableRow
                      key={item.id} item={item}
                      onChange={(field, value) => updateItem(setActivos, activos, item.id, field, value)}
                      onRemove={() => removeItem(setActivos, activos, item.id)}
                    />
                  ))}
                </div>
                <AddButton onClick={() => addItem(setActivos, activos, { nombre: '', monto: 0 })} label="Agregar activo" />
              </Card>

              <Card title="Pasivos">
                <div className="space-y-2">
                  {pasivos.map(item => (
                    <EditableRow
                      key={item.id} item={item}
                      onChange={(field, value) => updateItem(setPasivos, pasivos, item.id, field, value)}
                      onRemove={() => removeItem(setPasivos, pasivos, item.id)}
                    />
                  ))}
                </div>
                <AddButton onClick={() => addItem(setPasivos, pasivos, { nombre: '', monto: 0 })} label="Agregar pasivo" />
              </Card>
            </div>
          </div>
        )}


        {/* CARTERA DE PRODUCTOS */}
        {tab === 'cartera' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Cartera de Productos / Servicios</h2>
              <p className="text-slate-500 text-sm mt-1">Análisis BCG · Margen unitario · Crecimiento vs Participación</p>
            </div>

            <Card title="Catálogo Editable" subtitle="Precio · Costo · Unidades/mes · Crecimiento (%) · Participación de mercado (%)">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="text-left p-2 font-semibold">Producto</th>
                      <th className="text-right p-2 font-semibold">Precio</th>
                      <th className="text-right p-2 font-semibold">Costo</th>
                      <th className="text-right p-2 font-semibold">Ud/mes</th>
                      <th className="text-right p-2 font-semibold">Crec. %</th>
                      <th className="text-right p-2 font-semibold">Particip. %</th>
                      <th className="text-right p-2 font-semibold">Margen</th>
                      <th className="text-center p-2 font-semibold">BCG</th>
                      <th className="p-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosCalc.map(p => {
                      const bcgColor = { 'Estrella': 'bg-amber-100 text-amber-800', 'Vaca': 'bg-emerald-100 text-emerald-800', 'Interrogante': 'bg-indigo-100 text-indigo-800', 'Perro': 'bg-rose-100 text-rose-800' }[p.bcg]
                      return (
                        <tr key={p.id} className="border-b border-slate-200">
                          <td className="p-1"><input value={p.nombre} onChange={(e) => updateItem(setProductos, productos, p.id, 'nombre', e.target.value)} className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm" /></td>
                          <td className="p-1"><input type="number" value={p.precio} onChange={(e) => updateItem(setProductos, productos, p.id, 'precio', Number(e.target.value))} className="w-24 px-2 py-1.5 border border-slate-200 rounded text-right text-sm" /></td>
                          <td className="p-1"><input type="number" value={p.costo} onChange={(e) => updateItem(setProductos, productos, p.id, 'costo', Number(e.target.value))} className="w-24 px-2 py-1.5 border border-slate-200 rounded text-right text-sm" /></td>
                          <td className="p-1"><input type="number" value={p.unidadesMes} onChange={(e) => updateItem(setProductos, productos, p.id, 'unidadesMes', Number(e.target.value))} className="w-20 px-2 py-1.5 border border-slate-200 rounded text-right text-sm" /></td>
                          <td className="p-1"><input type="number" value={p.crecimiento} onChange={(e) => updateItem(setProductos, productos, p.id, 'crecimiento', Number(e.target.value))} className="w-20 px-2 py-1.5 border border-slate-200 rounded text-right text-sm" /></td>
                          <td className="p-1"><input type="number" value={p.participacion} onChange={(e) => updateItem(setProductos, productos, p.id, 'participacion', Number(e.target.value))} className="w-20 px-2 py-1.5 border border-slate-200 rounded text-right text-sm" /></td>
                          <td className="p-2 text-right text-slate-700 font-medium">{formatPct(p.margenPct)}</td>
                          <td className="p-2 text-center"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${bcgColor}`}>{p.bcg}</span></td>
                          <td className="p-1"><button onClick={() => removeItem(setProductos, productos, p.id)} className="text-slate-400 hover:text-rose-500 px-2">✕</button></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-3">
                <AddButton onClick={() => addItem(setProductos, productos, { nombre: '', precio: 0, costo: 0, unidadesMes: 0, crecimiento: 0, participacion: 0 })} label="Agregar producto" />
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Matriz BCG" subtitle="Eje X: Participación · Eje Y: Crecimiento · Tamaño: Margen mensual">
                <div className="h-80">
                  <ResponsiveContainer>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis type="number" dataKey="participacion" name="Participación" stroke="#64748b" fontSize={11} domain={[0, 100]} label={{ value: 'Participación de Mercado (%)', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#64748b' }} />
                      <YAxis type="number" dataKey="crecimiento" name="Crecimiento" stroke="#64748b" fontSize={11} label={{ value: 'Crecimiento (%)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#64748b' }} />
                      <ZAxis type="number" dataKey="margenTotalMes" range={[100, 800]} />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(v, n) => n === 'margenTotalMes' ? formatCLP(v) : v} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                      <Scatter data={productosCalc} fill="#4f46e5" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card title="Margen Total por Producto / mes">
                <div className="h-80">
                  <ResponsiveContainer>
                    <BarChart data={productosCalc}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="nombre" stroke="#64748b" fontSize={11} angle={-20} textAnchor="end" height={70} />
                      <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => '$' + (v/1000).toFixed(0) + 'k'} />
                      <Tooltip formatter={(v) => formatCLP(v)} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                      <Bar dataKey="margenTotalMes" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* RRHH (NEW) */}
        {tab === 'rrhh' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Recursos Humanos</h2>
              <p className="text-slate-500 text-sm mt-1">Capital humano · Plantilla · Costo total · Eficiencia · Rotación</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <KPI label="Plantilla Total" value={plantillaTotal} sub={`${headcountPorDepto.length} departamentos`} tone="default" />
              <KPI label="Costo Empresa" value={formatCLP(costoEmpresaRRHH)} sub={`${formatPct(ratioRRHHIngresos)} de ingresos`} tone={ratioRRHHIngresos <= 50 ? 'accent' : 'negative'} />
              <KPI label="Ingreso por Empleado" value={formatCLP(ingresoPorEmpleado)} sub="Productividad" tone="positive" />
              <KPI label="Tasa de Rotación" value={formatPct(tasaRotacion)} sub={`${salidasUltimoAno} salidas / 12m`} tone={tasaRotacion <= 10 ? 'positive' : tasaRotacion <= 20 ? 'accent' : 'negative'} />
            </div>

            <Card title="Configuración de Rotación">
              <div className="flex items-center gap-3 flex-wrap">
                <label className="text-sm text-slate-600">Salidas en últimos 12 meses:</label>
                <input
                  type="number"
                  value={salidasUltimoAno}
                  onChange={(e) => setSalidasUltimoAno(Number(e.target.value))}
                  className="w-24 px-3 py-2 border border-slate-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-slate-500 text-sm">→ Tasa anual: <span className="font-bold text-indigo-600">{formatPct(tasaRotacion)}</span></span>
                <span className="text-xs text-slate-500 ml-auto">Benchmark sano: 5–15% anual en SaaS / Consultoría</span>
              </div>
            </Card>

            <Card title="Plantilla Editable" subtitle="Cargo · Departamento · Tipo de Contrato · Costo Mensual">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="text-left p-2 font-semibold">Cargo</th>
                      <th className="text-left p-2 font-semibold">Departamento</th>
                      <th className="text-left p-2 font-semibold">Tipo de Contrato</th>
                      <th className="text-right p-2 font-semibold">Costo Mensual</th>
                      <th className="p-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {empleados.map(e => (
                      <tr key={e.id} className="border-b border-slate-200">
                        <td className="p-1"><input value={e.cargo} onChange={(ev) => updateItem(setEmpleados, empleados, e.id, 'cargo', ev.target.value)} className="w-full min-w-[160px] px-2 py-1.5 border border-slate-200 rounded text-sm" /></td>
                        <td className="p-1">
                          <select value={e.departamento} onChange={(ev) => updateItem(setEmpleados, empleados, e.id, 'departamento', ev.target.value)} className="w-full min-w-[130px] px-2 py-1.5 border border-slate-200 rounded text-sm bg-white">
                            <option>Gerencia</option><option>Tecnología</option><option>Ventas</option><option>Marketing</option><option>Consultoría</option><option>Finanzas</option><option>Operaciones</option><option>RRHH</option>
                          </select>
                        </td>
                        <td className="p-1">
                          <select value={e.tipoContrato} onChange={(ev) => updateItem(setEmpleados, empleados, e.id, 'tipoContrato', ev.target.value)} className="w-full min-w-[130px] px-2 py-1.5 border border-slate-200 rounded text-sm bg-white">
                            <option>Indefinido</option><option>Plazo Fijo</option><option>Honorarios</option><option>Part-Time</option><option>Practicante</option>
                          </select>
                        </td>
                        <td className="p-1"><input type="number" value={e.costoMensual} onChange={(ev) => updateItem(setEmpleados, empleados, e.id, 'costoMensual', Number(ev.target.value))} className="w-32 px-2 py-1.5 border border-slate-200 rounded text-right text-sm" /></td>
                        <td className="p-1"><button onClick={() => removeItem(setEmpleados, empleados, e.id)} className="text-slate-400 hover:text-rose-500 px-2">✕</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3">
                <AddButton onClick={() => addItem(setEmpleados, empleados, { cargo: '', departamento: 'Tecnología', tipoContrato: 'Indefinido', costoMensual: 0 })} label="Agregar empleado" />
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center text-sm">
                <span className="text-slate-600">Costo Promedio por Empleado</span>
                <span className="font-bold text-indigo-600">{formatCLP(costoPromedioEmpleado)}</span>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Distribución de Headcount por Departamento">
                <div className="h-72">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={headcountPorDepto} dataKey="count" nameKey="departamento" outerRadius={95} label={(e) => `${e.departamento}: ${e.count}`}>
                        {headcountPorDepto.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card title="Costo Salarial por Área">
                <div className="h-72">
                  <ResponsiveContainer>
                    <BarChart data={costoPorDepto}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="departamento" stroke="#64748b" fontSize={11} angle={-20} textAnchor="end" height={70} />
                      <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => '$' + (v/1000000).toFixed(1) + 'M'} />
                      <Tooltip formatter={(v) => formatCLP(v)} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                      <Bar dataKey="costo" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Distribución por Tipo de Contrato">
                <div className="h-64">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={headcountPorContrato} dataKey="count" nameKey="tipo" outerRadius={85} label={(e) => `${e.tipo}: ${e.count}`}>
                        {headcountPorContrato.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card title="Indicadores Críticos de RRHH">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                    <span className="text-slate-600">Costo RRHH / Ingresos</span>
                    <span className={`font-bold ${ratioRRHHIngresos <= 50 ? 'text-emerald-600' : 'text-rose-500'}`}>{formatPct(ratioRRHHIngresos)}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                    <span className="text-slate-600">Productividad (Ingreso/FTE)</span>
                    <span className="font-bold text-indigo-600">{formatCLP(ingresoPorEmpleado)}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                    <span className="text-slate-600">Costo Promedio por FTE</span>
                    <span className="font-bold text-slate-800">{formatCLP(costoPromedioEmpleado)}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                    <span className="text-slate-600">Tasa de Rotación Anual</span>
                    <span className={`font-bold ${tasaRotacion <= 15 ? 'text-emerald-600' : 'text-rose-500'}`}>{formatPct(tasaRotacion)}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                    <span className="text-slate-600">Margen sobre Costo RRHH</span>
                    <span className={`font-bold ${(totalIngresos - costoEmpresaRRHH) >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>{formatCLP(totalIngresos - costoEmpresaRRHH)}</span>
                  </div>
                  <div className="text-xs text-slate-500 bg-indigo-50 border border-indigo-200 p-3 rounded-lg mt-3">
                    En empresas SaaS / consultoría, el ratio Costo RRHH/Ingresos sano se ubica entre 35% y 55%. Sobre 60% indica baja escalabilidad o sobreplantilla.
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}


        {/* ABASTECIMIENTO */}
        {tab === 'abastecimiento' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Gestión de Abastecimiento</h2>
              <p className="text-slate-500 text-sm mt-1">Compras · Proveedores · Variación de precios · Eficiencia del gasto</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <KPI label="Total Compras" value={formatCLP(totalCompras)} sub={`${compras.length} registros`} tone="default" />
              <KPI label="Ratio Compra/Venta" value={formatPct(ratioCompraVenta)} sub={`Benchmark: ${ratioBenchmark}%`} tone={ratioCompraVenta <= ratioBenchmark ? 'positive' : 'negative'} />
              <KPI label="Variación Promedio" value={formatPct(variacionPromedio)} sub="Entre 1ª y última compra" tone={variacionPromedio > 5 ? 'negative' : variacionPromedio < 0 ? 'positive' : 'accent'} />
              <KPI label="Proveedores" value={proveedoresUnicos.length} sub={`${insumosUnicos.length} insumos`} tone="default" />
            </div>

            <Card title="Benchmark Ratio Compra/Venta">
              <div className="flex items-center gap-3 flex-wrap">
                <label className="text-sm text-slate-600">Meta máxima (% de ingresos):</label>
                <input type="number" value={ratioBenchmark} onChange={(e) => setRatioBenchmark(Number(e.target.value))} className="w-24 px-3 py-2 border border-slate-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <span className="text-slate-500">%</span>
                <div className="flex-1 min-w-[200px]">
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div className={`h-full ${ratioCompraVenta <= ratioBenchmark ? 'bg-emerald-500' : 'bg-rose-500'} transition-all`} style={{ width: `${Math.min(ratioCompraVenta, 100)}%` }} />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Actual: {formatPct(ratioCompraVenta)} · Objetivo: {'<='}{ratioBenchmark}%</div>
                </div>
              </div>
            </Card>

            <Card title="Registro de Compras" subtitle="Fecha · N° Documento · Proveedor · Insumo · Cantidad · Precio Unitario">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="text-left p-2 font-semibold">Fecha</th>
                      <th className="text-left p-2 font-semibold">Tipo</th>
                      <th className="text-left p-2 font-semibold">N° Doc</th>
                      <th className="text-left p-2 font-semibold">Proveedor</th>
                      <th className="text-left p-2 font-semibold">Insumo</th>
                      <th className="text-right p-2 font-semibold">Cant.</th>
                      <th className="text-left p-2 font-semibold">Ud</th>
                      <th className="text-right p-2 font-semibold">P. Unit.</th>
                      <th className="text-right p-2 font-semibold hidden md:table-cell">Total</th>
                      <th className="p-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {compras.map(c => (
                      <tr key={c.id} className="border-b border-slate-200">
                        <td className="p-1"><input type="date" value={c.fecha} onChange={(e) => updateItem(setCompras, compras, c.id, 'fecha', e.target.value)} className="w-36 px-2 py-1.5 border border-slate-200 rounded text-sm" /></td>
                        <td className="p-1">
                          <select value={c.tipoDoc || 'Factura'} onChange={(e) => updateItem(setCompras, compras, c.id, 'tipoDoc', e.target.value)} className="w-24 px-2 py-1.5 border border-slate-200 rounded text-sm bg-white">
                            <option value="Factura">Factura</option><option value="Boleta">Boleta</option><option value="Guía">Guía</option>
                          </select>
                        </td>
                        <td className="p-1"><input value={c.nDoc || ''} onChange={(e) => updateItem(setCompras, compras, c.id, 'nDoc', e.target.value)} placeholder="N°" className="w-24 px-2 py-1.5 border border-slate-200 rounded text-sm" /></td>
                        <td className="p-1"><input value={c.proveedor} onChange={(e) => updateItem(setCompras, compras, c.id, 'proveedor', e.target.value)} className="w-full min-w-[140px] px-2 py-1.5 border border-slate-200 rounded text-sm" /></td>
                        <td className="p-1"><input value={c.insumo} onChange={(e) => updateItem(setCompras, compras, c.id, 'insumo', e.target.value)} className="w-full min-w-[130px] px-2 py-1.5 border border-slate-200 rounded text-sm" /></td>
                        <td className="p-1"><input type="number" value={c.cantidad} onChange={(e) => updateItem(setCompras, compras, c.id, 'cantidad', Number(e.target.value))} className="w-20 px-2 py-1.5 border border-slate-200 rounded text-right text-sm" /></td>
                        <td className="p-1"><input value={c.unidad} onChange={(e) => updateItem(setCompras, compras, c.id, 'unidad', e.target.value)} className="w-16 px-2 py-1.5 border border-slate-200 rounded text-sm" /></td>
                        <td className="p-1"><input type="number" value={c.precioUnitario} onChange={(e) => updateItem(setCompras, compras, c.id, 'precioUnitario', Number(e.target.value))} className="w-24 px-2 py-1.5 border border-slate-200 rounded text-right text-sm" /></td>
                        <td className="p-1 text-right hidden md:table-cell text-slate-700 font-medium">{formatCLP(Number(c.cantidad || 0) * Number(c.precioUnitario || 0))}</td>
                        <td className="p-1"><button onClick={() => removeItem(setCompras, compras, c.id)} className="text-slate-400 hover:text-rose-500 px-2">✕</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3">
                <AddButton onClick={() => addItem(setCompras, compras, { fecha: new Date().toISOString().slice(0,10), tipoDoc: 'Factura', nDoc: '', proveedor: '', insumo: '', cantidad: 0, unidad: 'un', precioUnitario: 0 })} label="Agregar compra" />
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Variación de Precios por Insumo">
                {variacionInsumos.length > 0 ? (
                  <div className="space-y-2">
                    {variacionInsumos.map(v => (
                      <div key={v.insumo} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                        <div>
                          <div className="font-medium text-slate-800 text-sm">{v.insumo}</div>
                          <div className="text-xs text-slate-500">{formatCLP(v.precioInicial)} → {formatCLP(v.precioActual)}</div>
                        </div>
                        <div className={`font-bold text-sm ${v.variacionPct > 5 ? 'text-rose-500' : v.variacionPct < 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
                          {v.variacionPct >= 0 ? '+' : ''}{formatPct(v.variacionPct)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-slate-500 text-sm text-center py-8">Registra al menos 2 compras del mismo insumo para ver la variación.</div>
                )}
              </Card>

              <Card title="Gasto por Proveedor">
                <div className="h-72">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={gastoPorProveedor} dataKey="total" nameKey="proveedor" outerRadius={90} label={(e) => e.proveedor}>
                        {gastoPorProveedor.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => formatCLP(v)} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* MARKETING MIX */}
        {tab === 'marketing' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Marketing Mix · 7P</h2>
              <p className="text-slate-500 text-sm mt-1">Diagnóstico de las 7 dimensiones · Ajustable en tiempo real</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Radar de Desempeño">
                <div className="h-80">
                  <ResponsiveContainer>
                    <RadarChart data={Object.entries(marketingMix).map(([k, v]) => ({ dimension: k, valor: v }))}>
                      <PolarGrid stroke="#cbd5e1" />
                      <PolarAngleAxis dataKey="dimension" stroke="#475569" fontSize={12} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#94a3b8" fontSize={10} />
                      <Radar name="Desempeño" dataKey="valor" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.4} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card title="Ajustar Dimensiones">
                <div className="space-y-4">
                  {Object.entries(marketingMix).map(([k, v]) => (
                    <div key={k}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">{k}</span>
                        <span className={`text-sm font-bold ${v >= 75 ? 'text-emerald-600' : v >= 50 ? 'text-amber-600' : 'text-rose-500'}`}>{v}</span>
                      </div>
                      <input type="range" min="0" max="100" value={v} onChange={(e) => setMarketingMix({ ...marketingMix, [k]: Number(e.target.value) })} className="w-full accent-indigo-600" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card title="Acciones Sugeridas">
              <div className="space-y-2 text-sm">
                {Object.entries(marketingMix).filter(([_, v]) => v < 70).map(([k, v]) => (
                  <div key={k} className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-3 rounded-lg">
                    <span className="text-amber-700 font-bold mt-0.5">⚠</span>
                    <div>
                      <div className="font-semibold text-amber-900">{k} · {v}/100</div>
                      <div className="text-amber-800 text-xs">Bajo el umbral de 70. Priorizar mejora.</div>
                    </div>
                  </div>
                ))}
                {Object.entries(marketingMix).filter(([_, v]) => v < 70).length === 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-emerald-800 text-sm">✓ Todas las dimensiones sobre 70. Modelo equilibrado.</div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* CONTROL LEGAL */}
        {tab === 'legal' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Compliance & Control Legal</h2>
              <p className="text-slate-500 text-sm mt-1">Obligaciones · Vigencias · Indicador de cumplimiento global</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <KPI label="Cumplimiento Global" value={formatPct(cumplimientoLegal)} sub={`${legalItems.filter(l => l.vigente).length} de ${legalItems.length}`} tone={cumplimientoLegal >= 80 ? 'positive' : cumplimientoLegal >= 60 ? 'accent' : 'negative'} />
              <KPI label="Vigentes" value={legalItems.filter(l => l.vigente).length} sub="Sin observaciones" tone="positive" />
              <KPI label="Pendientes" value={legalItems.filter(l => !l.vigente).length} sub="Requieren acción" tone="negative" />
              <KPI label="Total" value={legalItems.length} sub="En seguimiento" tone="default" />
            </div>

            <Card title="Estado de Cumplimiento">
              <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                <div className={`h-full transition-all ${cumplimientoLegal >= 80 ? 'bg-emerald-500' : cumplimientoLegal >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${cumplimientoLegal}%` }} />
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>0%</span>
                <span className="font-semibold">{formatPct(cumplimientoLegal)}</span>
                <span>100%</span>
              </div>
            </Card>

            <Card title="Registro de Obligaciones Legales">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="text-left p-2 font-semibold">Obligación / Item</th>
                      <th className="text-center p-2 font-semibold">Vigente</th>
                      <th className="text-left p-2 font-semibold">Vencimiento</th>
                      <th className="p-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {legalItems.map(l => (
                      <tr key={l.id} className="border-b border-slate-200">
                        <td className="p-1"><input value={l.item} onChange={(e) => updateItem(setLegalItems, legalItems, l.id, 'item', e.target.value)} className="w-full min-w-[200px] px-2 py-1.5 border border-slate-200 rounded text-sm" /></td>
                        <td className="p-1 text-center">
                          <input type="checkbox" checked={l.vigente} onChange={(e) => updateItem(setLegalItems, legalItems, l.id, 'vigente', e.target.checked)} className="w-5 h-5 accent-emerald-600 cursor-pointer" />
                        </td>
                        <td className="p-1"><input value={l.vence} onChange={(e) => updateItem(setLegalItems, legalItems, l.id, 'vence', e.target.value)} className="w-full min-w-[120px] px-2 py-1.5 border border-slate-200 rounded text-sm" /></td>
                        <td className="p-1"><button onClick={() => removeItem(setLegalItems, legalItems, l.id)} className="text-slate-400 hover:text-rose-500 px-2">✕</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3">
                <AddButton onClick={() => addItem(setLegalItems, legalItems, { item: '', vigente: false, vence: '' })} label="Agregar obligación" />
              </div>
            </Card>

            <Card title="Marco Normativo Aplicable" subtitle="Organismos y regulaciones relevantes para SPA / SaaS en Chile">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {[
                  { org: 'SII', d: 'Inicio de actividades, facturación electrónica, IVA mensual, renta anual' },
                  { org: 'Dirección del Trabajo', d: 'Contratos, jornada legal, cotizaciones previsionales' },
                  { org: 'INAPI', d: 'Registro de marca, propiedad intelectual, patentes' },
                  { org: 'Ley 19.628 / 21.719', d: 'Tratamiento y protección de datos personales' },
                  { org: 'RGPD (UE)', d: 'Si se atienden clientes europeos: consentimiento, DPO, derecho al olvido' },
                  { org: 'Mutual / SUSESO', d: 'Seguro de accidentes laborales, plan preventivo' },
                ].map(x => (
                  <div key={x.org} className="bg-slate-50 p-3 rounded-lg">
                    <div className="font-semibold text-slate-800">{x.org}</div>
                    <div className="text-slate-500 text-xs mt-1">{x.d}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

      </main>

      <footer className="max-w-7xl mx-auto px-4 md:px-6 py-8 mt-8 border-t border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm text-slate-500">
          <div>{empresa} · Modelo de Gestión v2.0 · {new Date().getFullYear()}</div>
          <div>Desarrollado por Cristóbal Morales · Ing. en Negocios Internacionales · Analista de Datos</div>
        </div>
      </footer>
    </div>
  )
}
