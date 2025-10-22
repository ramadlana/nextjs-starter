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
    },
    {
      username: "testuser",
      password: "test123",
      description: "Standard test user",
    },
    {
      username: "demo",
      password: "demo123",
      description: "Demo user for presentations",
    },
  ];

  for (const userData of testUsers) {
    const hashedPassword = await argon2.hash(userData.password);

    try {
      const user = await prisma.user.upsert({
        where: { username: userData.username },
        update: {
          password: hashedPassword,
        },
        create: {
          username: userData.username,
          password: hashedPassword,
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

  console.log("\n📊 Database Statistics:");
  const userCount = await prisma.user.count();
  console.log(`   Total users: ${userCount}`);

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
