
'use client';

import { AssistantCard } from "@/components/assistant-card";
import { CallLogTable } from "@/components/call-log-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold font-headline">Welcome to your Dashboard</h1>
        <p className="text-muted-foreground">Here's a quick overview of your business.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AssistantCard />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Recent Calls</CardTitle>
                  <CardDescription>An overview of your most recent call activities.</CardDescription>
              </CardHeader>
              <CardContent>
                  <CallLogTable />
              </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
