import {CaseSlug} from './portfolioData';

export type Lang = 'en' | 'ar';

export interface LocalizedBriefing {
  title: string;
  subtitle: string;
  prompt: string;
}

export const UI_COPY: Record<
  Lang,
  {
    name: string;
    role: string;
    newBriefing: string;
    offlineCv: string;
    linkedin: string;
    lightMode: string;
    darkMode: string;
    agentTitle: string;
    agentSubtitleIdle: string;
    agentSubtitleBusy: string;
    heroHeadline: string;
    heroHeadlineItalic: string;
    heroDescription: string;
    starterHeading: string;
    inputPlaceholder: string;
    sendLabel: string;
    searchingLabel: string;
    retryLabel: string;
    recommendedHeading: string;
    openCase: string;
    openCaseShort: string;
    askAiShort: string;
    backToStudio: string;
    askAiAboutCase: string;
    inspectPartners: string;
    openOfflineCv: string;
    tabs: {
      focus: string;
      cases: string;
      screens: string;
      career: string;
      about: string;
    };
    filters: {
      allCases: string;
      fintech: string;
      enterprise: string;
      consumer: string;
      allScreens: string;
      web: string;
      mobile: string;
    };
    stats: {
      cases: string;
      teams: string;
      partners: string;
      screens: string;
    };
    about: {
      profileEyebrow: string;
      capabilitiesEyebrow: string;
      partnersEyebrow: string;
      summary: string;
      capabilities: string[];
    };
    caseLabels: {
      overview: string;
      legacy: string;
      research: string;
      evidence: string;
      strategy: string;
      screens: string;
      prevCase: string;
      nextCase: string;
      keyHighlights: string;
      askAboutRole: string;
      viewSpotlightBrief: string;
    };
    briefings: LocalizedBriefing[];
  }
