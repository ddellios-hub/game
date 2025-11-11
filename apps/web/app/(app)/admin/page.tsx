"use client";

import { useEffect, useState } from "react";
import { Button, Card } from "@sandbox/ui";
import { api } from "@/lib/api";

interface ReportItem {
  id: string;
  reason: string;
  status: string;
  targetUserId: string;
  targetUser: { name: string };
}

export default function AdminPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function loadReports() {
    const res = await api.get("/api/reports");
    setReports(res.data);
  }

  useEffect(() => {
    loadReports();
  }, []);

  async function handleBan(reportId: string) {
    setLoadingId(reportId);
    await api.post(`/api/reports/${reportId}/ban`, {
      reason: "Toxic behaviour",
      durationMinutes: 60,
      actorId: "admin"
    });
    await loadReports();
    setLoadingId(null);
  }

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">Moderation dashboard</h1>
      <div className="space-y-3">
        {reports.map((report) => (
          <Card key={report.id} className="bg-white/90" title={report.targetUser.name}>
            <p className="text-sm text-slate-600">Reason: {report.reason}</p>
            <p className="text-xs text-slate-400">Status: {report.status}</p>
            <Button
              variant="outline"
              className="mt-2"
              disabled={loadingId === report.id}
              onClick={() => handleBan(report.id)}
            >
              {loadingId === report.id ? "Applying..." : "Soft ban 60 min"}
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}
