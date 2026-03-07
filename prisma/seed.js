const { PrismaClient } = require("@prisma/client");
const argon2 = require("argon2");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create test users
  const testUsers = [
    {
      username: "admin",
      password: "admin123",
      description: "Admin test user",
      role: "ADMIN",
    },
    {
      username: "editor",
      password: "editor123",
      description: "Editor for CMS",
      role: "EDITOR",
    },
    {
      username: "testuser",
      password: "test123",
      description: "Standard test user",
      role: "USER",
    },
    {
      username: "demo",
      password: "demo123",
      description: "Demo user for presentations",
      role: "USER",
    },
  ];

  for (const userData of testUsers) {
    const hashedPassword = await argon2.hash(userData.password);
    const role = userData.role || "USER";

    try {
      const user = await prisma.user.upsert({
        where: { username: userData.username },
        update: {
          password: hashedPassword,
          role,
        },
        create: {
          username: userData.username,
          password: hashedPassword,
          role,
        },
      });

      console.log(
        `✅ Created/Updated user: ${userData.username} (password: ${userData.password})`
      );
    } catch (error) {
      console.error(
        `❌ Error creating user ${userData.username}:`,
        error.message
      );
    }
  }

  // Create sample CMS data
  const adminUser = await prisma.user.findUnique({ where: { username: "admin" } });
  if (adminUser) {
    const cat = await prisma.category.upsert({
      where: { slug: "getting-started" },
      update: {},
      create: {
        name: "Getting Started",
        slug: "getting-started",
        description: "Introduction and basics",
        order: 0,
      },
    });
    const sub = await prisma.subcategory.upsert({
      where: { categoryId_slug: { categoryId: cat.id, slug: "overview" } },
      update: {},
      create: {
        name: "Overview",
        slug: "overview",
        categoryId: cat.id,
        order: 0,
      },
    });
    await prisma.article.upsert({
      where: { slug: "welcome" },
      update: {},
      create: {
        title: "Welcome to Member Articles",
        slug: "welcome",
        excerpt: "Get started with the member area and explore our content.",
        content: "<p>Welcome! This is a sample member-only article. You can create more articles in the CMS and organize them by category and subcategory.</p><p>The sidebar shows the course outline structure: <strong>Category &gt; Subcategory &gt; Article</strong>.</p>",
        isPublic: false,
        publishedAt: new Date(),
        authorId: adminUser.id,
        subcategoryId: sub.id,
      },
    });
    await prisma.article.upsert({
      where: { slug: "hello-world" },
      update: {},
      create: {
        title: "Hello World",
        slug: "hello-world",
        excerpt: "A sample public article.",
        content: "<p>This is a sample <strong>public</strong> article. It's visible to everyone at <code>/public/articles/hello-world</code>.</p><p>Public articles are indexed for SEO and don't require login.</p>",
        isPublic: true,
        publishedAt: new Date(),
        authorId: adminUser.id,
      },
    });
    console.log("   Sample CMS data created");
  }

  console.log("\n📊 Database Statistics:");
  const userCount = await prisma.user.count();
  const articleCount = await prisma.article.count();
  console.log(`   Total users: ${userCount}`);
  console.log(`   Total articles: ${articleCount}`);

  console.log("\n✨ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
