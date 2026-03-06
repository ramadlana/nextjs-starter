# Test Data & Seeding

This document provides information about test users and how to seed the database with standard test data. The project uses **PostgreSQL**; ensure `DATABASE_URL` points to your Postgres instance before seeding.

## Test User Accounts

The following test accounts are created automatically when you run the seed script:

| Username   | Password   | Purpose                                        |
| ---------- | ---------- | ---------------------------------------------- |
| `admin`    | `admin123` | Admin test user for administrative testing     |
| `testuser` | `test123`  | Standard test user for general testing         |
| `demo`     | `demo123`  | Demo user for presentations and demonstrations |

## Database Seeding

### Initial Seed

To populate the database with test data:

```bash
npm run db:seed
```

This will create/update the test users in your database.

### Reset Database and Seed

To reset the entire database and re-seed with test data:

```bash
npm run db:reset
```

**⚠️ Warning:** This will delete ALL data in your database and start fresh!

### Manual Seeding with Prisma

You can also use Prisma's built-in seed command:

```bash
npx prisma db seed
```

## Using Test Accounts

### For Development

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Navigate to http://localhost:3000/login

3. Log in with any test account:
   - Username: `admin`
   - Password: `admin123`

### For Testing

Use different test accounts to test various scenarios:

- **admin**: Test admin-level functionality
- **testuser**: Test standard user workflows
- **demo**: Use for demos and presentations

## Security Notes

⚠️ **IMPORTANT**: These test accounts are for **DEVELOPMENT ONLY**!

- Never use these credentials in production
- Always delete or disable test accounts before deploying to production
- Change all passwords to secure, unique values in production environments

## Customizing Test Data

To add more test users or modify existing ones:

1. Edit `prisma/seed.js`
2. Add or modify users in the `testUsers` array:

```javascript
const testUsers = [
  {
    username: "newuser",
    password: "newpass123",
    description: "Description of user",
  },
  // Add more users here
];
```

3. Run the seed script:
   ```bash
   npm run db:seed
   ```

## Verifying Seed Data

After running the seed script, you should see output like:

```
🌱 Starting database seed...
✅ Created/Updated user: admin (password: admin123)
✅ Created/Updated user: testuser (password: test123)
✅ Created/Updated user: demo (password: demo123)

📊 Database Statistics:
   Total users: 3

✨ Seed completed successfully!
```

## Production Considerations

When preparing for production:

1. **Remove test accounts**:

   ```sql
   DELETE FROM User WHERE username IN ('admin', 'testuser', 'demo');
   ```

2. **Disable seeding**: Remove or comment out the `prisma.seed` configuration in `package.json`

3. **Create real admin account**: Use the registration endpoint with a secure password

4. **Implement user roles**: Extend the User model to include roles/permissions if needed

## Troubleshooting

### Seed script fails

If the seed script fails, check:

1. Database connection is working:

   ```bash
   npx prisma db push
   ```

2. Prisma client is generated:

   ```bash
   npx prisma generate
   ```

3. Dependencies are installed:
   ```bash
   npm install
   ```

### Duplicate user errors

The seed script uses `upsert`, so it will update existing users instead of creating duplicates. If you see errors, the database might be in an inconsistent state. Try:

```bash
npm run db:reset
```

## Integration with Development Workflow

### Recommended Setup

1. After cloning the repository:

   ```bash
   npm install
   npx prisma generate
   npx prisma migrate dev
   npm run db:seed
   npm run dev
   ```

2. When switching branches:

   ```bash
   npx prisma migrate dev
   npm run db:seed  # If test data is needed
   ```

3. Before testing:
   ```bash
   npm run db:reset  # Fresh start with test data
   ```

## CI/CD Considerations

For automated testing in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Setup Database
  run: |
    npx prisma generate
    npx prisma migrate deploy
    npm run db:seed

- name: Run Tests
  run: npm test
```

## Additional Resources

- [Prisma Seeding Guide](https://www.prisma.io/docs/guides/database/seed-database)
- [Authentication Documentation](./AUTHENTICATION.md)
- [Production Readiness Checklist](./PRODUCTION_READINESS.md)
