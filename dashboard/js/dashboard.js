(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  const shell = $("#admin-shell");
  const sidebar = $("#admin-sidebar");
  const menuToggle = $("#menu-toggle");
  const viewRoot = $("#view-root");
  const viewTitle = $("#view-title");
  const connectionPill = $("#connection-pill");
  const dirtyPill = $("#dirty-pill");
  const topSave = $("#top-save");
  const topPublish = $("#top-publish");
  const publishPill = $("#publish-pill");
  const hostedBanner = $("#hosted-banner");
  const publishDialog = $("#publish-dialog");
  const publishForm = $("#publish-form");
  const operationBanner = $("#operation-banner");
  const toast = $("#admin-toast");
  const uploadDialog = $("#upload-dialog");
  const uploadForm = $("#upload-form");
  const uploadMessage = $("#upload-message");
  const uploadResult = $("#upload-result");
  const uploadedPath = $("#uploaded-path");
  const uploadPreview = $("#upload-preview");
  const useUploadedPath = $("#use-uploaded-path");
  const workspace = $(".admin-workspace");

  const SECTION_META = {
    overview: { ar: "نظرة عامة", en: "Overview" },
    analytics: { ar: "التحليلات", en: "Analytics" },
    leads: { ar: "العملاء والحجوزات", en: "Leads & bookings" },
    "media-buying": { ar: "شراء الإعلانات", en: "Media buying" },
    campaigns: { ar: "الحملات", en: "Campaigns" },
    tips: { ar: "نصائح يومية", en: "Daily tips" },
    specialties: { ar: "التخصصات", en: "Specialties" },
    doctors: { ar: "الأطباء", en: "Doctors" },
    branches: { ar: "الفروع", en: "Branches" },
    articles: { ar: "المقالات والمعرفة", en: "Articles & Knowledge" },
    reviews: { ar: "الآراء", en: "Reviews" },
    digital: { ar: "المنتجات الرقمية", en: "Digital products" },
    settings: { ar: "إعدادات الموقع", en: "Site settings" },
    images: { ar: "الصور", en: "Images" },
    backups: { ar: "النسخ الاحتياطية", en: "Backups" },
  };

  const COLLECTION_SECTIONS = {
    specialties: {
      file: "specialties.json",
      groups: [{ key: "specialties", ar: "التخصصات", en: "Specialties" }],
    },
    doctors: {
      file: "doctors.json",
      groups: [{ key: "doctors", ar: "الأطباء", en: "Doctors" }],
    },
    branches: {
      file: "branches.json",
      groups: [{ key: "branches", ar: "الفروع", en: "Branches" }],
    },
    articles: {
      file: "articles.json",
      groups: [
        { key: "articles", ar: "المحتوى المعرفي", en: "Knowledge entries" },
        { key: "categories", ar: "التصنيفات", en: "Categories" },
      ],
    },
    reviews: {
      file: "reviews.json",
      groups: [{ key: "reviews", ar: "الآراء", en: "Reviews" }],
    },
    digital: {
      file: "digital.json",
      groups: [
        { key: "products", ar: "المنتجات الرقمية", en: "Digital products" },
      ],
    },
    campaigns: {
      file: "campaigns.json",
      groups: [{ key: "campaigns", ar: "الحملات", en: "Campaigns" }],
    },
  };

  const FIELD_LABELS = {
    // Sharing and Ask-AI, added 2026-09-06. These drive the row under every
    // Knowledge Centre entry, so the labels say what the editor is changing on
    // the live article rather than naming the JSON key.
    sharing: ["أزرار المشاركة والذكاء الاصطناعي", "Share & AI buttons"],
    networks: ["مواقع المشاركة", "Share networks"],
    ask: ["اسأل الذكاء الاصطناعي", "Ask AI"],
    assistants: ["المساعدات الذكية", "AI assistants"],
    question: ["السؤال اللي هيتبعت للمساعد", "Question sent to the assistant"],
    copied: ["رسالة «اتنسخ الرابط»", "‘Link copied’ message"],
    note: ["تنبيه تحت الأزرار", "Note under the buttons"],
    _note: ["ملاحظة داخلية", "Internal note"],
    _source: ["المصدر الداخلي", "Internal source"],
    _evidence: ["دليل المعلومة", "Evidence"],
    _todo: ["معلومة مطلوبة", "Missing information"],
    slug: ["الرابط المختصر", "Slug"],
    id: ["المعرّف", "ID"],
    index: ["الترتيب", "Order"],
    published: ["منشور", "Published"],
    sample: ["محتوى تجريبي", "Sample content"],
    staffed: ["الفريق متاح", "Staffed"],
    featured: ["مميّز", "Featured"],
    hasBeforeAfter: ["يعرض قبل وبعد", "Has before/after"],
    hasReviews: ["يعرض آراء", "Has reviews"],
    isPrimary: ["الفرع الرئيسي", "Primary branch"],
    icon: ["الأيقونة", "Icon"],
    name: ["الاسم", "Name"],
    shortName: ["الاسم المختصر", "Short name"],
    short: ["النص المختصر", "Short label"],
    title: ["العنوان", "Title"],
    kind: ["نوع المنشأة", "Organisation type"],
    tagline: ["الشعار النصي", "Tagline"],
    wordmark: ["الاسم المكتوب", "Wordmark"],
    domain: ["النطاق", "Domain"],
    logo: ["الشعار", "Logo"],
    desc: ["الوصف", "Description"],
    description: ["الوصف", "Description"],
    sub: ["العنوان الفرعي", "Subtitle"],
    intro: ["المقدمة", "Introduction"],
    summary: ["الملخص", "Summary"],
    excerpt: ["المقتطف", "Excerpt"],
    body: ["المحتوى", "Body"],
    heading: ["عنوان القسم", "Section heading"],
    text: ["النص", "Text"],
    label: ["التسمية", "Label"],
    q: ["السؤال", "Question"],
    a: ["الإجابة", "Answer"],
    treats: ["الحالات", "Conditions"],
    treatments: ["العلاجات والخدمات", "Treatments & services"],
    results: ["صور النتائج بعد الموافقة", "Consented result images"],
    consent: ["موافقة كتابية مؤكدة", "Written consent confirmed"],
    caption: ["التعليق الظاهر", "Visible caption"],
    facts: ["نقاط سريعة", "Key facts"],
    faq: ["الأسئلة الشائعة", "FAQ"],
    seo: ["إعدادات محركات البحث", "SEO"],
    credentials: ["المؤهلات", "Credentials"],
    days: ["الأيام", "Days"],
    hours: ["الساعات", "Hours"],
    branches: ["الفروع", "Branches"],
    specialties: ["التخصصات", "Specialties"],
    portrait: ["الصورة الشخصية", "Portrait"],
    portrait2x: ["الصورة الشخصية الكبيرة", "High-resolution portrait"],
    bio: ["النبذة", "Biography"],
    status: ["الحالة", "Status"],
    type: ["النوع", "Type"],
    category: ["التصنيف", "Category"],
    date: ["التاريخ", "Date"],
    readingTime: ["مدة القراءة", "Reading time"],
    author: ["الكاتب", "Author"],
    reviewedBy: ["المراجع الطبي", "Reviewed by"],
    sections: ["الأقسام", "Sections"],
    sources: ["المصادر", "Sources"],
    tags: ["الوسوم", "Tags"],
    image: ["الصورة", "Image"],
    imageAlt: ["وصف الصورة", "Image alt text"],
    imagePlaceholder: ["الصورة مؤقتة", "Image placeholder"],
    portraitPlaceholder: ["صورة مؤقتة", "Portrait placeholder"],
    photos: ["الصور", "Photos"],
    src: ["مسار الملف", "File path"],
    alt: ["النص البديل", "Alt text"],
    rating: ["التقييم", "Rating"],
    source: ["المصدر", "Source"],
    doctor: ["الطبيب", "Doctor"],
    aggregate: ["إجمالي التقييمات", "Rating aggregate"],
    value: ["القيمة", "Value"],
    count: ["العدد", "Count"],
    checked: ["آخر تحقق", "Last checked"],
    city: ["المدينة", "City"],
    country: ["الدولة", "Country"],
    area: ["المنطقة", "Area"],
    address: ["العنوان", "Address"],
    landmark: ["علامة مميزة", "Landmark"],
    geo: ["الإحداثيات", "Coordinates"],
    lat: ["خط العرض", "Latitude"],
    lng: ["خط الطول", "Longitude"],
    plusCode: ["Plus Code", "Plus Code"],
    mapsUrl: ["رابط الخريطة", "Map URL"],
    phone: ["الهاتف", "Phone"],
    whatsapp: ["واتساب", "WhatsApp"],
    display: ["النص الظاهر", "Display value"],
    tel: ["رقم الاتصال", "Telephone link"],
    gettingHere: ["طريقة الوصول", "Getting here"],
    products: ["المنتجات", "Products"],
    lede: ["النص التمهيدي", "Lede"],
    cta: ["نص الإجراء", "Call to action"],
    inside: ["المحتويات", "What is inside"],
    audience: ["الفئة المناسبة", "Audience"],
    formats: ["الخطط", "Formats"],
    includes: ["المحتويات", "Includes"],
    showPrice: ["إظهار السعر علناً", "Show price publicly"],
    _internalPricing: ["الأسعار الداخلية", "Internal pricing"],
    offer: ["السعر الداخلي", "Internal offer price"],
    was: ["السعر السابق الداخلي", "Previous internal price"],
    period: ["المدة", "Period"],
    currency: ["العملة", "Currency"],
    categories: ["التصنيفات", "Categories"],
    articles: ["المقالات", "Articles"],
    videos: ["فيديوهات تجارب المرضى", "Patient testimonial videos"],
    youtubeId: ["معرّف فيديو YouTube", "YouTube video ID"],
    screenshots: ["صور رسائل العملاء", "Feedback screenshots"],
    topics: ["موضوعات الآراء", "Review topics"],
    items: ["العناصر", "Items"],
    pending: ["بانتظار المراجعة", "Pending moderation"],
    beforeAfter: ["قبل وبعد", "Before and after"],
    pairs: ["الأزواج", "Pairs"],
    before: ["صورة قبل", "Before image"],
    after: ["صورة بعد", "After image"],
    contact: ["بيانات التواصل", "Contact"],
    social: ["روابط التواصل", "Social links"],
    proof: ["دلائل الثقة", "Trust signals"],
    nav: ["التنقل", "Navigation"],
    mega: ["قائمة كبيرة", "Mega menu"],
    childrenFrom: ["مصدر العناصر الفرعية", "Children source"],
    children: ["العناصر الفرعية", "Children"],
    footer: ["تذييل الموقع", "Footer"],
    columns: ["الأعمدة", "Columns"],
    links: ["الروابط", "Links"],
    linksFrom: ["مصدر الروابط", "Links source"],
    stats: ["الإحصاءات", "Statistics"],
    legal: ["النصوص القانونية", "Legal copy"],
    i18n: ["اللغات", "Languages"],
    ui: ["نصوص الواجهة", "Interface labels"],
    href: ["الرابط", "Link"],
    url: ["الرابط", "URL"],
    email: ["البريد الإلكتروني", "Email"],
    media: ["سجل الصور", "Media registry"],
    illustrative: ["صورة توضيحية مؤقتة", "Illustrative placeholder"],
    _todoAddress: [
      "بيانات العنوان المطلوب تأكيدها",
      "Address details needing confirmation",
    ],
    _todoBylines: [
      "بيانات الكاتب والمراجع المطلوب تأكيدها",
      "Author and reviewer details needing confirmation",
    ],
    _todoReview: ["مراجعة مطلوبة قبل النشر", "Review needed before publishing"],
    addReview: ["نص زر أضف تجربتك", "Share-experience button text"],
    analytics: ["أكواد القياس والتحقق", "Analytics & verification"],
    ga4MeasurementId: ["معرّف قياس GA4", "GA4 measurement ID"],
    clarityProjectId: ["معرّف مشروع Clarity", "Clarity project ID"],
    metaPixelId: ["معرّف Meta Pixel", "Meta Pixel ID"],
    tiktokPixelId: ["معرّف TikTok Pixel", "TikTok Pixel ID"],
    googleSiteVerification: ["رمز تحقق Google", "Google verification token"],
    googleVerificationFile: [
      "اسم ملف تحقق Google",
      "Google verification filename",
    ],
    bingSiteVerification: ["رمز تحقق Bing", "Bing verification token"],
    platform: ["المنصة", "Platform"],
    objective: ["الهدف", "Objective"],
    startDate: ["تاريخ البداية", "Start date"],
    endDate: ["تاريخ النهاية", "End date"],
    budget: ["الميزانية الداخلية", "Internal budget"],
    utmSource: ["مصدر UTM", "UTM source"],
    utmMedium: ["وسيط UTM", "UTM medium"],
    utmCampaign: ["اسم حملة UTM", "UTM campaign"],
    landingUrl: ["صفحة الهبوط", "Landing URL"],
    notes: ["ملاحظات", "Notes"],
    altLabel: ["اسم اللغة البديل", "Alternative language label"],
    ar: ["النص بالعربية", "Arabic text"],
    blurb: ["نبذة تذييل الموقع", "Footer summary"],
    bookNow: ["نص زر احجز موعدك", "Book-appointment button text"],
    bookShort: ["نص زر الحجز المختصر", "Short booking button text"],
    bookingNote: ["ملاحظة الحجز", "Booking note"],
    brand: ["بيانات العلامة", "Brand details"],
    calculate: ["نص زر احسب", "Calculate button text"],
    callUs: ["نص زر اتصل بينا", "Call-us button text"],
    clinicDays: ["تسمية أيام العيادة", "Clinic-days label"],
    close: ["نص زر الإغلاق", "Close button text"],
    code: ["كود اللغة", "Language code"],
    comingSoon: ["رسالة قريباً", "Coming-soon message"],
    conditionsTreated: [
      "عنوان الحالات اللي بنعالجها",
      "Conditions-treated heading",
    ],
    copyright: ["نص حقوق النشر", "Copyright text"],
    dir: ["اتجاه الكتابة", "Text direction"],
    disclaimer: ["التنبيه الطبي", "Medical disclaimer"],
    ekshefClinicId: ["معرّف العيادة على اكشف", "Ekshef clinic ID"],
    en: ["النص بالإنجليزية", "English text"],
    findAppointment: ["نص البحث عن موعد", "Find-appointment text"],
    formsEndpoint: ["رابط استقبال النماذج", "Form submission endpoint"],
    healthTools: ["عنوان الأدوات الصحية", "Health-tools heading"],
    home: ["تسمية الصفحة الرئيسية", "Home-page label"],
    homeHero: ["صورة واجهة الصفحة الرئيسية", "Home-page hero image"],
    homeVisits: ["نص الزيارات المنزلية", "Home-visits text"],
    instagram: ["رابط إنستجرام", "Instagram URL"],
    instagramBeforeAfter: [
      "رابط إنستجرام لقبل وبعد",
      "Before-and-after Instagram URL",
    ],
    instagramStories: ["رابط قصص إنستجرام", "Instagram Stories URL"],
    integrations: ["إعدادات استقبال النماذج", "Form integration settings"],
    key: ["المفتاح الداخلي للقائمة", "Navigation item key"],
    knowledgeCentre: ["عنوان مركز المعرفة", "Knowledge-centre heading"],
    latinTerms: [
      "مصطلحات تُعرض بالحروف اللاتينية",
      "Terms displayed in Latin script",
    ],
    learnMore: ["نص زر اعرف أكتر", "Learn-more button text"],
    line1: ["السطر الأول من اسم العلامة", "Wordmark first line"],
    line2: ["السطر الثاني من اسم العلامة", "Wordmark second line"],
    linktree: ["رابط لينك تري", "Linktree URL"],
    locale: ["رمز إعداد اللغة", "Locale code"],
    menu: ["نص زر القائمة", "Menu button text"],
    n: ["الرقم الظاهر", "Displayed statistic"],
    number: ["رقم واتساب بدون تنسيق", "Unformatted WhatsApp number"],
    onlineFollowUp: ["نص المتابعة أونلاين", "Online-follow-up text"],
    onlineGroup: [
      "تفاصيل السعر الداخلي للمجموعة أونلاين",
      "Internal online-group pricing",
    ],
    onlinePrivate3Months: [
      "تفاصيل السعر الداخلي للمتابعة الخاصة لثلاثة أشهر",
      "Internal three-month private pricing",
    ],
    onlinePrivateMonth: [
      "تفاصيل السعر الداخلي للمتابعة الخاصة لشهر",
      "Internal one-month private pricing",
    ],
    openNow: ["رسالة مفتوح الآن", "Open-now message"],
    openingSoon: ["رسالة الافتتاح قريباً", "Opening-soon message"],
    ourDoctors: ["عنوان أطباء القسم", "Department-doctors heading"],
    placeholder: ["الصورة لسه مؤقتة", "Image is still a placeholder"],
    priceOnConsult: ["رسالة السعر بعد الكشف", "Price-on-consultation message"],
    primary: ["ملف الشعار الأساسي", "Primary logo file"],
    publishedOn: ["نص تاريخ النشر", "Published-on text"],
    qa: ["عنوان اسأل الطبيب", "Ask-the-doctor heading"],
    readMore: ["نص زر اقرأ المزيد", "Read-more button text"],
    recipeBook: [
      "تفاصيل السعر الداخلي لكتاب الوصفات",
      "Internal recipe-book pricing",
    ],
    reset: ["نص زر إعادة البدء", "Reset button text"],
    resultsVary: ["تنبيه اختلاف النتائج", "Results-vary notice"],
    sampleContent: ["تنبيه المحتوى التجريبي", "Sample-content notice"],
    saveLocal: ["رسالة حفظ البيانات على جهازك", "Local-data storage message"],
    selectBranch: ["نص اختيار الفرع", "Branch-selection prompt"],
    selectDoctor: ["نص اختيار الطبيب", "Doctor-selection prompt"],
    selectSpecialty: ["نص اختيار التخصص", "Specialty-selection prompt"],
    skipToContent: ["نص تخطي القائمة للمحتوى", "Skip-to-content link text"],
    specialty: ["التخصص المرتبط", "Linked specialty"],
    tabDoctors: ["اسم تبويب الأطباء", "Doctors tab label"],
    tabFaq: ["اسم تبويب الأسئلة الشائعة", "FAQ tab label"],
    tabOverview: ["اسم تبويب النظرة العامة", "Overview tab label"],
    tabResults: ["اسم تبويب النتائج", "Results tab label"],
    tabReviews: ["اسم تبويب الآراء", "Reviews tab label"],
    tips: ["عنوان نصيحة اليوم", "Daily-tip heading"],
    toolDisclaimer: ["التنبيه أسفل الأدوات", "Tool disclaimer"],
    updates: ["عنوان المستجدات", "Updates heading"],
    viewAll: ["نص زر عرض الكل", "View-all button text"],
    viewProfile: ["نص زر عرض الملف", "View-profile button text"],
    viewSpecialty: ["نص زر عرض التخصص", "View-specialty button text"],
    whatsappShort: ["نص واتساب المختصر", "Short WhatsApp text"],
    wordmarkWhite: ["ملف الشعار النصي الفاتح", "Light wordmark file"],
    youtube: ["رابط يوتيوب", "YouTube URL"],
    youtubeTestimonials: [
      "رابط تجارب العملاء على يوتيوب",
      "YouTube testimonials URL",
    ],
  };

  const ARRAY_ITEM_TEMPLATES = {
    treatments: {
      slug: "",
      name: { ar: "", en: "" },
      summary: { ar: "", en: "" },
      body: { ar: "", en: "" },
      facts: { ar: [], en: [] },
    },
    results: {
      image: "",
      alt: { ar: "", en: "" },
      caption: { ar: "", en: "" },
      consent: false,
    },
    videos: {
      youtubeId: "",
      title: { ar: "", en: "" },
      caption: { ar: "", en: "" },
    },
    screenshots: {
      image: "",
      source: "other",
      alt: { ar: "", en: "" },
      consent: false,
    },
    faq: { q: { ar: "", en: "" }, a: { ar: "", en: "" } },
    sections: { id: "", heading: { ar: "", en: "" }, body: { ar: "", en: "" } },
    sources: { label: "", url: "" },
    photos: { src: "", alt: { ar: "", en: "" } },
    nav: {
      key: "",
      label: { ar: "", en: "" },
      href: "",
      mega: false,
      childrenFrom: "",
      children: [],
    },
    stats: { n: "", label: { ar: "", en: "" } },
    columns: { title: { ar: "", en: "" }, linksFrom: "", links: [] },
    links: { label: { ar: "", en: "" }, href: "" },
    children: { label: { ar: "", en: "" }, href: "", desc: { ar: "", en: "" } },
    formats: {
      slug: "",
      name: { ar: "", en: "" },
      summary: { ar: "", en: "" },
      includes: { ar: [], en: [] },
      showPrice: false,
    },
    inside: { ar: "", en: "" },
    audience: { ar: "", en: "" },
    pairs: { slug: "", sample: true, before: "", after: "", specialty: "" },
  };

  const COLLECTION_TEMPLATES = {
    specialties: {
      slug: "",
      index: "",
      published: false,
      staffed: false,
      featured: false,
      hasBeforeAfter: false,
      hasReviews: false,
      icon: "",
      name: { ar: "", en: "" },
      short: { ar: "", en: "" },
      sub: { ar: "", en: "" },
      intro: { ar: "", en: "" },
      treats: { ar: [], en: [] },
      treatments: [],
      faq: [],
      seo: { title: { ar: "", en: "" }, description: { ar: "", en: "" } },
      _todo: "Confirm all medical copy with the clinic before publishing.",
    },
    doctors: {
      slug: "",
      sample: false,
      published: false,
      featured: false,
      name: { ar: "", en: "" },
      title: { ar: "", en: "" },
      credentials: { ar: [], en: [] },
      days: { ar: "", en: "" },
      hours: { ar: "", en: "" },
      branches: [],
      specialties: [],
      portrait: "",
      portrait2x: "",
      portraitPlaceholder: false,
      bio: { ar: "", en: "" },
      _evidence: "",
      _source: "",
      _todo:
        "Confirm title, credentials, schedule, branches, specialties, biography, and portrait with the clinic before publishing.",
    },
    branches: {
      slug: "",
      published: false,
      status: "soon",
      isPrimary: false,
      name: { ar: "", en: "" },
      shortName: { ar: "", en: "" },
      area: { ar: "", en: "" },
      city: { ar: "", en: "" },
      country: { ar: "", en: "" },
      address: { ar: "", en: "" },
      landmark: { ar: "", en: "" },
      geo: { lat: null, lng: null },
      plusCode: "",
      mapsUrl: "",
      phone: { display: "", tel: "" },
      whatsapp: "",
      hours: { ar: "", en: "" },
      specialties: [],
      photos: [],
      intro: { ar: "", en: "" },
      gettingHere: { ar: [], en: [] },
      _todo:
        "Confirm the address, schedule, contact details, map, and photographs with the clinic before publishing.",
    },
    categories: {
      slug: "",
      name: { ar: "", en: "" },
      desc: { ar: "", en: "" },
      specialty: "",
    },
    articles: {
      slug: "",
      type: "article",
      published: false,
      featured: false,
      category: "",
      specialties: [],
      date: "",
      readingTime: 0,
      author: null,
      reviewedBy: null,
      image: null,
      title: { ar: "", en: "" },
      excerpt: { ar: "", en: "" },
      sections: [],
      faq: [],
      sources: [],
      tags: { ar: [], en: [] },
      imagePlaceholder: false,
      _todo:
        "Confirm the author, reviewer, sources, and medical copy before publishing.",
    },
    reviews: {
      id: "",
      published: false,
      sample: false,
      status: "pending",
      name: { ar: "", en: "" },
      text: { ar: "", en: "" },
      rating: 5,
      source: "Google",
      date: null,
      doctor: null,
      specialties: [],
    },
    products: {
      slug: "",
      published: false,
      featured: false,
      sample: false,
      type: "",
      icon: "",
      image: null,
      name: { ar: "", en: "" },
      short: { ar: "", en: "" },
      lede: { ar: "", en: "" },
      formats: [],
      inside: [],
      audience: [],
      faq: [],
      cta: { ar: "", en: "" },
      showPrice: false,
      _todo: "Confirm the product details with the clinic before publishing.",
    },
    campaigns: {
      id: "",
      name: "",
      platform: "meta",
      objective: "leads",
      status: "planned",
      startDate: "",
      endDate: "",
      budget: 0,
      currency: "EGP",
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      landingUrl: "",
      audience: "",
      notes: "",
    },
  };

  const VALIDATION_RULES = {
    "specialties.json": [
      {
        key: "specialties",
        id: "slug",
        required: ["slug", "name.ar", "name.en"],
      },
    ],
    "doctors.json": [
      { key: "doctors", id: "slug", required: ["slug", "name.ar", "name.en"] },
    ],
    "branches.json": [
      {
        key: "branches",
        id: "slug",
        required: ["slug", "status", "name.ar", "name.en"],
      },
    ],
    "articles.json": [
      {
        key: "categories",
        id: "slug",
        required: ["slug", "name.ar", "name.en"],
      },
      {
        key: "articles",
        id: "slug",
        required: ["slug", "type", "category", "title.ar", "title.en"],
      },
    ],
    "reviews.json": [{ key: "reviews", id: "id", required: ["id"] }],
    "digital.json": [
      {
        key: "products",
        id: "slug",
        required: ["slug", "type", "name.ar", "name.en"],
      },
    ],
    "campaigns.json": [
      { key: "campaigns", id: "id", required: ["id", "name"] },
    ],
  };

  const FILE_SECTIONS = Object.fromEntries(
    Object.entries(COLLECTION_SECTIONS).map(([section, config]) => [
      config.file,
      section,
    ]),
  );

  const state = {
    content: {},
    apiStatus: null,
    section: "overview",
    activeGroups: {},
    selected: {},
    settingsFile: "site.json",
    dirtyFiles: new Set(),
    fileMutations: {},
    // file -> the revision that was loaded, sent back on save so the
    // server can refuse a write built on a stale copy.
    contentRevs: {},
    conflict: null,
    listQuery: "",
    listFacet: "",
    settingsQuery: "",
    collectionPane: "list",
    images: [],
    imagesLoaded: false,
    // Set once a request has finished, success or failure, so a failed load
    // shows its error instead of being retried from every render.
    imagesAttempted: false,
    imagesLoading: false,
    imagesReloadPending: false,
    imagesError: null,
    backups: [],
    backupsLoaded: false,
    backupsAttempted: false,
    backupsLoading: false,
    backupsError: null,
    imageDir: "",
    imageQuery: "",
    editorContext: null,
    uploadTarget: null,
    uploadReturnFocus: null,
    uploadedValue: "",
    connected: false,
    savingFiles: new Set(),
    pipelineResult: null,
    operation: null,
    mode: "local",
    gitStatus: null,
  };

  let fieldSequence = 0;
  let toastTimer = null;

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function humanise(key) {
    return String(key)
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[-_]+/g, " ")
      .replace(/^\w/, (letter) => letter.toUpperCase());
  }

  function labelsFor(key) {
    return FIELD_LABELS[key] || [humanise(key), humanise(key)];
  }

  function labelHtml(key) {
    const [ar, en] = labelsFor(key);
    return `${escapeHtml(ar)} <small lang="en" dir="ltr">${escapeHtml(en)}</small>`;
  }

  function requiredMarkHtml() {
    return ' <span class="required-mark" aria-hidden="true">*</span><span class="visually-hidden">مطلوب · Required</span>';
  }

  function bilingualHeading(ar, en) {
    return `${escapeHtml(ar)} <small lang="en" dir="ltr">${escapeHtml(en)}</small>`;
  }

  function bilingualDescription(value) {
    const [ar, ...englishParts] = String(value || "").split(" · ");
    if (!englishParts.length) return escapeHtml(ar);
    return `${escapeHtml(ar)} <span class="english-copy" lang="en" dir="ltr">${escapeHtml(englishParts.join(" · "))}</span>`;
  }

  function isPlainObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
  }

  function isBilingual(value) {
    return (
      isPlainObject(value) &&
      Object.prototype.hasOwnProperty.call(value, "ar") &&
      Object.prototype.hasOwnProperty.call(value, "en")
    );
  }

  function deepClone(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }

  function blankLike(value, key = "") {
    if (Array.isArray(value)) return [];
    if (isPlainObject(value)) {
      return Object.fromEntries(
        Object.entries(value).map(([childKey, child]) => [
          childKey,
          blankLike(child, childKey),
        ]),
      );
    }
    if (typeof value === "boolean") return key === "published";
    if (typeof value === "number") return 0;
    if (value === null) return null;
    return "";
  }

  function pathToken(path) {
    return encodeURIComponent(JSON.stringify(path));
  }

  function readPathToken(token) {
    return JSON.parse(decodeURIComponent(token));
  }

  function getAt(root, path) {
    return path.reduce((value, key) => value?.[key], root);
  }

  function setAt(root, path, value) {
    if (!path.length) return;
    const parent = getAt(root, path.slice(0, -1));
    if (parent !== undefined && parent !== null)
      parent[path[path.length - 1]] = value;
  }

  function dottedPath(path) {
    return path
      .map((part, index) =>
        typeof part === "number" ? `[${part}]` : `${index ? "." : ""}${part}`,
      )
      .join("");
  }

  function requiredPathsFor(file, collection, item) {
    const rule = (VALIDATION_RULES[file] || []).find(
      (candidate) => candidate.key === collection,
    );
    if (!rule) return [];
    const required = [...rule.required];
    if (collection === "reviews" && item?.published === true) {
      required.push("name.ar", "name.en", "text.ar", "text.en");
    }
    return required;
  }

  function isRequiredPath(file, path) {
    if (file === "site.json") {
      return [
        "brand.name.ar",
        "brand.name.en",
        "brand.domain",
        "contact.phone.display",
        "contact.phone.tel",
      ].includes(path.join("."));
    }
    const [collection, index, ...relative] = path;
    if (typeof collection !== "string" || !Number.isInteger(index))
      return false;
    const item = state.content[file]?.[collection]?.[index];
    return requiredPathsFor(file, collection, item).includes(
      relative.join("."),
    );
  }

  function validateFile(file) {
    const data = state.content[file];
    const issues = [];
    if (!isPlainObject(data))
      return [{ path: [], message: "The content root must be a JSON object." }];
    /* Keep this identical to rule 8 in tools/validate.mjs. Internal figures
       belong only under a pricing/price(s) subtree; every other string can be
       rendered publicly and must be stopped before the save reaches disk. */
    const priceLeak =
      /[\d\u0660-\u0669][\d,\u0660-\u0669\s]{1,8}(\u062c\.?\u0645|\u062c\u0646\u064a\u0647|\bEGP\b|\bLE\b)/;
    const pricingPath = /(^|\.)(pricing|prices|price)(\.|\[|$)/i;

    const walk = (value, path = []) => {
      if (Array.isArray(value))
        return value.forEach((child, index) => walk(child, path.concat(index)));
      if (!isPlainObject(value)) return;
      Object.entries(value).forEach(([key, child]) => {
        const nextPath = path.concat(key);
        if (key === "showPrice" && child !== false) {
          issues.push({
            path: nextPath,
            message: `${dottedPath(nextPath)} must remain false.`,
          });
        }
        if (
          typeof child === "string" &&
          child &&
          !pricingPath.test(dottedPath(nextPath))
        ) {
          const leak = priceLeak.exec(child);
          if (leak) {
            issues.push({
              path: nextPath,
              message: `${dottedPath(nextPath)} looks like it contains a price ("${leak[0].trim()}"). Prices are never shown publicly.`,
            });
          }
        }
        if (
          /url$/i.test(key) &&
          typeof child === "string" &&
          child &&
          !/^https?:\/\//i.test(child)
        ) {
          issues.push({
            path: nextPath,
            message: `${dottedPath(nextPath)} must be a complete http(s) URL.`,
          });
        }
        if (
          key === "date" &&
          typeof child === "string" &&
          child &&
          !/^\d{4}-\d{2}-\d{2}$/.test(child)
        ) {
          issues.push({
            path: nextPath,
            message: `${dottedPath(nextPath)} must use YYYY-MM-DD.`,
          });
        }
        if (
          key === "checked" &&
          typeof child === "string" &&
          child &&
          !/^\d{4}-\d{2}$/.test(child)
        ) {
          issues.push({
            path: nextPath,
            message: `${dottedPath(nextPath)} must use YYYY-MM.`,
          });
        }
        if (
          /email/i.test(key) &&
          typeof child === "string" &&
          child &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(child)
        ) {
          issues.push({
            path: nextPath,
            message: `${dottedPath(nextPath)} must be a valid email address.`,
          });
        }
        if (
          key === "lat" &&
          child !== null &&
          (!Number.isFinite(child) || child < -90 || child > 90)
        ) {
          issues.push({
            path: nextPath,
            message: `${dottedPath(nextPath)} must be between -90 and 90.`,
          });
        }
        if (
          key === "lng" &&
          child !== null &&
          (!Number.isFinite(child) || child < -180 || child > 180)
        ) {
          issues.push({
            path: nextPath,
            message: `${dottedPath(nextPath)} must be between -180 and 180.`,
          });
        }
        walk(child, nextPath);
      });
    };
    walk(data);

    (VALIDATION_RULES[file] || []).forEach((rule) => {
      const items = data[rule.key];
      if (!Array.isArray(items)) {
        issues.push({
          path: [rule.key],
          message: `${rule.key} must be an array.`,
        });
        return;
      }
      const seen = new Set();
      items.forEach((item, index) => {
        const base = [rule.key, index];
        if (!isPlainObject(item)) {
          issues.push({
            path: base,
            message: `${dottedPath(base)} must be an object.`,
          });
          return;
        }
        requiredPathsFor(file, rule.key, item).forEach((requiredPath) => {
          const path = requiredPath.split(".");
          const value = getAt(item, path);
          if (typeof value !== "string" || !value.trim()) {
            issues.push({
              path: base.concat(path),
              message: `${dottedPath(base.concat(path))} is required.`,
            });
          }
        });
        const identifier = item[rule.id];
        if (typeof identifier === "string" && identifier) {
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(identifier)) {
            issues.push({
              path: base.concat(rule.id),
              message: `${dottedPath(base.concat(rule.id))} must use lowercase Latin letters, numbers, and hyphens.`,
            });
          }
          if (seen.has(identifier)) {
            issues.push({
              path: base.concat(rule.id),
              message: `${rule.id} "${identifier}" is duplicated.`,
            });
          }
          seen.add(identifier);
        }
        if (
          Object.prototype.hasOwnProperty.call(item, "rating") &&
          (!Number.isFinite(item.rating) || item.rating < 1 || item.rating > 5)
        ) {
          issues.push({
            path: base.concat("rating"),
            message: `${dottedPath(base.concat("rating"))} must be between 1 and 5.`,
          });
        }
        if (
          Object.prototype.hasOwnProperty.call(item, "readingTime") &&
          (!Number.isFinite(item.readingTime) || item.readingTime < 0)
        ) {
          issues.push({
            path: base.concat("readingTime"),
            message: `${dottedPath(base.concat("readingTime"))} must be zero or greater.`,
          });
        }
      });
    });
    return issues;
  }

  function removeAt(root, path) {
    const parent = getAt(root, path.slice(0, -1));
    const key = path[path.length - 1];
    if (Array.isArray(parent)) parent.splice(Number(key), 1);
    else if (isPlainObject(parent)) delete parent[key];
  }

  function nextFieldId() {
    fieldSequence += 1;
    return `admin-field-${fieldSequence}`;
  }

  function itemName(item, index) {
    if (!isPlainObject(item)) return String(item ?? `#${index + 1}`);
    const candidates = [item.name, item.title, item.shortName, item.label];
    for (const candidate of candidates) {
      if (isBilingual(candidate))
        return candidate.ar || candidate.en || item.slug || `#${index + 1}`;
      if (typeof candidate === "string" && candidate) return candidate;
    }
    return item.slug || item.id || item.type || `#${index + 1}`;
  }

  function itemSecondary(item) {
    if (!isPlainObject(item)) return "";
    return [item.slug, item.type, item.status].filter(Boolean).join(" · ");
  }

  async function api(path, options = {}) {
    const response = await fetch(path, {
      ...options,
      headers: {
        "content-type": "application/json",
        ...(options.headers || {}),
      },
    });
    let body = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }
    if (!response.ok) {
      const error = new Error(
        body?.error || `${response.status} ${response.statusText}`,
      );
      error.validationErrors = body?.validationErrors || [];
      // A 409 carries the current file, so the caller can offer to load it.
      error.conflict = Boolean(body?.conflict);
      error.conflictFile = body?.file || null;
      error.conflictContent = body?.content ?? null;
      error.conflictRev = body?.rev || "";
      throw error;
    }
    return body;
  }

  function setOperation(message, type = "", details = "") {
    state.operation = { message, type, details };
    operationBanner.textContent = message;
    operationBanner.className = `operation-banner${type ? ` is-${type}` : ""}`;
    operationBanner.hidden = !message;
  }

  function markDirty(file) {
    if (state.mode === "hosted") return;
    if (file) {
      state.dirtyFiles.add(file);
      state.fileMutations[file] = (state.fileMutations[file] || 0) + 1;
    }
    updateChrome();
  }

  function fileState(file) {
    if (state.savingFiles.has(file)) {
      return {
        className: "is-saving",
        ar: "جاري حفظ الملف",
        en: "Saving file",
      };
    }
    if (state.dirtyFiles.has(file)) {
      return {
        className: "is-dirty",
        ar: "تغييرات في المسودة لم تُحفظ",
        en: "Draft has unsaved changes",
      };
    }
    return {
      className: "is-saved",
      ar: "لا توجد تغييرات للحفظ",
      en: "No unsaved changes",
    };
  }

  function renderFileState(file) {
    const status = fileState(file);
    return `<span class="editor-file-state ${status.className}" data-file-state="${escapeHtml(file)}">${bilingualHeading(status.ar, status.en)}</span>`;
  }

  function renderEditorSavebar(
    file,
    labelAr = "حفظ الملف",
    labelEn = "Save file",
  ) {
    return `<div class="editor-savebar" data-savebar-file="${escapeHtml(file)}" role="region" aria-label="حفظ ${escapeHtml(file)} · Save ${escapeHtml(file)}">
      <div class="editor-savebar__state">
        ${renderFileState(file)}
        <code dir="ltr" title="${escapeHtml(file)}">${escapeHtml(file)}</code>
        <span class="savebar-note">الزر يحفظ الملف ده فقط <small lang="en" dir="ltr">This saves this file only</small></span>
      </div>
      <button class="admin-btn admin-btn--primary" type="button" data-action="save-file" data-file="${escapeHtml(file)}">
        ${escapeHtml(labelAr)} <span lang="en" dir="ltr">${escapeHtml(labelEn)}</span>
      </button>
    </div>`;
  }

  function currentFile() {
    if (COLLECTION_SECTIONS[state.section])
      return COLLECTION_SECTIONS[state.section].file;
    if (state.section === "settings") return state.settingsFile;
    if (state.section === "images") return "site.json";
    if (state.section === "tips") return "tips.json";
    return null;
  }

  function updateChrome() {
    const file = currentFile();
    const hasDirty = state.dirtyFiles.size > 0;
    dirtyPill.hidden = !hasDirty;
    if (hasDirty) {
      const files = [...state.dirtyFiles].sort();
      dirtyPill.innerHTML = `<span class="dirty-pill__mark" aria-hidden="true">!</span><span>${state.dirtyFiles.size} ملف غير محفوظ <small lang="en" dir="ltr">${state.dirtyFiles.size} unsaved</small></span>`;
      dirtyPill.setAttribute(
        "aria-label",
        `ملفات غير محفوظة: ${files.join(", ")} · Unsaved files: ${files.join(", ")}`,
      );
      dirtyPill.title = files.join(", ");
    } else {
      dirtyPill.removeAttribute("aria-label");
      dirtyPill.removeAttribute("title");
    }
    topSave.disabled =
      state.mode === "hosted" ||
      !file ||
      !state.dirtyFiles.has(file) ||
      !state.connected ||
      state.savingFiles.has(file);
    if (topPublish) topPublish.disabled = state.mode === "hosted" || !(state.gitStatus?.dirty?.length || state.gitStatus?.ahead > 0);
    if (publishPill) {
      const count = state.gitStatus?.dirty?.length || 0;
      publishPill.hidden = state.mode === "hosted" || !(count || state.gitStatus?.ahead);
      publishPill.textContent = count ? `تغييرات غير منشورة · ${count} ملفات · Unpublished changes` : state.gitStatus?.ahead ? `${state.gitStatus.ahead} commits unpublished` : "";
    }
    topSave.setAttribute(
      "aria-busy",
      state.savingFiles.has(file) ? "true" : "false",
    );
    topSave.setAttribute(
      "aria-label",
      file
        ? `حفظ ${file} فقط · Save ${file} only`
        : "لا يوجد ملف مفتوح للحفظ · No editable file is open",
    );
    topSave.title = file
      ? `${file} · ${state.dirtyFiles.has(file) ? "Unsaved" : "No unsaved changes"}`
      : "";

    $$("[data-file-state]").forEach((element) => {
      const status = fileState(element.dataset.fileState);
      element.className = `editor-file-state ${status.className}`;
      element.innerHTML = bilingualHeading(status.ar, status.en);
    });
    $$('[data-action="save-file"][data-file]').forEach((button) => {
      const buttonFile = button.dataset.file;
      button.disabled =
        state.mode === "hosted" ||
        !state.connected ||
        !state.dirtyFiles.has(buttonFile) ||
        state.savingFiles.has(buttonFile);
      button.setAttribute(
        "aria-busy",
        state.savingFiles.has(buttonFile) ? "true" : "false",
      );
    });

    connectionPill.classList.remove("is-loading", "is-error");
    if (!state.connected) connectionPill.classList.add("is-error");
    connectionPill.innerHTML = state.connected
      ? '<span class="status-dot" aria-hidden="true"></span><span class="status-label">الخادم متصل <small lang="en" dir="ltr">Server connected</small></span>'
      : '<span class="status-dot" aria-hidden="true"></span><span class="status-label">الخادم غير متصل <small lang="en" dir="ltr">Server offline</small></span>';
  }

  function announce(message, type = "") {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.className = `admin-toast${type ? ` is-${type}` : ""}`;
    toast.hidden = false;
    toastTimer = window.setTimeout(() => {
      toast.hidden = true;
    }, 6500);
  }

  function setFormMessage(message, type = "") {
    const element = $("#editor-message");
    if (!element) return;
    element.textContent = message;
    element.className = `form-message${type ? ` is-${type}` : ""}`;
  }

  function viewHeading(meta, description, action = "") {
    return `<div class="view-head">
      <div>
        <h2>${bilingualHeading(meta.ar, meta.en)}</h2>
        ${description ? `<p>${bilingualDescription(description)}</p>` : ""}
      </div>
      ${action}
    </div>`;
  }

  function getTimestampFromStatus(status) {
    if (!status) return null;
    return (
      status.lastBuildTime ||
      status.lastBuild ||
      status.builtAt ||
      status.buildTime ||
      status.updatedAt ||
      status.build?.finishedAt ||
      null
    );
  }

  function formatTimestamp(value) {
    if (!value) return "غير متاح من واجهة الخادم";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat("ar-EG-u-nu-arab", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  }

  function findTodos() {
    const todos = [];

    function collectTodoStrings(value, file, path) {
      if (typeof value === "string") {
        todos.push({ file, path, pathLabel: dottedPath(path), text: value });
        return;
      }
      if (Array.isArray(value)) {
        value.forEach((child, index) =>
          collectTodoStrings(child, file, path.concat(index)),
        );
        return;
      }
      if (isPlainObject(value)) {
        Object.entries(value).forEach(([key, child]) =>
          collectTodoStrings(child, file, path.concat(key)),
        );
      }
    }

    function walk(value, file, path) {
      if (Array.isArray(value)) {
        value.forEach((child, index) => walk(child, file, path.concat(index)));
        return;
      }
      if (!isPlainObject(value)) return;
      Object.entries(value).forEach(([key, child]) => {
        const nextPath = path.concat(key);
        if (key === "_todo") collectTodoStrings(child, file, nextPath);
        else walk(child, file, nextPath);
      });
    }

    Object.entries(state.content).forEach(([file, data]) =>
      walk(data, file, []),
    );
    return todos;
  }

  function collectionArray(file, key) {
    const value = state.content[file]?.[key];
    return Array.isArray(value) ? value : [];
  }

  /* Everything growth.js needs from this closure. Built fresh on every call so
     the growth modules always see the current content and status objects. */
  function growthBridge() {
    return {
      content: state.content,
      status: state.apiStatus,
      mode: state.mode,
      markDirty,
      render,
      saveFile,
      setEditorContext(value) {
        state.editorContext = value;
      },
    };
  }

  function renderGrowthSection(section) {
    state.editorContext = null;
    return window.DashboardGrowth.render(section, growthBridge());
  }

  function countIllustrative(value) {
    if (Array.isArray(value))
      return value.reduce(
        (total, child) => total + countIllustrative(child),
        0,
      );
    if (!isPlainObject(value)) return 0;
    return (
      (value.illustrative === true ? 1 : 0) +
      Object.entries(value).reduce(
        (total, [key, child]) =>
          total + (key === "illustrative" ? 0 : countIllustrative(child)),
        0,
      )
    );
  }

  function renderPipelinePanel(result) {
    if (!result) return "";
    const build = result.build || {};
    const validation = result.validation || {};
    const statusText = result.ok
      ? "البناء والفحص نجحا · Build and validation passed"
      : "البناء أو الفحص به أخطاء · Build or validation failed";
    return `<section class="admin-panel pipeline-panel ${result.ok ? "is-success" : "is-error"}" aria-labelledby="pipeline-title">
      <div class="panel-head">
        <div>
          <h2 id="pipeline-title">نتيجة البناء والفحص <small lang="en" dir="ltr">Build and validation result</small></h2>
          <p>${bilingualDescription(statusText)}</p>
        </div>
        <span class="admin-badge ${result.ok ? "admin-badge--ok" : "admin-badge--error"}">${result.ok ? bilingualHeading("نجح", "Passed") : bilingualHeading("فشل", "Failed")}</span>
      </div>
      <div class="pipeline-grid">
        <details ${build.ok ? "" : "open"}>
          <summary>مخرجات البناء <small lang="en" dir="ltr">Build output</small></summary>
          <pre dir="ltr">${escapeHtml([build.out, build.err].filter(Boolean).join("\n") || "No build output returned.")}</pre>
        </details>
        <details ${validation.ok ? "" : "open"}>
          <summary>مخرجات الفحص <small lang="en" dir="ltr">Validator output</small></summary>
          <pre dir="ltr">${escapeHtml([validation.out, validation.err].filter(Boolean).join("\n") || "No validator output returned.")}</pre>
        </details>
      </div>
    </section>`;
  }

  function renderOverview() {
    state.editorContext = null;
    const specialties = collectionArray("specialties.json", "specialties");
    const doctors = collectionArray("doctors.json", "doctors");
    const articles = collectionArray("articles.json", "articles");
    const publishedSpecialties = specialties.filter(
      (item) => item.published === true,
    ).length;
    const unpublishedSpecialties = specialties.filter(
      (item) => item.published !== true,
    ).length;
    const doctorsWithoutPortrait = doctors.filter(
      (item) => !String(item.portrait || "").trim(),
    ).length;
    const doctorsWithoutCredentials = doctors.filter((item) => {
      const ar = Array.isArray(item.credentials?.ar)
        ? item.credentials.ar.filter(Boolean)
        : [];
      const en = Array.isArray(item.credentials?.en)
        ? item.credentials.en.filter(Boolean)
        : [];
      return !ar.length || !en.length;
    }).length;
    const articlesWithoutAuthor = articles.filter(
      (item) => !String(item.author || "").trim(),
    ).length;
    const articlesWithoutReviewer = articles.filter(
      (item) => !String(item.reviewedBy || "").trim(),
    ).length;
    const illustrativeImages = countIllustrative(
      state.content["site.json"]?.media,
    );
    const todos = findTodos();
    const status = state.apiStatus || {};
    const lastBuild = formatTimestamp(getTimestampFromStatus(status));
    const cards = [
      ["صفحة مولّدة", "Generated pages", status.pageCount ?? "?"],
      ["تخصص منشور", "Published specialties", publishedSpecialties],
      ["تخصص غير منشور", "Unpublished specialties", unpublishedSpecialties],
      ["طبيب بدون صورة", "Doctors missing portrait", doctorsWithoutPortrait],
      [
        "طبيب بمؤهلات ناقصة",
        "Doctors missing credentials",
        doctorsWithoutCredentials,
      ],
      ["محتوى بدون كاتب", "Articles missing author", articlesWithoutAuthor],
      [
        "محتوى بدون مراجع",
        "Articles missing reviewer",
        articlesWithoutReviewer,
      ],
      ["صورة توضيحية مؤقتة", "Illustrative images", illustrativeImages],
      ["معلومة مطلوبة", "TODO entries", todos.length],
    ];

    return `${viewHeading(
      SECTION_META.overview,
      "ملخص مباشر لحالة محتوى الموقع وما يحتاج مراجعة. · A live summary of site content and outstanding work.",
      '<button class="admin-btn admin-btn--accent" type="button" data-action="rebuild">إعادة بناء الموقع <span lang="en" dir="ltr">Rebuild site</span></button>',
    )}

    <section class="admin-panel admin-panel--olive" aria-labelledby="local-only-title">
      <div class="panel-head">
        <div>
          <h2 id="local-only-title">أداة داخلية اختيارية <small lang="en" dir="ltr">Optional internal tool</small></h2>
          <p>الموقع المنشور لا يحتاج لوحة الإدارة أو هذا الخادم علشان يتفتح. لوحة الإدارة بتشتغل محلياً فقط وبدون تسجيل دخول.</p>
          <small lang="en" dir="ltr">The published site never requires this dashboard or server. This unauthenticated tool is for localhost use only.</small>
        </div>
      </div>
      <div class="status-grid">
        <div class="status-line"><span>${bilingualHeading("حالة الخادم", "Server health")}</span><strong>${status.ok ? bilingualHeading("متصل", "Healthy") : bilingualHeading("غير متاح", "Unavailable")}</strong></div>
        <div class="status-line"><span>${bilingualHeading("حالة البناء", "Build state")}</span><strong>${status.building ? bilingualHeading("جاري البناء", "Building") : bilingualHeading("جاهز", "Idle")}</strong></div>
        <div class="status-line status-line--timestamp"><span>${bilingualHeading("آخر بناء من واجهة الخادم", "Last API build")}</span><strong>${escapeHtml(lastBuild)}</strong></div>
      </div>
    </section>

    <section class="admin-panel" aria-labelledby="counts-title">
      <div class="panel-head">
        <h2 id="counts-title">أعداد المحتوى <small lang="en" dir="ltr">Content counts</small></h2>
      </div>
      <div class="count-grid">
        ${cards
          .map(
            ([ar, en, count]) => `<article class="metric-card">
          <strong class="metric-card__number">${count}</strong>
          <span class="metric-card__label">${escapeHtml(ar)} <small lang="en" dir="ltr">${escapeHtml(en)}</small></span>
        </article>`,
          )
          .join("")}
      </div>
    </section>

    <section class="admin-panel" aria-labelledby="todos-title">
      <div class="panel-head">
        <div>
          <h2 id="todos-title">المعلومات الناقصة <small lang="en" dir="ltr">Content TODOs</small></h2>
          <p>${todos.length} بند موجود تحت مفتاح <code>_todo</code><span class="english-copy" lang="en" dir="ltr">${todos.length} strings found recursively.</span></p>
        </div>
      </div>
      ${
        todos.length
          ? `<div class="todo-list">${todos
              .map(
                (
                  todo,
                ) => `<button class="todo-item" type="button" data-action="open-todo" data-file="${escapeHtml(todo.file)}" data-path="${pathToken(todo.path)}">
        <strong>${escapeHtml(todo.file)}</strong>
        <code>${escapeHtml(todo.pathLabel)}</code>
        <p>${escapeHtml(todo.text)}</p>
        <span class="todo-item__action">افتح المحرر <small lang="en" dir="ltr">Open editor</small></span>
      </button>`,
              )
              .join("")}</div>`
          : '<p class="collection-empty">لا توجد بنود ناقصة مسجلة. · No <code>_todo</code> strings found.</p>'
      }
    </section>
    ${renderPipelinePanel(state.pipelineResult)}`;
  }

  function activeGroup(section) {
    const config = COLLECTION_SECTIONS[section];
    const savedKey = state.activeGroups[section];
    return (
      config.groups.find((group) => group.key === savedKey) || config.groups[0]
    );
  }

  function selectionKey(section, groupKey) {
    return `${section}:${groupKey}`;
  }

  function isPendingReview(review) {
    return (
      review?.status === "pending" ||
      review?.approved === false ||
      review?.published === false
    );
  }

  function orderedIndices(items, section) {
    const indices = items.map((_, index) => index);
    if (section === "reviews") {
      indices.sort(
        (a, b) =>
          Number(isPendingReview(items[b])) -
            Number(isPendingReview(items[a])) || a - b,
      );
    }
    return indices;
  }

  /* Which live page does a collection item correspond to? Used for the
     "open on the site" link beside each row. */
  function livePathFor(section, item) {
    const slug = item && typeof item.slug === "string" ? item.slug : null;
    if (!slug) return null;
    const map = {
      specialties: `specialties/${slug}.html`,
      doctors: `doctors/${slug}.html`,
      branches: `branches/${slug}.html`,
      articles: `articles/${slug}.html`,
      digital: `digital/${slug}.html`,
    };
    return map[section] ? `/ar/${map[section]}` : null;
  }

  function matchesQuery(item, q) {
    if (!q) return true;
    const hay = JSON.stringify(item || {}).toLowerCase();
    return q
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .every((w) => hay.includes(w));
  }

  function resetListFilters() {
    state.listQuery = "";
    state.listFacet = "";
  }

  function typeFacets(items) {
    const seen = new Map();
    items.forEach((it) => {
      const t = it && typeof it.type === "string" ? it.type : null;
      if (t) seen.set(t, (seen.get(t) || 0) + 1);
    });
    return [...seen.entries()].sort((a, b) => b[1] - a[1]);
  }

  function renderCollectionList({
    section,
    file,
    group,
    items,
    selectedIndex,
  }) {
    const q = state.listQuery || "";
    const facet = state.listFacet || "";
    const facets = typeFacets(items);
    const ordered = orderedIndices(items, section).filter((i) => {
      const it = items[i];
      if (facet && it?.type !== facet) return false;
      return matchesQuery(it, q);
    });
    const tools =
      items.length > 8 || facets.length
        ? `
      <div class="list-tools">
        <input class="list-search" type="search" data-list-search value="${escapeHtml(q)}"
               placeholder="ابحث في القائمة · Search this list"
               aria-label="ابحث في القائمة · Search this list">
        ${
          facets.length
            ? `<div class="list-filters">
          <button class="list-filter" type="button" data-list-facet="" aria-pressed="${!facet}">الكل <small lang="en" dir="ltr">All ${items.length}</small></button>
          ${facets.map(([t, n]) => `<button class="list-filter" type="button" data-list-facet="${escapeHtml(t)}" aria-pressed="${facet === t}">${escapeHtml(t)} ${n}</button>`).join("")}
        </div>`
            : ""
        }
        <span class="list-count">${ordered.length} من ${items.length}<small lang="en" dir="ltr">Showing ${ordered.length} of ${items.length}</small></span>
      </div>`
        : "";
    return `<aside class="collection-panel" aria-label="${escapeHtml(group.ar)} · ${escapeHtml(group.en)}">
      <div class="collection-panel__head">
        <span class="collection-count">${items.length} عنصر<small lang="en" dir="ltr">${items.length} items</small></span>
        <button class="admin-btn admin-btn--primary" type="button" data-action="add-item" data-file="${escapeHtml(file)}" data-collection="${escapeHtml(group.key)}">
          إضافة جديد <span lang="en" dir="ltr">Add new</span>
        </button>
      </div>
      ${tools}
      <div class="collection-list">
        ${
          ordered.length
            ? ordered
                .map((index) => {
                  const item = items[index];
                  const selected = index === selectedIndex;
                  const pending =
                    section === "reviews" && isPendingReview(item);
                  return `<article class="collection-item${selected ? " is-selected" : ""}">
            <button class="collection-item__open" type="button" data-action="select-item" data-index="${index}" data-collection="${escapeHtml(group.key)}"${selected ? ' aria-current="true"' : ""}>
              <span class="collection-item__name">${escapeHtml(itemName(item, index))}</span>
              <span class="collection-item__meta">
                ${itemSecondary(item) ? `<span dir="ltr">${escapeHtml(itemSecondary(item))}</span>` : ""}
                ${item?.sample === true ? `<span class="admin-badge admin-badge--sample">${bilingualHeading("تجريبي", "Sample")}</span>` : ""}
                ${pending ? `<span class="admin-badge admin-badge--pending">${bilingualHeading("معلّق", "Pending")}</span>` : ""}
              </span>
            </button>
            <div class="collection-item__tools">
              <button class="icon-action" type="button" data-action="move-item" data-file="${escapeHtml(file)}" data-collection="${escapeHtml(group.key)}" data-index="${index}" data-direction="-1" aria-label="حرّك ${escapeHtml(itemName(item, index))} لأعلى · Move up" ${index === 0 ? "disabled" : ""}>↑</button>
              <button class="icon-action" type="button" data-action="move-item" data-file="${escapeHtml(file)}" data-collection="${escapeHtml(group.key)}" data-index="${index}" data-direction="1" aria-label="حرّك ${escapeHtml(itemName(item, index))} لأسفل · Move down" ${index === items.length - 1 ? "disabled" : ""}>↓</button>
              ${
                Object.prototype.hasOwnProperty.call(item || {}, "published")
                  ? `<label class="mini-toggle" title="منشور · Published">
                <input type="checkbox" data-list-published data-file="${escapeHtml(file)}" data-collection="${escapeHtml(group.key)}" data-index="${index}" ${item?.published === true ? "checked" : ""}>
                <span>نشر <small lang="en" dir="ltr">Live</small></span>
              </label>`
                  : ""
              }
              ${livePathFor(section, item) ? `<a class="item-preview" href="${escapeHtml(livePathFor(section, item))}" target="_blank" rel="noopener" title="افتح الصفحة على الموقع · Open on the site">معاينة <small lang="en" dir="ltr">View</small></a>` : ""}
            </div>
          </article>`;
                })
                .join("")
            : q || facet
              ? '<p class="collection-empty">مفيش نتائج للبحث ده. · No items match this search.</p>'
              : '<p class="collection-empty">القائمة فاضية حالياً. · This collection is empty.</p>'
        }
      </div>
    </aside>`;
  }

  function renderCollectionEditor({ file, group, items, selectedIndex }) {
    if (
      selectedIndex === null ||
      selectedIndex === undefined ||
      !items[selectedIndex]
    ) {
      return `<section class="editor-panel editor-panel--empty">
        <div><p>اختار عنصراً من القائمة أو أضِف عنصراً جديداً.</p><small lang="en" dir="ltr">Select an item or add a new one.</small></div>
      </section>`;
    }

    const item = items[selectedIndex];
    const title = itemName(item, selectedIndex);

    return `<section class="editor-panel" aria-labelledby="editor-title">
      <div class="editor-head">
        <div>
          <p class="admin-kicker">تحرير العنصر <span lang="en" dir="ltr">Edit item</span></p>
          <h2 id="editor-title">${escapeHtml(title)}</h2>
        </div>
        <div class="editor-head__actions">
          <button class="admin-btn admin-btn--danger admin-btn--sm" type="button" data-action="delete-item" data-file="${escapeHtml(file)}" data-collection="${escapeHtml(group.key)}" data-index="${selectedIndex}">
            حذف <span lang="en" dir="ltr">Delete</span>
          </button>
          <button class="admin-btn admin-btn--primary admin-btn--sm" type="button" data-action="save-file" data-file="${escapeHtml(file)}">
            حفظ الملف <span lang="en" dir="ltr">Save file</span>
          </button>
        </div>
      </div>
      <form class="dynamic-form" data-editor-form data-file="${escapeHtml(file)}">
        ${renderObjectFields(item, [group.key, selectedIndex], 0)}
      </form>
      <p class="form-message" id="editor-message" role="status" aria-live="polite"></p>
    </section>`;
  }

  function renderFileExtras(file, fileData, collectionKeys) {
    const extras = Object.fromEntries(
      Object.entries(fileData).filter(([key]) => !collectionKeys.includes(key)),
    );
    if (!Object.keys(extras).length) return "";
    return `<details class="admin-panel file-extras">
      <summary>${bilingualHeading("حقول الملف الإضافية", "Additional file fields")}</summary>
      <div class="file-extras__body">
        <p class="field-help">بيانات الملف اللي مش جزءاً من قائمة العناصر الرئيسية. · File-level data outside the main item list.</p>
        <form class="dynamic-form" data-editor-form data-file="${escapeHtml(file)}">
          ${renderObjectFields(extras, [], 0)}
        </form>
        <button class="admin-btn admin-btn--primary" type="button" data-action="save-file" data-file="${escapeHtml(file)}">حفظ الملف <span lang="en" dir="ltr">Save file</span></button>
      </div>
    </details>`;
  }

  function renderReviewModeration(items) {
    const pending = items
      .map((review, index) => ({ review, index }))
      .filter(({ review }) => isPendingReview(review));
    return `<section class="admin-panel moderation-panel" aria-labelledby="moderation-title">
      <div class="panel-head">
        <div>
          <h2 id="moderation-title">قائمة المراجعة <small lang="en" dir="ltr">Moderation queue</small></h2>
          <p>${pending.length} رأي في انتظار المراجعة<span class="english-copy" lang="en" dir="ltr">${pending.length} pending reviews.</span></p>
        </div>
      </div>
      ${
        pending.length
          ? `<div class="moderation-list">${pending
              .map(
                ({ review, index }) => `<article class="moderation-item">
        <div>
          <strong>${escapeHtml(itemName(review, index))}</strong>
          <p>${escapeHtml((isBilingual(review.text) ? review.text.ar || review.text.en : review.text) || "بدون نص · No text")}</p>
        </div>
        <div class="moderation-actions">
          <button class="admin-btn admin-btn--primary admin-btn--sm" type="button" data-action="approve-review" data-index="${index}">اعتماد <span lang="en" dir="ltr">Approve</span></button>
          <button class="admin-btn admin-btn--danger admin-btn--sm" type="button" data-action="delete-review" data-index="${index}">حذف <span lang="en" dir="ltr">Delete</span></button>
        </div>
      </article>`,
              )
              .join("")}</div>`
          : '<p class="collection-empty">لا توجد آراء معلّقة. · No pending reviews.</p>'
      }
    </section>

    <section class="admin-panel" aria-labelledby="paste-title">
      <div class="panel-head">
        <div>
          <h2 id="paste-title">لصق آراء Google <small lang="en" dir="ltr">Bulk-paste Google reviews</small></h2>
          <p>افصل بين كل رأي والتاني بسطر فاضي. هيتضافوا كمسودات معلّقة علشان تراجع كل حقل قبل الاعتماد والحفظ.</p>
        </div>
      </div>
      <label class="field-label" for="google-review-paste">النص المنسوخ <small lang="en" dir="ltr">Pasted reviews</small></label>
      <textarea class="bulk-paste" id="google-review-paste" dir="auto" placeholder="Name / الاسم&#10;5 stars / ٥ نجوم&#10;Review text / نص الرأي&#10;&#10;…"></textarea>
      <div class="array-actions">
        <button class="admin-btn admin-btn--accent" type="button" data-action="parse-reviews">تحويل لمسودات <span lang="en" dir="ltr">Parse into drafts</span></button>
      </div>
    </section>`;
  }

  function renderCollectionSection(section) {
    const config = COLLECTION_SECTIONS[section];
    const group = activeGroup(section);
    const fileData = state.content[config.file] || {};
    if (!Array.isArray(fileData[group.key])) fileData[group.key] = [];
    const items = fileData[group.key];
    const key = selectionKey(section, group.key);
    let selectedIndex = state.selected[key];
    if (
      selectedIndex !== null &&
      selectedIndex !== undefined &&
      !items[selectedIndex]
    )
      selectedIndex = null;
    if ((selectedIndex === null || selectedIndex === undefined) && items.length)
      selectedIndex = 0;
    state.selected[key] = selectedIndex;
    state.editorContext = {
      file: config.file,
      root: fileData,
      mode: "collection",
      collection: group.key,
      index: selectedIndex,
    };
    fieldSequence = 0;

    const meta = SECTION_META[section];
    const tabs =
      config.groups.length > 1
        ? `<div class="collection-tabs" role="tablist" aria-label="أنواع المحتوى · Content groups">
      ${config.groups
        .map(
          (
            candidate,
          ) => `<button class="segment-btn${candidate.key === group.key ? " is-active" : ""}" id="collection-tab-${escapeHtml(section)}-${escapeHtml(candidate.key)}" type="button" role="tab" aria-selected="${candidate.key === group.key}" aria-controls="collection-panel-${escapeHtml(section)}-${escapeHtml(candidate.key)}" tabindex="${candidate.key === group.key ? "0" : "-1"}" data-action="select-collection" data-section="${section}" data-collection="${candidate.key}">
        ${escapeHtml(candidate.ar)} <small lang="en" dir="ltr">${escapeHtml(candidate.en)}</small>
      </button>`,
        )
        .join("")}
    </div>`
        : "";

    return `${viewHeading(meta, "عدّل المحتوى بلغتيه واحفظ الملف لإعادة بناء الموقع وفحصه تلقائياً. · Edit both languages, then save the file to rebuild and validate the site.")}
      ${tabs}
      ${section === "reviews" ? renderReviewModeration(items) : ""}
      <div class="collection-layout" role="tabpanel" id="collection-panel-${escapeHtml(section)}-${escapeHtml(group.key)}" aria-label="${escapeHtml(group.ar)} · ${escapeHtml(group.en)}">
        ${renderCollectionList({ section, file: config.file, group, items, selectedIndex })}
        ${renderCollectionEditor({ file: config.file, group, items, selectedIndex })}
      </div>
      ${renderFileExtras(
        config.file,
        fileData,
        config.groups.map((candidate) => candidate.key),
      )}`;
  }

  function inputTypeFor(key, value) {
    if (typeof value === "number") return "number";
    if (key === "date") return "date";
    if (key === "checked" && /^\d{4}-\d{2}$/.test(String(value)))
      return "month";
    if (/email/i.test(key)) return "email";
    if (/url$/i.test(key)) return "url";
    return "text";
  }

  function shouldUseTextarea(key, value) {
    return (
      typeof value === "string" &&
      (value.length > 90 ||
        value.includes("\n") ||
        /(body|bio|intro|description|excerpt|summary|text|note|todo|disclaimer|blurb)/i.test(
          key,
        ))
    );
  }

  function isImageKey(key) {
    return (
      /^(image|imageAlt|portrait|portrait2x|photo|thumbnail|cover|src|logo|before|after)$/i.test(
        key,
      ) && key !== "imageAlt"
    );
  }

  function scalarAttributes(key, value, path) {
    const attributes = [];
    if (isRequiredPath(state.editorContext?.file, path))
      attributes.push("required", 'aria-required="true"');
    if (key === "slug" || key === "id") {
      attributes.push(
        'pattern="[a-z0-9]+(?:-[a-z0-9]+)*"',
        'title="Lowercase Latin letters, numbers, and hyphens only"',
      );
    }
    if (key === "rating") attributes.push('min="1"', 'max="5"', 'step="1"');
    if (key === "readingTime") attributes.push('min="0"', 'step="1"');
    if (key === "lat") attributes.push('min="-90"', 'max="90"', 'step="any"');
    if (key === "lng") attributes.push('min="-180"', 'max="180"', 'step="any"');
    if (
      typeof value === "number" &&
      !["rating", "readingTime", "lat", "lng"].includes(key)
    )
      attributes.push('step="any"');
    return attributes.join(" ");
  }

  function enumOptionsFor(key) {
    const file = state.editorContext?.file;
    if (file === "articles.json" && key === "type")
      return ["article", "update", "qa", "tip"];
    if (file === "digital.json" && key === "type") return ["ebook", "service"];
    if (file === "branches.json" && key === "status") return ["open", "soon"];
    if (file === "reviews.json" && key === "status")
      return ["pending", "approved"];
    return null;
  }

  function renderScalarInput(
    key,
    value,
    path,
    customLabel = null,
    direction = null,
  ) {
    const id = nextFieldId();
    const required = isRequiredPath(state.editorContext?.file, path);
    const label = `${customLabel || labelHtml(key)}${required ? requiredMarkHtml() : ""}`;
    const token = pathToken(path);
    const originalType = value === null ? "null" : typeof value;
    const safeValue = value === null || value === undefined ? "" : value;
    const dirAttribute = direction
      ? ` dir="${direction}"`
      : typeof safeValue === "string"
        ? ' dir="auto"'
        : "";

    if (typeof value === "boolean") {
      return `<div class="boolean-field">
        <input id="${id}" type="checkbox" data-bind data-path="${token}" data-value-type="boolean" ${value ? "checked" : ""} ${key === "showPrice" ? "disabled" : ""}>
        <label for="${id}">${label}</label>
        ${key === "showPrice" ? '<p class="field-help">مقفول لحماية الصفحات العامة، الأسعار تظل داخل لوحة الإدارة فقط. · Locked: prices remain dashboard-only.</p>' : ""}
      </div>`;
    }

    const enumOptions = enumOptionsFor(key);
    if (enumOptions && typeof value === "string") {
      const options = Array.from(new Set([value, ...enumOptions]));
      return `<div class="admin-field">
        <label for="${id}">${label}</label>
        <select id="${id}" data-bind data-path="${token}" data-value-type="string" ${scalarAttributes(key, value, path)}${dirAttribute}>
          ${options.map((option) => `<option value="${escapeHtml(option)}"${option === value ? " selected" : ""}>${escapeHtml(option || "اختار · Choose")}</option>`).join("")}
        </select>
      </div>`;
    }

    const control = shouldUseTextarea(key, String(safeValue))
      ? `<textarea id="${id}" data-bind data-path="${token}" data-value-type="${originalType}" ${scalarAttributes(key, value, path)}${dirAttribute}>${escapeHtml(safeValue)}</textarea>`
      : `<input id="${id}" type="${inputTypeFor(key, value)}" value="${escapeHtml(safeValue)}" data-bind data-path="${token}" data-value-type="${originalType}" ${scalarAttributes(key, value, path)}${dirAttribute}>`;

    const field = `<div class="admin-field"><label for="${id}">${label}</label>${control}</div>`;
    if (!isImageKey(key)) return field;

    // Show the image, not just its path. A path alone gives an editor no way
    // to tell a correct value from a stale or wrong one.
    const preview =
      typeof safeValue === "string" && safeValue.trim()
        ? `<img class="field-thumb" src="../${escapeHtml(safeValue)}" alt=""
             onerror="this.dataset.missing='1';this.replaceWith(Object.assign(document.createElement('p'),{className:'field-thumb-missing',textContent:'الملف مش موجود · File not found'}))">`
        : "";
    return `<div class="image-control">
      ${field}
      <div class="image-control__actions">
        <button class="admin-btn admin-btn--quiet" type="button" data-action="open-upload" data-path="${token}">اختيار / رفع <span lang="en" dir="ltr">Choose / upload</span></button>
        ${safeValue ? `<a class="item-preview" href="../${escapeHtml(safeValue)}" target="_blank" rel="noopener">فتح · Open</a>` : ""}
      </div>
      ${preview}
    </div>`;
  }

  function renderBilingualField(key, value, path, depth) {
    const required =
      isRequiredPath(state.editorContext?.file, path.concat("ar")) ||
      isRequiredPath(state.editorContext?.file, path.concat("en"));
    return `<section class="bilingual-field">
      <p class="field-label">${labelHtml(key)}${required ? requiredMarkHtml() : ""}</p>
      <div class="bilingual-grid">
        <div>
          <span class="locale-tag" lang="ar" dir="rtl">AR · العربية</span>
          ${renderLocaleValue(key, value.ar, path.concat("ar"), "ar", depth)}
        </div>
        <div dir="ltr">
          <span class="locale-tag" lang="en">EN · English</span>
          ${renderLocaleValue(key, value.en, path.concat("en"), "en", depth)}
        </div>
      </div>
    </section>`;
  }

  function renderLocaleValue(key, value, path, locale, depth) {
    if (Array.isArray(value))
      return renderArrayEditor(key, value, path, depth + 1, true, locale);
    if (isPlainObject(value))
      return renderObjectField(key, value, path, depth + 1);
    const [ar, en] = labelsFor(key);
    const label =
      locale === "ar"
        ? `<span lang="ar">${escapeHtml(ar)}، العربية</span>`
        : `<span lang="en">${escapeHtml(en)}, English</span>`;
    return renderScalarInput(
      key,
      value,
      path,
      label,
      locale === "ar" ? "rtl" : "ltr",
    );
  }

  function arrayItemTemplate(key, items, path) {
    const joined = path.join(".");
    if (
      state.editorContext?.file === "reviews.json" &&
      joined === "topics.items"
    ) {
      return { count: 0, label: { ar: "", en: "" } };
    }
    if (
      state.editorContext?.file === "reviews.json" &&
      joined === "pending.items"
    ) {
      return deepClone(COLLECTION_TEMPLATES.reviews);
    }
    if (ARRAY_ITEM_TEMPLATES[key]) return deepClone(ARRAY_ITEM_TEMPLATES[key]);
    if (items.length) return blankLike(items[0], key);
    return "";
  }

  function renderArrayEditor(
    key,
    items,
    path,
    depth,
    embedded = false,
    locale = null,
  ) {
    const hasObjects =
      items.some(isPlainObject) || isPlainObject(ARRAY_ITEM_TEMPLATES[key]);
    const body = `<div class="array-field__body">
      <div>
        ${
          items.length
            ? items
                .map((item, index) => {
                  const itemPath = path.concat(index);
                  if (isPlainObject(item)) {
                    return `<article class="repeat-card">
              <div class="repeat-card__head">
                <strong>${escapeHtml(labelsFor(key)[0])} ${index + 1} <small lang="en" dir="ltr">Item ${index + 1}</small></strong>
                <div class="row-actions">
                  <button class="icon-action" type="button" data-action="move-array-item" data-path="${pathToken(itemPath)}" data-direction="-1" aria-label="حرّك العنصر لأعلى · Move item up" ${index === 0 ? "disabled" : ""}>↑</button>
                  <button class="icon-action" type="button" data-action="move-array-item" data-path="${pathToken(itemPath)}" data-direction="1" aria-label="حرّك العنصر لأسفل · Move item down" ${index === items.length - 1 ? "disabled" : ""}>↓</button>
                  <button class="admin-btn admin-btn--danger admin-btn--sm" type="button" data-action="remove-array-item" data-path="${pathToken(itemPath)}">حذف <span lang="en" dir="ltr">Remove</span></button>
                </div>
              </div>
              <div class="form-section">${renderObjectFields(item, itemPath, depth + 1)}</div>
            </article>`;
                  }
                  const customLabel = locale
                    ? `<span lang="${locale}">${escapeHtml(locale === "ar" ? labelsFor(key)[0] : labelsFor(key)[1])}${locale === "ar" ? "، العربية" : ", English"} ${index + 1}</span>`
                    : `${labelHtml(key)} ${index + 1}`;
                  return `<div class="array-row">
            ${renderScalarInput(key, item, itemPath, customLabel, locale === "ar" ? "rtl" : locale === "en" ? "ltr" : null)}
            <div class="row-actions">
              <button class="icon-action" type="button" data-action="move-array-item" data-path="${pathToken(itemPath)}" data-direction="-1" aria-label="حرّك العنصر لأعلى · Move item up" ${index === 0 ? "disabled" : ""}>↑</button>
              <button class="icon-action" type="button" data-action="move-array-item" data-path="${pathToken(itemPath)}" data-direction="1" aria-label="حرّك العنصر لأسفل · Move item down" ${index === items.length - 1 ? "disabled" : ""}>↓</button>
              <button class="admin-btn admin-btn--danger admin-btn--sm" type="button" data-action="remove-array-item" data-path="${pathToken(itemPath)}">حذف <span lang="en" dir="ltr">Remove</span></button>
            </div>
          </div>`;
                })
                .join("")
            : '<p class="field-help">القائمة فاضية. · Empty list.</p>'
        }
      </div>
      <div class="array-actions">
        <button class="admin-btn admin-btn--quiet admin-btn--sm" type="button" data-action="add-array-item" data-path="${pathToken(path)}" data-array-key="${escapeHtml(key)}" data-object-items="${hasObjects}">
          إضافة صف <span lang="en" dir="ltr">Add row</span>
        </button>
      </div>
    </div>`;

    if (embedded)
      return `<div class="array-field" style="margin-top:.3rem">${body}</div>`;
    return `<details class="array-field" ${depth < 2 ? "open" : ""}>
      <summary><span>${labelHtml(key)}</span><small>${items.length} items</small></summary>
      ${body}
    </details>`;
  }

  function renderObjectField(key, value, path, depth) {
    return `<details class="object-field" ${depth < 2 ? "open" : ""}>
      <summary><span>${labelHtml(key)}</span><small>{ }</small></summary>
      <div class="object-field__body">${renderObjectFields(value, path, depth + 1)}</div>
    </details>`;
  }

  function renderField(key, value, path, depth) {
    if (isBilingual(value))
      return renderBilingualField(key, value, path, depth);
    if (Array.isArray(value)) return renderArrayEditor(key, value, path, depth);
    if (isPlainObject(value)) return renderObjectField(key, value, path, depth);
    return renderScalarInput(key, value, path);
  }

  function renderObjectFields(object, basePath, depth) {
    const entries = Object.entries(object || {});
    if (!entries.length)
      return '<p class="collection-empty">لا توجد حقول في هذا الكائن. · This object has no fields.</p>';
    return entries
      .map(([key, value]) =>
        renderField(key, value, basePath.concat(key), depth),
      )
      .join("");
  }

  function renderSettings() {
    const files = ["site.json", "pages.json", "pricing.json"].filter(
      (file) => state.content[file],
    );
    if (!files.includes(state.settingsFile))
      state.settingsFile = files[0] || "site.json";
    const file = state.settingsFile;
    const root = state.content[file] || {};
    state.editorContext = { file, root, mode: "root" };
    fieldSequence = 0;

    return `${viewHeading(
      SECTION_META.settings,
      "كل حقول إعدادات الموقع متاحة هنا، بما فيها القوائم والمعلومات القانونية. · All site settings are editable here, including navigation and legal copy.",
    )}
    <div class="settings-tabs" role="tablist" aria-label="ملفات الإعدادات · Settings files">
      ${files.map((candidate) => `<button class="segment-btn${candidate === file ? " is-active" : ""}" id="settings-tab-${candidate.replace(/\W/g, "-")}" type="button" role="tab" aria-selected="${candidate === file}" aria-controls="settings-panel" tabindex="${candidate === file ? "0" : "-1"}" data-action="select-settings-file" data-file="${candidate}">${candidate}</button>`).join("")}
    </div>
    <section class="editor-panel" id="settings-panel" role="tabpanel" aria-labelledby="settings-tab-${file.replace(/\W/g, "-")}">
      <div class="editor-head">
        <div>
          <p class="admin-kicker">ملف المحتوى <span lang="en" dir="ltr">Content file</span></p>
          <h2 id="settings-editor-title" dir="ltr">${escapeHtml(file)}</h2>
        </div>
        <button class="admin-btn admin-btn--primary" type="button" data-action="save-file" data-file="${escapeHtml(file)}">حفظ الملف <span lang="en" dir="ltr">Save file</span></button>
      </div>
      <form class="dynamic-form" data-editor-form data-file="${escapeHtml(file)}">${renderObjectFields(root, [], 0)}</form>
      <p class="form-message" id="editor-message" role="status" aria-live="polite"></p>
    </section>`;
  }

  /* ------------------------------------------------------------------
     Media library. The old panel could only upload، with 78 images in the
     project there was no way to see, find or reuse what already existed.
     ------------------------------------------------------------------ */
  async function loadImages() {
    if (state.imagesLoaded || state.imagesLoading || state.imagesAttempted)
      return;
    state.imagesLoading = true;
    state.imagesError = null;
    try {
      const data = await api("/api/images");
      state.images = data.images || [];
      state.imagesLoaded = true;
    } catch (e) {
      state.imagesError = String(e.message);
    } finally {
      state.imagesLoading = false;
      state.imagesAttempted = true;
      if (state.imagesReloadPending) {
        state.imagesReloadPending = false;
        state.imagesLoaded = false;
        state.imagesAttempted = false;
        state.images = [];
        loadImages();
      } else if (state.section === "images" || state.section === "analytics")
        render();
    }
  }

  function invalidateImages(reload = false) {
    state.imagesLoaded = false;
    state.imagesAttempted = false;
    state.imagesError = null;
    state.images = [];
    if (!reload) return;
    if (state.imagesLoading) state.imagesReloadPending = true;
    else loadImages();
  }

  function humanBytes(n) {
    if (!n) return "";
    return n > 1024 * 1024
      ? (n / 1048576).toFixed(1) + " MB"
      : Math.round(n / 1024) + " KB";
  }

  function renderImages() {
    const siteData = state.content["site.json"] || {};
    state.editorContext = { file: "site.json", root: siteData, mode: "media" };
    fieldSequence = 0;
    loadImages();

    const all = state.images || [];
    const dirs = [...new Set(all.map((i) => i.dir))].sort();
    const dirFilter = state.imageDir || "";
    const q = (state.imageQuery || "").toLowerCase();
    const shown = all.filter(
      (i) =>
        (!dirFilter || i.dir === dirFilter) &&
        (!q || i.path.toLowerCase().includes(q)),
    );

    const tools = `
      <div class="media-tools">
        <input class="list-search" type="search" data-image-search value="${escapeHtml(state.imageQuery || "")}"
               placeholder="ابحث بالاسم أو المسار · Search by name or path"
               aria-label="ابحث في الصور · Search images">
        <div class="list-filters">
          <button class="list-filter" type="button" data-image-dir="" aria-pressed="${!dirFilter}">الكل <small lang="en" dir="ltr">All ${all.length}</small></button>
          ${dirs.map((d) => `<button class="list-filter" type="button" data-image-dir="${escapeHtml(d)}" aria-pressed="${dirFilter === d}">${escapeHtml(d)} ${all.filter((i) => i.dir === d).length}</button>`).join("")}
        </div>
      </div>`;

    const grid =
      state.imagesLoading && !state.imagesLoaded
        ? '<p class="collection-empty">جاري التحميل… · Loading…</p>'
        : shown.length
          ? `<div class="media-grid">${shown
              .map(
                (i) => `
            <figure class="media-item">
              <img src="../${escapeHtml(i.path)}" alt="" loading="lazy">
              <figcaption>
                <span class="media-name" dir="ltr" title="${escapeHtml(i.path)}">${escapeHtml(i.name)}</span>
                <span class="media-meta" dir="ltr">${escapeHtml(i.dir)} · ${humanBytes(i.bytes)}</span>
              </figcaption>
              <button class="admin-btn admin-btn--quiet media-copy" type="button"
                      data-action="copy-image-path" data-path="${escapeHtml(i.path)}">
                نسخ المسار <span lang="en" dir="ltr">Copy path</span>
              </button>
            </figure>`,
              )
              .join("")}</div>`
          : '<p class="collection-empty">مفيش صور مطابقة. · No images match.</p>';

    return `${viewHeading(
      SECTION_META.images,
      "كل صور الموقع في مكان واحد. ابحث، اعرض، انسخ المسار، أو ارفع صورة جديدة. · Every image in the project: search it, view it, copy its path, or upload a new one.",
      '<button class="admin-btn admin-btn--accent" type="button" data-action="open-upload">رفع صورة <span lang="en" dir="ltr">Upload image</span></button>',
    )}
    ${
      state.imagesError
        ? `<p class="form-message is-error">${escapeHtml(state.imagesError)}
      <button class="admin-btn admin-btn--quiet" type="button" data-action="refresh-images">إعادة المحاولة <span lang="en" dir="ltr">Retry</span></button></p>`
        : ""
    }
    <section class="admin-panel" aria-labelledby="media-registry-title">
      <div class="panel-head">
        <div>
          <h2 id="media-registry-title">سجل الصور <small lang="en" dir="ltr">Media registry</small></h2>
          <p>راجع حالة الصور التوضيحية المؤقتة وبياناتها الثنائية. · Review illustrative placeholders and their bilingual metadata.</p>
        </div>
        <button class="admin-btn admin-btn--primary" type="button" data-action="save-file" data-file="site.json">حفظ السجل <span lang="en" dir="ltr">Save registry</span></button>
      </div>
      <form class="dynamic-form" data-editor-form data-file="site.json">
        ${siteData.media ? renderField("media", siteData.media, ["media"], 0) : '<p class="collection-empty">لا يوجد سجل صور في site.json. · No media registry exists in site.json.</p>'}
      </form>
      <p class="form-message" id="editor-message" role="status" aria-live="polite"></p>
    </section>
    ${tools}
    ${grid}
    ${
      state.uploadedValue
        ? `<article class="info-card" style="margin-top:1rem">
      <h2>آخر مسار <small lang="en" dir="ltr">Latest uploaded path</small></h2>
      <div class="inline-control">
        <input type="text" value="${escapeHtml(state.uploadedValue)}" readonly aria-label="آخر مسار مرفوع · Latest uploaded path" dir="ltr">
        <button class="admin-btn admin-btn--quiet" type="button" data-action="copy-latest-path">نسخ <span lang="en" dir="ltr">Copy</span></button>
      </div>
    </article>`
        : ""
    }`;
  }

  async function loadBackups(force = false) {
    if (force) {
      state.backupsLoaded = false;
      state.backupsAttempted = false;
    }
    if (state.backupsLoaded || state.backupsLoading || state.backupsAttempted)
      return;
    state.backupsLoading = true;
    state.backupsError = null;
    try {
      const data = await api("/api/backups");
      state.backups = data.backups || [];
      state.backupsLoaded = true;
    } catch (error) {
      state.backupsError = error.message;
    } finally {
      state.backupsLoading = false;
      state.backupsAttempted = true;
      if (state.section === "backups") render();
    }
  }

  function renderBackups() {
    state.editorContext = null;
    loadBackups();
    const rows = state.backups
      .map(
        (backup) => `<tr>
      <td><code dir="ltr">${escapeHtml(backup.file)}</code></td>
      <td>${escapeHtml(formatTimestamp(backup.createdAt))}</td>
      <td dir="ltr">${escapeHtml(humanBytes(backup.bytes) || `${backup.bytes} B`)}</td>
      <td><button class="admin-btn admin-btn--danger admin-btn--sm" type="button" data-action="restore-backup" data-backup="${escapeHtml(backup.name)}" data-file="${escapeHtml(backup.file)}">استرجاع <span lang="en" dir="ltr">Restore</span></button></td>
    </tr>`,
      )
      .join("");
    return `${viewHeading(
      SECTION_META.backups,
      "الحفظ من لوحة الإدارة ينشئ نسخة احتياطية قبل استبدال أي ملف. · Every dashboard save creates a backup before replacing a file.",
      '<button class="admin-btn admin-btn--quiet" type="button" data-action="refresh-backups">تحديث القائمة <span lang="en" dir="ltr">Refresh</span></button>',
    )}
    <section class="admin-panel" aria-labelledby="backup-list-title">
      <div class="panel-head">
        <div>
          <h2 id="backup-list-title">آخر 20 نسخة لكل ملف <small lang="en" dir="ltr">Latest 20 per file</small></h2>
          <p>قبل الاسترجاع، ينشئ الخادم نسخة جديدة من الملف الحالي، ثم يعيد البناء والفحص. · Restore first preserves the current file, then rebuilds and validates.</p>
        </div>
      </div>
      ${state.backupsError ? `<p class="form-message is-error">${escapeHtml(state.backupsError)}</p>` : ""}
      ${
        state.backupsLoading && !state.backupsLoaded
          ? '<p class="collection-empty">جاري تحميل النسخ… · Loading backups…</p>'
          : state.backups.length
            ? `<div class="table-scroll" tabindex="0" aria-label="قائمة النسخ الاحتياطية · Backup list"><table class="backup-table">
              <thead><tr><th scope="col">${bilingualHeading("الملف", "File")}</th><th scope="col">${bilingualHeading("التاريخ", "Timestamp")}</th><th scope="col">${bilingualHeading("الحجم", "Size")}</th><th scope="col">${bilingualHeading("إجراء", "Action")}</th></tr></thead>
              <tbody>${rows}</tbody>
            </table></div>`
            : '<p class="collection-empty">لا توجد نسخ احتياطية بعد. أول حفظ سينشئ واحدة. · No backups yet. The first save will create one.</p>'
      }
    </section>`;
  }

  function renderConflictNotice() {
    if (!state.conflict) return "";
    return `<section class="admin-panel conflict-panel" role="alert">
      <div>
        <strong>${escapeHtml(state.conflict.file)} اتغير في نافذة تانية. المسودة المحلية لم تُحفظ. <span lang="en" dir="ltr">The file changed in another window. This local draft was not saved.</span></strong>
        <p>انسخ أي تعديل محتاجه، ثم حمّل النسخة الحالية من الخادم قبل ما تكمل. · Copy anything you need, then load the current server version before continuing.</p>
      </div>
      <button class="admin-btn admin-btn--danger" type="button" data-action="load-conflict-version">تحميل نسخة الخادم <span lang="en" dir="ltr">Load server version</span></button>
    </section>`;
  }

  function render() {
    const meta = SECTION_META[state.section] || SECTION_META.overview;
    viewTitle.innerHTML = bilingualHeading(meta.ar, meta.en);
    $$("[data-nav]").forEach((button) => {
      const active = button.dataset.nav === state.section;
      button.classList.toggle("is-active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });

    let html;
    if (state.mode === "hosted" && ["campaigns", "images", "backups"].includes(state.section)) {
      html = `${viewHeading(meta, "البيانات والإجراءات دي متاحة على الجهاز المحلي فقط. · This section is local-only.")}<section class="admin-panel"><p>متاح محلياً فقط حفاظاً على خصوصية البيانات. <span lang="en" dir="ltr">Local-only to keep private data and files out of the public site.</span></p></section>`;
    } else if (state.section === "overview") html = renderOverview();
    else if (state.section === "analytics") {
      state.editorContext = null;
      loadImages();
      html = window.DashboardAnalytics.renderAnalytics({
        content: state.content,
        status: state.apiStatus,
        images: state.images,
        imagesLoaded: state.imagesLoaded,
        imagesError: state.imagesError,
      });
    } else if (
      ["leads", "media-buying", "campaigns", "tips"].includes(state.section)
    ) {
      html = renderGrowthSection(state.section);
    } else if (COLLECTION_SECTIONS[state.section])
      html = renderCollectionSection(state.section);
    else if (state.section === "settings") html = renderSettings();
    else if (state.section === "images") html = renderImages();
    else html = renderBackups();

    viewRoot.className = "";
    viewRoot.removeAttribute("aria-busy");
    viewRoot.innerHTML = renderConflictNotice() + html;
    if (state.mode === "hosted") {
      $$('[data-editor-form] input, [data-editor-form] textarea, [data-editor-form] select, [data-action="save-file"], [data-action="add-item"], [data-action="delete-item"], [data-action="move-item"], [data-growth="save-campaign"], [data-growth^="tip-"]', viewRoot).forEach((control) => control.disabled = true);
    }
    updateChrome();
    // Overview, Analytics and Settings are rendered here but decorated by
    // growth.js, so it needs the bridge on this path too.
    window.DashboardGrowth?.afterRender?.(state.section, growthBridge());
  }

  function renderLoadError(error) {
    state.connected = false;
    state.editorContext = null;
    viewRoot.removeAttribute("aria-busy");
    viewRoot.innerHTML = `<section class="error-panel">
      <h2>تعذر الاتصال بالخادم · Could not reach the server</h2>
      <p>شغّل <code>node server/serve.mjs</code> وافتح لوحة الإدارة من رابط <code>localhost</code>، مش مباشرة من الملف.</p>
      <p dir="ltr">${escapeHtml(error.message)}</p>
      <button class="admin-btn admin-btn--primary" type="button" data-action="retry-load">إعادة المحاولة <span lang="en" dir="ltr">Retry</span></button>
    </section>`;
    updateChrome();
  }

  function templateForCollection(key, items) {
    return deepClone(
      COLLECTION_TEMPLATES[key] ||
        (items.length
          ? blankLike(items[0])
          : { name: { ar: "", en: "" }, published: false }),
    );
  }

  function focusPath(path) {
    const token = pathToken(path);
    const control =
      $$(`[data-bind]`).find((candidate) => candidate.dataset.path === token) ||
      $$(`[data-bind]`).find((candidate) => {
        const candidatePath = readPathToken(candidate.dataset.path);
        return path.every((part, index) => candidatePath[index] === part);
      });
    if (!control) return false;
    let parent = control.closest("details");
    while (parent) {
      parent.open = true;
      parent = parent.parentElement?.closest("details");
    }
    control.focus({ preventScroll: true });
    control.scrollIntoView({ behavior: "smooth", block: "center" });
    return true;
  }

  function openPathInEditor(file, path) {
    const section =
      file === "site.json" && path[0] === "media"
        ? "images"
        : FILE_SECTIONS[file] ||
          (file === "site.json" || file === "pages.json"
            ? "settings"
            : "overview");
    state.section = section;
    history.replaceState(null, "", `#${section}`);
    const config = COLLECTION_SECTIONS[section];
    if (config && typeof path[0] === "string" && Number.isInteger(path[1])) {
      const group = config.groups.find(
        (candidate) => candidate.key === path[0],
      );
      if (group) {
        state.activeGroups[section] = group.key;
        state.selected[selectionKey(section, group.key)] = path[1];
      }
    }
    if (section === "settings") state.settingsFile = file;
    resetListFilters();
    render();
    window.requestAnimationFrame(() => focusPath(path));
  }

  function addCollectionItem(file, collection) {
    const items = collectionArray(file, collection);
    const item = templateForCollection(collection, items);
    if (collection === "reviews" && !item.id) item.id = `review-${Date.now()}`;
    items.push(item);
    const key = selectionKey(state.section, collection);
    state.selected[key] = items.length - 1;
    markDirty(file);
    render();
    const firstRequired =
      requiredPathsFor(file, collection, item)[0]?.split(".") || [];
    window.requestAnimationFrame(() =>
      focusPath([collection, items.length - 1, ...firstRequired]),
    );
  }

  function deleteCollectionItem(file, collection, index) {
    const items = collectionArray(file, collection);
    const item = items[index];
    if (!item) return;
    const ok = window.confirm(
      `حذف «${itemName(item, index)}» من المسودة؟ لن يتغير الملف قبل الحفظ.\n\nDelete this item from the draft? The file will not change until you save.`,
    );
    if (!ok) return;
    items.splice(index, 1);
    const key = selectionKey(state.section, collection);
    state.selected[key] = items.length
      ? Math.min(index, items.length - 1)
      : null;
    markDirty(file);
    render();
  }

  function moveCollectionItem(file, collection, index, direction) {
    const items = collectionArray(file, collection);
    const target = index + direction;
    if (!items[index] || target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target], items[index]];
    const key = selectionKey(state.section, collection);
    const selected = state.selected[key];
    if (selected === index) state.selected[key] = target;
    else if (selected === target) state.selected[key] = index;
    markDirty(file);
    render();
    window.requestAnimationFrame(() =>
      $(
        `[data-action="select-item"][data-index="${state.selected[key]}"]`,
      )?.focus(),
    );
  }

  function moveArrayItem(path, direction) {
    if (!state.editorContext) return;
    const index = Number(path[path.length - 1]);
    const array = getAt(state.editorContext.root, path.slice(0, -1));
    const target = index + direction;
    if (!Array.isArray(array) || target < 0 || target >= array.length) return;
    [array[index], array[target]] = [array[target], array[index]];
    markDirty(state.editorContext.file);
    render();
    window.requestAnimationFrame(() =>
      focusPath(path.slice(0, -1).concat(target)),
    );
  }

  function removeArrayItem(path) {
    if (!state.editorContext) return;
    const ok = window.confirm(
      "حذف هذا الصف من المسودة؟ لن يتغير الملف قبل الحفظ.\n\nRemove this row from the draft? The file will not change until saved.",
    );
    if (!ok) return;
    removeAt(state.editorContext.root, path);
    markDirty(state.editorContext.file);
    render();
  }

  async function saveFile(file) {
    if (state.mode === "hosted") return;
    if (!file || !state.content[file] || state.savingFiles.has(file)) return;
    const forms = $$(`[data-editor-form][data-file="${file}"]`);
    for (const form of forms) {
      if (!form.reportValidity()) {
        const message =
          "راجع الحقول المطلوبة أو غير الصالحة قبل الحفظ. · Fix required or invalid fields before saving.";
        setFormMessage(message, "error");
        setOperation(message, "error");
        announce(message, "error");
        return;
      }
    }
    const validationIssues = validateFile(file);
    if (validationIssues.length) {
      const details = validationIssues.map((issue) => issue.message).join("\n");
      const message = `تعذر حفظ ${file}: راجع ${validationIssues.length} مشكلة. · Fix ${validationIssues.length} validation issue(s) before saving.`;
      setFormMessage(`${message}\n${details}`, "error");
      setOperation(message, "error", details);
      announce(message, "error");
      openPathInEditor(file, validationIssues[0].path);
      return;
    }

    state.savingFiles.add(file);
    /* The mutation number is captured with the payload. A save rebuilds the
       site, which takes seconds, and the form stays editable throughout: if
       someone types during that window, the request already carries the older
       value and clearing the dirty flag would strand the newer one in memory
       with Save disabled and no unload warning. */
    const sentMutation = state.fileMutations[file] || 0;
    const sentPayload = JSON.stringify(state.content[file]);
    setFormMessage(
      "جاري الحفظ وإنشاء النسخة الاحتياطية والبناء والفحص… · Saving, backing up, building, and validating…",
    );
    setOperation(`جاري حفظ ${file}… · Saving ${file}…`);
    updateChrome();
    $$(`[data-action="save-file"][data-file="${file}"]`).forEach((button) => {
      button.disabled = true;
    });
    try {
      const result = await api(`/api/content/${encodeURIComponent(file)}`, {
        method: "PUT",
        headers: { "x-content-rev": state.contentRevs[file] || "" },
        body: sentPayload,
      });
      if (result?.rev) state.contentRevs[file] = result.rev;
      // Only what was actually sent is saved. Anything typed since stays dirty.
      if ((state.fileMutations[file] || 0) === sentMutation)
        state.dirtyFiles.delete(file);
      state.backupsLoaded = false;
      state.backupsAttempted = false;
      const pipeline = result?.pipeline || result?.rebuild;
      state.pipelineResult = pipeline || null;
      let message;
      if (pipeline?.ok) {
        message = `تم حفظ ${file} وإنشاء نسخة احتياطية، والبناء والفحص نجحا. · Saved, backed up, built, and validated successfully.`;
        setOperation(message, "success");
        announce(message, "success");
      } else {
        const details =
          [
            pipeline?.build?.err,
            pipeline?.validation?.out,
            pipeline?.validation?.err,
          ]
            .filter(Boolean)
            .join("\n") ||
          "لم يرجع الخادم نتيجة فحص ناجحة. · The server did not report a successful verification.";
        message = `تم حفظ ${file} ونسخه احتياطياً، لكن البناء أو الفحص فشل. التعديل محفوظ ولم يضع. · Saved and backed up, but build or validation failed. The edit is preserved.`;
        setOperation(message, "error", details);
        announce(message, "error");
      }
      await refreshStatus();
      render();
      setFormMessage(message, pipeline?.ok ? "success" : "error");
    } catch (error) {
      /* A conflict is not a plain failure: the file on disk holds someone
         else's work. Say so, keep this tab's edits in memory so nothing is
         lost, and let the person decide. Merging silently is the one thing
         that must not happen here. */
      if (error.conflict) {
        state.conflict = {
          file,
          theirs: error.conflictContent,
          rev: error.conflictRev,
        };
        const clash = `${file} اتغير في نافذة تانية بعد ما فتحت الصفحة. تعديلاتك لسه موجودة وما اتحفظتش. · ${file} changed in another window after you loaded it. Your edits are still here, unsaved.`;
        render();
        setFormMessage(clash, "error");
        setOperation(clash, "error", error.message);
        announce(clash, "error");
        return;
      }
      const details = error.validationErrors?.join("\n") || "";
      const message = `فشل حفظ ${file}: ${error.message}. التعديلات ما زالت موجودة وغير محفوظة. · Save failed; edits remain unsaved.`;
      setFormMessage(`${message}${details ? `\n${details}` : ""}`, "error");
      setOperation(message, "error", details);
      announce(message, "error");
    } finally {
      state.savingFiles.delete(file);
      $$(`[data-action="save-file"][data-file="${file}"]`).forEach((button) => {
        button.disabled = false;
      });
      updateChrome();
    }
  }

  async function rebuildSite() {
    if (state.dirtyFiles.size) {
      const message =
        "احفظ التغييرات أولاً علشان البناء يستخدم أحدث نسخة. · Save unsaved changes before rebuilding.";
      setOperation(message, "error");
      announce(message, "error");
      return;
    }
    const button = $('[data-action="rebuild"]');
    if (button) button.disabled = true;
    announce("جاري إعادة بناء الموقع… · Rebuilding site…");
    setOperation(
      "جاري إعادة بناء الموقع وفحصه… · Rebuilding and validating the site…",
    );
    try {
      const result = await api("/api/rebuild", { method: "POST", body: "{}" });
      state.pipelineResult = result;
      const details = [
        result?.build?.err,
        result?.validation?.out,
        result?.validation?.err,
      ]
        .filter(Boolean)
        .join("\n");
      const message = result?.ok
        ? "تم بناء الموقع وفحصه بنجاح. · Site built and validated successfully."
        : "فشل البناء أو الفحص. راجع المخرجات أدناه. · Build or validation failed; review the output below.";
      setOperation(
        message,
        result?.ok ? "success" : "error",
        result?.ok ? "" : details,
      );
      announce(message, result?.ok ? "success" : "error");
      await refreshStatus();
      if (state.section === "overview") render();
    } catch (error) {
      const message = `تعذر إعادة البناء: ${error.message}`;
      setOperation(message, "error");
      announce(message, "error");
    } finally {
      if (button) button.disabled = false;
    }
  }

  async function restoreBackup(name, file) {
    if (state.dirtyFiles.has(file)) {
      const message = `ملف ${file} فيه تغييرات غير محفوظة. احفظها أو أعد تحميل اللوحة قبل الاسترجاع. · This file has unsaved edits; save or reload before restoring.`;
      setOperation(message, "error");
      announce(message, "error");
      return;
    }
    const ok = window.confirm(
      `استرجاع النسخة المحددة من ${file}؟ سيحفظ الخادم نسخة من الملف الحالي أولاً.\n\nRestore this ${file} backup? The server will preserve the current file first.`,
    );
    if (!ok) return;
    setOperation(
      `جاري استرجاع ${file} وإعادة الفحص… · Restoring and validating ${file}…`,
    );
    try {
      const result = await api("/api/backups/restore", {
        method: "POST",
        body: JSON.stringify({ backup: name }),
      });
      state.content[file] = result.content;
      state.contentRevs[file] = result.rev;
      state.pipelineResult = result.pipeline || null;
      state.backupsLoaded = false;
      state.backupsAttempted = false;
      await refreshStatus();
      const message = result.pipeline?.ok
        ? `تم استرجاع ${file} وإنشاء نسخة من حالته السابقة، والبناء والفحص نجحا. · Restored, preserved, built, and validated successfully.`
        : `تم استرجاع ${file}، لكن البناء أو الفحص فشل. · Restored, but build or validation failed.`;
      const details = result.pipeline?.ok
        ? ""
        : [
            result.pipeline?.build?.err,
            result.pipeline?.validation?.out,
            result.pipeline?.validation?.err,
          ]
            .filter(Boolean)
            .join("\n");
      setOperation(message, result.pipeline?.ok ? "success" : "error", details);
      announce(message, result.pipeline?.ok ? "success" : "error");
      render();
    } catch (error) {
      const details = error.validationErrors?.join("\n") || "";
      const message = `تعذر الاسترجاع: ${error.message}. · Restore failed.`;
      setOperation(message, "error", details);
      announce(message, "error");
    }
  }

  async function refreshStatus() {
    if (state.mode === "hosted") { state.connected = false; updateChrome(); return; }
    try {
      state.apiStatus = await api("/api/status");
      state.connected = Boolean(state.apiStatus?.ok);
      state.gitStatus = await api("/api/git/status").catch(() => null);
    } catch {
      state.connected = false;
    }
    updateChrome();
  }

  function coerceInput(element) {
    const type = element.dataset.valueType;
    if (type === "boolean") return element.checked;
    if (type === "number")
      return element.value === "" ? null : Number(element.value);
    if (type === "null") return element.value === "" ? null : element.value;
    return element.value;
  }

  function approveReview(index) {
    const reviews = collectionArray("reviews.json", "reviews");
    const review = reviews[index];
    if (!review) return;
    review.published = true;
    review.status = "approved";
    if (Object.prototype.hasOwnProperty.call(review, "approved"))
      review.approved = true;
    state.selected[selectionKey("reviews", "reviews")] = index;
    markDirty("reviews.json");
    render();
    announce(
      "تم اعتماد الرأي في المسودة. احفظ الملف للنشر. · Approved in draft; save to publish.",
      "success",
    );
  }

  function deleteReview(index) {
    const reviews = collectionArray("reviews.json", "reviews");
    const review = reviews[index];
    if (!review) return;
    const ok = window.confirm(
      "حذف الرأي من المسودة؟ لن يتغير الملف قبل الحفظ.\n\nDelete this review from the draft? The file will not change until saved.",
    );
    if (!ok) return;
    reviews.splice(index, 1);
    state.selected[selectionKey("reviews", "reviews")] = reviews.length
      ? Math.min(index, reviews.length - 1)
      : null;
    markDirty("reviews.json");
    render();
  }

  function parseRating(lines) {
    for (const line of lines) {
      const stars = line.match(/[★⭐]/g);
      if (stars?.length) return Math.min(5, stars.length);
      const numeric = line.match(
        /(?:rating\s*[:\-]?\s*|تقييم\s*[:\-]?\s*)?([1-5])(?:\s*\/\s*5|\s*(?:stars?|نجوم))/i,
      );
      if (numeric) return Number(numeric[1]);
    }
    return 5;
  }

  function isReviewMetaLine(line) {
    return /(?:local guide|مرشد محلي|\b[1-5]\s*(?:stars?|نجوم)|[★⭐]|\b\d+\s*(?:reviews?|photos?|مراجعات|صور)\b|ago$|منذ\s|edited|تم التعديل)/i.test(
      line,
    );
  }

  function parseGoogleReviews(raw) {
    const normalised = raw.replace(/\r/g, "").replace(/\t+/g, "\n").trim();
    if (!normalised) return [];
    const blocks = normalised
      .split(/\n\s*\n+|\n-{3,}\n/)
      .map((block) => block.trim())
      .filter(Boolean);

    return blocks
      .map((block, blockIndex) => {
        const lines = block
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        const rating = parseRating(lines);
        const isoLine = lines.find((line) =>
          /\b\d{4}-\d{2}-\d{2}\b/.test(line),
        );
        const dateMatch = isoLine?.match(/\b\d{4}-\d{2}-\d{2}\b/);
        const meaningful = lines.filter(
          (line) => !isReviewMetaLine(line) && line !== isoLine,
        );
        const name = meaningful.shift() || "";
        const text = meaningful.join("\n");
        const hasArabic = /[\u0600-\u06ff]/.test(text);
        return {
          id: `google-${Date.now()}-${blockIndex + 1}`,
          published: false,
          sample: false,
          status: "pending",
          name: { ar: name, en: name },
          text: { ar: hasArabic ? text : "", en: hasArabic ? "" : text },
          rating,
          source: "Google",
          date: dateMatch ? dateMatch[0] : null,
          doctor: null,
          specialties: [],
        };
      })
      .filter((review) => review.name || review.text.ar || review.text.en);
  }

  function handleReviewPaste() {
    const textarea = $("#google-review-paste");
    const parsed = parseGoogleReviews(textarea?.value || "");
    if (!parsed.length) {
      announce(
        "لم أقدر أستخرج آراء. افصل كل رأي بسطر فاضي. · No reviews could be parsed.",
        "error",
      );
      textarea?.focus();
      return;
    }
    const reviews = collectionArray("reviews.json", "reviews");
    const firstIndex = reviews.length;
    reviews.push(...parsed);
    state.selected[selectionKey("reviews", "reviews")] = firstIndex;
    markDirty("reviews.json");
    render();
    announce(
      `تمت إضافة ${parsed.length} مسودة للمراجعة قبل الاعتماد. · Added ${parsed.length} draft reviews for confirmation.`,
      "success",
    );
  }

  function openUpload(path = null) {
    state.uploadTarget =
      path && state.editorContext
        ? {
            root: state.editorContext.root,
            path,
            file: state.editorContext.file,
          }
        : null;
    uploadForm.reset();
    $("#upload-directory").value = "uploads";
    uploadResult.hidden = true;
    uploadMessage.textContent = "";
    uploadMessage.className = "form-message";
    uploadedPath.value = "";
    uploadPreview.textContent = "";
    useUploadedPath.hidden = !state.uploadTarget;
    uploadDialog.showModal();
    window.requestAnimationFrame(() => $("#upload-directory").focus());
  }

  function closeUpload() {
    if (uploadDialog.open) uploadDialog.close();
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () =>
        reject(reader.error || new Error("Could not read file"));
      reader.readAsDataURL(file);
    });
  }

  async function uploadImage(event) {
    event.preventDefault();
    const file = $("#upload-file").files[0];
    const dir = $("#upload-directory").value.trim() || "uploads";
    if (!file) {
      uploadMessage.textContent = "اختار صورة أولاً. · Choose an image first.";
      uploadMessage.className = "form-message is-error";
      return;
    }
    const submit = $('button[type="submit"]', uploadForm);
    submit.disabled = true;
    uploadMessage.textContent = "جاري رفع الصورة… · Uploading image…";
    uploadMessage.className = "form-message";
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const result = await api("/api/upload", {
        method: "POST",
        body: JSON.stringify({ dir, filename: file.name, dataUrl }),
      });
      state.uploadedValue = result.path;
      uploadedPath.value = result.path;
      uploadPreview.innerHTML = `<img src="/${escapeHtml(result.path)}" alt="معاينة الصورة المرفوعة · Uploaded image preview">`;
      uploadResult.hidden = false;
      useUploadedPath.hidden = !state.uploadTarget;
      uploadMessage.textContent = result.renamed
        ? `تم الرفع باسم ${result.path.split("/").pop()} لأن الاسم كان مستخدماً. · Uploaded as ${result.path.split("/").pop()}; the original name was taken.`
        : `تم الرفع (${result.bytes} bytes). · Upload complete.`;
      uploadMessage.className = "form-message is-success";
      /* The library caches its listing. Uploading from the Images header has no
         field to fill, so useUploadedValue never runs and nothing else would
         invalidate that cache until a full page reload. */
      invalidateImages(state.section === "images");
    } catch (error) {
      uploadMessage.textContent = `فشل الرفع: ${error.message}`;
      uploadMessage.className = "form-message is-error";
    } finally {
      submit.disabled = false;
    }
  }

  async function copyText(value) {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      announce("تم نسخ المسار. · Path copied.", "success");
    } catch {
      uploadedPath.focus();
      uploadedPath.select();
      announce("المسار محدد للنسخ اليدوي. · Path selected for manual copy.");
    }
  }

  function useUploadedValue() {
    if (!state.uploadTarget || !state.uploadedValue) return;
    setAt(
      state.uploadTarget.root,
      state.uploadTarget.path,
      state.uploadedValue,
    );
    markDirty(state.uploadTarget.file);
    invalidateImages();
    closeUpload();
    render();
    announce(
      "تم وضع المسار في الحقل. احفظ الملف لتثبيت التغيير. · Field filled; save the file to commit it.",
      "success",
    );
  }

  function loadConflictVersion() {
    if (!state.conflict) return;
    const { file, theirs, rev } = state.conflict;
    const ok = window.confirm(
      `تحميل النسخة الحالية من ${file}؟ التعديلات غير المحفوظة في هذا الملف ستُستبدل.\n\nLoad the current server copy of ${file}? Unsaved changes in this file will be replaced.`,
    );
    if (!ok) return;
    state.content[file] = deepClone(theirs);
    state.contentRevs[file] = rev;
    state.dirtyFiles.delete(file);
    state.fileMutations[file] = 0;
    state.conflict = null;
    render();
    announce(
      `تم تحميل النسخة الحالية من ${file}. · Loaded the current server version.`,
      "success",
    );
  }

  function openSidebar() {
    shell.classList.add("is-sidebar-open");
    menuToggle.setAttribute("aria-expanded", "true");
    sidebar.removeAttribute("inert");
    $("[data-nav].is-active", sidebar)?.focus();
  }

  function closeSidebar(returnFocus = false) {
    shell.classList.remove("is-sidebar-open");
    menuToggle.setAttribute("aria-expanded", "false");
    if (window.matchMedia("(max-width: 52rem)").matches)
      sidebar.setAttribute("inert", "");
    if (returnFocus) menuToggle.focus();
  }

  function syncSidebarMode() {
    if (
      window.matchMedia("(max-width: 52rem)").matches &&
      !shell.classList.contains("is-sidebar-open")
    ) {
      sidebar.setAttribute("inert", "");
    } else {
      sidebar.removeAttribute("inert");
    }
  }

  function switchSection(section) {
    if (!SECTION_META[section]) return;
    state.section = section;
    resetListFilters();
    history.replaceState(null, "", `#${section}`);
    closeSidebar(false);
    render();
    $("#dashboard-main").focus({ preventScroll: true });
  }

  async function load() {
    connectionPill.classList.add("is-loading");
    try {
      const content = await api("/api/content");
      const { __revs: revs = {}, ...files } = content || {};
      state.content = files;
      state.contentRevs = revs;
      state.fileMutations = {};
      state.conflict = null;
      state.connected = true;
      await refreshStatus();
      const requested = location.hash.replace(/^#/, "");
      if (SECTION_META[requested]) state.section = requested;
      resetListFilters();
      render();
    } catch (error) {
      try {
        const snapshot = await fetch("content/index.json", { cache: "no-store" });
        if (!snapshot.ok) throw error;
        const payload = await snapshot.json();
        state.content = payload.files || {};
        state.contentRevs = {};
        state.mode = "hosted";
        state.connected = false;
        hostedBanner.hidden = false;
        const requested = location.hash.replace(/^#/, "");
        if (SECTION_META[requested]) state.section = requested;
        resetListFilters();
        render();
      } catch { renderLoadError(error); }
    }
  }

  function openPublish() {
    if (state.mode === "hosted" || !state.gitStatus) return;
    $("#publish-message").value = `Content update ${new Date().toISOString().slice(0, 10)}`;
    $("#publish-files").innerHTML = (state.gitStatus.dirty || []).map((file) => `<li><code dir="ltr">${escapeHtml(file)}</code></li>`).join("") || "<li>Committed changes waiting to push</li>";
    $("#publish-log").textContent = "";
    $("#deploy-result").textContent = "";
    publishDialog.showModal();
  }

  async function publishSite(event) {
    event.preventDefault();
    const submit = publishForm.querySelector('[type="submit"]');
    submit.disabled = true;
    const log = $("#publish-log");
    log.textContent = "Building, validating, committing, and pushing…\n";
    try {
      const result = await api("/api/publish", { method: "POST", body: JSON.stringify({ message: $("#publish-message").value }) });
      log.textContent = (result.log || []).join("\n");
      state.gitStatus = result.status;
      const deploy = await api("/api/deploy/status");
      $("#deploy-result").innerHTML = `${deploy.status ? `Deploy: ${escapeHtml(deploy.status)}${deploy.conclusion ? ` / ${escapeHtml(deploy.conclusion)}` : ""}` : escapeHtml(deploy.error || "Deploy status unavailable")}${deploy.url ? ` · <a href="${escapeHtml(deploy.url)}" target="_blank" rel="noopener">GitHub Actions</a>` : ""} · <a href="https://laroseclinics.com" target="_blank" rel="noopener">laroseclinics.com</a>`;
      await refreshStatus();
    } catch (error) {
      log.textContent += `\nERROR: ${error.message}`;
      setOperation(`فشل النشر: ${error.message} · Publish failed`, "error");
      await refreshStatus();
    } finally { submit.disabled = false; updateChrome(); }
  }

  document.addEventListener("input", (event) => {
    const control = event.target.closest("[data-bind]");
    if (!control || !state.editorContext) return;
    const path = readPathToken(control.dataset.path);
    setAt(state.editorContext.root, path, coerceInput(control));
    markDirty(state.editorContext.file);
  });

  document.addEventListener("input", (event) => {
    const imgSearch = event.target.closest("[data-image-search]");
    if (imgSearch) {
      state.imageQuery = imgSearch.value;
      render();
      const again = document.querySelector("[data-image-search]");
      if (again) {
        again.focus();
        again.setSelectionRange(again.value.length, again.value.length);
      }
      return;
    }
    const search = event.target.closest("[data-list-search]");
    if (!search) return;
    state.listQuery = search.value;
    render();
    // keep focus and caret after the re-render
    const again = document.querySelector("[data-list-search]");
    if (again) {
      again.focus();
      again.setSelectionRange(again.value.length, again.value.length);
    }
  });

  document.addEventListener("click", (event) => {
    const facet = event.target.closest("[data-list-facet]");
    if (facet) {
      state.listFacet = facet.dataset.listFacet || "";
      return render();
    }
    const dir = event.target.closest("[data-image-dir]");
    if (dir) {
      state.imageDir = dir.dataset.imageDir || "";
      return render();
    }
    const copy = event.target.closest("[data-action='copy-image-path']");
    if (copy) {
      copyText(copy.dataset.path);
      copy.innerHTML = 'تم النسخ <span lang="en" dir="ltr">Copied</span>';
      setTimeout(() => {
        copy.innerHTML =
          'نسخ المسار <span lang="en" dir="ltr">Copy path</span>';
      }, 1400);
    }
  });

  document.addEventListener("change", (event) => {
    const toggle = event.target.closest("[data-list-published]");
    if (!toggle) return;
    const items = collectionArray(
      toggle.dataset.file,
      toggle.dataset.collection,
    );
    const item = items[Number(toggle.dataset.index)];
    if (!item) return;
    item.published = toggle.checked;
    if (
      toggle.dataset.collection === "reviews" &&
      toggle.checked &&
      item.status === "pending"
    )
      item.status = "approved";
    markDirty(toggle.dataset.file);
    render();
  });

  document.addEventListener("click", (event) => {
    /* growth.js buttons carry data-growth rather than data-action so the two
       vocabularies cannot collide; route them first. */
    const growthElement = event.target.closest("[data-growth]");
    if (growthElement && window.DashboardGrowth?.action?.(growthElement.dataset.growth, growthElement)) return;

    const actionElement = event.target.closest("[data-action]");
    if (!actionElement) return;
    const action = actionElement.dataset.action;

    if (window.DashboardGrowth?.action?.(action, actionElement)) return;

    if (action === "retry-load") load();
    if (action === "open-publish") openPublish();
    if (action === "close-publish") publishDialog.close();
    if (action === "rebuild") rebuildSite();
    if (action === "save-current") saveFile(currentFile());
    if (action === "save-file") saveFile(actionElement.dataset.file);
    if (action === "select-collection") {
      state.activeGroups[actionElement.dataset.section] =
        actionElement.dataset.collection;
      /* Both filters are global. Carrying a type filter such as `tip` into a
         collection whose items have no type hid every row, and with no facets
         to render there was no All button left to clear it with. */
      resetListFilters();
      render();
    }
    if (action === "select-settings-file") {
      state.settingsFile = actionElement.dataset.file;
      resetListFilters();
      render();
    }
    if (action === "select-item") {
      const group = activeGroup(state.section);
      state.selected[selectionKey(state.section, group.key)] = Number(
        actionElement.dataset.index,
      );
      render();
    }
    if (action === "add-item")
      addCollectionItem(
        actionElement.dataset.file,
        actionElement.dataset.collection,
      );
    if (action === "delete-item")
      deleteCollectionItem(
        actionElement.dataset.file,
        actionElement.dataset.collection,
        Number(actionElement.dataset.index),
      );
    if (action === "move-item")
      moveCollectionItem(
        actionElement.dataset.file,
        actionElement.dataset.collection,
        Number(actionElement.dataset.index),
        Number(actionElement.dataset.direction),
      );
    if (action === "add-array-item" && state.editorContext) {
      const path = readPathToken(actionElement.dataset.path);
      const items = getAt(state.editorContext.root, path);
      if (Array.isArray(items)) {
        items.push(
          arrayItemTemplate(actionElement.dataset.arrayKey, items, path),
        );
        markDirty(state.editorContext.file);
        render();
        window.requestAnimationFrame(() =>
          focusPath(path.concat(items.length - 1)),
        );
      }
    }
    if (action === "remove-array-item" && state.editorContext) {
      removeArrayItem(readPathToken(actionElement.dataset.path));
    }
    if (action === "move-array-item")
      moveArrayItem(
        readPathToken(actionElement.dataset.path),
        Number(actionElement.dataset.direction),
      );
    if (action === "approve-review")
      approveReview(Number(actionElement.dataset.index));
    if (action === "delete-review")
      deleteReview(Number(actionElement.dataset.index));
    if (action === "parse-reviews") handleReviewPaste();
    if (action === "open-upload")
      openUpload(
        actionElement.dataset.path
          ? readPathToken(actionElement.dataset.path)
          : null,
      );
    if (action === "close-upload") closeUpload();
    if (action === "copy-upload-path") copyText(uploadedPath.value);
    if (action === "copy-latest-path") copyText(state.uploadedValue);
    if (action === "use-uploaded-path") useUploadedValue();
    if (action === "load-conflict-version") loadConflictVersion();
    if (action === "open-todo")
      openPathInEditor(
        actionElement.dataset.file,
        readPathToken(actionElement.dataset.path),
      );
    if (action === "refresh-backups") loadBackups(true);
    /* A failed load no longer retries itself from render(), so the panel needs
       an explicit way back. Backups already had one; images did not. */
    if (action === "refresh-images") {
      invalidateImages(true);
      render();
    }
    if (action === "restore-backup")
      restoreBackup(actionElement.dataset.backup, actionElement.dataset.file);
  });

  $$("[data-nav]").forEach((button) =>
    button.addEventListener("click", () => switchSection(button.dataset.nav)),
  );
  menuToggle.addEventListener("click", () =>
    shell.classList.contains("is-sidebar-open")
      ? closeSidebar(true)
      : openSidebar(),
  );
  $("#sidebar-scrim").addEventListener("click", () => closeSidebar(true));
  uploadForm.addEventListener("submit", uploadImage);
  uploadDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeUpload();
  });
  publishForm.addEventListener("submit", publishSite);
  publishDialog.addEventListener("cancel", (event) => { event.preventDefault(); publishDialog.close(); });

  window.addEventListener("resize", syncSidebarMode);
  window.addEventListener("beforeunload", (event) => {
    if (!state.dirtyFiles.size) return;
    event.preventDefault();
    event.returnValue = "";
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && shell.classList.contains("is-sidebar-open"))
      closeSidebar(true);
    const tabButton = event.target.closest?.('.segment-btn[role="tab"]');
    if (
      tabButton &&
      ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
    ) {
      const tabs = $$(`.segment-btn[role="tab"]`, tabButton.parentElement);
      const index = tabs.indexOf(tabButton);
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? tabs.length - 1
            : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) %
              tabs.length;
      event.preventDefault();
      tabs[next]?.click();
      window.requestAnimationFrame(() =>
        $$('.segment-btn[role="tab"]')[next]?.focus(),
      );
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
      const file = currentFile();
      if (file) {
        event.preventDefault();
        saveFile(file);
      }
    }
  });

  syncSidebarMode();
  load();
})();
