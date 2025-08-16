'use client';

import { Dialer } from "@/components/dialer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone } from "lucide-react";

export default function LiveCallPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Live Call</h1>
        <p className="text-muted-foreground">Make calls and manage live conversations with real-time transcription.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Phone className="h-6 w-6" />
            Call Interface
          </CardTitle>
          <CardDescription>
            Initiate calls, view live transcription, and manage active conversations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialer />
        </CardContent>
      </Card>
    </div>
  );
}
