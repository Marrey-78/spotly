import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

type AnalyticsEntityType = "venue" | "organizer";
type Period = "7d" | "30d" | "90d";

interface AnalyticsViewProps {
  entityType: AnalyticsEntityType;
  entityId: string;
  entityName: string;
  token: string;
  onBack?: () => void;
}

interface TopEvent {
  id: string;
  title: string;
  impressions: number;
  views: number;
  favorites: number;
  ticket_clicks: number;
}

interface AnalyticsStats {
  venue_views?: number;
  organizer_views?: number;

  venue_favorites?: number;
  organizer_favorites?: number;

  event_impressions: number;
  event_views: number;
  event_favorites: number;

  website_clicks: number;
  instagram_clicks: number;
  ticket_clicks: number;
  directions_clicks?: number;

  unique_visitors: number;

  previous_venue_views?: number | null;
  previous_organizer_views?: number | null;

  views_change_percentage?: number | null;

  top_events: TopEvent[];
}

interface TimelinePoint {
  day: string;
  profile_views: number;
  event_impressions: number;
  event_views: number;
  event_favorites: number;
  ticket_clicks: number;
}

export function AnalyticsView({
  entityType,
  entityId,
  entityName,
  token,
  onBack,
}: AnalyticsViewProps) {
  const [period, setPeriod] = useState<Period>("30d");

  const [stats, setStats] =
    useState<AnalyticsStats | null>(null);

  const [timeline, setTimeline] =
    useState<TimelinePoint[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [entityId, entityType, period]);

  async function loadAnalytics() {
    try {
      setLoading(true);
      setError(null);

      const entityPath =
        entityType === "venue"
          ? "venues"
          : "organizers";

      const [statsResponse, timelineResponse] =
        await Promise.all([
          fetch(
            `${API_URL}/analytics/${entityPath}/${entityId}/stats?period=${period}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),

          fetch(
            `${API_URL}/analytics/${entityPath}/${entityId}/timeline?period=${period}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

      if (!statsResponse.ok) {
        throw new Error(
          "Errore nel caricamento delle statistiche"
        );
      }

      if (!timelineResponse.ok) {
        throw new Error(
          "Errore nel caricamento dell'andamento"
        );
      }

      const statsData =
        await statsResponse.json();

      const timelineData =
        await timelineResponse.json();

      setStats(statsData);
      setTimeline(timelineData);

    } catch (err) {
      console.error(err);

      setError(
        "Impossibile caricare le statistiche."
      );

    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-zinc-400">
          Caricamento statistiche...
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-400 mb-4">
            {error ?? "Statistiche non disponibili"}
          </p>

          <button
            onClick={loadAnalytics}
            className="bg-white text-black px-4 py-2 rounded-xl"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  const profileViews =
    entityType === "venue"
      ? stats.venue_views ?? 0
      : stats.organizer_views ?? 0;

  const profileFavorites =
    entityType === "venue"
      ? stats.venue_favorites ?? 0
      : stats.organizer_favorites ?? 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24">

      {/* HEADER */}

      <div className="px-5 pt-6">
        {onBack && (
          <button
            onClick={onBack}
            className="text-zinc-400 mb-4"
          >
            ← Indietro
          </button>
        )}

        <p className="text-sm text-zinc-500">
          Statistiche
        </p>

        <h1 className="text-2xl font-semibold">
          {entityName}
        </h1>
      </div>

      {/* PERIOD */}

      <div className="flex gap-2 px-5 mt-6">
        {(["7d", "30d", "90d"] as Period[]).map(
          (value) => (
            <button
              key={value}
              onClick={() => setPeriod(value)}
              className={`px-4 py-2 rounded-full text-sm ${
                period === value
                  ? "bg-white text-black"
                  : "bg-zinc-900 text-zinc-400"
              }`}
            >
              {value === "7d"
                ? "7G"
                : value === "30d"
                ? "30G"
                : "90G"}
            </button>
          )
        )}
      </div>

      {/* KPI */}

      <div className="grid grid-cols-2 gap-3 px-5 mt-6">

        <StatCard
          title="Visualizzazioni"
          value={profileViews}
          change={stats.views_change_percentage}
        />

        <StatCard
          title="Visitatori"
          value={stats.unique_visitors}
        />

        <StatCard
          title="Preferiti"
          value={profileFavorites}
        />

        <StatCard
          title="Visualizzazioni eventi"
          value={stats.event_views}
        />

      </div>

      {/* FUNNEL */}

      <section className="px-5 mt-8">
        <h2 className="text-lg font-semibold mb-4">
          Performance eventi
        </h2>

        <div className="bg-zinc-900 rounded-2xl p-5 space-y-5">

          <FunnelRow
            label="Impression"
            value={stats.event_impressions}
          />

          <FunnelRow
            label="Visualizzazioni"
            value={stats.event_views}
          />

          <FunnelRow
            label="Preferiti"
            value={stats.event_favorites}
          />

          <FunnelRow
            label="Click ticket"
            value={stats.ticket_clicks}
          />

        </div>
      </section>

      {/* TIMELINE */}

      <section className="px-5 mt-8">
        <h2 className="text-lg font-semibold">
          Andamento
        </h2>

        <p className="text-sm text-zinc-500 mt-1 mb-4">
          Visualizzazioni giornaliere
        </p>

        <SimpleChart data={timeline} />
      </section>

      {/* TOP EVENTS */}

      <section className="px-5 mt-8">
        <h2 className="text-lg font-semibold mb-4">
          Eventi migliori
        </h2>

        <div className="space-y-3">
          {stats.top_events.length === 0 ? (
            <div className="bg-zinc-900 rounded-2xl p-5 text-zinc-500">
              Nessun dato disponibile.
            </div>
          ) : (
            stats.top_events.map(
              (event, index) => (
                <div
                  key={event.id}
                  className="bg-zinc-900 rounded-2xl p-4"
                >
                  <div className="flex justify-between gap-4">

                    <div>
                      <span className="text-xs text-zinc-500">
                        #{index + 1}
                      </span>

                      <p className="font-medium">
                        {event.title}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        {event.views}
                      </p>

                      <p className="text-xs text-zinc-500">
                        visualizzazioni
                      </p>
                    </div>

                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4 text-sm">

                    <MiniStat
                      label="Impression"
                      value={event.impressions}
                    />

                    <MiniStat
                      label="Preferiti"
                      value={event.favorites}
                    />

                    <MiniStat
                      label="Ticket"
                      value={event.ticket_clicks}
                    />

                  </div>
                </div>
              )
            )
          )}
        </div>
      </section>

    </div>
  );
}

function StatCard({
  title,
  value,
  change,
}: {
  title: string;
  value: number;
  change?: number | null;
}) {
  return (
    <div className="bg-zinc-900 rounded-2xl p-4">

      <p className="text-sm text-zinc-500">
        {title}
      </p>

      <p className="text-2xl font-semibold mt-1">
        {value.toLocaleString("it-IT")}
      </p>

      {change !== undefined &&
        change !== null && (
          <p
            className={`text-xs mt-2 ${
              change >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {change >= 0 ? "↑" : "↓"}{" "}
            {Math.abs(change)}%
          </p>
        )}

    </div>
  );
}

function FunnelRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-zinc-400">
        {label}
      </span>

      <span className="font-semibold">
        {value.toLocaleString("it-IT")}
      </span>
    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <p className="font-medium">
        {value.toLocaleString("it-IT")}
      </p>

      <p className="text-xs text-zinc-500">
        {label}
      </p>
    </div>
  );
}

function SimpleChart({
  data,
}: {
  data: TimelinePoint[];
}) {
  if (data.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-2xl p-5 text-zinc-500">
        Nessun dato disponibile.
      </div>
    );
  }

  const maxValue = Math.max(
    ...data.map((item) => item.profile_views),
    1
  );

  return (
    <div className="bg-zinc-900 rounded-2xl p-4">

      <div className="h-40 flex items-end gap-1">
        {data.map((item) => {
          const height =
            (item.profile_views / maxValue) * 100;

          return (
            <div
              key={item.day}
              className="flex-1 flex items-end h-full"
              title={`${item.day}: ${item.profile_views}`}
            >
              <div
                className="w-full bg-white/80 rounded-t"
                style={{
                  height: `${Math.max(
                    height,
                    item.profile_views > 0 ? 3 : 0
                  )}%`,
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-3 text-xs text-zinc-600">
        <span>
          {formatDate(data[0]?.day)}
        </span>

        <span>
          {formatDate(
            data[data.length - 1]?.day
          )}
        </span>
      </div>

    </div>
  );
}

function formatDate(date?: string) {
  if (!date) return "";

  return new Date(date).toLocaleDateString(
    "it-IT",
    {
      day: "2-digit",
      month: "2-digit",
    }
  );
}