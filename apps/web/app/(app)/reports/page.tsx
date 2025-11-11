"use client";

import { useEffect, useState } from "react";
import { Card } from "@sandbox/ui";
import { api } from "@/lib/api";

interface Report {
  id: string;
  reason: string;
  createdAt: string;
  reporter: { name: string };
  targetUser: { name: string };
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    async function load() {
      const res = await api.get("/api/reports");
      setReports(res.data);
    }
    load();
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">Reports</h1>
      <div className="space-y-3">
        {reports.map((report) => (
          <Card key={report.id} className="bg-white/90">
            <p className="text-sm text-slate-600">
              <strong>{report.reporter.name}</strong> reported <strong>{report.targetUser.name}</strong>
            </p>
            <p className="text-sm text-slate-500">Reason: {report.reason}</p>
            <p className="text-xs text-slate-400">{new Date(report.createdAt).toLocaleString()}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
