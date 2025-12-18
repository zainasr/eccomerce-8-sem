import "dotenv/config";
import { db } from "./connection";
import { and, eq, inArray } from "drizzle-orm";
import {
  categories,
  products,
  productImages,
  productCategories,
  users,
  blogs,
} from "./schemas";

type CategorySeed = { name: string; slug: string; description?: string };
type ProductSeed = {
  name: string;
  slug: string;
  description: string;
  price: string; // decimal as string
  sku?: string;
  status?: "draft" | "active" | "archived";
  stockQuantity?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  images: { url: string; isPrimary?: boolean }[];
  categorySlugs: string[];
};

type BlogSeed = {
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML content
  coverImage: string;
  status: "draft" | "published";
};

async function main() {
  // Ensure we have an admin (platform seller)
  const [admin] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.role, "admin"))
    .limit(1);

  if (!admin) {
    console.error(
      "No admin user found. Please create an admin user first; products.sellerId references admin."
    );
    process.exit(1);
  }

  const categorySeeds: CategorySeed[] = [
    {
      name: "Electronics",
      slug: "electronics",
      description:
        "Cutting-edge gadgets and devices, from smartphones and laptops to audio and smart home tech.",
    },
    {
      name: "Computers & Laptops",
      slug: "computers-laptops",
      description:
        "Powerful notebooks and desktops for creators, gamers, and professionals.",
    },
    {
      name: "Audio & Headphones",
      slug: "audio-headphones",
      description:
        "Immersive headphones, earbuds, speakers, and DACs crafted for pristine sound.",
    },
    {
      name: "Smart Home",
      slug: "smart-home",
      description:
        "Connected lights, cameras, and hubs that make your home more secure and efficient.",
    },
    {
      name: "Accessories",
      slug: "accessories",
      description:
        "Chargers, cables, cases, and stands designed to complement your devices.",
    },
    {
      name: "Wearables",
      slug: "wearables",
      description:
        "Smartwatches and fitness trackers to keep you connected and motivated.",
    },
    {
      name: "Cameras & Photo",
      slug: "cameras-photo",
      description:
        "Mirrorless cameras, action cams, and lenses for creators at every level.",
    },
  ];

  // Upsert categories (by slug)
  for (const c of categorySeeds) {
    const existing = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, c.slug))
      .limit(1);
    if (existing.length === 0) {
      await db.insert(categories).values({
        name: c.name,
        slug: c.slug,
        description: c.description,
      });
    }
  }

  const productSeeds: ProductSeed[] = [
    {
      name: "Aurora X1 Ultrabook 14” M3",
      slug: "aurora-x1-ultrabook-14-m3",
      description:
        "A featherweight 14-inch creator laptop featuring next‑gen M3 performance, all‑day battery, and a color‑accurate Retina display.",
      price: "1499.00",
      sku: "AX1-14-M3",
      status: "active",
      stockQuantity: 25,
      seoTitle: "Aurora X1 Ultrabook 14” M3 – Lightweight Creator Laptop",
      seoDescription:
        "Shop the Aurora X1 Ultrabook with M3 performance, Retina display, and all‑day battery. Perfect for creators and pros on the go.",
      seoKeywords:
        "ultrabook,laptop,creator laptop,retina display,m3 laptop,lightweight laptop",
      images: [
        { url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3" },
      ],
      categorySlugs: ["computers-laptops"],
    },
    {
      name: "Nimbus Pro Noise‑Canceling Headphones",
      slug: "nimbus-pro-noise-canceling-headphones",
      description:
        "Studio‑grade over‑ear headphones with adaptive ANC, 40‑hour battery life, and spatial audio for immersive listening.",
      price: "299.00",
      sku: "NB-PRO-ANC",
      status: "active",
      stockQuantity: 60,
      seoTitle: "Nimbus Pro ANC Headphones – Spatial Audio, 40h Battery",
      seoDescription:
        "Experience studio‑grade sound with Nimbus Pro ANC headphones. Adaptive noise cancellation, spatial audio, and 40‑hour battery.",
      seoKeywords: "anc headphones,noise canceling,spatial audio,studio headphones",
      images: [
        { url: "https://images.unsplash.com/photo-1518448130976-9f5ed6f20b7b", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf" },
      ],
      categorySlugs: ["audio-headphones"],
    },
    {
      name: "Pulse S2 True Wireless Earbuds",
      slug: "pulse-s2-true-wireless-earbuds",
      description:
        "Compact earbuds with active noise reduction, crystal‑clear calls, and IPX5 water resistance.",
      price: "129.00",
      sku: "PLS-S2-TWS",
      status: "active",
      stockQuantity: 120,
      seoTitle: "Pulse S2 Earbuds – Compact ANC, Clear Calls, IPX5",
      seoDescription:
        "Pulse S2 true wireless earbuds deliver ANC, clear calls, and a snug fit. Perfect for workouts and commute.",
      seoKeywords: "wireless earbuds,ANC earbuds,IPX5,bluetooth earbuds",
      images: [
        { url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df", isPrimary: true },
      ],
      categorySlugs: ["audio-headphones", "accessories"],
    },
    {
      name: "Lyra 4K Smart Camera",
      slug: "lyra-4k-smart-camera",
      description:
        "AI‑powered 4K security camera with HDR, night vision, and instant alerts. Works seamlessly with major smart home hubs.",
      price: "199.00",
      sku: "LYRA-4K",
      status: "active",
      stockQuantity: 80,
      seoTitle: "Lyra 4K Smart Camera – HDR, Night Vision, Smart Alerts",
      seoDescription:
        "Secure your home with Lyra 4K. AI detection, HDR video, night vision, and smart notifications.",
      seoKeywords: "smart camera,home security,4k camera,ai detection",
      images: [
        { url: "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb", isPrimary: true },
      ],
      categorySlugs: ["smart-home", "cameras-photo"],
    },
    {
      name: "Flux Mini Smart Hub",
      slug: "flux-mini-smart-hub",
      description:
        "Compact Matter‑ready hub connecting lights, sensors, and locks with powerful automations.",
      price: "89.00",
      sku: "FLX-HUB-MINI",
      status: "active",
      stockQuantity: 150,
      seoTitle: "Flux Mini Smart Hub – Matter Ready, Powerful Automations",
      seoDescription:
        "Control your smart home with the Flux Mini hub. Matter‑ready, fast automations, and easy setup.",
      seoKeywords: "smart hub,matter hub,home automation,smart home",
      images: [
        { url: "https://images.unsplash.com/photo-1491933382434-500287f9b54b", isPrimary: true },
      ],
      categorySlugs: ["smart-home"],
    },
    {
      name: "NovaWatch S",
      slug: "novawatch-s",
      description:
        "Elegant smartwatch with AMOLED display, ECG, sleep tracking, and 7‑day battery life.",
      price: "349.00",
      sku: "NW-S-AMOLED",
      status: "active",
      stockQuantity: 70,
      seoTitle: "NovaWatch S – AMOLED, ECG, Sleep Tracking, 7‑Day Battery",
      seoDescription:
        "Stay connected and healthy with NovaWatch S. AMOLED display, ECG, sleep tracking, and long battery life.",
      seoKeywords: "smartwatch,ecg watch,amoled watch,fitness tracker",
      images: [
        { url: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c", isPrimary: true },
      ],
      categorySlugs: ["wearables"],
    },
    {
      name: "Atlas 27” 5K Creator Display",
      slug: "atlas-27-5k-creator-display",
      description:
        "Factory‑calibrated 5K display with 99% DCI‑P3, Thunderbolt, and pro color workflows.",
      price: "1099.00",
      sku: "ATLAS-27-5K",
      status: "active",
      stockQuantity: 40,
      seoTitle: "Atlas 27” 5K Creator Monitor – 99% DCI‑P3, Thunderbolt",
      seoDescription:
        "Level up your studio with a 27‑inch 5K, color‑accurate display built for creators.",
      seoKeywords: "5k monitor,creator display,dci-p3,thunderbolt monitor",
      images: [
        { url: "https://images.unsplash.com/photo-1518770660439-4636190af475", isPrimary: true },
      ],
      categorySlugs: ["electronics", "computers-laptops"],
    },
    {
      name: "Glide Pro Wireless Mouse",
      slug: "glide-pro-wireless-mouse",
      description:
        "Ergonomic mouse with multi‑device pairing, MagCharge, and precision optical sensor.",
      price: "79.00",
      sku: "GLIDE-PRO",
      status: "active",
      stockQuantity: 200,
      seoTitle: "Glide Pro Wireless Mouse – Ergonomic, Multi‑Device, MagCharge",
      seoDescription:
        "Work comfortably with Glide Pro. Ergonomic design, precise tracking, and quick magnetic charging.",
      seoKeywords: "wireless mouse,ergonomic mouse,bluetooth mouse,office accessories",
      images: [
        { url: "https://images.unsplash.com/photo-1587825140400-4cfa0552ef3f", isPrimary: true },
      ],
      categorySlugs: ["accessories"],
    },
    {
      name: "AeroPad 2-in-1 Fast Charger",
      slug: "aeropad-2-in-1-fast-charger",
      description:
        "Magnetic 15W wireless charger and stand that powers your phone and earbuds together.",
      price: "59.00",
      sku: "AEROPAD-2IN1",
      status: "active",
      stockQuantity: 180,
      seoTitle: "AeroPad 2‑in‑1 – 15W Magnetic Wireless Charger & Stand",
      seoDescription:
        "Charge phone and earbuds simultaneously with AeroPad. Compact, stylish, and reliable.",
      seoKeywords: "wireless charger,magnetic charger,2-in-1 charger",
      images: [
        { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e", isPrimary: true },
      ],
      categorySlugs: ["accessories"],
    },
    {
      name: "Zephyr Action Cam 4K",
      slug: "zephyr-action-cam-4k",
      description:
        "Rugged 4K60 action camera with horizon‑lock, gyro stabilization, and underwater housing included.",
      price: "249.00",
      sku: "ZEPHYR-4K",
      status: "active",
      stockQuantity: 95,
      seoTitle: "Zephyr 4K Action Camera – Stabilization, Horizon Lock",
      seoDescription:
        "Capture every adventure in crisp 4K with Zephyr. Rugged, stabilized, and ready for the elements.",
      seoKeywords: "action camera,4k camera,stabilization,adventure camera",
      images: [
        { url: "https://images.unsplash.com/photo-1519181245277-cffeb31da2fb", isPrimary: true },
      ],
      categorySlugs: ["cameras-photo", "electronics"],
    },
    {
      name: "Cobalt Mechanical Keyboard 75%",
      slug: "cobalt-mechanical-keyboard-75",
      description:
        "Hot‑swappable 75% keyboard with gasket mount, PBT keycaps, and wireless tri‑mode connectivity.",
      price: "179.00",
      sku: "COBALT-75",
      status: "active",
      stockQuantity: 110,
      seoTitle: "Cobalt 75% – Hot‑Swap Mechanical Keyboard, Tri‑Mode Wireless",
      seoDescription:
        "Type better with Cobalt 75. Gasket mount comfort, PBT caps, and flexible connectivity.",
      seoKeywords: "mechanical keyboard,75 keyboard,wireless keyboard,hot-swap",
      images: [
        { url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8", isPrimary: true },
      ],
      categorySlugs: ["accessories", "computers-laptops"],
    },
    {
      name: "Vertex USB‑C Hub 8‑in‑1",
      slug: "vertex-usb-c-hub-8-in-1",
      description:
        "Sleek aluminum USB‑C hub with HDMI 4K, 100W PD, SD/TF, and dual USB‑A 3.2.",
      price: "69.00",
      sku: "VERTEX-8IN1",
      status: "active",
      stockQuantity: 160,
      seoTitle: "Vertex 8‑in‑1 USB‑C Hub – 4K HDMI, 100W PD",
      seoDescription:
        "Expand your laptop with Vertex. Essential ports in a compact, travel‑ready hub.",
      seoKeywords: "usb-c hub,4k hdmi,power delivery,sd card reader",
      images: [
        { url: "https://images.unsplash.com/photo-1519414442781-fbd745c5b497", isPrimary: true },
      ],
      categorySlugs: ["accessories"],
    },
    {
      name: "Helios Smart Light Kit",
      slug: "helios-smart-light-kit",
      description:
        "Modular RGB light panels with music sync, dynamic scenes, and voice control.",
      price: "139.00",
      sku: "HELIOS-LIGHT",
      status: "active",
      stockQuantity: 90,
      seoTitle: "Helios Smart Lights – Modular Panels with Music Sync",
      seoDescription:
        "Create mood with Helios panels. Dynamic scenes, music sync, and voice assistant support.",
      seoKeywords: "smart lights,light panels,rgb panels,music sync",
      images: [
        { url: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60", isPrimary: true },
      ],
      categorySlugs: ["smart-home"],
    },
    {
      name: "Orbit MagSafe Power Bank 10K",
      slug: "orbit-magsafe-power-bank-10k",
      description:
        "Slim 10,000 mAh magnetic power bank with pass‑through charging and LED battery indicator.",
      price: "49.00",
      sku: "ORBIT-10K",
      status: "active",
      stockQuantity: 220,
      seoTitle: "Orbit 10K MagSafe Power Bank – Slim, Fast, Magnetic",
      seoDescription:
        "Stay powered with Orbit 10K. Compact MagSafe battery with pass‑through charging.",
      seoKeywords: "power bank,magsafe battery,portable charger,10kmah",
      images: [
        { url: "https://images.unsplash.com/photo-1526491109672-74740652b5db", isPrimary: true },
      ],
      categorySlugs: ["accessories"],
    },
    {
      name: "Breeze Air Purifier Mini",
      slug: "breeze-air-purifier-mini",
      description:
        "Quiet HEPA air purifier with app control, ideal for bedrooms and home offices.",
      price: "99.00",
      sku: "BREEZE-MINI",
      status: "active",
      stockQuantity: 130,
      seoTitle: "Breeze Mini Air Purifier – HEPA, Quiet, App Control",
      seoDescription:
        "Breathe cleaner air with Breeze Mini. HEPA filtration and whisper‑quiet operation.",
      seoKeywords: "air purifier,hepa,smart home air,quiet air purifier",
      images: [
        { url: "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa7", isPrimary: true },
      ],
      categorySlugs: ["smart-home", "electronics"],
    },
  ];

  // Insert products and relations if not present (by slug)
  for (const p of productSeeds) {
    const existing = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, p.slug))
      .limit(1);
    if (existing.length > 0) continue;

    const [inserted] = await db
      .insert(products)
      .values({
        sellerId: admin.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        sku: p.sku,
        status: p.status ?? "active",
        stockQuantity: p.stockQuantity ?? 0,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        seoKeywords: p.seoKeywords,
      })
      .returning({ id: products.id });

    // Images
    if (p.images?.length) {
      await db.insert(productImages).values(
        p.images.map((img) => ({
          productId: inserted.id,
          imageUrl: img.url,
          isPrimary: img.isPrimary ?? false,
        }))
      );
    }

    // Categories
    if (p.categorySlugs?.length) {
      const cats = await db
        .select({ id: categories.id, slug: categories.slug })
        .from(categories)
        .where(inArray(categories.slug, p.categorySlugs));
      if (cats.length) {
        await db.insert(productCategories).values(
          cats.map((c) => ({ productId: inserted.id, categoryId: c.id }))
        );
      }
    }
  }

  // Blog Seeds
  const blogSeeds: BlogSeed[] = [
    {
      title: "The Future of Smart Home Technology: A Complete Guide",
      slug: "future-of-smart-home-technology-complete-guide",
      excerpt: "Discover how smart home devices are transforming our daily lives, from voice assistants to automated lighting systems. Learn about the latest trends and what to expect in 2025.",
      coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop",
      status: "published",
      content: `<h1>The Future of Smart Home Technology: A Complete Guide</h1>
<p>Smart home technology has evolved from a futuristic concept to an everyday reality. Today, millions of households worldwide are embracing connected devices that make life more convenient, secure, and energy-efficient.</p>

<h2>What is Smart Home Technology?</h2>
<p>Smart home technology refers to a network of interconnected devices that can be controlled remotely via smartphones, tablets, or voice commands. These devices communicate with each other through the Internet of Things (IoT), creating an ecosystem that learns your preferences and adapts to your lifestyle.</p>

<h2>Key Benefits of Smart Home Devices</h2>
<h3>1. Convenience and Automation</h3>
<p>Imagine waking up to your favorite music, with your lights gradually brightening and your coffee maker starting automatically. Smart home systems can automate routine tasks, saving you time and effort throughout the day.</p>

<h3>2. Energy Efficiency</h3>
<p>Smart thermostats, lighting systems, and appliances can significantly reduce your energy consumption. These devices learn your patterns and optimize usage, potentially saving hundreds of dollars annually on utility bills.</p>

<h3>3. Enhanced Security</h3>
<p>Modern smart security systems include cameras, motion sensors, and smart locks that provide real-time alerts and remote monitoring. You can check on your home from anywhere in the world.</p>

<h2>Popular Smart Home Categories</h2>
<ul>
<li><strong>Smart Lighting:</strong> LED bulbs and switches that can change color, brightness, and schedule automatically</li>
<li><strong>Smart Speakers:</strong> Voice assistants like Amazon Alexa and Google Home that control your entire ecosystem</li>
<li><strong>Smart Thermostats:</strong> Learning devices that optimize heating and cooling based on your schedule</li>
<li><strong>Smart Security:</strong> Cameras, doorbells, and locks that provide comprehensive home protection</li>
<li><strong>Smart Appliances:</strong> Refrigerators, ovens, and washing machines with connectivity features</li>
</ul>

<h2>What to Expect in 2025</h2>
<p>The smart home industry is rapidly advancing. We're seeing increased integration with artificial intelligence, improved interoperability between devices, and a focus on sustainability. Matter, the new connectivity standard, promises to make smart home setup easier than ever.</p>

<p>As technology continues to evolve, smart homes will become more intuitive, secure, and energy-efficient. The future is bright for homeowners looking to embrace this transformative technology.</p>`,
    },
    {
      title: "Choosing the Perfect Laptop for Creators: Performance vs. Portability",
      slug: "choosing-perfect-laptop-creators-performance-vs-portability",
      excerpt: "Navigate the complex world of creator laptops. We break down the essential specs, compare top models, and help you find the perfect balance between power and portability for your creative work.",
      coverImage: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200&auto=format&fit=crop",
      status: "published",
      content: `<h1>Choosing the Perfect Laptop for Creators: Performance vs. Portability</h1>
<p>As a creator, your laptop is your most important tool. Whether you're editing videos, designing graphics, or producing music, choosing the right machine can make or break your workflow. But with so many options available, how do you find the perfect balance?</p>

<h2>Understanding Your Creative Needs</h2>
<p>Before diving into specifications, it's crucial to understand what type of creative work you'll be doing. Video editors have different requirements than graphic designers, and music producers need different features than photographers.</p>

<h2>Key Specifications to Consider</h2>
<h3>Processor (CPU)</h3>
<p>The CPU is the brain of your laptop. For intensive tasks like 4K video editing or 3D rendering, you'll want a high-performance processor. Intel's Core i7/i9 or AMD's Ryzen 7/9 series are excellent choices for creators.</p>

<h3>Graphics Card (GPU)</h3>
<p>A dedicated GPU is essential for video editing, 3D work, and GPU-accelerated tasks. NVIDIA's RTX series or AMD's Radeon Pro GPUs offer excellent performance for creative applications.</p>

<h3>RAM</h3>
<p>More RAM means smoother multitasking and faster rendering. We recommend at least 16GB for most creators, with 32GB or more for professional video editors and 3D artists.</p>

<h3>Storage</h3>
<p>SSD storage is non-negotiable for creators. Look for NVMe SSDs with at least 512GB capacity. Many creators opt for 1TB or more to store large project files.</p>

<h3>Display Quality</h3>
<p>Color accuracy is crucial. Look for displays with:</p>
<ul>
<li>High resolution (at least 1920x1080, preferably 2560x1440 or 4K)</li>
<li>Wide color gamut (100% sRGB minimum, DCI-P3 for professionals)</li>
<li>Accurate color calibration</li>
</ul>

<h2>Performance vs. Portability: Finding Your Balance</h2>
<p>This is the eternal dilemma for creators. High-performance laptops tend to be heavier and have shorter battery life, while ultraportable machines may lack the power you need.</p>

<h3>If You Prioritize Performance:</h3>
<p>Consider workstation-class laptops like the MacBook Pro 16" or high-end Windows machines. These offer desktop-level performance but sacrifice portability.</p>

<h3>If You Prioritize Portability:</h3>
<p>Ultrabooks and thin-and-light laptops are perfect for creators on the go. While they may not match desktop performance, modern models are surprisingly capable.</p>

<h2>Our Top Recommendations</h2>
<p>Based on our testing, here are some standout options:</p>
<ul>
<li><strong>MacBook Pro 14" M3:</strong> Excellent balance of power and portability</li>
<li><strong>Dell XPS 15:</strong> Powerful Windows alternative with great display</li>
<li><strong>ASUS ProArt StudioBook:</strong> Designed specifically for creators</li>
</ul>

<p>Remember, the best laptop is the one that fits your specific workflow and budget. Consider your primary use case, and don't be afraid to invest in quality—your productivity depends on it.</p>`,
    },
    {
      title: "Wireless Audio Revolution: Why True Wireless Earbuds Are Taking Over",
      slug: "wireless-audio-revolution-true-wireless-earbuds",
      excerpt: "Explore the rapid evolution of true wireless earbuds. From early connectivity issues to today's advanced ANC and spatial audio, discover why these tiny devices have become the audio standard.",
      coverImage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1200&auto=format&fit=crop",
      status: "published",
      content: `<h1>Wireless Audio Revolution: Why True Wireless Earbuds Are Taking Over</h1>
<p>The audio industry has undergone a dramatic transformation over the past decade. What started as a niche market for tech enthusiasts has become the dominant form of personal audio. True wireless earbuds have revolutionized how we listen to music, take calls, and interact with our devices.</p>

<h2>The Rise of True Wireless Technology</h2>
<p>When Apple introduced AirPods in 2016, they sparked a revolution. The concept of completely wireless earbuds—no cables, no wires, just pure freedom—captured the imagination of consumers worldwide. Today, true wireless earbuds are everywhere, from gyms to coffee shops to office spaces.</p>

<h2>What Makes True Wireless Special?</h2>
<h3>Complete Freedom</h3>
<p>Unlike traditional wireless headphones or neckband earbuds, true wireless earbuds have no physical connection between the two earbuds. This design offers unparalleled freedom of movement and a minimalist aesthetic.</p>

<h3>Advanced Features</h3>
<p>Modern true wireless earbuds pack impressive technology into tiny packages:</p>
<ul>
<li><strong>Active Noise Cancellation (ANC):</strong> Blocks out ambient noise for immersive listening</li>
<li><strong>Spatial Audio:</strong> Creates a 3D sound experience</li>
<li><strong>Transparency Mode:</strong> Lets you hear your surroundings when needed</li>
<li><strong>Voice Assistants:</strong> Built-in support for Siri, Google Assistant, and Alexa</li>
<li><strong>Water Resistance:</strong> IPX4 to IPX7 ratings for workouts and rain</li>
</ul>

<h2>Key Technologies Driving Innovation</h2>
<h3>Bluetooth Evolution</h3>
<p>Bluetooth 5.0 and later versions have dramatically improved connection stability, range, and audio quality. Low-latency codecs like aptX Adaptive and LDAC ensure high-quality audio transmission.</p>

<h3>Battery Technology</h3>
<p>Advances in battery technology have extended playtime from 3-4 hours to 8-12 hours on a single charge, with charging cases providing 24-40 hours total. Fast charging capabilities mean 5 minutes can give you an hour of playback.</p>

<h3>Audio Processing</h3>
<p>Sophisticated DSP (Digital Signal Processing) chips enable features like adaptive EQ, noise cancellation, and spatial audio processing—all happening in real-time within the tiny earbuds.</p>

<h2>Choosing the Right Pair</h2>
<p>With hundreds of options available, choosing the right true wireless earbuds can be overwhelming. Consider these factors:</p>

<h3>Sound Quality</h3>
<p>Look for earbuds with good frequency response and support for high-quality codecs. Many premium models offer customizable EQ settings.</p>

<h3>Comfort and Fit</h3>
<p>Since earbuds sit in your ears for hours, comfort is crucial. Look for multiple ear tip sizes and ergonomic designs.</p>

<h3>Battery Life</h3>
<p>Consider your usage patterns. If you're a heavy user, prioritize models with longer battery life and fast charging.</p>

<h3>Features</h3>
<p>Determine which features matter most to you. Do you need ANC? Transparency mode? Wireless charging? These features add to the cost but can significantly enhance your experience.</p>

<h2>The Future of True Wireless Audio</h2>
<p>We're seeing exciting developments on the horizon:</p>
<ul>
<li>Improved battery life through more efficient chips</li>
<li>Better integration with health and fitness tracking</li>
<li>Enhanced spatial audio for immersive experiences</li>
<li>AI-powered sound personalization</li>
</ul>

<p>True wireless earbuds have become an essential accessory for modern life. As technology continues to improve, we can expect even more impressive features and better performance in smaller, more affordable packages.</p>`,
    },
    {
      title: "Sustainable Tech: How to Build an Eco-Friendly Home Office",
      slug: "sustainable-tech-eco-friendly-home-office",
      excerpt: "Learn how to create an environmentally conscious workspace. From energy-efficient devices to sustainable materials, discover practical tips for reducing your tech carbon footprint.",
      coverImage: "https://images.unsplash.com/photo-1497215842964-222b430dc094?q=80&w=1200&auto=format&fit=crop",
      status: "published",
      content: `<h1>Sustainable Tech: How to Build an Eco-Friendly Home Office</h1>
<p>As remote work becomes the norm, many of us are spending more time in our home offices. This shift presents an opportunity to create workspaces that are not only productive but also environmentally responsible. Building a sustainable home office is easier than you might think.</p>

<h2>Why Sustainable Tech Matters</h2>
<p>The technology industry has a significant environmental impact. From manufacturing processes to energy consumption, our devices contribute to carbon emissions and electronic waste. By making conscious choices, we can reduce this impact while maintaining productivity.</p>

<h2>Energy-Efficient Devices</h2>
<h3>Choose Energy Star Certified Products</h3>
<p>Look for Energy Star certified monitors, computers, and peripherals. These devices meet strict energy efficiency guidelines and can reduce your electricity consumption by 20-30%.</p>

<h3>LED Lighting</h3>
<p>Replace traditional bulbs with LED alternatives. LED lights use up to 75% less energy and last 25 times longer than incandescent bulbs. Smart LED systems can further optimize energy usage with automated scheduling.</p>

<h3>Laptop vs. Desktop</h3>
<p>Laptops are generally more energy-efficient than desktop computers. If your work allows, a laptop can reduce your energy consumption significantly while offering portability benefits.</p>

<h2>Sustainable Materials and Design</h2>
<h3>Bamboo and Recycled Materials</h3>
<p>Choose desks, keyboard trays, and accessories made from sustainable materials like bamboo or recycled plastic. These materials are durable, attractive, and have a lower environmental impact.</p>

<h3>Modular Furniture</h3>
<p>Invest in modular furniture that can adapt to your changing needs. This reduces waste and extends the life of your office furniture.</p>

<h2>Reducing Electronic Waste</h2>
<h3>Buy Quality, Buy Less</h3>
<p>Invest in high-quality devices that will last longer. While premium products cost more upfront, they often provide better value over time and reduce the need for frequent replacements.</p>

<h3>Repair Instead of Replace</h3>
<p>Before discarding a device, consider if it can be repaired. Many manufacturers now offer repair services, and third-party repair shops can extend device lifespans significantly.</p>

<h3>Proper Disposal</h3>
<p>When devices do reach end-of-life, dispose of them responsibly. Many electronics retailers offer recycling programs, and some manufacturers provide trade-in options.</p>

<h2>Power Management</h2>
<h3>Smart Power Strips</h3>
<p>Use smart power strips that automatically cut power to devices when they're not in use. This prevents phantom power consumption and can save significant energy.</p>

<h3>Power Settings</h3>
<p>Configure your devices to enter sleep mode when idle. Enable automatic screen dimming and set shorter timeout periods for sleep mode.</p>

<h2>Paperless Workflow</h2>
<p>Embrace digital tools to reduce paper usage:</p>
<ul>
<li>Use cloud storage instead of physical filing</li>
<li>Sign documents digitally</li>
<li>Take notes on tablets or laptops</li>
<li>Use digital whiteboards for brainstorming</li>
</ul>

<h2>Renewable Energy</h2>
<p>If possible, power your home office with renewable energy. Solar panels, green energy plans from utilities, or portable solar chargers can significantly reduce your carbon footprint.</p>

<h2>Creating a Greener Workspace</h2>
<p>Beyond technology, consider these additions:</p>
<ul>
<li><strong>Plants:</strong> Improve air quality and create a calming environment</li>
<li><strong>Natural Light:</strong> Position your desk near windows to reduce artificial lighting needs</li>
<li><strong>Proper Insulation:</strong> Ensure your workspace is well-insulated to reduce heating and cooling costs</li>
</ul>

<h2>Measuring Your Impact</h2>
<p>Track your energy consumption using smart plugs and energy monitoring tools. Understanding your usage patterns helps identify opportunities for improvement.</p>

<p>Building a sustainable home office is an ongoing process. Start with small changes and gradually incorporate more eco-friendly practices. Every step toward sustainability makes a difference, both for the environment and your wallet.</p>`,
    },
    {
      title: "Productivity Hacks: Essential Tech Accessories for Remote Workers",
      slug: "productivity-hacks-essential-tech-accessories-remote-workers",
      excerpt: "Maximize your remote work efficiency with these must-have tech accessories. From ergonomic keyboards to monitor stands, discover the tools that can transform your home office setup.",
      coverImage: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop",
      status: "published",
      content: `<h1>Productivity Hacks: Essential Tech Accessories for Remote Workers</h1>
<p>Working from home has become the new normal, but creating a productive workspace requires more than just a laptop. The right tech accessories can dramatically improve your comfort, efficiency, and overall work experience. Here's your guide to the essential accessories every remote worker needs.</p>

<h2>Ergonomic Essentials</h2>
<h3>Monitor Stands and Risers</h3>
<p>Proper monitor height is crucial for preventing neck and back strain. A quality monitor stand elevates your screen to eye level, promoting better posture. Look for stands with:</p>
<ul>
<li>Adjustable height settings</li>
<li>Cable management features</li>
<li>Additional storage space</li>
</ul>

<h3>Ergonomic Keyboards</h3>
<p>Mechanical keyboards with ergonomic designs can reduce wrist strain and improve typing comfort. Split keyboards and those with wrist rests are particularly beneficial for long typing sessions.</p>

<h3>Ergonomic Mice</h3>
<p>Vertical or ergonomic mice reduce wrist pronation, preventing repetitive strain injuries. Many models offer customizable buttons for productivity shortcuts.</p>

<h2>Display Enhancements</h2>
<h3>External Monitors</h3>
<p>Multiple monitors significantly boost productivity. A second (or third) screen allows you to:</p>
<ul>
<li>Keep reference materials visible while working</li>
<li>Compare documents side-by-side</li>
<li>Monitor communications while focusing on tasks</li>
</ul>

<h3>Monitor Arms</h3>
<p>Monitor arms free up desk space and provide flexible positioning. They're especially useful for multi-monitor setups and allow easy adjustment throughout the day.</p>

<h2>Audio Solutions</h2>
<h3>Quality Headphones</h3>
<p>Noise-canceling headphones are essential for:</p>
<ul>
<li>Blocking out distractions</li>
<li>Clear video calls</li>
<li>Focusing in noisy environments</li>
</ul>

<h3>USB Microphones</h3>
<p>Built-in laptop microphones often produce poor audio quality. A dedicated USB microphone dramatically improves call clarity and professional appearance during video conferences.</p>

<h3>Speaker Systems</h3>
<p>For those who prefer speakers over headphones, quality desktop speakers provide clear audio for calls and music without the isolation of headphones.</p>

<h2>Connectivity and Power</h2>
<h3>USB-C Hubs</h3>
<p>Modern laptops have limited ports. A USB-C hub expands connectivity, providing:</p>
<ul>
<li>Multiple USB-A ports</li>
<li>HDMI or DisplayPort outputs</li>
<li>SD card readers</li>
<li>Ethernet connectivity</li>
</ul>

<h3>Wireless Charging Pads</h3>
<p>Keep your phone and earbuds charged without cable clutter. Wireless charging pads maintain your devices' battery levels throughout the day.</p>

<h3>Power Banks</h3>
<p>Portable power banks ensure you never run out of battery, whether you're working from a coffee shop or your laptop's battery is running low.</p>

<h2>Organization and Cable Management</h2>
<h3>Cable Management Solutions</h3>
<p>Keep your desk tidy with:</p>
<ul>
<li>Cable clips and ties</li>
<li>Under-desk cable trays</li>
<li>Cable sleeves for grouping wires</li>
</ul>

<h3>Desk Organizers</h3>
<p>Desktop organizers keep essential items within reach while maintaining a clean workspace. Look for organizers with compartments for pens, sticky notes, and small accessories.</p>

<h2>Lighting Solutions</h2>
<h3>Desk Lamps</h3>
<p>Proper lighting reduces eye strain and improves focus. LED desk lamps with adjustable brightness and color temperature are ideal for long work sessions.</p>

<h3>Ring Lights</h3>
<p>For frequent video calls, a ring light provides professional-quality lighting that makes you look your best on camera.</p>

<h2>Comfort Additions</h2>
<h3>Laptop Stands</h3>
<p>Elevating your laptop improves ergonomics and provides better viewing angles. Many stands also include cooling fans to prevent overheating.</p>

<h3>Footrests</h3>
<p>An ergonomic footrest promotes better posture and reduces lower back strain during long sitting sessions.</p>

<h3>Desk Mats</h3>
<p>Large desk mats provide a comfortable surface for your mouse and keyboard while protecting your desk surface.</p>

<h2>Creating Your Perfect Setup</h2>
<p>Building an effective home office doesn't require buying everything at once. Start with the essentials:</p>
<ol>
<li>Ergonomic keyboard and mouse</li>
<li>Monitor stand or external monitor</li>
<li>Quality headphones</li>
<li>USB-C hub</li>
<li>Desk lamp</li>
</ol>

<p>As you identify your specific needs, gradually add accessories that enhance your workflow. Remember, the best setup is one that works for your unique work style and space constraints.</p>

<p>Investing in quality tech accessories pays dividends in productivity, comfort, and job satisfaction. Your workspace should support your best work, and these tools can help you achieve that goal.</p>`,
    },
  ];

  // Insert blogs if not present (by slug)
  for (const blog of blogSeeds) {
    const existing = await db
      .select({ id: blogs.id })
      .from(blogs)
      .where(eq(blogs.slug, blog.slug))
      .limit(1);
    if (existing.length > 0) continue;

    await db.insert(blogs).values({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage,
      status: blog.status,
      authorId: admin.id,
      publishedAt: blog.status === "published" ? new Date() : null,
    });
  }

  console.log("✅ Seed completed: categories, products, and blogs inserted.");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => {
    // Postgres-js ends when process exits
    process.exit(0);
  });


