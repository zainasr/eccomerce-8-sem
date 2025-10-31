import "dotenv/config";
import { db } from "./connection";
import { and, eq, inArray } from "drizzle-orm";
import {
  categories,
  products,
  productImages,
  productCategories,
  users,
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

  console.log("✅ Seed completed: categories and products inserted.");
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


