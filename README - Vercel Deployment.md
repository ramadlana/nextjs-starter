Make sure package.json include prisma generate

```
"scripts": {
  ...
  "build": "prisma generate && next build",
  ...
```

- Register Neon DB
- Get connection string postgresql
  'postgresql://xxxxx'

Go to Vercel

- Project -> new
- Enter git URL
- Framework preset: Next JS
- Env Variable
  - DATABASE_URL = string from neon
  - JWT_SECRET = your secret
