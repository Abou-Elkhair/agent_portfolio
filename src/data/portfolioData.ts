export type CaseSlug =
  | 'e-invest'
  | '7salty'
  | 'zabatha'
  | 'monsooq'
  | 'go-bus'
  | 'sas-vaya';

export type CaseCategory = 'all' | 'fintech' | 'enterprise' | 'consumer';

export interface PartnerItem {
  id: string;
  name: string;
  logo?: string;
  wordmark?: string;
  accent?: string;
  darkBg?: boolean;
}

export interface ScreenSlide {
  id: string;
  src: string;
  alt: string;
  title: string;
  caption: string;
  product?: string;
  format?: 'mobile' | 'web';
  category?: 'web' | 'mobile';
  accent?: string;
  wash?: string;
}

export interface CaseMetric {
  value: string;
  label: string;
  detail?: string;
}

export interface CaseStep {
  index: string;
  title: string;
  body: string;
}

export interface CaseStudy {
  slug: CaseSlug;
  number: string;
  domain: string;
  category: Exclude<CaseCategory, 'all'>;
  title: string;
  subtitle: string;
  headline: string;
  headlineItalic: string;
  lead: string;
  accent: string;
  wash: string;
  heroBg: string;
  meta: {label: string; value: string}[];
  previewScreens: {src: string; alt: string; role: 'left' | 'main' | 'right'}[];
  previewFormat: 'mobile' | 'web';
  brief: {
    eyebrow: string;
    heading: string;
    body: string;
    pillars: {label: string; text: string}[];
  };
  research?: {
    eyebrow: string;
    heading: string;
    body: string;
    findings: CaseStep[];
    note?: string;
  };
  legacyEvidence?: {
    eyebrow: string;
    heading: string;
    body: string;
    legacyShots: {src: string; alt: string; caption: string}[];
    signals: CaseStep[];
    reviewsLabel: string;
    reviews: {src: string; alt: string}[];
  };
  stats?: {
    eyebrow: string;
    heading: string;
    body: string;
    items: CaseMetric[];
    note?: string;
  };
  quotes?: {
    eyebrow: string;
    heading: string;
    items: {quote: string; cite: string}[];
  };
  strategy?: {
    eyebrow: string;
    heading: string;
    items: CaseStep[];
    table?: {
      headers: [string, string];
      rows: [string, string][];
    };
  };
  highlights?: {
    eyebrow: string;
    heading: string;
    points: string[];
    marketNote?: {eyebrow: string; heading: string; body: string};
  };
  webDirection?: {
    eyebrow: string;
    heading: string;
    body: string;
    domains: string[];
    principleHeading: string;
    principleBody: string;
  };
  reflection?: {
    eyebrow: string;
    heading: string;
    items: {title: string; body: string}[];
  };
  carouselHeading: {
    eyebrow: string;
    heading: string;
    body: string;
    note?: string;
  };
  screens: ScreenSlide[];
}

export interface CareerEntry {
  id: string;
  index: string;
  period: string;
  company: string;
  role: string;
  focusLabel: string;
  lede: string;
  points: string[];
  projects?: {name: string; summary: string}[];
}

export const PROFILE = {
  name: 'Abouelkhair Rady Mohamed',
  shortName: 'Abouelkhair Rady',
  role: 'Senior UI/UX Designer',
  year: '2026',
  linkedinUrl: 'https://www.linkedin.com/in/abou-elkhair/',
  cvUrl: '/cv.pdf',
  heroEyebrow: 'Selected Work · 2026',
  heroTitle: 'Complex products.',
  heroTitleItalic: 'Clear decisions.',
  heroLead:
    'I am Abouelkhair Rady, a Senior UI/UX Designer shaping trustworthy digital experiences across fintech, enterprise systems, and national-scale platforms.',
  availabilitySummary:
    'Research to shipped product experience across banking, analytics, governance, and consumer apps.',
  capabilities: [
    'UX Research & Usability Studies',
    'Product Strategy & Task Flows',
    'Complex UI Systems & Dashboards',
    'Mobile & Responsive Product Design',
  ],
};