> = {
  en: {
    name: 'Abouelkhair Rady Mohamed',
    role: 'Senior UI/UX Designer',
    newBriefing: 'New Chat',
    offlineCv: 'CV',
    linkedin: 'LinkedIn',
    lightMode: 'Light',
    darkMode: 'Dark',
    agentTitle: 'Portfolio AI Agent',
    agentSubtitleIdle: 'Grounded strictly in portfolio data',
    agentSubtitleBusy: 'Synthesizing grounded answer…',
    heroHeadline: 'Complex products.',
    heroHeadlineItalic: 'Clear decisions.',
    heroDescription:
      'Ask Abouelkhair’s AI agent about his 6 UX case studies, usability research metrics, 24 product screens, and 7-team career history.',
    starterHeading: 'Quick recruiter prompts',
    inputPlaceholder: 'Ask about projects, research, or career…',
    sendLabel: 'Send',
    searchingLabel: 'Searching portfolio records…',
    retryLabel: 'Retry',
    recommendedHeading: 'Recommended follow-ups',
    openCase: 'Open Case Study',
    openCaseShort: 'Open',
    askAiShort: 'Ask AI',
    backToStudio: 'Back to AI Studio',
    askAiAboutCase: 'Ask AI about',
    inspectPartners: 'View 16 Partners',
    openOfflineCv: 'Open Offline CV',
    tabs: {
      focus: 'Focus',
      cases: 'Cases (06)',
      screens: 'Screens (24)',
      career: 'Career (07)',
      about: 'About & Partners',
    },
    filters: {
      allCases: 'All (6)',
      fintech: 'FinTech',
      enterprise: 'Enterprise',
      consumer: 'Consumer',
      allScreens: 'All (24)',
      web: 'Web',
      mobile: 'Mobile',
    },
    stats: {
      cases: 'Cases',
      teams: 'Teams',
      partners: 'Partners',
      screens: 'Screens',
    },
    about: {
      profileEyebrow: 'Profile & Practice',
      capabilitiesEyebrow: 'Core Capabilities',
      partnersEyebrow: '16 Organizations & Banking Partners',
      summary:
        'Research to shipped product experience across banking, analytics, governance, and consumer apps.',
      capabilities: [
        'UX Research & Usability Studies',
        'Product Strategy & Task Flows',
        'Complex UI Systems & Dashboards',
        'Mobile & Responsive Product Design',
      ],
    },
    caseLabels: {
      overview: 'Overview',
      legacy: 'Legacy Signals',
      research: 'Research',
      evidence: 'Evidence',
      strategy: 'Strategy',
      screens: 'Screens',
      prevCase: 'Previous Case',
      nextCase: 'Next Case',
      keyHighlights: 'Key Products Shipped',
      askAboutRole: 'Ask AI about this role',
      viewSpotlightBrief: 'Spotlight Overview',
    },
    briefings: [
      {
        title: 'FinTech & Banking UX',
        subtitle: 'E-Invest, 7salty & regional bank systems',
        prompt:
          'Summarize Abouelkhair’s FinTech and banking UX work across E-Invest, 7salty, and KnowledgeNet.',
      },
      {
        title: 'Usability Research & Data',
        subtitle: '57-person survey, legacy reviews & Go Bus study',
        prompt:
          'Which case studies best prove his UX research and usability testing impact with concrete numbers?',
      },
      {
        title: 'Enterprise & GovTech Scale',
        subtitle: 'SAS Vaya, DSME national platforms & Deloitte',
        prompt:
          'Tell me about his enterprise governance and national analytics platforms like SAS Vaya and DataScience Middle East.',
      },
      {
        title: 'Career, Partners & CV',
        subtitle: '7 product teams (2021–Present) & 16 partners',
        prompt:
          'Give me an executive recruiter overview of his 7 career roles, partner organizations, and core capabilities.',
      },
    ],
  },
  ar: {
    name: 'أبو الخير راضي محمد',
    role: 'مصمم واجهات وتجربة مستخدم أول (Senior UI/UX)',
    newBriefing: 'محادثة جديدة',
    offlineCv: 'السيرة الذاتية',
    linkedin: 'لينكدإن',
    lightMode: 'نهاري',
    darkMode: 'ليلي',
    agentTitle: 'مساعد البورتفوليو الذكي',
    agentSubtitleIdle: 'إجابات موثقة من بيانات البورتفوليو فقط',
    agentSubtitleBusy: 'جاري البحث في بيانات المشاريع والخبرة…',
    heroHeadline: 'منتجات معقدة.',
    heroHeadlineItalic: 'قرارات واضحة.',
    heroDescription:
      'اسأل المساعد الذكي عن 6 دراسات حالة متكاملة، أبحاث تجربة المستخدم، 24 شاشة تصميم، ومسيرة عمل عبر 7 شركات وبنوك إقليمية.',
    starterHeading: 'أسئلة سريعة لمسؤولي التوظيف',
    inputPlaceholder: 'اسأل عن المشاريع، الأبحاث، أو الخبرة المهنية…',
    sendLabel: 'إرسال',
    searchingLabel: 'جاري البحث في سجل الأعمال…',
    retryLabel: 'إعادة المحاولة',
    recommendedHeading: 'أسئلة مقترحة للمتابعة',
    openCase: 'فتح دراسة الحالة',
    openCaseShort: 'عرض',
    askAiShort: 'اسأل المساعد',
    backToStudio: 'العودة لاستوديو المساعد',
    askAiAboutCase: 'اسأل المساعد عن',
    inspectPartners: 'عرض الـ 16 شريكاً',
    openOfflineCv: 'فتح السيرة الذاتية PDF',
    tabs: {
      focus: 'التركيز',
      cases: 'دراسات الحالة (06)',
      screens: 'الشاشات (24)',
      career: 'الخبرة (07)',
      about: 'نبذة والشركاء',
    },
    filters: {
      allCases: 'الكل (6)',
      fintech: 'التقنية المالية',
      enterprise: 'المؤسسات والسفر',
      consumer: 'التجارة والألعاب',
      allScreens: 'الكل (24)',
      web: 'ويب',
      mobile: 'موبايل',
    },
    stats: {
      cases: 'دراسات حالة',
      teams: 'شركات',
      partners: 'شركاء',
      screens: 'شاشات',
    },
    about: {
      profileEyebrow: 'الملف المهني والممارسة',
      capabilitiesEyebrow: 'المهارات والقدرات الأساسية',
      partnersEyebrow: '16 مؤسسة وبنكاً وشريكاً تقنياً',
      summary:
        'من أبحاث المستخدم إلى إطلاق المنتجات النهائية في قطاعات البنوك، التحليلات الحكومية، الحوكمة، وتطبيقات المستهلك.',
      capabilities: [
        'أبحاث تجربة المستخدم واختبارات قابلية الاستخدام',
        'استراتيجية المنتج وتدفقات المهام',
        'أنظمة التصميم المعقدة ولوحات البيانات',
        'تصميم تطبيقات الجوال والمنصات المتجاوبة',
      ],
    },
    caseLabels: {
      overview: 'نظرة عامة',
      legacy: 'مؤشرات النسخة السابقة',
      research: 'البحث والتحليل',
      evidence: 'البيانات والاقتباسات',
      strategy: 'الاستراتيجية والحل',
      screens: 'الشاشات',
      prevCase: 'المشروع السابق',
      nextCase: 'المشروع التالي',
      keyHighlights: 'أبرز المنتجات المنفذة',
      askAboutRole: 'اسأل المساعد عن هذه الوظيفة',
      viewSpotlightBrief: 'ملخص المشروع المميز',
    },
    briefings: [
      {
        title: 'التقنية المالية والبنوك',
        subtitle: 'E-Invest و 7salty ومنصات KnowledgeNet',
        prompt:
          'لخّص خبرة أبو الخير في مجال التكنولوجيا المالية والبنوك عبر E-Invest و 7salty و KnowledgeNet باللغة العربية.',
      },
      {
        title: 'أبحاث المستخدم والنتائج الرقمية',
        subtitle: 'استبيان 57 مشاركاً ومراجعات E-Invest و Go Bus',
        prompt:
          'ما هي دراسات الحالة التي تثبت قوة أبحاث تجربة المستخدم واختبارات قابلية الاستخدام بالأرقام؟ أجب بالعربية.',
      },
      {
        title: 'أنظمة المؤسسات والتحليلات',
        subtitle: 'SAS Vaya ومنصات DataScience Middle East',
        prompt:
          'اشرح عمله في منصات حوكمة البيانات والتحليلات الوطنية مثل SAS Vaya و DataScience Middle East بالعربية.',
      },
      {
        title: 'المسيرة المهنية والشركاء',
        subtitle: '7 فرق عمل (2021–الآن) و 16 بنكاً ومؤسسة',
        prompt:
          'قدّم ملخصاً لمسؤولي التوظيف عن وظائفه السبع وأبرز البنوك والشركاء ومهاراته الأساسية بالعربية.',
      },
    ],
  },
};

