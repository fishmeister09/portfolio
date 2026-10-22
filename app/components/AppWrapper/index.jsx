"use client";
import styles from "./AppWrapper.module.css";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import Printer from "../Printer";
import Barcode from "../Barcode";
import { Quote, Row, Section, ToggleRow } from "../Receipt/parts";
import { profile, quote } from "../../data/profile";
import projectsData from "../../project/projects-data.json";
import {
  isSoundOn,
  playFeed,
  playTear,
  setSound,
  subscribeSound,
} from "../../lib/sound";

gsap.registerPlugin(useGSAP);

// The bottom of the paper rolls toward the viewer. Each strip is nested in the
// previous one and tilts a little further, so together they trace an arc that
// tightens toward the tip, the way real paper curls.
const CURL_DEGREES = 5;
const BEND = [0.3, 0.5, 0.7, 0.9, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6];
// Tone per strip edge: the bend dips into shadow, the crest catches the light.
const SHADE = [0, 0.015, 0.03, 0.045, 0.05, 0.04, 0.01, -0.03, -0.04, 0, 0.05];

// Feed keyframes ported from the reference printer: ten smooth bursts with a
// short pause between each, as a percentage of the distance travelled.
const FEED_DURATION = 1.75;
const FEED_PERCENT = [-91, -91, -81, -81, -70, -70, -58, -58, -45, -45, -32, -32, -20, -20, -10, -10, -3, -3, 0];
const FEED_TIMES = [0, 0.075, 0.105, 0.18, 0.21, 0.285, 0.315, 0.39, 0.42, 0.495, 0.525, 0.6, 0.63, 0.705, 0.735, 0.81, 0.84, 0.915, 0.945, 1];

const FEED_BURSTS = FEED_PERCENT.flatMap((percent, i) => {
  const from = i === 0 ? -100 : FEED_PERCENT[i - 1];
  return percent === from
    ? []
    : [[FEED_TIMES[i] * FEED_DURATION, FEED_TIMES[i + 1] * FEED_DURATION]];
});

const tone = (shade) =>
  shade >= 0
    ? `rgba(0, 0, 0, ${shade})`
    : `rgba(255, 255, 255, ${-shade * 6})`;

const Curl = () => {
  let strip = null;
  for (let i = BEND.length - 1; i >= 0; i--) {
    strip = (
      <div
        className={`${styles.strip} ${i === BEND.length - 1 ? styles.tear : ""}`}
        style={{
          "--bend": BEND[i],
          "--tone-from": tone(SHADE[i]),
          "--tone-to": tone(SHADE[i + 1]),
        }}
      >
        {strip}
      </div>
    );
  }
  return (
    <div className={styles.curl} aria-hidden="true">
      {strip}
    </div>
  );
};