export const PARTNERS: PartnerItem[] = [
  {id: 'dsme', name: 'DataScience Middle East', logo: '/images/partners/datascience-me.png'},
  {id: 'kn', name: 'KnowledgeNet', logo: '/images/partners/knowledge-net.png'},
  {id: 'scatus', name: 'Scatus Technologies', logo: '/images/partners/scatus.png'},
  {id: 'caspian', name: 'Caspian DS', logo: '/images/partners/caspian-ds.png'},
  {id: 'devnile', name: 'Devnile', logo: '/images/partners/devnile.png', darkBg: true},
  {id: 'lamha', name: 'Lamha App', logo: '/images/partners/lamha.png'},
  {id: 'spirutude', name: 'Spirutude LTD', logo: '/images/partners/spirutude.svg'},
  {id: 'adib', name: 'ADIB', logo: '/images/partners/adib.svg'},
  {id: 'fab', name: 'First Abu Dhabi Bank', logo: '/images/partners/fab-color.svg'},
  {id: 'mashreq', name: 'Mashreq', logo: '/images/partners/mashreq-color.svg'},
  {id: 'sab', name: 'Saudi Awwal Bank', logo: '/images/partners/sab.svg'},
  {id: 'enbd', name: 'Emirates NBD', logo: '/images/partners/emirates-nbd.svg'},
  {id: 'sico', name: 'SICO', logo: '/images/partners/sico.svg', darkBg: true},
  {id: 'riyad', name: 'Riyad Bank', logo: '/images/partners/riyad-bank.svg'},
  {id: 'exchange', name: 'Saudi Exchange', wordmark: 'Saudi Exchange', accent: '#007c86'},
  {id: 'deloitte', name: 'Deloitte', logo: '/images/partners/deloitte.png'},
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'e-invest',
    number: '01',
    domain: 'FinTech · Trading Platform',
    category: 'fintech',
    title: 'E-Invest',
    subtitle: 'Product Redesign',
    headline: 'Trust had to be',
    headlineItalic: 'rebuilt before trading.',
    lead: 'The redesign started with a legacy banking app, real customer complaints, and the decision to turn repeated friction into a clearer investment experience.',
    accent: '#103b9f',
    wash: '#e8efff',
    heroBg: '#0b2566',
    meta: [
      {label: 'Role', value: 'UX Research, Product Design, UI'},
      {label: 'Platforms', value: 'Mobile & Web'},
      {label: 'Scope', value: 'Trading, Portfolio & Order Flows'},
    ],
    previewFormat: 'mobile',
    previewScreens: [
      {src: '/images/einvest-stock.png', alt: 'E-Invest stock details screen', role: 'left'},
      {src: '/images/einvest-home.png', alt: 'E-Invest redesigned home screen', role: 'main'},
      {src: '/images/einvest-confirmation.png', alt: 'E-Invest order confirmation screen', role: 'right'},
    ],
    brief: {
      eyebrow: 'The Brief',
      heading: 'Not a new coat of paint. A new point of view.',
      body: 'The existing product supported the mechanics of trading, but customers struggled with the experience around it: portfolio visibility, chart precision, order management, and a reliable path through high-stakes actions.',
      pillars: [
        {label: 'Context', text: 'Legacy trading app already delivered to a regional bank'},
        {label: 'Challenge', text: 'Restore clarity without reducing market depth'},
        {label: 'Outcome', text: 'A unified decision framework across mobile and web'},
      ],
    },
    legacyEvidence: {
      eyebrow: 'The Starting Point',
      heading: 'The legacy app was already telling us what had to change.',
      body: 'The redesign did not begin with a visual direction. It began with the live product and the feedback customers left when access, portfolio visibility, precision, and trade control were failing.',
      legacyShots: [
        {
          src: '/images/einvest-legacy-portfolio.png',
          alt: 'Legacy E-Invest portfolio screen',
          caption: 'Legacy portfolio view',
        },
        {
          src: '/images/einvest-legacy-chart.png',
          alt: 'Legacy E-Invest market chart screen',
          caption: 'Legacy market detail',
        },
      ],
      signals: [
        {
          index: '01',
          title: 'Access failed before entry',
          body: 'Password and login issues broke customer confidence before they could view their holdings.',
        },
        {
          index: '02',
          title: 'Precision was not optional',
          body: 'Customers called out rounded chart values when exact share prices mattered.',
        },
        {
          index: '03',
          title: 'Portfolio visibility was incomplete',
          body: 'Users could not reliably track holdings, history, dividends, or dependable P&L context.',
        },
        {
          index: '04',
          title: 'Orders needed clearer control',
          body: 'Filtering, sorting, order status, and post-sale settlement needed explicit guidance.',
        },
      ],
      reviewsLabel: 'Original customer feedback from the legacy application that initiated the redesign',
      reviews: [
        {src: '/images/einvest-review-password.png', alt: 'Customer feedback about password login'},
        {src: '/images/einvest-review-holdings.png', alt: 'Customer feedback about missing shares'},
        {src: '/images/einvest-review-decimals.png', alt: 'Customer feedback about chart decimal precision'},
        {src: '/images/einvest-review-back.png', alt: 'Customer feedback about app closing and chart accuracy'},
        {src: '/images/einvest-review-interface.png', alt: 'Customer feedback on interface usability'},
        {src: '/images/einvest-review-chart.png', alt: 'Customer feedback about the chart experience'},
        {src: '/images/einvest-review-withdrawal.png', alt: 'Customer feedback about money after selling shares'},
        {src: '/images/einvest-review-analytics.png', alt: 'Customer feedback about analytics and historical data'},
        {src: '/images/einvest-review-compatibility.png', alt: 'Customer feedback on device compatibility'},
      ],
    },
    strategy: {
      eyebrow: 'Design Strategy',
      heading: 'From customer signal to a framework for confident decisions.',
      items: [
        {
          index: '01',
          title: 'Visibility before action',
          body: 'Put portfolio state, market movement, and order status where customers can evaluate them before trading.',
        },
        {
          index: '02',
          title: 'Precision by default',
          body: 'Respect financial data with exact decimal pricing, contextual charts, and readable performance signals.',
        },
        {
          index: '03',
          title: 'One coherent journey',
          body: 'Connect discovery, analysis, execution, and confirmation rather than scattering decisions across disconnected tabs.',
        },
      ],
      table: {
        headers: ['Customer Signal', 'Design Response'],
        rows: [
          [
            'Portfolio and account information lacked a clear hierarchy',
            'Designed a scannable home state with balance, market pulse, and direct portfolio shortcuts.',
          ],
          [
            'Market details were hard to interpret quickly',
            'Focused the stock view around exact price, change, chart range, and actionable trading depth.',
          ],
          [
            'High-stakes trade states needed reassurance',
            'Made order review and confirmation explicit, keeping fee, quantity, and settlement context visible.',
          ],
        ],
      },
    },
    webDirection: {
      eyebrow: 'The Web Direction',
      heading: 'Detail when it matters. Hierarchy everywhere.',
      body: 'The same decision framework extends to the desktop trading workspace: a high-density environment where navigation, order detail, charts, and market context remain legible.',
      domains: [
        'Markets & exact price context',
        'Portfolio & P&L visibility',
        'Order status & settlement control',
        'Execution detail & confirmation',
      ],
      principleHeading: 'Density without noise.',
      principleBody:
        'Information is deliberately grouped into stable areas of focus: navigation, market context, active position, and decision controls.',
    },
    reflection: {
      eyebrow: 'Reflection',
      heading: 'More than a visual refresh.',
      items: [
        {
          title: 'Customer feedback grounded',
          body: 'The work began with real customer pain points and turned those signals into an experience strategy.',
        },
        {
          title: 'System-wide consistency',
          body: 'Mobile and web follow one shared logic rather than becoming separate product stories.',
        },
        {
          title: 'Decision-led screens',
          body: 'Every screen is accountable to a moment where clarity, trust, or control matters.',
        },
      ],
    },
    carouselHeading: {
      eyebrow: 'Mobile Experience',
      heading: 'From onboarding to focused execution.',
      body: 'The redesigned mobile flow makes every stage legible: set up access, scan the market, analyze a symbol, and review the order before confirming.',
    },
    screens: [
      {
        id: 'ei-1',
        src: '/images/einvest-signup.png',
        alt: 'E-Invest account creation screen',
        title: '01 / Onboard',
        caption: 'A clear beginning for secure account access.',
        format: 'mobile',
      },
      {
        id: 'ei-2',
        src: '/images/einvest-dashboard.png',
        alt: 'E-Invest redesigned dashboard screen',
        title: '02 / Orient',
        caption: 'Portfolio, watchlist, and market signals in one home state.',
        format: 'mobile',
      },
      {
        id: 'ei-3',
        src: '/images/einvest-home.png',
        alt: 'E-Invest market and portfolio home screen',
        title: '03 / Discover',
        caption: 'Immediate starting point for market movers and holdings.',
        format: 'mobile',
      },
      {
        id: 'ei-4',
        src: '/images/einvest-market-details.png',
        alt: 'E-Invest market details screen',
        title: '04 / Read the market',
        caption: 'Market details organized for rapid scanning.',
        format: 'mobile',
      },
      {
        id: 'ei-5',
        src: '/images/einvest-stock.png',
        alt: 'E-Invest detailed market data and chart screen',
        title: '05 / Analyze',
        caption: 'Exact price context, charting, and depth working together.',
        format: 'mobile',
      },
      {
        id: 'ei-6',
        src: '/images/einvest-confirmation-full.png',
        alt: 'E-Invest trade confirmation screen',
        title: '06 / Confirm',
        caption: 'High-stakes execution states ask for deliberate final confirmation.',
        format: 'mobile',
      },
    ],
  },
  {
    slug: '7salty',
    number: '02',
    domain: 'FinTech · Micro-Savings',
    category: 'fintech',
    title: '7salty',
    subtitle: 'Savings Experience',
    headline: 'Micro-savings,',
    headlineItalic: 'made accessible.',
    lead: 'A micro-savings mobile application shaped around financial inclusion, trust barriers, and everyday saving habits for youth and low-income communities.',
    accent: '#087f72',
    wash: '#dff5ef',
    heroBg: '#0b4a42',
    meta: [
      {label: 'Role', value: 'UX Research, Product Design, UI'},
      {label: 'Platform', value: 'Mobile App (iOS & Android)'},
      {label: 'Scope', value: 'Discovery, Research & Core Flows'},
    ],
    previewFormat: 'mobile',
    previewScreens: [
      {src: '/images/7salty-history.png', alt: '7salty savings history screen', role: 'left'},
      {src: '/images/7salty-home.png', alt: '7salty mobile home screen', role: 'main'},
      {src: '/images/7salty-balance.png', alt: '7salty balance screen', role: 'right'},
    ],
    brief: {
      eyebrow: 'Project Overview',
      heading: 'A micro-savings product designed for financial inclusion.',
      body: '7salty was created to help a wider population save money and participate in the formal financial system without prohibitive minimums or eroding fees.',
      pillars: [
        {label: '50,000 LE', text: 'Maximum account balance cap tailored for micro-saving'},
        {label: '0 LE', text: 'Zero minimum balance required to open and maintain'},
        {label: 'Free', text: 'No hidden account or maintenance fees'},
      ],
    },
    research: {
      eyebrow: 'The Problem & Research',
      heading: 'Traditional saving tools exclude the people who need them most.',
      body: 'We ran 6 qualitative interviews (4 low-income users and 2 service providers) alongside 57 survey responses across ages 18–30—covering employees, students, housewives, and daily workers.',
      findings: [
        {
          index: '01',
          title: 'Minimum balance barriers',
          body: 'Low-income earners cannot keep capital locked behind conventional bank thresholds.',
        },
        {
          index: '02',
          title: 'Fee erosion',
          body: 'Monthly maintenance and transaction fees quickly wipe out small deposits.',
        },
        {
          index: '03',
          title: 'Weak saving incentives',
          body: 'Negligible returns on small balances give little emotional motivation to save.',
        },
        {
          index: '04',
          title: 'Service capacity',
          body: 'Traditional branches struggle to serve high-frequency micro-transactions profitably.',
        },
      ],
    },
    stats: {
      eyebrow: 'Survey Evidence',
      heading: 'The research made the trust gap measurable.',
      body: 'Three behavioral signals clarified where transparency, motivation, and familiar wallet mental models had to lead.',
      items: [
        {value: '44%', label: 'Did not trust online payments', detail: '25 of 57 survey participants'},
        {value: '57%', label: 'Saved outside banks', detail: '33 participants used informal means'},
        {value: '43%', label: 'Saved via bank accounts', detail: '24 participants held formal savings'},
      ],
      note: 'The product direction had to earn immediate trust, reward consistency, and make every pound movement transparent.',
    },
    quotes: {
      eyebrow: 'What We Heard',
      heading: 'Trust, control, and a reason to save.',
      items: [
        {
          quote: 'Confidence means knowing there is a responsible party that guarantees my money.',
          cite: 'Interview Participant',
        },
        {
          quote: 'I like to pay my bills online because of the convenience—when I trust it.',
          cite: 'Survey Respondent',
        },
        {
          quote: 'Every time I make a deposit, getting points or rewards motivates me to keep going.',
          cite: 'Interview Participant',
        },
      ],
    },
    strategy: {
      eyebrow: 'From Finding to Design',
      heading: 'Every insight translated into a concrete product decision.',
      items: [
        {
          index: 'Trust',
          title: 'Visible accountability',
          body: 'Surface reassuring institutional context and clear guarantees from the very first onboarding touchpoint.',
        },
        {
          index: 'Purpose',
          title: 'Goal-led saving',
          body: 'Support personal saving milestones and timely nudges so small deposits feel intentional.',
        },
        {
          index: 'Control',
          title: 'Full ledger clarity',
          body: 'Keep transaction history, fee transparency, and withdrawal requests effortless to inspect.',
        },
        {
          index: 'Reward',
          title: 'Habit reinforcement',
          body: 'Pair regular deposits with cash rewards and milestones to sustain momentum.',
        },
      ],
    },
    highlights: {
      eyebrow: 'The Solution',
      heading: 'Accessible, understandable, and rewarding.',
      points: [
        'No minimum balance',
        'No interest complexity',
        'Cash awards for regular saving',
        'Multi-channel cash in & out',
        'Built for everyday convenience',
      ],
      marketNote: {
        eyebrow: 'Market Context',
        heading: 'Meet people where their money already moves.',
        body: 'Competitive research benchmarked local wallets users already trusted—Vodafone Cash, BM Wallet, QNB Wallet, and MyFawry—to align transfer, deposit, and bill-pay expectations.',
      },
    },
    carouselHeading: {
      eyebrow: 'User App',
      heading: 'The product experience.',
      body: 'Key moments across daily saving actions, clear balance visibility, and transaction request history.',
    },
    screens: [
      {
        id: '7s-1',
        src: '/images/7salty-home.png',
        alt: 'Original 7salty home screen',
        title: '01 / Home',
        caption: 'Saving status, deposit rewards, and immediate next actions.',
        format: 'mobile',
      },
      {
        id: '7s-2',
        src: '/images/7salty-balance.png',
        alt: 'Original 7salty current balance screen',
        title: '02 / Current Balance',
        caption: 'An unambiguous view of available savings and goals.',
        format: 'mobile',
      },
      {
        id: '7s-3',
        src: '/images/7salty-history.png',
        alt: 'Original 7salty request history screen',
        title: '03 / Request History',
        caption: 'Past deposits and cash-out requests remain easy to verify.',
        format: 'mobile',
      },
    ],
  },
  {
    slug: 'zabatha',
    number: '03',
    domain: 'E-Commerce · Automotive Parts',
    category: 'consumer',
    title: 'Zabatha',
    subtitle: 'Commerce Redesign',
    headline: 'Find the right part.',
    headlineItalic: 'Without the friction.',
    lead: 'Usability testing and information architecture redesign simplifying how drivers match vehicle specs to verified automotive spare parts.',
    accent: '#c84e1d',
    wash: '#fff0e7',
    heroBg: '#27211e',
    meta: [
      {label: 'Role', value: 'UX Research, Usability Testing, UI'},
      {label: 'Platform', value: 'Mobile Commerce'},
      {label: 'Scope', value: 'Search, Vehicle Filters & PDP'},
    ],
    previewFormat: 'mobile',
    previewScreens: [
      {src: '/images/zabatha-search.png', alt: 'Zabatha automotive parts search screen', role: 'left'},
      {src: '/images/zabatha-home.png', alt: 'Zabatha storefront screen', role: 'main'},
      {src: '/images/zabatha-details.png', alt: 'Zabatha product detail screen', role: 'right'},
    ],
    brief: {
      eyebrow: 'Project Overview',
      heading: 'Make finding the right spare part feel certain.',
      body: 'Zabatha is a digital marketplace for automotive components and accessories. The redesign centered on search and compatibility verification so drivers could locate and buy the exact part with confidence.',
      pillars: [
        {label: 'Study Task', text: 'Locate a compatible petrol pump, verify reviews & specs, and add to cart'},
        {label: 'Core Gap', text: 'Missing model-year context caused abandonment before checkout'},
        {label: 'Solution', text: 'Vehicle-first filtering and structured compatibility cards'},
      ],
    },
    research: {
      eyebrow: 'The Problem',
      heading: 'Customers could not reliably get from “I need a part” to the exact product.',
      body: 'Task-based usability testing uncovered four recurring friction points across navigation, search relevance, and product detail verification.',
      findings: [
        {
          index: '01',
          title: 'Unclear starting point',
          body: 'Participants abandoned tasks early because categories and navigation labels lacked clear entry cues.',
        },
        {
          index: '02',
          title: 'Irrelevant search results',
          body: 'Unstructured search queries and weak filters surfaced incompatible or off-topic components.',
        },
        {
          index: '03',
          title: 'Missing vehicle-year context',
          body: 'Without brand, model, and year anchored upfront, users could not judge part fitment.',
        },
        {
          index: '04',
          title: 'Sparse technical details',
          body: 'Product pages lacked clear specifications, stock status, and peer reviews needed to commit.',
        },
      ],
    },
    strategy: {
      eyebrow: 'Design Response',
      heading: 'Better search structure, not more options.',
      items: [
        {
          index: '01',
          title: 'Guided vehicle filters',
          body: 'Place search prominently and guide shoppers through brand, model, year, engine type, and category from step one.',
        },
        {
          index: '02',
          title: 'Compatibility on cards',
          body: 'Expose vehicle model fitment, stock availability, and quick add-to-cart directly inside result cards.',
        },
        {
          index: '03',
          title: 'Decision-ready product pages',
          body: 'Organize specifications, warranty/fitment notes, and customer reviews into a scannable hierarchy.',
        },
      ],
    },
    carouselHeading: {
      eyebrow: 'Original Product UI',
      heading: 'Browse, filter, decide.',
      body: 'Original screens from the redesigned Zabatha product covering storefront discovery, filtered search results, and technical product detail.',
    },
    screens: [
      {
        id: 'zb-1',
        src: '/images/zabatha-home.png',
        alt: 'Original Zabatha redesigned home screen',
        title: '01 / Discover',
        caption: 'Start directly with vehicle context, brands, and structured categories.',
        format: 'mobile',
      },
      {
        id: 'zb-2',
        src: '/images/zabatha-search.png',
        alt: 'Original Zabatha redesigned search results',
        title: '02 / Search Results',
        caption: 'Apply vehicle filters before comparing compatible parts.',
        format: 'mobile',
      },
      {
        id: 'zb-3',
        src: '/images/zabatha-details.png',
        alt: 'Original Zabatha redesigned product detail screen',
        title: '03 / Product Details',
        caption: 'Verify fitment specifications and reviews before adding to cart.',
        format: 'mobile',
      },
    ],
  },
  {
    slug: 'monsooq',
    number: '04',
    domain: 'Gaming · Discovery & Subscriptions',
    category: 'consumer',
    title: 'Monsooq',
    subtitle: 'Discovery & Plans',
    headline: 'Play what fits.',
    headlineItalic: 'Pay your way.',
    lead: 'A B2C digital gaming discovery and flexible subscription platform designed around how players ages 18–35 evaluate titles and try before committing.',
    accent: '#6d28d9',
    wash: '#f0e8ff',
    heroBg: '#1c1826',
    meta: [
      {label: 'Role', value: 'UX Research, Product Strategy, UI'},
      {label: 'Audience', value: 'Players aged 18–35'},
      {label: 'Platform', value: 'Digital Gaming Web Service'},
    ],
    previewFormat: 'web',
    previewScreens: [
      {src: '/images/monsooq-recommended.png', alt: 'Monsooq recommended games screen', role: 'left'},
      {src: '/images/monsooq-trending.png', alt: 'Monsooq trending games screen', role: 'main'},
      {src: '/images/monsooq-plans.png', alt: 'Monsooq subscription plans screen', role: 'right'},
    ],
    brief: {
      eyebrow: 'The Opportunity',
      heading: 'Gaming access should feel as flexible as gaming itself.',
      body: 'Monsooq explored a B2C service for digital games and time-based entertainment for players unwilling to lock into rigid long-term subscriptions before testing a library.',
      pillars: [
        {label: '01', text: 'Discover timely, relevant games quickly'},
        {label: '02', text: 'Choose a transparent plan or free trial'},
        {label: '03', text: 'Pay with regionally accessible methods and play'},
      ],
    },
    research: {
      eyebrow: 'Research Signals',
      heading: 'Three player behaviors shaped the product direction.',
      body: 'User interviews, competitive benchmarking, and card sorting revealed what makes a new gaming subscription feel trustworthy and worth exploring.',
      findings: [
        {
          index: '01',
          title: 'Local payment reality',
          body: 'Players highlighted regional card constraints and needed flexible local payment alternatives.',
        },
        {
          index: '02',
          title: 'Relevance over volume',
          body: 'Players expected trending titles, curated offers, and tailored recommendations rather than a flat catalogue.',
        },
        {
          index: '03',
          title: 'Low-risk trial entry',
          body: 'Free-to-try games and transparent trial tiers lowered hesitation at sign-up.',
        },
      ],
    },
    quotes: {
      eyebrow: 'Player Perspective',
      heading: 'From “what should I play?” to a confident first choice.',
      items: [
        {
          quote:
            'Players need relevant discovery, flexible access, and low-risk ways to try content before committing.',
          cite: 'Research synthesis · flexible access, curated discovery, and low-risk trials',
        },
      ],
    },
    strategy: {
      eyebrow: 'Design Response',
      heading: 'Make discovery, relevance, and commitment visible.',
      items: [
        {
          index: '01',
          title: 'Trending first',
          body: 'Bring timely and popular titles forward so the service offers an immediate, lively starting point.',
        },
        {
          index: '02',
          title: 'Recommendations with context',
          body: 'Group games into recognizable collections rather than forcing players through an uncurated list.',
        },
        {
          index: '03',
          title: 'Plans that explain trade-offs',
          body: 'Present clear tiering, trial access, and visible benefits so commitment is effortless to compare.',
        },
      ],
    },
    carouselHeading: {
      eyebrow: 'Product Experience',
      heading: 'Discover. Decide. Start playing.',
      body: 'Curated discovery, personalized recommendations, and transparent subscription tiering bring the product direction into focus.',
    },
    screens: [
      {
        id: 'ms-1',
        src: '/images/monsooq-trending.png',
        alt: 'Original Monsooq trending games discovery screen',
        title: '01 / Trending Games',
        caption: 'A visual, timely entry point into the catalogue.',
        format: 'web',
      },
      {
        id: 'ms-2',
        src: '/images/monsooq-recommended.png',
        alt: 'Original Monsooq recommended games screen',
        title: '02 / Recommended For You',
        caption: 'Personalized picks organized with deliberate hierarchy.',
        format: 'web',
      },
      {
        id: 'ms-3',
        src: '/images/monsooq-plans.png',
        alt: 'Original Monsooq subscription plans screen',
        title: '03 / Plans & Trial',
        caption: 'A transparent bridge from free trial access to paid plans.',
        format: 'web',
      },
    ],
  },
  {
    slug: 'go-bus',
    number: '05',
    domain: 'Travel · Usability Study',
    category: 'enterprise',
    title: 'Go Bus',
    subtitle: 'Trip Changes',
    headline: 'Keep every ticket',
    headlineItalic: 'in the traveller’s control.',
    lead: 'A mobile usability study uncovered a critical post-booking gap: travellers could not find how to edit or cancel a trip. The redesign brought management directly into the ticket.',
    accent: '#0e5a7a',
    wash: '#e1f3f8',
    heroBg: '#063456',
    meta: [
      {label: 'Role', value: 'UX Research, Usability Testing, Product Design'},
      {label: 'Method', value: 'Moderated Mobile Usability Testing'},
      {label: 'Participants', value: '4 Participants'},
      {label: 'Focus', value: 'Booking, Trip Edits & Cancellation'},
    ],
    previewFormat: 'mobile',
    previewScreens: [
      {src: '/images/gobus-03.png', alt: 'Go Bus change trip search screen', role: 'left'},
      {src: '/images/gobus-01.png', alt: 'Go Bus ticket list screen', role: 'main'},
      {src: '/images/gobus-06.png', alt: 'Go Bus seat selection screen', role: 'right'},
    ],
    brief: {
      eyebrow: 'The Context',
      heading: 'The journey did not end at checkout.',
      body: 'The study followed a round-trip booking from Cairo to Port Said—from bus and seat selection through reservation management. The steepest usability failures appeared after purchase, when travellers returned to modify a ticket they already owned.',
      pillars: [
        {label: 'Design Question', text: 'After buying a ticket, can a traveller locate it and see what can still be changed?'},
        {label: 'Study Task', text: 'Book Cairo → Port Said round trip, then return later to review and modify it'},
        {label: 'Key Pivot', text: 'Make post-booking actions native to the ticket itself'},
      ],
    },
    research: {
      eyebrow: 'Usability Study',
      heading: 'Four sessions exposed the exact same control gap.',
      body: 'Participants completed a full round-trip mobile booking and post-booking review, revealing four high-severity breakdowns.',
      findings: [
        {
          index: '4 / 4',
          title: 'Could not locate trip changes',
          body: 'Every participant expected to edit or cancel a booked ticket, but the ticket view hid those actions.',
        },
        {
          index: '4 / 4',
          title: 'Trip information felt inconsistent',
          body: 'All four sessions surfaced conflicting trip details during booking, eroding reservation confidence.',
        },
        {
          index: '3 / 4',
          title: 'Seat confirmation was unclear',
          body: 'The seat selection step did not clarify the next decision, prompting premature exits.',
        },
        {
          index: '4 / 4',
          title: 'Sign-in interrupted checkout',
          body: 'Authentication errors during sign-up/login blocked participants from finishing their booking.',
        },
      ],
      note: 'Counts reflect four moderated usability sessions and represent directional findings rather than population statistics.',
    },
    strategy: {
      eyebrow: 'Design Response',
      heading: 'Redesign the ticket around the next useful action.',
      items: [
        {
          index: '01',
          title: 'Rework ticket hierarchy',
          body: 'Elevate route, departure timing, booking reference, and payment status into one scannable ticket card.',
        },
        {
          index: '02',
          title: 'Expose trip management',
          body: 'Give travellers direct paths to reschedule, swap seats, or cancel straight from the ticket detail view.',
        },
        {
          index: '03',
          title: 'Explain rules before confirming',
          body: 'Show eligibility windows, change fees, and refund policies upfront before final confirmation.',
        },
        {
          index: '04',
          title: 'Clarify seat & trip states',
          body: 'Differentiate selected, available, and occupied seats clearly and keep trip metadata consistent end-to-end.',
        },
      ],
    },
    carouselHeading: {
      eyebrow: 'Original Product UI',
      heading: 'From ticket list to trip management.',
      body: 'Six mobile frames spanning ticket discovery, payment status, schedule search for edits, detailed stops, and seat selection.',
    },
    screens: [
      {
        id: 'gb-1',
        src: '/images/gobus-01.png',
        alt: 'Go Bus My Tickets list with upcoming and past trips',
        title: '01 / My Tickets',
        caption: 'Upcoming and past bookings with clear route and payment state.',
        format: 'mobile',
      },
      {
        id: 'gb-2',
        src: '/images/gobus-02.png',
        alt: 'Go Bus ticket list with payment states',
        title: '02 / Booking Status',
        caption: 'Ticket cards surface fare, route, date, and status immediately.',
        format: 'mobile',
      },
      {
        id: 'gb-3',
        src: '/images/gobus-03.png',
        alt: 'Go Bus trip search to edit a booked trip time',
        title: '03 / Find a Trip to Edit',
        caption: 'Browse alternative departures when modifying a booked journey.',
        format: 'mobile',
      },
      {
        id: 'gb-4',
        src: '/images/gobus-04.png',
        alt: 'Go Bus trip details with route map, stop details and ticket reference',
        title: '04 / Ticket Details',
        caption: 'Route stops, ticket reference, and active trip status in context.',
        format: 'mobile',
      },
      {
        id: 'gb-5',
        src: '/images/gobus-05.png',
        alt: 'Go Bus second ticket detail variation with fare and driver information',
        title: '05 / Booking Information',
        caption: 'Essential travel details stay accessible throughout the trip.',
        format: 'mobile',
      },
      {
        id: 'gb-6',
        src: '/images/gobus-06.png',
        alt: 'Go Bus seat selection screen showing selected, available and unavailable seats',
        title: '06 / Seat Selection',
        caption: 'Seat availability states clearly distinguished before confirmation.',
        format: 'mobile',
      },
    ],
  },
  {
    slug: 'sas-vaya',
    number: '06',
    domain: 'Enterprise · Governance Platform',
    category: 'enterprise',
    title: 'SAS Vaya',
    subtitle: 'Enterprise Governance',
    headline: 'Make complex',
    headlineItalic: 'governance easier to navigate.',
    lead: 'Information architecture and interface design for an enterprise data governance platform uniting reporting, CAS data libraries, consumption analytics, and risk monitoring.',
    accent: '#173e59',
    wash: '#e8f0f8',
    heroBg: '#12293b',
    meta: [
      {label: 'Product', value: 'SAS Vaya Governance Platform'},
      {label: 'Environment', value: 'Enterprise Web Platform'},
      {label: 'Work', value: 'UX Mapping & Interface Design'},
    ],
    previewFormat: 'web',
    previewScreens: [
      {src: '/images/sas-reports-list.png', alt: 'SAS Vaya reports library', role: 'left'},
      {src: '/images/sas-cas-overview.png', alt: 'SAS Vaya CAS overview with library metrics', role: 'main'},
      {src: '/images/sas-dataset-details.png', alt: 'SAS Vaya dataset analysis and lineage', role: 'right'},
    ],
    brief: {
      eyebrow: 'Project Context',
      heading: 'One platform. Several connected operational areas.',
      body: 'SAS Vaya spans reports, CAS data libraries, usage telemetry, risk auditing, and user administration. The challenge was uniting distinct workflows under one coherent information system.',
      pillars: [
        {label: 'Govern Data', text: 'Browse CAS libraries, inspect schemas, and trace dataset lineage'},
        {label: 'Monitor Usage', text: 'Track consumption trends, storage capacity, and system health'},
        {label: 'Track Risk', text: 'Scan duplicate risks, audit logs, and affected executive reports'},
      ],
    },
    strategy: {
      eyebrow: 'Design Approach',
      heading: 'Keep the information system legible at enterprise scale.',
      items: [
        {
          index: '01',
          title: 'Orient operators quickly',
          body: 'Give every governance domain—CAS, reports, usage, and administration—a predictable anchor in the product hierarchy.',
        },
        {
          index: '02',
          title: 'Prioritize actionable signals',
          body: 'Surface storage capacity, active alerts, and severity flags so administrators can triage without digging.',
        },
        {
          index: '03',
          title: 'Connect cross-domain workflows',
          body: 'Link datasets directly to their downstream reports, risk events, and usage patterns using shared interaction patterns.',
        },
      ],
    },
    carouselHeading: {
      eyebrow: 'Product Screens',
      heading: 'From platform overview to operational detail.',
      body: 'Ten enterprise workspace views across CAS libraries, dataset lineage, audit trails, risk triage, storage analytics, and executive reporting.',
    },
    screens: [
      {
        id: 'sv-1',
        src: '/images/sas-cas-overview.png',
        alt: 'CAS overview showing libraries, capacity and system risks',
        title: '01 / CAS Overview',
        caption: 'Capacity, libraries, and active alerts unified in one operational view.',
        format: 'web',
      },
      {
        id: 'sv-2',
        src: '/images/sas-cas-libraries.png',
        alt: 'CAS library list with dataset and usage information',
        title: '02 / CAS Libraries',
        caption: 'Browse datasets with ownership, status, and resource context.',
        format: 'web',
      },
      {
        id: 'sv-3',
        src: '/images/sas-dataset-details.png',
        alt: 'Dataset details with usage trend, dependencies and column schema',
        title: '03 / Dataset Details',
        caption: 'Usage trends, dependencies, and column schema together.',
        format: 'web',
      },
      {
        id: 'sv-4',
        src: '/images/sas-cas-audit.png',
        alt: 'CAS audit log showing data operations and recent activity',
        title: '04 / Audit Activity',
        caption: 'Review recent data operations and governance changes in context.',
        format: 'web',
      },
      {
        id: 'sv-5',
        src: '/images/sas-cas-risks.png',
        alt: 'Risk monitoring table with filters and severity levels',
        title: '05 / Risk Monitoring',
        caption: 'Scan issues by category, severity, and affected data assets.',
        format: 'web',
      },
      {
        id: 'sv-6',
        src: '/images/sas-risk-detail.png',
        alt: 'Risk detail view comparing duplicate records and their impact',
        title: '06 / Risk Detail',
        caption: 'Inspect duplicate records, root cause, and impacted reports.',
        format: 'web',
      },
      {
        id: 'sv-7',
        src: '/images/sas-library-analytics.png',
        alt: 'CAS library analytics showing storage and activity trends',
        title: '07 / Library Analytics',
        caption: 'Storage allocation and library health made immediately readable.',
        format: 'web',
      },
      {
        id: 'sv-8',
        src: '/images/sas-usage-analytics.png',
        alt: 'SAS usage analytics showing user and report activity',
        title: '08 / Usage Analytics',
        caption: 'Track report adoption and platform consumption over time.',
        format: 'web',
      },
      {
        id: 'sv-9',
        src: '/images/sas-reports-list.png',
        alt: 'Reports library with active and inactive reports',
        title: '09 / Reports Library',
        caption: 'Filter and scan report health across a single workspace.',
        format: 'web',
      },
      {
        id: 'sv-10',
        src: '/images/sas-executive-report.png',
        alt: 'Executive dashboard report with usage metrics and activity',
        title: '10 / Executive Report',
        caption: 'Bring report activity, dependencies, and adoption metrics together.',
        format: 'web',
      },
    ],
  },
];

