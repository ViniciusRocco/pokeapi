import { useEffect, useState, type CSSProperties } from 'react'
import { X } from 'lucide-react'
import { allTypes, typeColors, typePt } from '../../constants'
import type { Filters } from '../../types'
import { defaultFilters } from '../../utils/pokemon'

interface FilterSheetProps {
  value: Filters
  onChange: (filters: Filters) => void
  onClose: () => void
}

export function FilterSheet({ value, onChange, onClose }: FilterSheetProps) {
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  function toggleType(type: string) {
    setDraft((current) => ({
      ...current,
      types: current.types.includes(type)
        ? current.types.filter((item) => item !== type)
        : [...current.types, type],
    }))
  }

  return (
    <div className="sheet-backdrop" onMouseDown={onClose} role="presentation">
      <section
        className="filter-sheet"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-title"
      >
        <div className="sheet-handle" />
        <header>
          <h2 id="filter-title">Filtros</h2>
          <button onClick={onClose} aria-label="Fechar filtros"><X /></button>
        </header>

        <div className="filter-section">
          <h3>Selecione o tipo</h3>
          <div className="type-filter-grid">
            <button
              className={draft.types.length === 0 ? 'selected' : ''}
              onClick={() => setDraft((current) => ({ ...current, types: [] }))}
            >
              Todos os tipos
            </button>
            {allTypes.map((type) => (
              <button
                key={type}
                className={draft.types.includes(type) ? 'selected' : ''}
                style={{ '--type': typeColors[type] } as CSSProperties}
                onClick={() => toggleType(type)}
              >
                {typePt[type]}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Geração</h3>
          <div className="generation-grid">
            <button
              className={draft.generation === null ? 'selected' : ''}
              onClick={() => setDraft((current) => ({ ...current, generation: null }))}
            >
              Todas
            </button>
            {Array.from({ length: 9 }, (_, index) => index + 1).map((generation) => (
              <button
                className={draft.generation === generation ? 'selected' : ''}
                onClick={() => setDraft((current) => ({ ...current, generation }))}
                key={generation}
              >
                {generation}ª
              </button>
            ))}
          </div>
        </div>

        <div className="range-row">
          <label>
            Altura máxima <b>{draft.maxHeight / 10} m</b>
            <input
              aria-label="Altura máxima"
              type="range"
              min="1"
              max="1000"
              value={draft.maxHeight}
              onChange={(event) => setDraft((current) => ({ ...current, maxHeight: Number(event.target.value) }))}
            />
          </label>
          <label>
            Peso máximo <b>{draft.maxWeight / 10} kg</b>
            <input
              aria-label="Peso máximo"
              type="range"
              min="1"
              max="10000"
              value={draft.maxWeight}
              onChange={(event) => setDraft((current) => ({ ...current, maxWeight: Number(event.target.value) }))}
            />
          </label>
        </div>

        <footer>
          <button className="clear" onClick={() => setDraft(defaultFilters)}>Limpar</button>
          <button className="apply" onClick={() => { onChange(draft); onClose() }}>Aplicar filtros</button>
        </footer>
      </section>
    </div>
  )
}
