import { MongoClient } from "mongodb";

// Sample data from existing JSON files
const servicesData = {
  categories: [
    {
      id: "development",
      title: "Development",
      description: "End-to-end software solutions across all platforms",
      services: [
        {
          id: 1,
          title: "Web Application Development",
          description:
            "Building high-performance, responsive web applications with modern technologies.",
          icon: "Globe",
          featured: true,
        },
        {
          id: 2,
          title: "Cross-Platform Mobile Apps",
          description:
            "Native and cross-platform mobile applications for iOS and Android.",
          icon: "Smartphone",
        },
        {
          id: 3,
          title: "Desktop Application Development",
          description:
            "Powerful desktop applications for Windows, macOS, and Linux built for performance.",
          icon: "Monitor",
        },
        {
          id: 4,
          title: "Custom Software Solutions",
          description:
            "Tailored software development services to meet your unique business requirements.",
          icon: "Code2",
        },
      ],
    },
    {
      id: "design",
      title: "Design",
      description: "Crafting beautiful and intuitive user experiences",
      services: [
        {
          id: 5,
          title: "UI/UX Design",
          description:
            "Creating intuitive and beautiful user interfaces that drive engagement.",
          icon: "Palette",
          featured: true,
        },
      ],
    },
    {
      id: "ai",
      title: "AI & Machine Learning",
      description:
        "Intelligent solutions powered by cutting-edge AI technology",
      services: [
        {
          id: 6,
          title: "AI Accelerated Development",
          description:
            "Launch market-ready products 70% faster with our AI-driven development process.",
          icon: "Rocket",
          featured: true,
        },
        {
          id: 7,
          title: "AI Automation",
          description:
            "Streamlining digital systems with intelligent automation to reduce manual workload and increase efficiency.",
          icon: "Bot",
        },
        {
          id: 8,
          title: "AI Integration",
          description:
            "Seamlessly integrate artificial intelligence capabilities into your existing software ecosystem.",
          icon: "CircuitBoard",
        },
        {
          id: 9,
          title: "Machine Learning Solutions",
          description:
            "Leverage data-driven insights and predictive models to power smarter business decisions.",
          icon: "Brain",
        },
      ],
    },
  ],
};

const projectsData = [
  {
    id: 1,
    title: "Neon Verse",
    category: "Web Experience",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
    year: "2025",
    description:
      "An immersive 3D web experience redefining digital interaction through WebGL and motion.",
    tech: ["WebGL", "Three.js", "React"],
  },
  {
    id: 2,
    title: "AI Nexus",
    category: "Enterprise Platform",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1932&auto=format&fit=crop",
    year: "2024",
    description:
      "Predictive analytics dashboard empowering enterprises with actionable AI-driven insights.",
    tech: ["Next.js", "Python", "TensorFlow"],
  },
  {
    id: 3,
    title: "Crypto Hive",
    category: "FinTech",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop",
    year: "2024",
    description:
      "Next-generation DeFi platform featuring real-time trading data and secure wallet integration.",
    tech: ["Solidity", "Web3.js", "Tailwind"],
  },
];

const membersData = [
  {
    id: 1,
    name: "Alex Morgan",
    role: "Lead Developer",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "UI Engineer",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "David Kim",
    role: "Product Manager",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574&auto=format&fit=crop",
  },
];

const heroData = {
  headline1: "Precision in",
  headline2: "Every Pixel.",
  description:
    "We craft digital experiences that feel inevitable. Simple. Powerful. Timeless.",
  primaryCta: {
    text: "Start a Project",
    href: "#contact",
  },
  secondaryCta: {
    text: "View Our Work",
    href: "#projects",
  },
};

const aboutData = {
  label: "Who We Are",
  title: "Digital",
  titleHighlight: "Alchemists",
  paragraphs: [
    'At 90sLabs, we believe in the power of <span class="text-white font-medium">nostalgia fused with futurism</span>. We don\'t just build websites; we construct digital realities that defy convention and elevate user experience to art.',
    "Born from a passion for the 90s aesthetic and modern engineering, our team delivers software that is both robust and visually stunning.",
  ],
  graphicText: "90sLabs",
  graphicSubtext: "Agency",
};

async function seed() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ MONGODB_URI environment variable is not set");
    console.log("\nTo run this script:");
    console.log(
      "1. Create a .env.local file with your MongoDB connection string",
    );
    console.log(
      '2. Run: MONGODB_URI="your-connection-string" npx tsx scripts/seed.ts',
    );
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    console.log("🔗 Connecting to MongoDB Atlas...");
    await client.connect();

    const db = client.db("90sX-portfolio");
    console.log("✅ Connected to database: 90sX-portfolio");

    // Clear existing data
    console.log("\n🗑️  Clearing existing collections...");
    await db.collection("services").deleteMany({});
    await db.collection("projects").deleteMany({});
    await db.collection("members").deleteMany({});
    await db.collection("hero").deleteMany({});
    await db.collection("about").deleteMany({});

    // Insert new data
    console.log("\n📥 Inserting sample data...");

    await db.collection("services").insertOne(servicesData);
    console.log("   ✓ Services data inserted");

    await db.collection("projects").insertMany(projectsData);
    console.log("   ✓ Projects data inserted (3 items)");

    await db.collection("members").insertMany(membersData);
    console.log("   ✓ Members data inserted (3 items)");

    await db.collection("hero").insertOne(heroData);
    console.log("   ✓ Hero data inserted");

    await db.collection("about").insertOne(aboutData);
    console.log("   ✓ About data inserted");

    console.log("\n🎉 Database seeded successfully!");
    console.log("\nCollections created in 90sX-portfolio:");
    console.log("   • services");
    console.log("   • projects");
    console.log("   • members");
    console.log("   • hero");
    console.log("   • about");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("\n🔌 Connection closed");
  }
}

seed();
