import type { NavItem, Social } from "../data/site.ts";

/** Home is 00 so the rest match the on-page section labels (About 01 … Contact 06). */
export const menuItems = (nav: NavItem[]) =>
  nav.map((n, i) => ({ number: String(i).padStart(2, "0"), label: n.label, href: n.href }));

/** Only socials with a real URL; unconfirmed ones (TODO in site data) never render as dead links. */
export const menuSocials = (socials: Social[]) =>
  socials.flatMap((s) => (s.href ? [{ label: s.label, href: s.href }] : []));
