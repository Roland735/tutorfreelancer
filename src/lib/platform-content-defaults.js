export const PLATFORM_CONTENT_SEED = {
  "site.navigation": {
    brand: {
      name: "TutorFreelance",
      tagline: "Zimbabwe Tutor Marketplace",
    },
    links: [
      { name: "Find Tutors", href: "/tutors" },
      { name: "Live Requests", href: "/#marketplace" },
      { name: "Subjects", href: "/#categories" },
      { name: "How It Works", href: "/#how-it-works" },
      { name: "Pricing", href: "/pricing" },
    ],
    auth: {
      loginLabel: "Log In",
      signupLabel: "Join Now",
      mobileSignupLabel: "Create an Account",
      dashboardLabel: "Dashboard",
      mobileDashboardLabel: "Go to Dashboard",
      logoutLabel: "Log Out",
    },
  },
  "site.footer": {
    brandDescription:
      "A trusted Zimbabwean university tutor marketplace for academic support, student income, and secure tutoring coordination.",
    socialLinks: [
      { name: "Twitter", href: "#" },
      { name: "Facebook", href: "#" },
      { name: "LinkedIn", href: "#" },
      { name: "Instagram", href: "#" },
    ],
    sections: [
      {
        title: "For Students",
        links: [
          { label: "Browse Tutors", href: "/tutors" },
          { label: "Post a Job", href: "/post-job" },
          { label: "How to Hire", href: "/#how-it-works" },
          { label: "Student Success Stories", href: "/reviews" },
        ],
      },
      {
        title: "For Tutors",
        links: [
          { label: "Browse Jobs", href: "/jobs" },
          { label: "Become a Tutor", href: "/signup?role=tutor" },
          { label: "Tutor Resources", href: "/help-support" },
          { label: "Community Guidelines", href: "/terms" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About Us", href: "/about" },
          { label: "Pricing", href: "/pricing" },
          { label: "Blog", href: "/admin/content" },
          { label: "Contact Support", href: "/help-support" },
        ],
      },
    ],
    newsletter: {
      title: "Stay Updated",
      description:
        "Subscribe for platform updates, study tips, and tutor growth insights.",
      placeholder: "Enter your email",
      buttonLabel: "Subscribe",
    },
    legalLinks: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Settings", href: "/privacy" },
    ],
  },
  "lookups.marketplace": {
    universities: [
      "University of Zimbabwe",
      "National University of Science and Technology",
      "Midlands State University",
      "Chinhoyi University of Technology",
      "Harare Institute of Technology",
      "Great Zimbabwe University",
      "Lupane State University",
      "Zimbabwe Open University",
      "Bindura University of Science Education",
      "Africa University",
      "Catholic University of Zimbabwe",
      "Women's University in Africa",
      "Marondera University of Agricultural Sciences and Technology",
      "Gwanda State University",
      "Manicaland State University of Applied Sciences",
      "Pan African University",
    ],
    cities: [
      "Harare",
      "Bulawayo",
      "Mutare",
      "Gweru",
      "Masvingo",
      "Chinhoyi",
      "Bindura",
      "Marondera",
      "Kadoma",
      "Kwekwe",
      "Gwanda",
      "Zvishavane",
    ],
    languages: ["English", "Shona", "Ndebele", "Xitsonga", "Chewa", "Venda", "Tonga"],
    studentYearOptions: [
      "1st Year",
      "2nd Year",
      "3rd Year",
      "4th Year",
      "5th Year",
      "Postgraduate",
      "Recent Graduate",
    ],
    tutorAcademicLevels: [
      "Undergraduate",
      "Final Year",
      "Honours",
      "Masters",
      "PhD",
      "Graduate",
      "Professional",
    ],
    tutoringModes: [
      { value: "Online", label: "Online" },
      { value: "In-Person", label: "In-person" },
      { value: "Both", label: "Both" },
    ],
    subjectOptions: [
      "Mathematics",
      "Statistics",
      "Accounting",
      "Economics",
      "Business Studies",
      "Computer Science",
      "Programming",
      "Data Science",
      "Physics",
      "Chemistry",
      "Biology",
      "Medicine",
      "Engineering",
      "Law",
      "English",
      "Communication Skills",
    ],
    countries: [
      { code: "ZW", name: "Zimbabwe" },
      { code: "ZA", name: "South Africa" },
    ],
    roleOptions: [
      {
        value: "student",
        title: "Student",
        description:
          "Find trusted tutors, get assignment help, and improve exam confidence.",
        badge: "Need academic support",
      },
      {
        value: "tutor",
        title: "Tutor",
        description:
          "Offer tutoring, build credibility, and earn from your university expertise.",
        badge: "Ready to teach",
      },
    ],
    passwordRules: [
      "At least 8 characters",
      "At least 1 letter",
      "At least 1 number",
    ],
    socialOptions: [
      { label: "Google", icon: "Mail" },
      { label: "GitHub", icon: "Github" },
    ],
    jobCategories: [
      "Mathematics",
      "Computer Science",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "History",
      "Foreign Languages",
      "Engineering",
      "Business",
      "Economics",
      "Psychology",
    ],
    jobAcademicLevels: ["High School", "Undergraduate", "Graduate", "PhD"],
    budgetTypes: ["Fixed", "Hourly"],
    sessionTypes: ["Online", "In-Person", "Both"],
    urgencies: ["Low", "Medium", "High", "Urgent"],
    durations: [
      "Less than 1 month",
      "1-3 months",
      "3-6 months",
      "More than 6 months",
    ],
  },
  "page.home": {
    hero: {
      badge: "Trusted by university students",
      title: "Find a great tutor or become one.",
      description:
        "A premium Zimbabwean student marketplace for academic help, peer tutoring, and trusted university support.",
      searchButtonLabel: "Explore Requests",
      primaryCtaLabel: "Find a Tutor",
      primaryCtaHref: "/tutors",
      secondaryCtaLabel: "Post a Request",
      secondaryCtaHref: "/post-job",
      placeholders: ["Calculus", "Python tutoring", "Accounting", "Econometrics"],
      popularUniversities: [
        "University of Zimbabwe",
        "NUST",
        "Midlands State University",
      ],
    },
    processSteps: [
      {
        number: "01",
        title: "Post what you need",
        description:
          "Share the subject, budget, preferred session format, and deadline in under a minute.",
      },
      {
        number: "02",
        title: "Compare trusted tutors",
        description:
          "Review verified profiles, university background, ratings, and response speed.",
      },
      {
        number: "03",
        title: "Book and learn confidently",
        description:
          "Choose online or in-person support and keep requests, chats, and bookings organized.",
      },
      {
        number: "04",
        title: "Grow your results or income",
        description:
          "Students improve faster and tutors build trusted campus reputations.",
      },
    ],
    trustItems: [
      {
        title: "Verified university identity",
        description:
          "Tutor profiles can be checked against real campus details before they earn trust signals.",
      },
      {
        title: "Clear quality signals",
        description:
          "Ratings, completed sessions, and response speed make comparison easier.",
      },
      {
        title: "Secure coordination",
        description:
          "Requests, communication, and session planning stay in one professional workflow.",
      },
      {
        title: "Built for academic outcomes",
        description:
          "The product is designed around faster matching, better fit, and less student friction.",
      },
    ],
    pricingPlans: [
      {
        name: "Starter",
        price: "$0",
        description:
          "For students exploring support and tutors building early traction.",
        features: [
          "Browse tutors and active requests",
          "Pay only for booked sessions",
          "Standard support access",
          "Basic profile visibility",
        ],
        cta: "Start Free",
        href: "/signup",
      },
      {
        name: "Pro",
        price: "$9.99",
        description:
          "Best for frequent learners and serious student freelancers.",
        features: [
          "Priority request placement",
          "Reduced platform fees",
          "Enhanced profile credibility",
          "Priority support response",
        ],
        cta: "Choose Pro",
        href: "/pricing",
        featured: true,
      },
      {
        name: "Campus Plus",
        price: "$19.99",
        description:
          "For tutors maximizing bookings and premium visibility across campuses.",
        features: [
          "Featured tutor placement",
          "Advanced performance insights",
          "Lower commission structure",
          "Faster payout options",
        ],
        cta: "Unlock Premium",
        href: "/pricing",
      },
    ],
    fallbackReviews: [
      {
        id: "home-review-1",
        rating: 5,
        comment:
          "I found a statistics tutor within one evening and the session felt more professional than random chat groups.",
        reviewer: {
          name: "Nyasha Dube",
          university: "University of Zimbabwe",
          avatar: "",
        },
        session: { job: { subject: "Statistics" } },
      },
      {
        id: "home-review-2",
        rating: 5,
        comment:
          "My tutor profile finally felt credible and students came in with clearer expectations.",
        reviewer: {
          name: "Tatenda Moyo",
          university: "NUST",
          avatar: "",
        },
        session: { job: { subject: "Computer Science" } },
      },
      {
        id: "home-review-3",
        rating: 5,
        comment:
          "The request feed is easy to scan and feels far more organized than campus WhatsApp groups.",
        reviewer: {
          name: "Rumbidzai Chari",
          university: "Midlands State University",
          avatar: "",
        },
        session: { job: { subject: "Economics" } },
      },
    ],
    fallbackBlogs: [
      {
        id: "home-blog-1",
        category: "Study Systems",
        title: "How one strong tutoring session becomes exam-week momentum",
        excerpt:
          "Build a simple follow-up routine that helps students retain concepts and prepare smarter.",
        date: "Latest",
        readTime: "5 min read",
        author: { name: "TutorFreelance Team" },
      },
      {
        id: "home-blog-2",
        category: "Tutor Growth",
        title: "What high-trust student tutor profiles do differently",
        excerpt:
          "Learn how better proof, positioning, and subject framing increase profile quality.",
        date: "Latest",
        readTime: "4 min read",
        author: { name: "TutorFreelance Team" },
      },
      {
        id: "home-blog-3",
        category: "Academic Help",
        title: "A better way to request help when you are stuck on a difficult module",
        excerpt:
          "Use a concise, structured request so tutors can respond faster with stronger proposals.",
        date: "Latest",
        readTime: "6 min read",
        author: { name: "TutorFreelance Team" },
      },
    ],
    prediction: {
      eyebrow: "Early Warning Prediction",
      title: "Spot learning risk before students fall behind.",
      description:
        "The platform analyzes session completion, cancellations, open requests, and engagement patterns to surface a clear risk level earlier.",
      cards: [
        {
          title: "Signals",
          body: "Completion trends, cancellations, and open support requests",
        },
        {
          title: "Output",
          body: "Low, medium, or high risk with an engagement score",
        },
        {
          title: "Action",
          body: "Short recommendations to improve consistency early",
        },
      ],
    },
    momentumStats: [
      {
        title: "Student community",
        description:
          "Students and tutors already building academic momentum together.",
      },
      {
        title: "Session volume",
        description:
          "A steady stream of completed sessions across Zimbabwean universities.",
      },
      {
        title: "Market confidence",
        description:
          "High-quality outcomes supported by student reviews and repeat demand.",
      },
      {
        title: "Academic coverage",
        description:
          "From STEM to essay-heavy disciplines and applied business support.",
      },
    ],
  },
  "page.login": {
    trustMetrics: [
      { value: "18k+", label: "Students supported" },
      { value: "4.9/5", label: "Average session rating" },
      { value: "65k+", label: "Tutoring sessions completed" },
    ],
    demoRoles: [
      { role: "student", label: "Load Student Account" },
      { role: "tutor", label: "Load Tutor Account" },
      { role: "admin", label: "Load Admin Account" },
    ],
    auth: {
      badge: "Secure sign-in",
      eyebrow: "Welcome back",
      title: "Sign in to your academic workspace",
      description:
        "Return to a calm, secure platform built for Zimbabwean university students who teach, learn, and collaborate with confidence.",
    },
  },
  "page.signup": {
    trustPoints: [
      "Role-based onboarding keeps student and tutor journeys clear from the start.",
      "Zimbabwe-focused university, city, and language support improves local trust.",
      "Secure credential signup is ready for future provider expansion.",
    ],
  },
  "page.profileSetup": {
    citySuggestions: ["Harare", "Bulawayo", "Mutare", "Gweru", "Masvingo", "Chinhoyi"],
    languageSuggestions: ["English", "Shona", "Ndebele", "Xitsonga"],
    universitySuggestions: [
      "University of Zimbabwe",
      "National University of Science and Technology",
      "Harare Institute of Technology",
      "Midlands State University",
      "Chinhoyi University of Technology",
      "Great Zimbabwe University",
    ],
    yearOptions: ["Freshman", "Sophomore", "Junior", "Senior", "Masters", "PhD"],
    trustPoints: [
      "Helps students trust that you are a real university peer.",
      "Improves matching for tutoring requests and study support.",
      "Makes your profile easier to discover by city and language.",
      "Creates a stronger first impression before messages begin.",
      "Can be updated later anytime from your dashboard.",
    ],
  },
  "page.jobPosting": {
    title: "Post a New Job",
    description:
      "Follow the steps to create your job listing and find the right tutor.",
  },
  "page.help-support": {
    categories: ["Account", "Payments", "Bookings", "Safety", "Technical issue"],
    faqs: [
      {
        question: "How do I know a tutor or student is trustworthy?",
        answer:
          "Use profile completeness, university details, reviews, completed sessions, and message history before booking.",
      },
      {
        question: "Can I tutor online and in-person?",
        answer:
          "Yes. Jobs and tutor profiles support online, in-person, and flexible session types.",
      },
      {
        question: "How do withdrawals work for Zimbabwe payouts?",
        answer:
          "The starter wallet supports EcoCash and bank payout methods so the product can extend to verified payouts later.",
      },
    ],
    guidelines: [
      "Keep all communication and agreements on-platform.",
      "Avoid sharing private payment details before trust is established.",
      "Report suspicious activity or abusive behavior immediately.",
    ],
  },
  "page.pricing": {
    badge: "Flexible Plans",
    title: "Simple, Transparent Pricing",
    description:
      "Choose the plan that fits your learning or teaching goals. No hidden fees, cancel anytime.",
    plans: [
      {
        name: "Student Basic",
        monthlyPrice: 0,
        yearlyPrice: 0,
        description: "Everything needed to find a tutor and get started.",
        cta: "Get Started Free",
        ctaLink: "/signup?role=student",
        popular: false,
        features: [
          { name: "Browse all tutors", included: true },
          { name: "Post up to 3 jobs/month", included: true },
          { name: "Secure payments", included: true },
          { name: "Basic support", included: true },
          { name: "Session recording", included: false },
          { name: "Priority matching", included: false },
        ],
      },
      {
        name: "Student Pro",
        monthlyPrice: 9.99,
        yearlyPrice: 7.99,
        description: "Accelerate your learning with premium tools.",
        cta: "Upgrade to Pro",
        ctaLink: "/signup?role=student&plan=pro",
        popular: true,
        features: [
          { name: "Browse all tutors", included: true },
          { name: "Unlimited job posts", included: true },
          { name: "Secure payments", included: true },
          { name: "Priority support 24/7", included: true },
          { name: "HD session recordings", included: true },
          { name: "Verified student badge", included: true },
        ],
      },
      {
        name: "Tutor Pro",
        monthlyPrice: 19.99,
        yearlyPrice: 15.99,
        description: "For serious tutors who want to maximize earnings.",
        cta: "Start Teaching",
        ctaLink: "/signup?role=tutor&plan=pro",
        popular: false,
        features: [
          { name: "Unlimited job applications", included: true },
          { name: "Featured profile placement", included: true },
          { name: "Lowest platform fees (5%)", included: true },
          { name: "Detailed analytics", included: true },
          { name: "Custom profile URL", included: true },
          { name: "Early access to new jobs", included: true },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I cancel my subscription at any time?",
        answer:
          "Yes. You can cancel any subscription from account settings and benefits remain until the current billing period ends.",
      },
      {
        question: "How does the platform fee work?",
        answer:
          "Free accounts use the standard platform fee. Tutor Pro lowers fees so tutors keep more of their earnings.",
      },
      {
        question: "Is there a free trial for Pro plans?",
        answer:
          "Yes. Both Student Pro and Tutor Pro include a 14-day free trial before billing begins.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "The product is structured for cards and wallet integrations, with future support for localized Zimbabwe payouts.",
      },
      {
        question: "Can I switch between plans?",
        answer:
          "Yes. You can upgrade or downgrade later and the billing logic can be extended for prorated changes.",
      },
    ],
  },
  "page.about": {
    hero: {
      title: "Building trust in university tutoring",
      description:
        "TutorFreelance helps Zimbabwean university students find credible academic support and gives strong tutors a serious place to grow.",
      ctaLabel: "Join Our Mission",
      ctaHref: "/signup",
    },
    story: {
      title: "Our Story",
      paragraphs: [
        "TutorFreelance started with a simple need: students needed faster access to credible academic help, while capable tutors needed a more trusted way to earn from their knowledge.",
        "We are building infrastructure for a calmer, safer, and more organized tutor marketplace that feels local to Zimbabwean universities and scalable over time.",
      ],
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    stats: [
      { label: "Active Tutors", value: "1,200+" },
      { label: "Students Helped", value: "8,500+" },
      { label: "Campuses", value: "16+" },
      { label: "Sessions Completed", value: "24k+" },
    ],
    teamMembers: [
      {
        name: "Alex Johnson",
        role: "Founder",
        image: "https://i.pravatar.cc/150?u=alex",
        bio: "Focused on platform trust, academic operations, and user growth.",
      },
      {
        name: "Maria Rodriguez",
        role: "Product Lead",
        image: "https://i.pravatar.cc/150?u=maria",
        bio: "Builds marketplace systems that keep student journeys clear and scalable.",
      },
      {
        name: "David Kim",
        role: "Community Lead",
        image: "https://i.pravatar.cc/150?u=david",
        bio: "Shapes the support, moderation, and community standards experience.",
      },
      {
        name: "Sarah Jenkins",
        role: "Design Lead",
        image: "https://i.pravatar.cc/150?u=sarahj",
        bio: "Designs calm, high-trust interfaces that are easy to scan and use.",
      },
    ],
    universityPartners: [
      "University of Zimbabwe",
      "NUST",
      "Midlands State University",
      "HIT",
      "Africa University",
    ],
    cta: {
      title: "Ready to join the future of learning?",
      description:
        "Whether you want to learn something difficult or earn from what you already know, there is a place for you here.",
      studentLabel: "Start Learning",
      studentHref: "/signup?role=student",
      tutorLabel: "Become a Tutor",
      tutorHref: "/signup?role=tutor",
    },
  },
  "page.privacy": {
    statusLabel: "Database-backed legal content",
    title: "Privacy Policy",
    intro:
      "TutorFreelance collects account and marketplace information so the platform can operate safely, personalize experiences, and support trusted academic coordination.",
    paragraphs: [
      "We collect account details such as name, email, role, university, city, languages, and onboarding preferences to create accounts, improve trust, and support verification workflows.",
      "Platform data should be stored securely and processed only for legitimate marketplace operations including authentication, moderation, analytics, and service delivery.",
      "Final launch-ready policies can extend this page with retention periods, cookie details, provider disclosures, data rights, and deletion request procedures.",
    ],
  },
  "page.terms": {
    statusLabel: "Database-backed legal content",
    title: "Terms of Service",
    intro:
      "TutorFreelance connects Zimbabwean students and tutors through a trusted academic marketplace and expects accurate information, respectful conduct, and safe platform use.",
    paragraphs: [
      "Users agree to provide accurate details, respect campus-safe conduct, and follow platform rules related to bookings, messaging, moderation, and payments.",
      "Tutors remain responsible for the accuracy of their academic claims and teaching offers. Students remain responsible for lawful and appropriate use of tutoring services.",
      "Production terms can extend this page with full account security, acceptable use, refunds, moderation, intellectual property, and dispute-handling rules.",
    ],
  },
};

export function getPlatformDefault(key) {
  return PLATFORM_CONTENT_SEED[key] || null;
}