export const CASE_AR_SUMMARIES: Record<
  CaseSlug,
  {
    domain: string;
    subtitle: string;
    headline: string;
    lead: string;
  }
> = {
  'e-invest': {
    domain: 'التقنية المالية · منصة تداول',
    subtitle: 'إعادة تصميم المنتج',
    headline: 'كان لا بد من إعادة بناء الثقة قبل التداول.',
    lead: 'بدأت إعادة التصميم من تطبيق بنكي قائم وشكاوى حقيقية للعملاء، لتحويل الاحتكاك المتكرر إلى تجربة استثمار أوضح.',
  },
  '7salty': {
    domain: 'التقنية المالية · الادخار المصغّر',
    subtitle: 'تجربة الادخار',
    headline: 'الادخار المصغّر في متناول الجميع.',
    lead: 'تطبيق ادخار مصغّر صُمّم لتعزيز الشمول المالي وتجاوز عوائق الثقة وبناء عادات ادخار يومية للشباب وذوي الدخل المحدود.',
  },
  zabatha: {
    domain: 'التجارة الإلكترونية · قطع غيار السيارات',
    subtitle: 'إعادة تصميم المتجر',
    headline: 'اعثر على القطعة الصحيحة دون تعقيد.',
    lead: 'اختبارات قابلية استخدام وإعادة هيكلة المعلومات لتبسيط مطابقة مواصفات السيارة مع قطع الغيار المعتمدة.',
  },
  monsooq: {
    domain: 'الألعاب · الاكتشاف والاشتراكات',
    subtitle: 'الاكتشاف والباقات',
    headline: 'العب ما يناسبك وادفع بطريقتك.',
    lead: 'منصة ألعاب رقمية واشتراكات مرنة مصممة لطريقة تقييم اللاعبين (18–35 عاماً) وتجربة الألعاب قبل الالتزام.',
  },
  'go-bus': {
    domain: 'السفر · دراسة قابلية الاستخدام',
    subtitle: 'تعديل الرحلات',
    headline: 'إبقاء كل تذكرة تحت تحكم المسافر.',
    lead: 'كشفت دراسة قابلية استخدام عن فجوة حرجة بعد الحجز حيث تعذّر على المسافرين تعديل أو إلغاء رحلاتهم بسهولة.',
  },
  'sas-vaya': {
    domain: 'المؤسسات · منصة حوكمة البيانات',
    subtitle: 'الحوكمة المؤسسية',
    headline: 'تبسيط التنقل في أنظمة الحوكمة المعقدة.',
    lead: 'هيكلة معلومات وتصميم واجهات لمنصة حوكمة بيانات مؤسسية توحّد التقارير ومكتبات CAS وتحليلات الاستهلاك والمخاطر.',
  },
};

