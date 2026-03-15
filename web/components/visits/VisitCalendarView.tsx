"use client";

import { useCallback, useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer, type View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { fr } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

// ─── Localizer ────────────────────────────────────────────────────────────────

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: fr }),
  getDay,
  locales: { fr },
});

const MESSAGES = {
  next: "Suivant",
  previous: "Précédent",
  today: "Aujourd'hui",
  month: "Mois",
  week: "Semaine",
  day: "Jour",
  agenda: "Agenda",
  date: "Date",
  time: "Heure",
  event: "Visite",
  noEventsInRange: "Aucune visite sur cette période.",
  showMore: (n: number) => `+${n} visite(s)`,
};

// ─── Status → color map ───────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, { bg: string; border: string }> = {
  PLANNED:   { bg: "#3b82f6", border: "#2563eb" }, // blue
  COMPLETED: { bg: "#22c55e", border: "#16a34a" }, // green
  CANCELLED: { bg: "#94a3b8", border: "#64748b" }, // slate
};

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: any;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  visits: any[];
  onSelectSlot: (date: Date) => void;
  onSelectEvent: (visit: any) => void;
}

export default function VisitCalendarView({ visits, onSelectSlot, onSelectEvent }: Props) {
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());

  const events: CalendarEvent[] = useMemo(
    () =>
      visits.map((v) => ({
        id: v.id,
        title: `Dr. ${v.doctor?.firstName ?? ""} ${v.doctor?.lastName ?? ""}`,
        start: new Date(v.visitedAt),
        end: new Date(new Date(v.visitedAt).getTime() + 60 * 60 * 1000),
        resource: v,
      })),
    [visits]
  );

  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const status = event.resource?.status ?? "PLANNED";
    const colors = STATUS_COLORS[status] ?? STATUS_COLORS.PLANNED;
    return {
      style: {
        backgroundColor: colors.bg,
        borderLeft: `3px solid ${colors.border}`,
        borderRadius: "5px",
        color: "white",
        fontSize: "11px",
        fontWeight: 500,
        padding: "2px 6px",
        border: "none",
        cursor: "pointer",
        opacity: status === "CANCELLED" ? 0.65 : 1,
      },
    };
  }, []);

  const handleSelectSlot = useCallback(
    ({ start }: { start: Date }) => onSelectSlot(start),
    [onSelectSlot]
  );

  const handleSelectEvent = useCallback(
    (event: CalendarEvent) => onSelectEvent(event.resource),
    [onSelectEvent]
  );

  return (
    <div className="space-y-3">
      {/* Calendar */}
      <div
        className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
        style={{ height: 640 }}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          messages={MESSAGES}
          culture="fr"
          style={{ height: "100%", padding: "16px" }}
          formats={{
            dayHeaderFormat: (d: Date) => format(d, "EEE d MMM", { locale: fr }),
            monthHeaderFormat: (d: Date) => format(d, "MMMM yyyy", { locale: fr }),
            dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
              `${format(start, "d MMM", { locale: fr })} – ${format(end, "d MMM yyyy", { locale: fr })}`,
          }}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0" />
          Planifiée
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
          Effectuée
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-slate-400 flex-shrink-0" />
          Annulée
        </div>
        <span className="ml-auto text-slate-400 italic">
          Cliquez sur une date pour planifier · sur une visite pour le rapport
        </span>
      </div>
    </div>
  );
}
