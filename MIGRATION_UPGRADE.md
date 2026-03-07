# Migration: Hierarchical Categories

This project was updated to support **unlimited category nesting** (category › subcategory › subsubcategory › ...).

## Fresh install (empty database)

```bash
npx prisma migrate dev
npm run db:seed
```

## Upgrading from existing database (old Category + Subcategory schema)

If you have an existing database with the old schema:

```bash
# Mark the initial migration as applied (skip table creation)
npx prisma migrate resolve --applied 0_init

# Run the hierarchical categories migration
npx prisma migrate dev
```

Then regenerate the Prisma client and seed if needed:

```bash
npx prisma generate
npm run db:seed
```
