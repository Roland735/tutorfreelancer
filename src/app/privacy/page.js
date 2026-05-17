"use client";

import Link from "next/link";
import { ArrowLeft, GraduationCap, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.16),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#0f172a_48%,_#111827_100%)]" />
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400/35 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to signup
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-100">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
            Legal placeholder
          </div>
        </div>

        <Card className="border border-white/12 bg-white/10 shadow-[0_24px_80px_rgba(2,6,23,0.55)] backdrop-blur-2xl">
          <CardContent className="space-y-6 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-sky-400 to-emerald-300 text-slate-950">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">TutorFreelancer</p>
                <h1 className="text-3xl font-semibold text-white">Privacy Policy</h1>
              </div>
            </div>

            <p className="text-sm leading-7 text-slate-300">
              This placeholder page keeps the signup journey complete and avoids broken links.
              Replace it with your production privacy policy before launch.
            </p>

            <div className="space-y-4 text-sm leading-7 text-slate-300">
              <p>
                TutorFreelancer collects account details such as name, email, role, university,
                city, languages, and onboarding preferences so the platform can create user
                accounts, improve trust, personalize student or tutor experiences, and support
                future verification workflows.
              </p>
              <p>
                Platform data should be stored securely, processed only for legitimate academic
                marketplace operations, and shared only where necessary for authentication,
                compliance, moderation, and service delivery.
              </p>
              <p>
                Add your final policies for data retention, cookies, third-party providers, user
                rights, contact information, and deletion requests here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
