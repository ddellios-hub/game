"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button, Card } from "@sandbox/ui";
import { api } from "@/lib/api";

interface ReportUserDialogProps {
  reporterId: string;
  targetUserId: string;
}

export function ReportUserDialog({ reporterId, targetUserId }: ReportUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("Unsportsmanlike conduct");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    await api.post("/api/reports", { reporterId, targetUserId, reason });
    setStatus("Report submitted");
    setLoading(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="outline">Report</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/30 backdrop-blur" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white" title="Report player">
            <label className="text-sm font-medium text-slate-600" htmlFor="reason">
              Reason
              <textarea
                id="reason"
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none"
                rows={3}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />
            </label>
            {status && <p className="text-sm text-success">{status}</p>}
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Submit report"}
              </Button>
            </div>
          </Card>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
