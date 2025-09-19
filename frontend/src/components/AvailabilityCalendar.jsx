import { useEffect, useMemo, useState } from 'react'

/** Format Date -> 'YYYY-MM-DD' */
    function fmt(d) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
    }

    /** Build a matrix of weeks (arrays) for a given month */
    function buildMonthMatrix(year, monthIndex) {
    // monthIndex: 0..11
    const first = new Date(year, monthIndex, 1)
    const last = new Date(year, monthIndex + 1, 0)
    const days = []
    // prepend empty slots for weekday offset (0=Sun..6=Sat)
    const startOffset = (first.getDay() + 6) % 7 // make Monday=0
    for (let i = 0; i < startOffset; i++) days.push(null)
    for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, monthIndex, d))
    // chunk into weeks of 7
    const weeks = []
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7))
    return weeks
    }

    /** Check if a date string is within a selected range */
    function isInRange(dateStr, start, end) {
    if (!start || !end) return false
    return dateStr >= start && dateStr <= end
    }

    /**
     * Minimal, dependency-free availability calendar:
     * - Shows 2 consecutive months (current + next) by default
     * - blockedDates: array of 'YYYY-MM-DD' strings
     * - onChange({startDate, endDate}) when user selects range
     */
    export default function AvailabilityCalendar({
    blockedDates = [],
    months = 2,
    initialMonth = new Date(),
    startDate,
    endDate,
    onChange
    }) {
    const today = useMemo(() => {
        const now = new Date()
        now.setHours(0, 0, 0, 0)
        return now
    }, [])
    const minDay = fmt(today)

    const [cursor, setCursor] = useState(new Date(initialMonth < today ? today : initialMonth))
    const [start, setStart] = useState(startDate || '')
    const [end, setEnd] = useState(endDate || '')

    useEffect(() => {
        if (startDate && startDate >= minDay) {
        setStart(startDate)
        } else if (!startDate) {
        setStart('')
        }
    }, [startDate, minDay])
    useEffect(() => {
        if (endDate && endDate >= minDay) {
        setEnd(endDate)
        } else if (!endDate) {
        setEnd('')
        }
    }, [endDate, minDay])

    const blockedSet = useMemo(() => new Set(blockedDates || []), [blockedDates])

    function handlePick(dayStr) {
        if (dayStr < minDay) {
        return
        }
        // If no start yet, set start.
        if (!start || (start && end)) {
        setStart(dayStr); setEnd('')
        onChange?.({ startDate: dayStr, endDate: '' })
        return
        }
        // If start exists and end empty -> set end (order it)
        if (dayStr < start) {
        setEnd(start); setStart(dayStr)
        onChange?.({ startDate: dayStr, endDate: start })
        } else {
        setEnd(dayStr)
        onChange?.({ startDate: start, endDate: dayStr })
        }
    }

    function renderMonth(y, m) {
        const weeks = buildMonthMatrix(y, m)
        const monthName = new Date(y, m, 1).toLocaleString(undefined, { month: 'long', year: 'numeric' })

        return (
        <div key={`${y}-${m}`} className="rounded border bg-white">
            <div className="px-3 py-2 font-semibold border-b">{monthName}</div>
            <div className="grid grid-cols-7 text-xs text-gray-600 px-3 py-2">
            {['Mo','Tu','We','Th','Fr','Sa','Su'].map((d) => (
                <div key={d} className="p-1 text-center">{d}</div>
            ))}
            </div>
            <div className="px-3 pb-3">
            {weeks.map((w, i) => (
                <div key={i} className="grid grid-cols-7 text-sm">
                {w.map((d, j) => {
                    if (!d) return <div key={j} className="p-1" />
                    const dayStr = fmt(d)
                    const isBlocked = blockedSet.has(dayStr) || dayStr < minDay
                    const isSelStart = start && dayStr === start
                    const isSelEnd = end && dayStr === end
                    const inRange = isInRange(dayStr, start, end)
                    const base = 'm-0.5 rounded px-2 py-1 text-center cursor-pointer'
                    let cls = 'hover:bg-gray-100'
                    if (isBlocked) cls = 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    if (inRange && !isSelStart && !isSelEnd) cls = 'bg-blue-100'
                    if (isSelStart || isSelEnd) cls = 'bg-blue-600 text-white'
                    return (
                    <button
                        key={j}
                        type="button"
                        disabled={isBlocked}
                        onClick={() => handlePick(dayStr)}
                        className={`${base} ${cls}`}
                    >
                        {d.getDate()}
                    </button>
                    )
                })}
                </div>
            ))}
            </div>
        </div>
        )
    }

    const monthGrids = []
    const baseY = cursor.getFullYear()
    const baseM = cursor.getMonth()
    for (let i = 0; i < months; i++) {
        const date = new Date(baseY, baseM + i, 1)
        monthGrids.push(renderMonth(date.getFullYear(), date.getMonth()))
    }

    const minMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const prevTarget = new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)
    const canGoPrev = prevTarget >= minMonth

    return (
        <div className="space-y-2">
        <div className="flex items-center justify-between">
            <button
            type="button"
            className="rounded border px-2 py-1 text-sm disabled:opacity-50"
            onClick={() => {
                if (canGoPrev) {
                setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
                }
            }}
            disabled={!canGoPrev}
            >
            ‹ Prev
            </button>
            <div className="text-sm text-gray-600">
            {start ? `From ${start}` : 'Pick a start date'}
            {end ? ` — To ${end}` : ''}
            </div>
            <button
            type="button"
            className="rounded border px-2 py-1 text-sm"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            >
            Next ›
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {monthGrids}
        </div>
        </div>
    )
    }
