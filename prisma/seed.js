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
