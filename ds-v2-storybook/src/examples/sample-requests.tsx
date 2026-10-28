import { useMemo, useState } from "react";
import { Inbox, Plus } from "lucide-react";
import { Banner } from "../components/banner";
import { Button } from "../components/button";
import { ChipGroup } from "../components/chip";
import { Dialog } from "../components/dialog";
import { Input } from "../components/input";
import { MetricCard } from "../components/card";
import { SearchInput } from "../components/search-input";
import { SegmentedControl } from "../components/segmented-control";
import { Select, TIMEFRAME_PRESETS } from "../components/select";
import { cn } from "../lib/cn";

type Row = {
  id: string;
  name: string;
  handle: string;
  status: "Pending" | "Approved" | "Declined";
  gmv: string;
  updated: string;
};

const rows: Row[] = [
  { id: "maya", name: "Maya Chen", handle: "@glowwithmaya", status: "Pending", gmv: "$18,240", updated: "5 min ago" },
  { id: "leo", name: "Leo Park", handle: "@leoeats", status: "Pending", gmv: "$9,110", updated: "22 min ago" },
  { id: "nina", name: "Nina Alvarez", handle: "@ninacooks", status: "Approved", gmv: "$42,680", updated: "1 hr ago" },
  { id: "omar", name: "Omar Haddad", handle: "@omartests", status: "Declined", gmv: "$3,420", updated: "Yesterday" },
];

const statusTone: Record<Row["status"], string> = {
  Pending: "bg-warning-subtle text-warning",
  Approved: "bg-success-subtle text-success",
  Declined: "bg-error-subtle text-error",
};

/** Example composition. No top nav — page edge, grid, cards, rows, and one dialog. */
export function SampleRequests({ frame = "desktop" }: { frame?: "desktop" | "phone" }) {
  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState("pending");
  const [timeframe, setTimeframe] = useState("30d");
  const [chips, setChips] = useState([
    { id: "gmv", label: "GMV", value: ">$5k" },
    { id: "shop", label: "Shop", value: "US" },
  ]);
  const [active, setActive] = useState<Row | null>(null);
  const [note, setNote] = useState("");
  const [decision, setDecision] = useState<string | null>(null);

  const visible = useMemo(() => {
    return rows.filter((row) => {
      const matchesQuery = `${row.name} ${row.handle}`.toLowerCase().includes(query.trim().toLowerCase());
      const matchesSegment = segment === "all" || row.status.toLowerCase() === segment;
      return matchesQuery && matchesSegment;
    });
  }, [query, segment]);

  return (
    <div className={cn("mx-auto w-full bg-background text-foreground", frame === "phone" ? "max-w-[390px]" : "max-w-[var(--content-max)]")}>
      <div className="flex flex-col gap-[var(--space-spacious)] px-[var(--page-edge)] py-[var(--page-edge)]">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-title text-foreground">Sample requests</h1>
            <p className="mt-1 font-subtitle">Approve or decline sample requests from creators.</p>
          </div>
          <Button leadingIcon={<Plus />} className={frame === "phone" ? "w-full" : undefined}>
            New request
          </Button>
        </header>

        <Banner
          layout="page"
          tone="info"
          actions="link"
          title="2 requests expire tomorrow"
          description="Review them before the offer window closes."
          actionLabel="Review expiring"
        />

        <div
          className="grid"
          style={{ gridTemplateColumns: "repeat(var(--grid-columns), minmax(0, 1fr))", gap: "var(--grid-gutter)" }}
        >
          <div style={{ gridColumn: frame === "phone" ? "span 2" : "span 3" }}>
            <MetricCard label="Pending" value={18} caption="waiting on you" />
          </div>
          <div style={{ gridColumn: frame === "phone" ? "span 2" : "span 3" }}>
            <MetricCard label="Approved" value={42} delta="+6" caption="vs last week" tone="success" />
          </div>
          <div style={{ gridColumn: frame === "phone" ? "span 4" : "span 3" }}>
            <MetricCard label="GMV" value={128406} format={(value) => `$${Math.round(value).toLocaleString("en-US")}`} delta="+12.4%" caption="vs last week" tone="brand" />
          </div>
          <div style={{ gridColumn: frame === "phone" ? "span 4" : "span 3" }}>
            <MetricCard label="Reply rate" value={64} format={(value) => `${Math.round(value)}%`} caption="last 30 days" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className={cn("flex gap-2", frame === "phone" ? "flex-col" : "flex-wrap items-end")}>
            <SegmentedControl
              label="Request status"
              value={segment}
              onValueChange={setSegment}
              options={[
                { value: "pending", label: "Pending" },
                { value: "approved", label: "Approved" },
                { value: "all", label: "All" },
              ]}
            />
            <div className={frame === "phone" ? "w-full" : "w-[220px]"}>
              <Select label="Timeframe" value={timeframe} onValueChange={setTimeframe} options={TIMEFRAME_PRESETS} />
            </div>
            <div className={frame === "phone" ? "w-full" : "min-w-[240px] flex-1"}>
              <SearchInput label="Search creators" value={query} onValueChange={setQuery} placeholder="Search creators" />
            </div>
          </div>
          <ChipGroup chips={chips} onRemove={(id) => setChips((list) => list.filter((chip) => chip.id !== id))} />
        </div>

        <div className="overflow-hidden rounded-panel border border-border bg-raised shadow-resting">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Sample requests</caption>
            <thead>
              <tr className="bg-muted-surface">
                {["Creator", "Status", ...(frame === "phone" ? [] : ["GMV", "Updated"]), "Actions"].map((heading) => (
                  <th key={heading} scope="col" className={cn("h-10 px-4 font-label", heading === "Actions" && "sr-only")}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={frame === "phone" ? 3 : 5} className="px-4 py-10 text-center">
                    <Inbox size={16} strokeWidth={1.5} aria-hidden className="mx-auto text-muted" />
                    <p className="mt-2 font-body-strong">No requests match</p>
                    <p className="font-caption">Clear a filter or try another name.</p>
                  </td>
                </tr>
              ) : (
                visible.map((row) => (
                  <tr key={row.id} className="h-[var(--size-table-row)] border-t border-border hover:bg-muted-surface">
                    <th scope="row" className="px-4 text-left font-body-strong font-medium">
                      {row.name}
                      <span className="mt-0.5 block font-caption font-normal">{row.handle}</span>
                    </th>
                    <td className="px-4">
                      <span className={cn("inline-flex h-5 items-center rounded-pill px-2 font-caption-strong", statusTone[row.status])}>{row.status}</span>
                    </td>
                    {frame === "phone" ? null : (
                      <>
                        <td className="px-4 font-body tabular-nums">{row.gmv}</td>
                        <td className="px-4 font-caption">{row.updated}</td>
                      </>
                    )}
                    <td className="px-4 text-right">
                      <Button size="sm" variant="outline" onClick={() => { setActive(row); setNote(""); }}>
                        Review
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {decision ? <p className="font-caption">Last decision: {decision}</p> : null}
      </div>

      <Dialog
        open={active !== null}
        onOpenChange={(next) => {
          if (!next) setActive(null);
        }}
        title={active ? `Review ${active.name}` : "Review request"}
        description={active ? `${active.handle} · ${active.gmv} GMV in this window.` : undefined}
        secondaryAction={{ label: "Not now", onClick: () => setActive(null) }}
        primaryAction={{
          label: "Approve",
          onClick: () => {
            if (active) setDecision(`Approved ${active.name}${note ? ` — ${note}` : ""}`);
            setActive(null);
          },
        }}
      >
        <Input label="Note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Optional note for the team" />
      </Dialog>
    </div>
  );
}
