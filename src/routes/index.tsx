import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Handshake,
  Instagram,
  Mail,
  MessageCircle,
  PlayCircle,
  Presentation,
  UserRound,
  Users,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kodeflux — Micro-SaaS Tools for Solo Founders" },
      {
        name: "description",
        content:
          "Kodeflux is a micro-SaaS lab: six business tools for solo founders, freelancers and side-hustlers. Free to try, no signup required.",
      },
      {
        property: "og:title",
        content: "Kodeflux — Micro-SaaS Tools for Solo Founders",
      },
      {
        property: "og:description",
        content:
          "Six tools, one ecosystem. Systems built from real experience in hospitality, agencies, rentals and trading.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const tools = [
  {
    name: "Kapsule Tools",
    desc: "For agencies, freelancers, and content creators who manage multiple clients.",
    href: "https://social-io.netlify.app/",
  },
  {
    name: "Kashflow Tools",
    desc: "For multi-income earners who want to know where the money actually goes.",
    href: "https://budget-tools.netlify.app/",
  },
  {
    name: "Kluster Tools",
    desc: "For rental owners and side hustlers turning assets into steady income.",
    href: "https://rental-io.netlify.app/",
  },
  {
    name: "Konsole Tools",
    desc: "For active traders in forex or crypto who want discipline over noise.",
    href: "https://trader-tools.netlify.app/",
  },
  {
    name: "Kubicle Tools",
    desc: "For coaches, trainers and mentors running structured programs.",
    href: "https://mentor-io.netlify.app/",
  },
  {
    name: "Kruiser Tools",
    desc: "For travelers, guides and tour operators planning trips, itineraries and experiences.",
    href: "https://travel-tools.netlify.app/",
  },
];

const learn = [
  {
    icon: PlayCircle,
    title: "E-Mini Course",
    desc: "Short, focused video lessons on running each business type. Practical, no fluff.",
    flagship: false,
  },
  {
    icon: BookOpen,
    title: "E-Playbook",
    desc: "Industry-specific written guides — pricing, operations, and growth frameworks you can apply today.",
    flagship: false,
  },
  {
    icon: Users,
    title: "Membership",
    desc: "Private community access, monthly live sessions, and early access to every new tool.",
    flagship: true,
  },
];

const programs = [
  {
    icon: Presentation,
    title: "Webinar Mastery",
    desc: "Live group sessions on specific business challenges.",
  },
  {
    icon: UserRound,
    title: "Private Mentoring",
    desc: "Direct mentoring for your specific business situation.",
  },
  {
    icon: Handshake,
    title: "Affiliate Program",
    desc: "Earn by sharing tools you actually use.",
  },
];

function Nav() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="text-lg font-extrabold tracking-tight">
          Kodeflux<span className="text-primary">.</span>
        </a>
        <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#tools" className="transition-colors hover:text-foreground">
            Tools
          </a>
          <a href="#learn" className="transition-colors hover:text-foreground">
            Learn
          </a>
          <a href="#community" className="transition-colors hover:text-foreground">
            Community
          </a>
        </div>
        <a
          href="#tools"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Try the tools
        </a>
      </nav>
    </header>
  );
}

function SectionHeader({
  eyebrow,
  headline,
}: {
  eyebrow: string;
  headline: string;
}) {
  return (
    <Reveal className="glow-soft mx-auto max-w-2xl text-center">
      <p className="mono-label relative">{eyebrow}</p>
      <h2 className="relative mt-4 text-3xl leading-[1.05] sm:text-4xl md:text-5xl">
        {headline}
      </h2>
    </Reveal>
  );
}

