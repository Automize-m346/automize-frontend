'use client';

import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header showUserMenu={isAuthenticated} />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Ihre Automizen-Plattform
          </h1>
          <p className="text-2xl text-blue-600 font-semibold mb-8">
            für Ihre Konfigurationsdateien
          </p>
          <p className="text-lg text-slate-600 mb-12">
            Automatize ist dazu gebaut, Ihre Konfigurationsdateien schnell und einfach zu konfigurieren.
          </p>
          <div className="space-y-4">
            <Link href="/auth/sign-up">
              <Button size="lg" className="text-lg px-8 py-6">
                Jetzt Starten
              </Button>
            </Link>
            <p className="text-slate-600 text-sm">
              über 10000 Dateien bei ersten Einsendern bereitgestellt
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div>
              <div className="w-10 h-10 bg-blue-600 rounded-lg mb-4"></div>
              <p className="text-slate-600 text-sm">
                wir sind unterstützung automizen mit modernen und praktische 100-5000 Integrationen bei 6 Einsätzen.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">automatize-as46</h3>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>Sprache</li>
                <li>Chat</li>
                <li>Docs</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">User one</h3>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>Chat one</li>
                <li>Slack</li>
                <li>Plugin</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Support</h3>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>FAQ</li>
                <li>Support Ticket</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8">
            <p className="text-sm text-slate-600">
              support@automize.com<br />
              0719 786 23 38
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
