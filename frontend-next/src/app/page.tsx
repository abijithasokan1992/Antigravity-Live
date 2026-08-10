'use client';

import Link from 'next/link';
import {
  AudioLines,
  Captions,
  Clapperboard,
  FileCheck2,
  Film,
  Image as ImageIcon,
  Languages,
  Scissors,
  Sparkles,
  Tv,
  WalletCards,
} from 'lucide-react';

const salesEmail = 'support-bridge@crayonspictures.com';
const representationPayLink = 'https://rzp.io/rzp/SbC2Zpe';

const services = [
  {
    title: 'AI Dubbing',
    description: 'Rights-controlled dubbing workflow with transcription, translation, subtitle timing, authorised voice workflow, QC and export.',
    icon: AudioLines,
    href: '/ai-studio',
    action: 'Open service',
    status: 'Operator-assisted',
  },
  {
    title: 'AI Subtitles & Translation',
    description: 'Transcript, translated subtitles, SRT/VTT delivery and QC for Malayalam, English, Hindi, Tamil and Telugu workflows.',
    icon: Captions,
    href: `mailto:${salesEmail}?subject=${encodeURIComponent('StreamVista AI Subtitles service request')}`,
    action: 'Request job',
    status: 'Available by project',
  },
  {
    title: 'Audio Description',
    description: 'Accessibility-focused audio-description preparation with human review and project-based delivery.',
    icon: Languages,
    href: `mailto:${salesEmail}?subject=${encodeURIComponent('StreamVista Audio Description service request')}`,
    action: 'Request job',
    status: 'Human-approved output',
  },
  {
    title: 'AI Editing & Post Support',
    description: 'Edit preparation, media cleanup, conform support, subtitles, metadata and post-production packaging.',
    icon: Scissors,
    href: '/processing',
    action: 'Open workflow',
    status: 'Hybrid service',
  },
  {
    title: 'Image / Poster Generation',
    description: 'Film posters, pitch visuals, buyer artwork, social creatives and catalogue presentation assets.',
    icon: ImageIcon,
    href: 'https://streamvista-design-studio.vercel.app',
    action: 'Open Design Studio',
    status: 'Design service',
  },
  {
    title: 'OTT / TV Delivery Package',
    description: 'Master, subtitle, metadata, rights-manifest and QC package preparation for platform or broadcaster delivery workflows.',
    icon: FileCheck2,
    href: '/packaging',
    action: 'Open packaging',
    status: 'Destination-ready prep',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4 pb-12">
      <section className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="max-w-3xl space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-4 w-4" /> StreamVista AI Media Services
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[0.95]">
            Turn film and media work into <span className="gradient-text">paid production services.</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-lg leading-relaxed max-w-2xl">
            AI-assisted dubbing, subtitles, audio description, editing support, image generation, delivery packaging and film representation — operated by StreamVista and the Crayons network with rights and human approval gates.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={`mailto:${salesEmail}?subject=${encodeURIComponent('StreamVista AI Media Services — paid project enquiry')}`}
              className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-sm transition-colors"
            >
              Start a paid project
            </a>
            <a
              href={representationPayLink}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm transition-colors inline-flex items-center gap-2"
            >
              <WalletCards className="h-4 w-4" /> Activate Film Representation — ₹25,000 + GST
            </a>
          </div>
          <p className="text-[11px] text-slate-500">
            Payment CTA above is only for the existing Crayons Bridge representation activation offer. Other services are quoted per project before payment.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Services</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Sell what we already know how to operate.</h2>
          </div>
          <a href={`mailto:${salesEmail}`} className="text-sm font-bold text-cyan-300 hover:text-cyan-200">Commercial enquiries →</a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => {
            const Icon = service.icon;
            const external = service.href.startsWith('http') || service.href.startsWith('mailto:');
            const card = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 grid place-items-center">
                    <Icon className="h-5 w-5 text-cyan-300" />
                  </div>
                  <span className="text-[10px] rounded-full border border-white/10 px-2.5 py-1 text-slate-400">{service.status}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-white">{service.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-400">{service.description}</p>
                </div>
                <span className="text-xs font-black text-cyan-300">{service.action} →</span>
              </>
            );

            const classes = 'glass-card p-5 rounded-2xl border border-white/10 space-y-4 block hover:border-cyan-500/40 transition-colors';
            return external ? (
              <a key={service.title} href={service.href} target={service.href.startsWith('http') ? '_blank' : undefined} rel={service.href.startsWith('http') ? 'noreferrer' : undefined} className={classes}>
                {card}
              </a>
            ) : (
              <Link key={service.title} href={service.href} className={classes}>
                {card}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/creator" className="glass-card p-5 rounded-2xl border border-white/10 space-y-3 block">
          <Clapperboard className="h-5 w-5 text-purple-300" />
          <h3 className="font-black text-white">Creator / Producer Intake</h3>
          <p className="text-xs text-slate-400">Bring the title, rights position and source material into the workflow.</p>
        </Link>
        <Link href="/buyer-portal" className="glass-card p-5 rounded-2xl border border-white/10 space-y-3 block">
          <Film className="h-5 w-5 text-emerald-300" />
          <h3 className="font-black text-white">Licensing & Buyer Workflow</h3>
          <p className="text-xs text-slate-400">Move rights-cleared titles into buyer evaluation and commercial discussion.</p>
        </Link>
        <Link href="/watch" className="glass-card p-5 rounded-2xl border border-white/10 space-y-3 block">
          <Tv className="h-5 w-5 text-red-300" />
          <h3 className="font-black text-white">Crayons Loop</h3>
          <p className="text-xs text-slate-400">Audience-facing distribution and paid access where the content and rights are ready.</p>
        </Link>
      </section>

      <footer className="pt-6 border-t border-white/10 text-xs text-slate-500 flex flex-col sm:flex-row justify-between gap-2">
        <span>STREAMVISTA (OPC) PRIVATE LIMITED · AI-assisted media production services</span>
        <span>Rights-controlled · Human-approved · Commercial terms confirmed per project</span>
      </footer>
    </div>
  );
}
