export interface ImpactMetric {
  value: string;
  label: string;
}

export type ProjectCategory = "web-apps" | "research" | "data-eng" | "others";

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  kind: string;
  year?: string;
  summary: string;
  impact: ImpactMetric[];
  stack: string[];
  problem: string;
  approach: string[];
  outcome: string;
  limitations?: string;
  role?: string;
  repo?: string | null;
}

export interface ExperienceEntry {
  period: string;
  title: string;
  org: string;
  description: string;
  skills: string[];
  branch: "main" | "software" | "data" | "merge";
  graphNode: string;
  category: string;
  commit: string;
  metrics?: ImpactMetric[];
  highlights?: string[];
}

export interface ToolkitGroup {
  title: string;
  items: string[];
}

export const projects: Project[] = [
  // {
  //   slug: "gradepath",
  //   title: "GradeBuddy",
  //   category: "web-apps",
  //   kind: "Web application",
  //   summary:
  //     "Track grades, attendance, and deadlines, then simulate what you need on your next exam to reach your target.",
  //   impact: [
  //     { value: "5", label: "core features" },
  //     { value: "3", label: "grade targets described" },
  //     { value: "7", label: "technologies" },
  //   ],
  //   stack: [
  //     "React",
  //     "TypeScript",
  //     "Tailwind",
  //     "Python",
  //     "FastAPI",
  //     "PostgreSQL",
  //     "OpenAI Integration",
  //   ],
  //   problem:
  //     "University portals show grades but not what they mean for a student's final outcome. Students are left manually calculating how marks, assessment weightings, and attendance affect their goals, without guidance on what to prioritize.",
  //   approach: [
  //     "Simulate the marks needed to reach a target academic outcome.",
  //     "Track module grades and assessment weightings.",
  //     "Flag modules that may put a student's average at risk.",
  //     "Recommend relevant learning topics and quizzes.",
  //     "Bring attendance, timetables, and deadlines into one overview.",
  //   ],
  //   outcome:
  //     "GradeBuddy turns academic tracking into actionable planning, helping students understand what they need next and where to focus their effort.",
  // },
  // {
  //   slug: "tripflow",
  //   title: "Trip.io",
  //   category: "web-apps",
  //   kind: "Web application",
  //   summary:
  //     "Plan a trip with AI-suggested activities, a map-linked itinerary, and warnings when a day is overloaded.",
  //   impact: [
  //     { value: "AI", label: "activity suggestions" },
  //     { value: "5", label: "core features" },
  //     { value: "9", label: "technologies" },
  //   ],
  //   stack: [
  //     "React",
  //     "TypeScript",
  //     "Tailwind",
  //     "React DnD",
  //     "React Leaflet",
  //     "ASP.NET Core / C#",
  //     "Entity Framework",
  //     "PostgreSQL",
  //     "OpenAI Integration",
  //   ],
  //   problem:
  //     "Trip planning often involves switching between maps, blogs, notes, and spreadsheets. Plans can become overpacked, underestimate travel time, or include routes that look fine on paper but are impractical.",
  //   approach: [
  //     "Generate activity suggestions based on destination, dates, and travel preferences.",
  //     "Build and rearrange a day-by-day itinerary with drag and drop.",
  //     "Show places on a live Leaflet map.",
  //     "Warn when a day's activities are not feasible.",
  //     "Optimize a day using distance, duration, and travel style.",
  //   ],
  //   outcome:
  //     "Trip.io brings activity discovery, itinerary editing, and geographic context together so travelers can spot unrealistic plans before the trip.",
  // },
  // {
  //   slug: "cookpilot",
  //   title: "CookAI",
  //   category: "web-apps",
  //   kind: "Web application",
  //   summary:
  //     "Turn the ingredients on hand into a recipe and get hands-free, voice-guided help while cooking.",
  //   impact: [
  //     { value: "Voice", label: "hands-free cooking" },
  //     { value: "5", label: "core features" },
  //     { value: "7", label: "technologies" },
  //   ],
  //   stack: [
  //     "React",
  //     "TypeScript",
  //     "Tailwind",
  //     "FastAPI",
  //     "Llama AI Integration",
  //     "Web Speech API",
  //     "MongoDB",
  //   ],
  //   problem:
  //     "Static recipe instructions are difficult to use when a cook is missing an ingredient, unsure about a step, or unable to scroll while their hands are busy.",
  //   approach: [
  //     "Generate recipes from ingredients that are available.",
  //     "Guide the cooking process with voice instructions and text-to-speech.",
  //     "Answer questions about substitutions and cooking issues in context.",
  //     "Adapt the recipe when ingredients or steps change.",
  //     "Link timers to individual recipe steps.",
  //   ],
  //   outcome:
  //     "CookAI is designed as an adaptive cooking companion that can keep helping when a recipe changes mid-way, rather than only presenting static instructions.",
  // },
  {
    slug: "uncertainty-aware-depression-decision-support",
    title:
      "Uncertainty-Aware AI Decision Support for Depression Care Using Brain and Speech Signals",
    category: "research",
    kind: "Research paper",
    summary:
      "An AI system that analyses a person's brain activity (EEG) and speech to spot signs of depression, then checks how reliable its own result is before suggesting safe, guideline-based next steps.",
    impact: [
      {
        value: "100%",
        label:
          "held-out accuracy combining EEG + speech (vs 87.5% speech, 75% EEG alone)",
      },
      {
        value: "15/15",
        label:
          "unsafe recommendations caught and corrected by the safety reviewer",
      },
      {
        value: "1.2 → 2.8",
        label:
          "average caution (out of 3) when signals were noisy or conflicting",
      },
    ],
    stack: [
      "Python",
      "PyTorch",
      "LangGraph",
      "Ollama (Qwen3.5)",
      "PostgreSQL",
      "Streamlit",
      "EEGLAB / MATLAB",
    ],
    problem:
      "Depression is assessed in short, infrequent appointments, and most AI tools give one confident answer even when the data is noisy or conflicting. That is risky in mental healthcare.",
    approach: [
      "DenseNet121 classifiers on EEG (STFT) and speech (log-Mel) spectrograms, combined with decision-level late fusion and participant-independent validation.",
      "Passed class probabilities, signal-quality flags and cross-modal agreement downstream, so uncertainty drove caution levels instead of being discarded.",
      "Four-agent LangGraph workflow (patient summary, clinical reasoning, intervention planning, safety review) with deterministic guideline retrieval from NICE NG222.",
      "Deterministic control nodes for schema validation, routing, retry limits and fallback, with longitudinal memory stored in PostgreSQL (JSONB).",
    ],
    outcome:
      "Combining both signals classified all 8 unseen participants correctly. The system grew more cautious when evidence was weak, and the safety reviewer caught all 15 deliberately unsafe plans. A proof of concept on a small dataset, not a diagnostic tool.",
  },
  {
    slug: "intelligent-blood-cell-classification-through-computer-vision-and-deep-learning",
    title:
      "Intelligent Blood Cell Classification Through Computer Vision and Deep Learning",
    category: "research",
    kind: "Applied AI / Computer Vision",
    summary:
      "Exploring how far AI can go in recognising blood cells under a microscope. I built and benchmarked multiple machine learning approaches, from handcrafted image features to deep learning, to find out what actually makes a difference.",
    impact: [
      { value: "94.05%", label: "CNN test accuracy" },
      { value: "93.50%", label: "macro F1-score" },
      { value: "17,062", label: "cleaned cell images" },
    ],
    stack: [
      "Python",
      "TensorFlow / Keras",
      "CNNs",
      "Scikit-learn",
      "Ensemble Learning",
      "HOG Feature Extraction",
      "Computer Vision",
      "PCA",
      "K-Means",
      "Gaussian Mixture Models",
      "Data Analysis",
    ],
    problem:
      "At first glance, blood cells might seem easy enough to tell apart. Look a little closer, though, and things get tricky. Some share remarkably similar shapes, colours and textures, making classification less straightforward than it sounds. So I set out to see how well different machine learning approaches could tell them apart. Would carefully engineered features be enough, or would deep learning have the edge?",
    approach: [
      "First, I got to know the data. Explored all eight blood cell categories, looked at class distributions, colour patterns and image quality, and investigated anything that might cause trouble during training.",
      "Before jumping into modelling, I tackled data quality. Checked for duplicates, potential leakage between splits and problematic images, bringing the dataset from 17,092 down to 17,062 samples.",
      "Started simple with an MLP, then experimented with class weighting to handle imbalance. That helped a little, but I wanted to see what better features could do.",
      "Got hands-on with feature engineering, combining HOG descriptors for cell shapes and textures with RGB and HSV colour features. The result? My MLP improved from 78.10% to 83.93% test accuracy.",
      "Next came ensemble learning. I experimented with voting and stacking approaches, combining different models to see whether they could make better predictions together. The stacking ensemble reached 88.04% accuracy.",
      "Then I let a CNN learn the visual features for itself. Instead of manually deciding which patterns mattered, the network learned directly from the images and achieved the strongest results.",
      "I also explored what happens without labels, experimenting with K-Means and Gaussian Mixture Models. Using pretrained ResNet18 embeddings and PCA, I investigated whether meaningful cell groupings could emerge on their own.",
      "Finally, I went beyond the headline accuracy. Confusion matrices, macro-F1 and class-level performance helped me understand which cells the models recognised confidently and which ones still caused confusion.",
    ],
    outcome:
      "The CNN took the lead with 94.05% test accuracy and a 93.50% macro-F1 score, a 15.95 percentage-point improvement over my initial MLP baseline. Feature engineering gave the MLP a noticeable boost, while stacking pushed performance further to 88.04%. What I enjoyed most was seeing how each experiment revealed something new. Sometimes better features made all the difference; other times, letting the model learn those features itself worked best. The biggest takeaway? Building a good classifier isn't just about picking a powerful model. It's about understanding your data, making thoughtful improvements and figuring out why something works (or doesn't).",
  },

{
  slug: "mapping-meteorites-through-geospatial-data-analytics",
  title:
    "Mapping Meteorites: Exploring Earth's Cosmic History Through Data",
  category: "data-eng",
  kind: "Geospatial Data Analytics / Visualisation",

  summary:
    "Where do meteorites end up, and why are some places full of discoveries while others barely appear on the map? I explored over 45,000 NASA meteorite records, combining geography, climate, and land cover data to uncover patterns in where meteorites are found and how our search for them has changed over time.",

  impact: [
    { value: "45,716", label: "meteorite records analysed" },
    { value: "4", label: "datasets integrated" },
    { value: "6", label: "visualisations developed" },
  ],

  stack: [
    "Python",
    "Pandas",
    "NumPy",
    "GeoPandas",
    "Rasterio",
    "OpenCV",
    "Plotly",
    "Matplotlib",
    "Seaborn",
    "Tkinter",
    "CustomTkinter",
    "Geospatial Analysis",
    "Data Engineering",
    "Statistical Analysis",
    "Data Visualisation",
  ],

  problem:
    "NASA has recorded thousands of meteorites discovered across the world, but plotting their locations only tells part of the story. Why does Antarctica dominate the records? Do certain environments make meteorites easier to find? And are we really mapping where meteorites land, or simply where humans have been looking? I wanted to connect the dots between meteorite discoveries, geography, climate, and human exploration.",

  approach: [
    "Started with NASA's Meteorite Landings dataset, exploring over 45,000 records to understand discovery trends, meteorite sizes, and the most common classifications.",

    "Built a data retrieval pipeline with automatic retries and fallbacks between web, cloud, and local sources, making it easier to work with multiple large datasets without starting from scratch.",

    "Combined meteorite records with Natural Earth country boundaries, ESA land cover maps, and Köppen-Geiger climate data to add geographical and environmental context to each discovery.",

    "Developed reusable geospatial functions to match meteorite coordinates with country boundaries and raster data, including nearest-neighbour fallbacks for tricky locations near coastlines and missing raster values.",

    "Cleaned and transformed the data using Pandas, handling missing values, invalid coordinates, inconsistent classifications, and outliers. Simplified 466 meteorite classes into 13 broader categories for easier analysis.",

    "Explored historical discovery patterns and meteorite masses using statistical techniques including IQR, log transformations, and MAD-based robust z-scores to identify unusual changes.",

    "Created six visualisations, from interactive sunburst charts and an animated country leaderboard to a 3D globe, climate-based timelines, a discovery bias dashboard, and a time-lapse map of meteorite discoveries.",

    "Built an interactive desktop application using Tkinter and CustomTkinter, letting users filter meteorites by location, classification, mass, and year, then explore the results through configurable charts.",

    "Finally, looked beyond the visual patterns to investigate how scientific expeditions, population distribution, and environmental conditions influence what gets discovered and recorded.",
  ],

  outcome:
    "The most interesting discovery? The meteorite map tells us almost as much about human exploration as it does about space. Antarctica's discovery records surged after organised scientific expeditions began in the 1970s, while deserts, ice fields, and open landscapes emerged as major recovery hotspots. Meanwhile, densely vegetated regions remain comparatively underrepresented. By bringing together four datasets, six visualisations, and an interactive explorer, I turned thousands of individual records into a much clearer picture of how meteorite discoveries have evolved. It was a reminder that data doesn't always tell the whole story on its own — sometimes the most interesting insights come from understanding what's missing.",
},

  {
    slug: "real-time-analytics-&-anomaly-detection-for-newcastle's-urban-sensor-network",
    title:
      "Real-Time Analytics & Anomaly Detection for Newcastle's Urban Sensor Network",
    category: "data-eng",
    kind: "Data engineering",
    summary:
      "What if a city could spot air pollution spikes as they happen? Built a real-time data pipeline using Newcastle's live sensor network to track air quality, catch anomalies, and turn raw readings into useful insights.",

    impact: [
      { value: "<800ms", label: "alert dispatch latency" },
      { value: "98.28%", label: "pipeline health" },
      { value: "19.2x", label: "data aggregation ratio" },
    ],

    stack: [
      "Python",
      "PySpark",
      "Azure Databricks",
      "Apache Spark",
      "Delta Lake",
      "Medallion Architecture",
      "Lambda Architecture",
      "Great Expectations",
      "PagerDuty",
      "Power BI",
    ],

    problem:
      "Cities collect a lot of data, but having data isn't the same as knowing what's happening. Sensor readings arrive constantly, some are unreliable, and traditional batch processing can leave important changes unnoticed for hours. The challenge was to make sense of that data quickly, without sacrificing accuracy.",

    approach: [
      "Connected to Newcastle's Urban Observatory API, pulling live air quality readings every 30 seconds.",
      "Built two pipelines in Databricks using Spark: one to catch anomalies as they happen, and another to clean up the data and uncover longer-term patterns.",
      "Organised everything into Bronze, Silver, and Gold Delta Lake layers, taking readings from raw sensor data to analytics-ready insights.",
      "Added automated quality checks to catch duplicate readings, unusual spikes, frozen sensors, and gradual sensor drift.",
      "Connected PagerDuty to flag pollution anomalies in real time, with a cooldown to avoid flooding the system with repeated alerts.",
      "Brought the cleaned data into Power BI dashboards to explore air quality trends across Newcastle.",
    ],

    outcome:
      "Tested the pipeline against live data from 27 Newcastle sensors. Over an hour, it processed 536 readings, maintained 98.28% pipeline health, and dispatched anomaly alerts in under 800ms. It also filtered out 17 unreliable readings and condensed the remaining data into 27 hourly aggregates, making it easier to explore the city's air quality without digging through raw sensor logs.",
  },

  // {
  //   slug: "armada",
  //   title: "Armada",
  //   category: "others",
  //   kind: "Robotics project",
  //   summary:
  //     "A robotic arm that recognizes objects and calculates its own movements to pick them up without scripted paths.",
  //   impact: [
  //     { value: "Live", label: "object recognition" },
  //     { value: "Multi-DOF", label: "joint control" },
  //     { value: "6", label: "technologies" },
  //   ],
  //   stack: [
  //     "Python",
  //     "OpenCV",
  //     "ROS",
  //     "Raspberry Pi",
  //     "Arduino",
  //     "Inverse Kinematics",
  //   ],
  //   problem:
  //     "Robotic manipulation is difficult to demonstrate without fixed, scripted movements. Recognizing an object's position and computing a valid path across multiple joints requires solving inverse kinematics in real time.",
  //   approach: [
  //     "Recognize and localize objects using computer vision.",
  //     "Apply Jacobian inverse kinematics to calculate movements across multiple degrees of freedom.",
  //     "Execute autonomous pick-up and drop-off behavior.",
  //     "Connect ROS-based control with Raspberry Pi and Arduino hardware.",
  //   ],
  //   outcome:
  //     "Armada computes joint movements in real time to pick up and drop off detected objects, rather than following a pre-programmed route.",
  // },
  // {
  //   slug: "relic",
  //   title: "Relic",
  //   category: "others",
  //   kind: "Augmented reality project",
  //   summary:
  //     "An Android AR experience that turns museum exhibits into animated stories using a phone camera.",
  //   impact: [
  //     { value: "AR", label: "exhibit experiences" },
  //     { value: "No headset", label: "phone-based access" },
  //     { value: "5", label: "listed project features" },
  //   ],
  //   stack: [
  //     "Unity3D",
  //     "Vuforia Engine",
  //     "Augmented Reality",
  //     "Android",
  //     "3D Animation",
  //   ],
  //   problem:
  //     "Museum exhibits can be static and text-heavy, making it easy for visitors to pass by objects without engaging with them.",
  //   approach: [
  //     "Recognize physical exhibits using image tracking through a phone camera.",
  //     "Overlay real-time 3D animations built with Unity3D.",
  //     "Use Vuforia-powered marker detection.",
  //     "Build for casual, walk-up interaction without a headset or separate kiosk.",
  //     "Deploy as an Android experience.",
  //   ],
  //   outcome:
  //     "Relic turns a phone into an interactive lens for museum exhibits, adding a 3D animated layer without requiring extra visitor hardware.",
  // },
  // {
  //   slug: "kitchmind",
  //   title: "KitchMind",
  //   category: "others",
  //   kind: "IoT project",
  //   summary:
  //     "A smart grocery system that tracks kitchen stock and expiry dates to support independent living.",
  //   impact: [
  //     { value: "ESP", label: "hardware hub" },
  //     { value: "Auto", label: "stock and expiry tracking" },
  //     { value: "6", label: "technologies" },
  //   ],
  //   stack: [
  //     "Java",
  //     "ESP32/ESP8266",
  //     "IoT Sensors",
  //     "Android Studio",
  //     "Computer Vision",
  //     "Embedded Systems",
  //   ],
  //   problem:
  //     "People living independently can find routine kitchen tasks such as tracking expiry dates and reordering groceries increasingly difficult to manage.",
  //   approach: [
  //     "Use sensors and a camera to track expiry dates and kitchen stock.",
  //     "Connect the hardware through an ESP microcontroller.",
  //     "Generate grocery lists based on usage patterns.",
  //     "Integrate automatic reordering.",
  //     "Provide an Android companion app designed for elderly-friendly interaction.",
  //   ],
  //   outcome:
  //     "KitchMind pairs kitchen sensors and camera input with a companion app to reduce manual stock tracking and help manage grocery reordering.",
  // },
];

