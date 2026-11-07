import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { LenisProvider } from '@/components/ui/LenisProvider';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { RouteTransition } from '@/components/ui/RouteTransition';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { TerminalDrawer } from '@/components/ui/TerminalDrawer';
import { AskYashChatbot } from '@/components/chat/AskYashChatbot';
import { profile } from '@/data/profile';

const spaceGrotesk = localFont({
  src: './fonts/SpaceGrotesk-Latin.woff2',
  weight: '500 700',
  variable: '--font-space-grotesk',
  display: 'swap',
});

const inter = localFont({
  src: './fonts/Inter-Latin.woff2',
  weight: '400 600',
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = localFont({
  src: './fonts/JetBrainsMono-Latin.woff2',
  weight: '400 600',
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const caveat = localFont({
  src: './fonts/Caveat-Latin.woff2',
  weight: '500 700',
  variable: '--font-caveat',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yashsigchi.dev';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name} — Software Engineer · AI/ML Engineer · Full-Stack Engineer`,
    template: `%s | ${profile.name}`,
  },
  description:
    'Portfolio of Yash Sigchi — Final-year B.Tech CSE (AI & ML) at VIT Chennai. I build backend systems that ship and AI that explains itself.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: `${profile.name} — Software Engineer · AI/ML Engineer`,
    description:
      "I build backend systems that ship and AI that explains itself. Final-year B.Tech CSE (AI & ML) at VIT Chennai.",
    siteName: profile.name,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: `${profile.name} Portfolio`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} — Software Engineer · AI/ML Engineer`,
    description:
      'I build backend systems that ship and AI that explains itself.',
    images: ['/og.png'],
  },
};

const jsonLdPerson = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  url: SITE_URL,
  email: profile.email,
  jobTitle: profile.targetRoles,
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: profile.university,
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Jaipur',
    addressRegion: 'Rajasthan',
    addressCountry: 'IN',
  },
  sameAs: [profile.github, profile.linkedin, profile.leetcode],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} ${caveat.variable} dark`}
    >
      <body className="bg-void text-primary antialiased selection:bg-violet/35 selection:text-primary">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:px-4 focus:py-2 focus:rounded-pill focus:bg-indigo focus:text-void focus:font-mono focus:text-xs focus:font-semibold"
        >
          Skip to main content
        </a>
        <div className="film-grain" aria-hidden="true" />
        <ScrollProgress />
        <CustomCursor />
        <CommandPalette />
        <TerminalDrawer />
        <AskYashChatbot />
        <LenisProvider>
          <RouteTransition>{children}</RouteTransition>
        </LenisProvider>
      </body>
    </html>
  );
}
