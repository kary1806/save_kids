import { useEffect, useState } from 'react'
import { X, Route, MapPin, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'

type CategoryInfo = { key: string; label: string; color: string }
type ReportRow = {
  id: string
  category: string
  situation: string
  location: string
  occurred_at: string
  created_at: string
}

export default function MyReportsModal({
  userId,
  onClose,
}: {
  userId: string
  onClose: () => void
}) {
  const [categories, setCategories] = useState<CategoryInfo[]>([])
  const [reports, setReports] = useState<ReportRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('report_categories').select('*'),
      supabase
        .from('reports')
        .select('id, category, situation, location, occurred_at, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
    ]).then(([categoriesRes, reportsRes]) => {
      setCategories(categoriesRes.data ?? [])
      setReports(reportsRes.data ?? [])
      setLoading(false)
    })
  }, [userId])

  function categoryColor(key: string) {
    return categories.find((c) => c.key === key)?.color ?? '#6b7280'
  }

  function categoryLabel(key: string) {
    return categories.find((c) => c.key === key)?.label ?? key
  }

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 px-4">
      <div className="animate-fade-up relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-5 top-5 text-black transition-colors duration-200 hover:text-black/60"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <Route className="h-5 w-5 text-brand" />
          <h2 className="font-instrument text-xl font-semibold text-black">Mis reportes</h2>
        </div>
        <p className="mt-1 font-instrument text-sm text-black/60">
          Historial de situaciones que has reportado.
        </p>

        <div className="mt-5 flex flex-1 flex-col gap-3 overflow-y-auto">
          {loading && <p className="font-instrument text-sm text-black/40">Cargando...</p>}

          {!loading && reports.length === 0 && (
            <p className="font-instrument text-sm text-black/40">
              Todavía no has reportado ninguna situación.
            </p>
          )}

          {reports.map((report) => (
            <div key={report.id} className="rounded-xl border border-hairline p-3">
              <div className="flex items-center justify-between">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-instrument text-xs font-medium"
                  style={{
                    backgroundColor: `${categoryColor(report.category)}20`,
                    color: categoryColor(report.category),
                  }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: categoryColor(report.category) }}
                  />
                  {categoryLabel(report.category)}
                </span>
                <span className="font-instrument text-xs text-black/40">
                  {new Date(report.occurred_at).toLocaleDateString('es-CO', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>

              <p className="mt-2 font-instrument text-sm font-semibold text-black">
                {report.situation}
              </p>

              <div className="mt-1 flex items-center gap-1.5 font-instrument text-xs text-black/60">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                {report.location}
              </div>
              <div className="mt-1 flex items-center gap-1.5 font-instrument text-xs text-black/40">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                {new Date(report.occurred_at).toLocaleTimeString('es-CO', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