export const SELECTED_SCREENS: ScreenSlide[] = [
  {
    id: 'sel-dm',
    src: '/images/gallery-data-marketplace.png',
    alt: 'Data Marketplace landing page with categories, search, and popular data product cards',
    product: 'Data Marketplace',
    title: 'Data Marketplace',
    caption: 'Privacy-first data discovery platform',
    category: 'web',
    accent: '#484cd6',
    wash: '#edf0ff',
  },
  {
    id: 'sel-csi',
    src: '/images/gallery-construction-intelligence.png',
    alt: 'Construction sector intelligence dashboard with KPIs, charts, project distribution, and recent projects',
    product: 'Construction Sector Intelligence',
    title: 'Construction Sector Intelligence',
    caption: 'Investment Saudi analytics dashboard',
    category: 'web',
    accent: '#007380',
    wash: '#e8f6f5',
  },
  {
    id: 'sel-rer-map',
    src: '/images/gallery-rer-map.png',
    alt: 'RER web experience with a map, property listings, and market insight panel',
    product: 'RER Real Estate',
    title: 'RER · Map Search',
    caption: 'Map-based property search & insights',
    category: 'web',
    accent: '#3b5c85',
    wash: '#ecf2fa',
  },
  {
    id: 'sel-rer-home',
    src: '/images/gallery-rer-home.png',
    alt: 'RER full page property discovery, market overview, charts, and listing table',
    product: 'RER Real Estate',
    title: 'RER · Market Overview',
    caption: 'Property discovery & analytics index',
    category: 'web',
    accent: '#3b5c85',
    wash: '#ecf2fa',
  },
  {
    id: 'sel-rer-details',
    src: '/images/gallery-rer-property-details.png',
    alt: 'RER property details with listing information, related listings, and nearby places map',
    product: 'RER Real Estate',
    title: 'RER · Property Details',
    caption: 'Listing specifications & nearby places',
    category: 'web',
    accent: '#3b5c85',
    wash: '#ecf2fa',
  },
  {
    id: 'sel-rer-fav',
    src: '/images/gallery-rer-favorites.png',
    alt: 'RER favorites page showing saved property cards and contact actions',
    product: 'RER Real Estate',
    title: 'RER · Saved Listings',
    caption: 'Shortlisted properties & comparison',
    category: 'web',
    accent: '#3b5c85',
    wash: '#ecf2fa',
  },
  {
    id: 'sel-rer-search',
    src: '/images/gallery-rer-search-results.png',
    alt: 'RER property search results with filters, property cards, and market insights',
    product: 'RER Real Estate',
    title: 'RER · Filtered Results',
    caption: 'Multi-criteria property search',
    category: 'web',
    accent: '#3b5c85',
    wash: '#ecf2fa',
  },
  {
    id: 'sel-rer-mob-analytics',
    src: '/images/selected-rer-analytics.png',
    alt: 'RER property analytics and market overview screen',
    product: 'RER Mobile',
    title: 'RER Mobile · Analytics',
    caption: 'On-the-go real estate market metrics',
    category: 'mobile',
    accent: '#3b5c85',
    wash: '#ecf2fa',
  },
  {
    id: 'sel-rer-mob-list',
    src: '/images/selected-rer-list.png',
    alt: 'RER mobile property listing screen',
    product: 'RER Mobile',
    title: 'RER Mobile · Listings',
    caption: 'Mobile property cards & filters',
    category: 'mobile',
    accent: '#3b5c85',
    wash: '#ecf2fa',
  },
  {
    id: 'sel-cat-home',
    src: '/images/gallery-catering-home.png',
    alt: 'Catering service home screen with food categories and restaurant discovery',
    product: 'Catering Service',
    title: 'Catering · Home Discovery',
    caption: 'Food categories & vendor discovery',
    category: 'mobile',
    accent: '#148b58',
    wash: '#e7f5ee',
  },
  {
    id: 'sel-cat-rest',
    src: '/images/gallery-catering-restaurant.png',
    alt: 'Restaurant page with offers, menu sections, and item controls',
    product: 'Catering Service',
    title: 'Catering · Restaurant Menu',
    caption: 'Offers, categories & package ordering',
    category: 'mobile',
    accent: '#148b58',
    wash: '#e7f5ee',
  },
  {
    id: 'sel-cat-loc1',
    src: '/images/gallery-catering-location-selected.png',
    alt: 'Map location screen with selected delivery point and confirmation action',
    product: 'Catering Service',
    title: 'Catering · Delivery Point',
    caption: 'Selected event location confirmation',
    category: 'mobile',
    accent: '#148b58',
    wash: '#e7f5ee',
  },
  {
    id: 'sel-cat-loc2',
    src: '/images/gallery-catering-location-picker.png',
    alt: 'Map based address selection screen',
    product: 'Catering Service',
    title: 'Catering · Location Picker',
    caption: 'Map-based venue pin selection',
    category: 'mobile',
    accent: '#148b58',
    wash: '#e7f5ee',
  },
  {
    id: 'sel-mab-home',
    src: '/images/gallery-mabrour-home.png',
    alt: 'Mabrour mobile home screen with wallet balance, offers, and navigation',
    product: 'Mabrour',
    title: 'Mabrour · Wallet & Home',
    caption: 'Balance, offers & service shortcuts',
    category: 'mobile',
    accent: '#a87900',
    wash: '#fff8de',
  },
  {
    id: 'sel-mab-srv',
    src: '/images/gallery-mabrour-services.png',
    alt: 'Mabrour services screen for travel, transport, and pilgrimage',
    product: 'Mabrour',
    title: 'Mabrour · Pilgrimage Services',
    caption: 'Travel, transport & booking utilities',
    category: 'mobile',
    accent: '#138252',
    wash: '#e8f6ef',
  },
  {
    id: 'sel-mab-pts',
    src: '/images/gallery-mabrour-points.png',
    alt: 'Mabrour rewards screen with points balance, redemption, and activity history',
    product: 'Mabrour',
    title: 'Mabrour · Rewards Ledger',
    caption: 'Points balance & activity history',
    category: 'mobile',
    accent: '#a87900',
    wash: '#fff8de',
  },
  {
    id: 'sel-mab-red',
    src: '/images/gallery-mabrour-redeem.png',
    alt: 'Mabrour points redemption flow with conversion and confirmation',
    product: 'Mabrour',
    title: 'Mabrour · Redeem to Wallet',
    caption: 'Points conversion & confirmation',
    category: 'mobile',
    accent: '#a87900',
    wash: '#fff8de',
  },
  {
    id: 'sel-ei-det',
    src: '/images/gallery-einvest-stock-details.png',
    alt: 'E-Invest stock details screen with price chart, timeframe filters, and buy and sell actions',
    product: 'E-Invest',
    title: 'E-Invest · Stock Trend',
    caption: 'Timeframe filters & order actions',
    category: 'mobile',
    accent: '#103b9f',
    wash: '#e8efff',
  },
  {
    id: 'sel-ei-cand',
    src: '/images/gallery-einvest-stock-chart.png',
    alt: 'E-Invest stock detail with candlestick chart and trading controls',
    product: 'E-Invest',
    title: 'E-Invest · Candlestick View',
    caption: 'Technical chart depth & execution',
    category: 'mobile',
    accent: '#103b9f',
    wash: '#e8efff',
  },
  {
    id: 'sel-trk-det',
    src: '/images/selected-truck-trip-detail.png',
    alt: 'Truck Location mobile trip details with driver, route, and delivery actions',
    product: 'Truck Location',
    title: 'Truck Location · Trip Detail',
    caption: 'Driver dispatch & delivery workflow',
    category: 'mobile',
    accent: '#0873b7',
    wash: '#e8f4fb',
  },
  {
    id: 'sel-trk-map',
    src: '/images/selected-truck-map.png',
    alt: 'Truck Location mobile route map across Riyadh',
    product: 'Truck Location',
    title: 'Truck Location · Live Route',
    caption: 'Real-time corridor map across Riyadh',
    category: 'mobile',
    accent: '#0873b7',
    wash: '#e8f4fb',
  },
  {
    id: 'sel-lam-story',
    src: '/images/selected-lamha-story.png',
    alt: 'Lamha Arabic audio story screen with sharing and reminder controls',
    product: 'Lamha App',
    title: 'Lamha · Audio Player',
    caption: 'Story playback, sharing & reminders',
    category: 'mobile',
    accent: '#238280',
    wash: '#e4f6f4',
  },
  {
    id: 'sel-lam-lib',
    src: '/images/selected-lamha-library.png',
    alt: 'Lamha library screen with books, podcasts, and playlists',
    product: 'Lamha App',
    title: 'Lamha · Personal Library',
    caption: 'Books, podcasts & curated playlists',
    category: 'mobile',
    accent: '#238280',
    wash: '#e4f6f4',
  },
  {
    id: 'sel-lam-off',
    src: '/images/selected-lamha-offer.png',
    alt: 'Lamha audiobook subscription offer screen',
    product: 'Lamha App',
    title: 'Lamha · Subscription Offer',
    caption: 'Membership conversion experience',
    category: 'mobile',
    accent: '#238280',
    wash: '#e4f6f4',
  },
];

