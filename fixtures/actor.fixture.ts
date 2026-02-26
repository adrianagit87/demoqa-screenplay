import { test as base, type Page } from '@playwright/test';
import { Actor } from '../screenplay/core/Actor';
import { BrowseTheWeb } from '../screenplay/abilities/BrowseTheWeb';

interface ActorFixtures {
  actor: Actor;
}

export const test = base.extend<ActorFixtures>({
  actor: async ({ page }: { page: Page }, use: (actor: Actor) => Promise<void>) => {
    // Block known ad/tracker domains
    await page.route(
      /(googlesyndication|doubleclick|googletagmanager|adservice|amazon-adsystem|adnxs|outbrain|taboola|criteo|moatads|pubmatic|rubiconproject|openx|scorecardresearch|quantserve|chartbeat|adsafeprotected)/,
      route => route.abort()
    );

    // Remove fixed ad overlays and iframes as soon as they appear in the DOM
    await page.addInitScript(() => {
      const removeAds = () => {
        document.querySelectorAll(
          '#fixedban, iframe[id^="aswift"], [id^="google_ads_iframe"], .adsbygoogle, [class*="ad-slot"]'
        ).forEach(el => {
          const elem = el as HTMLElement;
          elem.style.display = 'none';
          elem.style.pointerEvents = 'none';
        });
      };
      new MutationObserver(removeAds).observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
      document.addEventListener('DOMContentLoaded', removeAds);
    });

    const actor = Actor.named('QA').whoCan(BrowseTheWeb.using(page));
    await use(actor);
  },
});

export { expect } from '@playwright/test';