export const experience: ExperienceEntry[] = [
  {
    period: "Oct 2019 — Aug 2022",
    title: "BSc Computer Science (Systems Engineering)",
    org: "Middlesex University Mauritius",
    description:
      "Started with core computer science theory, data structures, and Unix terminal roots, then spent three years exploring how far code can stretch. Alongside full-stack web development and core software engineering, I dove into robotics, designed interactive tech (HCI, AR, VUI), and tackled AI and Business Intelligence modules. It gave me a truly holistic view of tech from low-level terminal scripts and robust web architectures all the way to intelligent, spatial user experiences.",
    skills: [
      "C++",
      "Java",
      "C",
      "Shell",
      "Bash",
      "HTML",
      "CSS",
      "JavaScript",
      "PHP",
      "MongoDB",
      "Unity",
      "Vuforia",
      "Android Studio",
      "Python",
      "OpenCV",
      "IoT",
      "Raspberry Pi",
      "Arduino",
    ],
    branch: "main",
    graphNode: "bsc",
    category: "Education",
    commit: "init",
    highlights: ["First Class Honours", "Outstanding Student Award"],
  },
  {
    period: "July 2022 — Aug 2023",
    title: "Technical Consultant",
    org: "Big Bang",
    description:
      "Stepped into a fast-paced environment to deliver end-to-end ERP solutions, scoping requirements, drafting functional/technical design documents, and building custom software. Developed Spring Boot automations and resilient integrators bridging NetSuite ERP with Shopify e-commerce and accounting platforms across diverse industries. Streamlined financial, warehouse, and supply-chain workflows while managing core in-house products, including the flagship Stripe-NetSuite integrator and high-volume RPA billing pipelines.",
    skills: [
      "Java",
      "Spring Boot",
      "REST / SOAP APIs",
      "NetSuite",
      "SuiteScript",
      "Celigo",
      "Shopify",
      "Stripe",
      "RPA",
    ],
    branch: "software",
    graphNode: "bigbang",
    category: "Work",
    commit: "feat",
    metrics: [
      { value: "3", label: "enterprise go-lives delivered" },
      { value: "15+", label: "client accounts managed" },
      { value: "2", label: "in-house products developed" },
    ],
  },
  {
    period: "Aug 2023 — Aug 2025",
    title: "Software Developer III",
    org: "Dayforce (formerly Ceridian) · HCM / HR technology",
    description:
      "Joined a newly formed team operating with startup-style agility to engineer an intelligent test automation platform validating core Dayforce modules (Recruiting, Payroll, Benefits, and Workforce Management) using combinatorial user data generation. Delivered full-stack capabilities by pairing C#/.NET EF backends with an interactive React Flow canvas, enabling teams to visually assemble drag-and-drop test cases that executed compiled DLLs under the hood. Spearheaded an internal Services UAT (SUAT) tool that expanded into a vital cross-team platform, alongside R&D exploring Agentic AI to transform natural language user logs into executable test scripts. Maintained Azure DevOps pipelines, conducted code reviews, hosted sprint demos, and mentored new developers.",
    skills: [
      ".NET",
      "Entity Framework",
      "React",
      "Tailwind CSS",
      "Azure DevOps",
      "Selenium",
      "SpecFlow",
      "xUnit",
    ],
    branch: "software",
    graphNode: "dayforce",
    category: "Work",
    commit: "feat",
    highlights: [
      "Caught 5+ release-blocking defects before production",
      "Represented Dayforce at university tech workshops",
      "Prototyped an agentic AI pipeline that generates test code from natural language logs",
    ],
  },
  {
    period: "Sep 2025 — Aug 2026",
    title: "MSc Data Science",
    org: "Nottingham Trent University, UK",
    description:
      "Crossed borders and stepped back into academia at the dawn of the agentic AI era, translating real-world software engineering discipline into advanced data-driven research. Immersed in big data architectures, statistical modeling in R, autonomous agent design, and robust ETL pipelines combining rigorous exploratory data analysis (EDA) with scalable machine learning, from CNNs and neural networks to ensemble modeling, to decode the underlying mechanics powering modern AI systems.",
    skills: [
      "Python",
      "R",
      "SQL",
      "Tableau",
      "PyTorch",
      "Scikit-learn",
      "Pandas",
      "NumPy",
      "Apache Spark",
      "Databricks",
      "LangChain",
      "LangGraph",
      "RAG",
    ],
    branch: "data",
    graphNode: "msc",
    category: "Education",
    commit: "feat",
    highlights: ["Graduated with Distinction", "Best Student Project Award"],
  },
  {
    period: "2026",
    title: "Agentic AI — Dissertation",
    org: "Part of MSc Data Science · Nottingham Trent University",
    description:
      "Built an AI system that reads brainwave (EEG) and voice signals and uses a team of AI agents to suggest mental healthcare options. A deep learning vision model processes the signals, and a multi-agent LangGraph workflow checks every recommendation against UK clinical guidelines (NICE). What sets it apart is that it measures its own uncertainty. Most systems quietly guess when the input is noisy or incomplete. This one detects missing or low-quality signals, treats that as a reason to be less confident, and tightens its safety checks automatically before it recommends anything.",
    skills: [
      "LangGraph",
      "Python",
      "PyTorch",
      "DenseNet121",
      "Ollama (Qwen)",
      "PostgreSQL",
      "Streamlit",
      "EEGLAB",
      "Librosa",
    ],
    branch: "merge",
    graphNode: "merge",
    category: "Research",
    commit: "merge",
  },
];