export const CAREER_HISTORY: CareerEntry[] = [
  {
    id: 'dsme',
    index: '01',
    period: 'Oct 2025 — Present',
    company: 'DataScience Middle East',
    role: 'Senior UI/UX Designer · Government, analytics & decision-support platforms',
    focusLabel: 'Role Focus',
    lede: 'Led UX for advanced analytics and government platforms across transportation, petroleum, healthcare, fintech, and national decision-support sectors.',
    points: [
      'Translated complex multi-dimensional datasets into intuitive dashboards and decision-support interfaces.',
      'Mapped end-to-end journeys and established scalable component design systems.',
      'Partnered directly with data scientists and policy domain experts on high-impact national products.',
    ],
    projects: [
      {
        name: 'Saudi National Diagnostic Platform',
        summary: 'Royal Court decision support and national benchmarking.',
      },
      {
        name: 'Healthcare Insights Platform',
        summary: 'MOHAP KPI dashboards and predictive analytics.',
      },
      {
        name: 'Transportation Analytics',
        summary: 'Fleet performance, route optimization, and passenger-flow insights.',
      },
      {
        name: 'Petroleum Operations',
        summary: 'Real-time drilling, production, and safety monitoring.',
      },
      {
        name: 'FinTech Risk & Compliance',
        summary: 'Risk scoring, fraud detection, and compliance workflows.',
      },
    ],
  },
  {
    id: 'scatus',
    index: '02',
    period: 'Apr 2025 — May 2025',
    company: 'Scatus Technologies',
    role: 'Consultant UI/UX Designer · Saudi Stock Exchange onboarding engagement',
    focusLabel: 'Engagement',
    lede: 'Redesigned the listed-company onboarding journey for the Saudi Stock Exchange in a focused consulting engagement.',
    points: [
      'Collaborated with Scatus Technologies and Deloitte to simplify regulatory steps and improve completion clarity.',
    ],
  },
  {
    id: 'knowledgenet',
    index: '03',
    period: 'Apr 2022 — Sep 2025',
    company: 'KnowledgeNet',
    role: 'Senior UI/UX Designer · FinTech, banking & enterprise products',
    focusLabel: 'Role Focus',
    lede: 'Led UX across FinTech and enterprise banking products for leading regional financial institutions.',
    points: [
      'Maintained and expanded the KnowledgeNet design system for consistent multi-product experiences.',
      'Conducted user research and moderated usability testing alongside engineering and compliance teams.',
    ],
    projects: [
      {
        name: 'E-Invest Trading Platform',
        summary: 'Trading, order journeys, portfolios, and market data.',
      },
      {
        name: 'Liquify Factoring Platform',
        summary: 'Invoice finance, risk scoring, and SME onboarding.',
      },
      {
        name: 'E-Corp Open Banking',
        summary: 'Corporate cash management, payments, and reconciliation.',
      },
      {
        name: 'KN Design System',
        summary: 'Core components, design tokens, and interaction patterns.',
      },
      {
        name: 'Ghadi Cashflow Analysis',
        summary: 'Financial insights and deficit-detection dashboards.',
      },
    ],
  },
  {
    id: 'caspian',
    index: '04',
    period: 'Nov 2022 — Sep 2023',
    company: 'Caspian DS',
    role: 'Part-Time UI/UX Designer · CRM, medical & education platforms',
    focusLabel: 'Role Focus',
    lede: 'Designed responsive CRM, medical, and education platforms across varied enterprise contexts.',
    points: [
      'Created wireframes, user flows, and interactive prototypes that enabled fast validation before engineering build.',
    ],
  },
  {
    id: 'devnile',
    index: '05',
    period: 'Jan 2022 — Sep 2022',
    company: 'Devnile',
    role: 'Part-Time UI/UX Designer · User journeys, prototypes & product usability',
    focusLabel: 'Role Focus',
    lede: 'Crafted user journeys and product prototypes across web and mobile client applications.',
    points: [
      'Used Figma and Adobe XD to elevate usability and maintain consistency across responsive breakpoints.',
    ],
  },
  {
    id: 'spirutude',
    index: '06',
    period: 'Aug 2021 — Mar 2022',
    company: 'Spirutude LTD',
    role: 'UI/UX Designer · Web & mobile product interfaces',
    focusLabel: 'Role Focus',
    lede: 'Developed web and mobile interface concepts aligned closely with each product brand identity.',
    points: [
      'Produced structured wireframes and high-fidelity mockups translating early product concepts into shippable UI.',
    ],
  },
  {
    id: 'lamha',
    index: '07',
    period: 'Aug 2021 — Dec 2021',
    company: 'Lamha App',
    role: 'Part-Time UI/UX Designer · Audio content app redesign & engagement',
    focusLabel: 'Role Focus',
    lede: 'Redesigned Lamha’s audio-content mobile app, a Top 20 App Store product in its category.',
    points: [
      'Introduced gamification and retention mechanics to encourage habitual daily listening.',
      'Designed a personal library and content-rating system strengthening discovery and trust.',
      'Contributed to a reported 40% increase in active users and paid subscriptions.',
    ],
  },
];