const SECTIONS = [
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

const slugs = Object.keys(projectsData);

// Printed on the receipt under the masthead: section jumps on the home page,
// back and next on a project page.
const navFor = (pathName) => {
  if (!pathName.startsWith("/project/")) return SECTIONS;
  const slug = pathName.split("/").pop();
  const next = slugs[(slugs.indexOf(slug) + 1) % slugs.length];
  return [
    { href: "/#projects", label: "← All projects" },
    ...(next !== slug
      ? [{ href: `/project/${next}`, label: `${projectsData[next].title} →` }]
      : []),
  ];
};

const formatDate = (date) =>
  date
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(",", " ·");

export default function AppWrapper({ children }) {
  const stageRef = useRef(null);
  const pathName = usePathname();
  const router = useRouter();
  const [printing, setPrinting] = useState(true);
  const [printedAt, setPrintedAt] = useState("");
  const [sound, setSoundState] = useState(false);

  useEffect(() => {
    setSoundState(isSoundOn());
    return subscribeSound(setSoundState);
  }, []);

  // Leaving for another page tears this receipt off at the slot, then the
  // printer prints the next one.
  useEffect(() => {
    const stage = stageRef.current;
    const onClick = (event) => {
      const link = event.target.closest("a[href]");
      if (!link || event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (link.target === "_blank" || link.hasAttribute("download")) return;
      const url = new URL(link.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Stop Next's <Link> from navigating before the tear plays.
      event.preventDefault();
      event.stopPropagation();
      playTear();
      const receipt = stage.querySelector("[data-receipt]");
      gsap.to(receipt, {
        y: "+=80",
        rotation: -2,
        opacity: 0,
        duration: 0.45,
        ease: "power2.in",
        onComplete: () => router.push(url.pathname + url.hash),
      });
    };
    stage.addEventListener("click", onClick, true);
    return () => stage.removeEventListener("click", onClick, true);
  }, [router]);

  useEffect(() => {
    // Every load prints from the top, so the browser restoring the old scroll
    // position would fight us mid-print. Take it over, and jump instantly:
    // the page's smooth scroll-behavior is for section links, not this.
    window.history.scrollRestoration = "manual";
    // Honour section links like /#contact; otherwise start at the top.
    const target = window.location.hash && document.querySelector(window.location.hash);
    if (target) target.scrollIntoView({ behavior: "instant" });
    else window.scrollTo({ top: 0, behavior: "instant" });
    setPrintedAt(formatDate(new Date()));
  }, [pathName]);

  useGSAP(
    () => {
      const receipt = stageRef.current.querySelector("[data-receipt]");
      // Hand control from the CSS fallback over to GSAP.
      receipt.removeAttribute("data-printing");

      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        ({ conditions }) => {
          gsap.set(receipt, { opacity: 1, rotation: 0 });
          // Arriving at a section link (/#contact): show the finished receipt
          // rather than printing it out of view.
          const landedOnSection =
            window.location.hash && document.querySelector(window.location.hash);
          if (conditions.reduce || landedOnSection) {
            gsap.set(receipt, { y: 0, "--curl": CURL_DEGREES });
            setPrinting(false);
            return;
          }

          // A long receipt only feeds the part you can see; past that it
          // would just blur through the slot.
          const travel = Math.min(receipt.offsetHeight, window.innerHeight * 1.2);

          setPrinting(true);
          const stopSound = playFeed(FEED_BURSTS);
          const tl = gsap
            .timeline({ onComplete: () => setPrinting(false) })
            .set(receipt, { y: 2 - travel, "--curl": 0 });
          FEED_PERCENT.forEach((percent, i) => {
            tl.to(receipt, {
              y: (percent / 100) * travel,
              duration: (FEED_TIMES[i + 1] - FEED_TIMES[i]) * FEED_DURATION,
              ease: "none",
              force3D: true,
            });
          });
          tl
            // Freshly printed paper relaxes into its curl.
            .to(receipt, {
              "--curl": CURL_DEGREES,
              duration: 0.9,
              ease: "elastic.out(1, 0.5)",
            }, "-=0.25");

          // The page is its final height while the paper is still sliding up,
          // so scrolling mid-print shows it moving under you. If the visitor
          // starts scrolling, finish the print at once instead.
          const SCROLL_KEYS = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "];
          const finish = (event) => {
            if (event.type === "keydown" && !SCROLL_KEYS.includes(event.key)) return;
            tl.progress(1);
            stop();
          };
          const stop = () => {
            stopSound();
            window.removeEventListener("wheel", finish);
            window.removeEventListener("touchmove", finish);
            window.removeEventListener("keydown", finish);
          };
          window.addEventListener("wheel", finish, { passive: true });
          window.addEventListener("touchmove", finish, { passive: true });
          window.addEventListener("keydown", finish);
          tl.eventCallback("onComplete", () => {
            stop();
            setPrinting(false);
          });
          return stop;
        }
      );
      return () => mm.revert();
    },
    { dependencies: [pathName], scope: stageRef }
  );

  return (
    <div ref={stageRef} className={styles.stage} id="top">
      <Printer printing={printing} />

      <div className={styles.feed}>
        <div className={styles.slotShadow} aria-hidden="true" />
        <div className={styles.receipt} data-receipt data-printing="true">
          <div className={styles.paper}>
            <header className={styles.header}>
              <h1 className={styles.name}>{profile.name}</h1>
              <p className={styles.role}>
                {profile.role} · {profile.location}
              </p>
              <p className={styles.tagline}>{profile.tagline}</p>
              <nav className={styles.nav} aria-label="Receipt">
                {navFor(pathName).map(({ href, label }, i) => (
                  <React.Fragment key={href}>
                    {i > 0 && <span aria-hidden="true">·</span>}
                    {href.startsWith("#") ? (
                      <a href={href}>{label}</a>
                    ) : (
                      <Link href={href}>{label}</Link>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            </header>

            {children}

            <Section title="Note">
              <Quote quote={quote.text} author={quote.author} href={quote.href} />
            </Section>

            <Section>
              <Row label="Date" value={printedAt || "—"} />
              <Row label="Page" value={pathName} />
              <ToggleRow label="Printer sound" on={sound} onToggle={() => setSound(!sound)} />
              <Row label="Back to top" value="↑" href="#top" />
            </Section>

            <div className={styles.end}>
              <Barcode value={`fishmeister${pathName === "/" ? "/home" : pathName}`} />
              <a
                href="/arjun-sethi-resume.pdf"
                download
                className={styles.qr}
                aria-label="Scan for resume (download PDF)"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/qr-resume.svg" alt="" width={84} height={84} />
                <span>Scan for resume</span>
              </a>
              <p className={styles.thanks}>*** Thank you for visiting ***</p>
            </div>
          </div>
          <Curl />
        </div>
      </div>
    </div>
  );
}