export const toolkit: ToolkitGroup[] = [
  {
    title: "languages",
    items: ["C#", "Python", "TypeScript", "JavaScript", "SQL", "R"],
  },
  {
    title: "backend-apis",
    items: [
      ".NET Core",
      "ASP.NET Web API",
      "FastAPI",
      "RESTful Microservices",
      "Entity Framework",
    ],
  },
  {
    title: "frontend-ui",
    items: ["React", "Vite", "Tailwind CSS", "HTML5", "CSS3"],
  },
  {
    title: "agentic-ai-ml",
    items: [
      "LangGraph",
      "LangChain",
      "RAG Architectures",
      "PyTorch",
      "LLM Orchestration",
      "Multimodal ML",
      "Guardrails & HITL",
    ],
  },
  {
    title: "data-engineering",
    items: [
      "Apache Spark",
      "Azure Databricks",
      "ETL Pipelines",
      "Lambda Architecture",
    ],
  },
  {
    title: "databases",
    items: ["PostgreSQL", "MySQL", "JSONB / Relational Schemas"],
  },
  {
    title: "testing-qa",
    items: [
      "Selenium",
      "SpecFlow",
      "xUnit",
      "Automated Test Suites",
      "Test Data Generation",
    ],
  },
  {
    title: "devops-infrastructure",
    items: ["Azure DevOps", "Docker", "CI/CD Pipelines", "Git"],
  },
];
