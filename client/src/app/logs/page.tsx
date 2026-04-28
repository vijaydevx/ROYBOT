"use client";

import { PageLayout } from "@/components/PageLayout";
import { ListTodo } from "lucide-react";

export default function LogsPage() {
  return (
    <PageLayout title="System Logs" subtitle="Historical Event Records">
      <div className="h-full flex flex-col items-center justify-center text-s-text-muted">
         <div className="p-8 rounded-[3rem] bg-s-card/30 border border-s-border flex flex-col items-center gap-4">
            <ListTodo size={48} className="opacity-20" />
            <h2 className="text-xl font-black uppercase tracking-[0.3em] opacity-40 text-center text-white">Log Archive<br/><span className="text-xs">Coming Soon in v2.1</span></h2>
         </div>
      </div>
    </PageLayout>
  );
}
