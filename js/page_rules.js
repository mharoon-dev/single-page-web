const PAGE_RULES = [
  {
    aid: ['4976747', '5298444','5690624','6181925','6661834'],
    href: 'https://assets.webmk.co/windsor-chabad/2020-campaign/script.js',
    type: 'script',
  },
  {
    aid: ['7093881'],
    href: 'https://cdn.webmk.co/windsor-chabad/campaign-2025/script.js?v',
    type: 'script',
  },
];

const SECTION_RULES = [
  {
    sectionId: 5473729,
    href: 'https://webmk.co/sites/holidays/passover/passover-v2.css',
    type: 'style',
  },
  {
    sectionId: 5473729,
    href: 'https://webmk.co/sites/holidays/passover/passover-cdo.css',
    type: 'style',
  },
  {
    sectionId: 5473729,
    href: 'https://webmk.co/sites/holidays/passover/passover-script.js',
    type: 'script',
  },
];

function pageSpecificStyling(url) {
  const styles = document.createElement('link');
  styles.rel = 'stylesheet';
  styles.type = 'text/css';
  styles.media = 'screen';
  styles.href = url;
  document.getElementsByTagName('head')[0].appendChild(styles);
}

function pageSpecificJs(url) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
}

function injectAsset(rule) {
  if (rule.type === 'script') {
    pageSpecificJs(rule.href);
  } else if (rule.type === 'style') {
    pageSpecificStyling(rule.href);
  } else if (rule.type === 'redirect') {
    window.location.href = rule.href;
  }
}

const ruleCheck = (rule) => {
  if (Array.isArray(rule.aid)) {
    return rule.aid.some((aid) => window.location.href.indexOf(aid) !== -1);
  } else {
    return window.location.href.indexOf(rule.aid) !== -1;
  }
}

PAGE_RULES.forEach((rule) => {
  const ruleMatches = ruleCheck(rule);
  if (ruleMatches) {
    injectAsset(rule);
  }
});

function sectionRuleInjection() {
  const scopeAids = document.querySelector("meta[name='scope-aids']")?.content;
  SECTION_RULES.forEach((rule) => {
    if (scopeAids?.includes(rule.sectionId)) {
      injectAsset(rule);
    }
  });
}

if (document.readyState !== 'loading') {
  sectionRuleInjection();
} else {
  document.addEventListener('DOMContentLoaded', sectionRuleInjection);
}
