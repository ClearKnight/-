import type { School } from '../../types'
import './SchoolSelector.css'

interface SchoolSelectorProps {
  schools: School[]
  activeSchoolId: string
  onChange: (schoolId: string) => void
}

export function SchoolSelector({ schools, activeSchoolId, onChange }: SchoolSelectorProps) {
  return (
    <div className="ufm-school-selector">
      {schools.map((school) => {
        const active = school.id === activeSchoolId
        return (
          <button
            key={school.id}
            type="button"
            className={active ? 'ufm-school-chip ufm-school-chip-active' : 'ufm-school-chip'}
            onClick={() => onChange(school.id)}
          >
            <span className="ufm-school-name">{school.name}</span>
            {school.alias && <span className="ufm-school-alias">{school.alias}</span>}
          </button>
        )
      })}
    </div>
  )
}