export const CAREER_AR_LABELS: Record<
  string,
  {role: string; summary: string}
> = {
  dsme: {
    role: 'مصمم UI/UX أول · المنصات الحكومية والتحليلات ودعم القرار',
    summary:
      'قيادة تجربة المستخدم لمنصات التحليلات المتقدمة والمنصات الحكومية في قطاعات النقل والبترول والرعاية الصحية والتقنية المالية.',
  },
  scatus: {
    role: 'مستشار UI/UX · رحلة تسجيل الشركات في السوق المالية السعودية',
    summary:
      'إعادة تصميم رحلة انضمام الشركات المدرجة في تداول السعودية بالتعاون مع Scatus و Deloitte لتبسيط الإجراءات التنظيمية.',
  },
  knowledgenet: {
    role: 'مصمم UI/UX أول · منتجات التقنية المالية والبنوك والمؤسسات',
    summary:
      'قيادة تصميم تجربة المستخدم لمنتجات التداول والتمويل والمصرفية المفتوحة وتطوير نظام التصميم KN Design System.',
  },
  caspian: {
    role: 'مصمم UI/UX بدوام جزئي · أنظمة CRM والطبية والتعليمية',
    summary:
      'تصميم منصات متجاوبة لإدارة علاقات العملاء والقطاع الطبي والتعليمي مع بناء النماذج التفاعلية السريعة.',
  },
  devnile: {
    role: 'مصمم UI/UX بدوام جزئي · رحلات المستخدم والنماذج الأولية',
    summary:
      'تصميم رحلات المستخدم ونماذج تفاعلية لتطبيقات الويب والجوال باستخدام Figma و Adobe XD.',
  },
  spirutude: {
    role: 'مصمم UI/UX · واجهات منتجات الويب والجوال',
    summary:
      'تطوير مفاهيم واجهات الويب والجوال المتوافقة مع الهوية البصرية وتحويل الأفكار الأولية إلى تصاميم قابلة للتنفيذ.',
  },
  lamha: {
    role: 'مصمم UI/UX بدوام جزئي · إعادة تصميم تطبيق لمحة الصوتي',
    summary:
      'إعادة تصميم تطبيق المحتوى الصوتي لمحة (ضمن أعلى 20 تطبيقاً في المتجر) مع تحقيق زيادة 40% في المستخدمين النشطين والاشتراكات.',
  },
};
