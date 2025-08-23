# Deployment Guide (Vercel + Prisma + NextAuth)

## 1. Prerequisites

- Repo pushed to GitHub (or GitLab / Bitbucket)
- A PostgreSQL database (e.g. Neon) and its DATABASE_URL
- Google OAuth credentials (Client ID / Secret)

## 2. Environment Variables (Vercel Project Settings)

Set for Production and Preview:

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET= (32+ char random base64)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXTAUTH_URL=https://your-project-name.vercel.app
```

Preview override (optional):

```
NEXTAUTH_URL=https://$VERCEL_URL
```

## 3. Package Scripts

`package.json` build pipeline should run Prisma migrations first and generate the client automatically (postinstall does this):

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma migrate deploy && next build",
    "start": "next start",
    "postinstall": "prisma generate"
  }
}
```

## 4. Google OAuth Configuration

Authorized redirect URI:

```
https://your-project-name.vercel.app/api/auth/callback/google
```

Authorized JavaScript origin:

```
https://your-project-name.vercel.app
```

## 5. Migrations

All SQL migrations in `prisma/migrations` are applied by `prisma migrate deploy` during the Vercel build.
To create a new migration locally:

```
npx prisma migrate dev --name add_feature_x
```

Commit the generated folder under `prisma/migrations`.

## 6. Local Testing Before Deploy

```
cp .env.example .env.local   # create if needed
npx prisma generate
npx prisma migrate deploy
npm run build
```

## 7. Deploy

- Import repo into Vercel (root directory = project root containing package.json)
- Confirm environment variables
- Trigger deploy

## 8. Post-Deploy Checks

- Sign in with Google & credentials flows
- /api/profile returns user data
- Create + list saved code snippets
- Monitor logs in Vercel Dashboard

## 9. Security / Hardening

- Rotate `NEXTAUTH_SECRET` if ever exposed
- Use pooled connection string for Neon if high concurrency
- Restrict Google OAuth publishing status to production users (optional)

## 10. Removing Legacy Generated Client

The custom `generated/prisma` directory is no longer needed (we now use the default `@prisma/client`). Ensure it is deleted locally and not tracked:

```
git rm -r generated/prisma
```

(Already ignored via `.gitignore`.)

## 11. Troubleshooting

| Issue                  | Fix                                                |
| ---------------------- | -------------------------------------------------- |
| redirect_uri_mismatch  | Update Google OAuth redirect URI to production URL |
| Invalid `NEXTAUTH_URL` | Ensure HTTPS and exact Vercel domain               |
| DB connection errors   | Verify DATABASE_URL and Neon pooling               |
| 500 on auth callbacks  | Check missing env vars in Vercel settings          |

## 12. Optional Improvements

- Add bundle analyzer (next-bundle-analyzer)
- Add SWR caching for profile & saved-code
- Implement logging (Log Drains / Sentry)

---

Happy shipping!