function Landing() {
  return (
    <div id="top" className="dark min-h-screen bg-background text-foreground">
      <Nav />

      {/* HERO */}
      <section className="glow-hero relative overflow-hidden pt-36 pb-24 sm:pt-44 sm:pb-32">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-4xl px-5 text-center">
          <Reveal>
            <p className="mono-label">Micro-SaaS Lab</p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 text-4xl leading-[1.03] sm:text-6xl md:text-7xl">
              A pack of tools for self-made entrepreneurs, solo founders and
              side-hustlers — <span className="text-primary">one hub.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mx-auto mt-7 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Built on real experience across hospitality, creative agencies,
              rentals, and trading. Not theory — systems that actually run
              businesses.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#tools"
                className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
              >
                Explore the tools
              </a>
              <a
                href="#community"
                className="w-full rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-border-strong hover:bg-secondary sm:w-auto"
              >
                Join the community
              </a>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <p className="mt-8 font-mono text-xs tracking-wider text-muted-foreground">
              6 tools live · Free to try · No signup required
            </p>
          </Reveal>
        </div>
      </section>

      {/* TOOLS */}
      <section id="tools" className="scroll-mt-20 px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeader eyebrow="The Toolkit" headline="Six tools. One ecosystem." />
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool, i) => (
              <Reveal
                as="li"
                key={tool.name}
                delay={i * 70}
                className="surface-card flex flex-col p-5"
              >
                <h3 className="text-xl">{tool.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {tool.desc}
                </p>
                <div className="tool-screenshot mt-5" />
                <a
                  href={tool.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                >
                  Try it free
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* LEARN */}
      <section id="learn" className="scroll-mt-20 px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow="Level Up"
            headline="Learn the systems behind the tools."
          />
          <ul className="mt-14 grid gap-6 md:grid-cols-3">
            {learn.map((item, i) => (
              <Reveal
                as="li"
                key={item.title}
                delay={i * 80}
                className={cn(
                  "surface-card flex flex-col p-6",
                  item.flagship && "card-flagship",
                )}
              >
                <item.icon
                  className={cn(
                    "size-6",
                    item.flagship ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <h3 className="mt-5 text-xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
                <span className="mt-6 w-fit rounded-full border border-border px-3 py-1 font-mono text-[0.65rem] tracking-[0.16em] text-muted-foreground uppercase">
                  Coming soon
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* MORE PROGRAMS */}
      <section className="px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeader eyebrow="Also Coming" headline="Go deeper, together." />
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {programs.map((item, i) => (
              <Reveal
                as="li"
                key={item.title}
                delay={i * 70}
                className="surface-card flex items-start gap-4 p-5"
              >
                <span className="rounded-lg border border-border bg-secondary p-2.5">
                  <item.icon className="size-5 text-primary" />
                </span>
                <span>
                  <h3 className="text-base">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* FLUXMAN */}
      <section className="px-5 py-10">
        <Reveal className="mx-auto flex max-w-6xl flex-col gap-3 rounded-xl border border-border bg-secondary/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
            <span className="font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
              Series
            </span>
            <p className="text-sm text-muted-foreground">
              Fluxman — stories every entrepreneur, founder and hustler can
              relate to.
            </p>
          </div>
          <a
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Watch on YouTube →
          </a>
        </Reveal>
      </section>

      {/* COMMUNITY / FOOTER */}
      <footer id="community" className="scroll-mt-20">
        <div className="glow-warm relative overflow-hidden px-5 py-24 sm:py-32">
          <Reveal className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-3xl sm:text-5xl">Join the community!</h2>
            <p className="mt-4 text-base text-muted-foreground">
              Tutorials, e-courses &amp; industry playbooks — coming soon!
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              {[
                {
                  icon: Instagram,
                  href: "https://www.instagram.com/kode.flux",
                  label: "Instagram",
                },
                {
                  icon: MessageCircle,
                  href: "https://wa.me/6282299988720",
                  label: "WhatsApp",
                },
                {
                  icon: Mail,
                  href: "mailto:hello@kodeflux.com",
                  label: "Email",
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="rounded-xl border border-border bg-secondary/50 p-3 text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-border-strong hover:text-primary"
                >
                  <s.icon className="size-5" />
                </a>
              ))}
            </div>
          </Reveal>
        </div>
        <div className="border-t border-border px-5 py-6">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 font-mono text-xs text-muted-foreground sm:flex-row">
            <span>© Kodeflux 2026. All rights reserved.</span>
            <span>Made in Bali</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
