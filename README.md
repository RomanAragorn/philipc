# philipc

A modern ecommerce application built with **Next.js 14+ (App Router)**, React 19, TypeScript, Tailwind CSS, and Supabase.

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Git](https://git-scm.com/)

## 📁 Project Structure

With Next.js, the `client` and `server` folders are merged. The `app/` directory handles all routing, UI (Client Components), and backend logic (Server Components, API Routes, Server Actions).

```
philipc/
├── app/                    # Next.js App Router (handles all pages & logic)
│   ├── (auth)/             # Route group for auth pages (login, signup)
│   ├── (store)/            # Route group for main e-commerce (products, cart)
│   ├── api/                # Server-side API routes (replaces 'server' folder)
│   │   └── ...
│   ├── layout.tsx          # Root layout (client-side)
│   └── page.tsx            # Main homepage (server-side by default)
│
├── components/               # Reusable UI components (buttons, modals, etc.)
├── lib/                      # Helper functions, Supabase clients (client & server)
├── public/                   # Static assets (images, fonts)
│
├── database/                # Database files
│   ├─ schema.sql            # Table definitions & RLS
│   ├─ seeds.sql             # initial INSERTs
│   └─ migrations/
│
├── .env.local                # Environment variables (YOU CREATE THIS)
├── .env.example              # Environment template
├── .gitignore
├── package.json              # Single package.json for the whole project
├── tsconfig.json
├── next.config.mjs           # Next.js configuration
└── README.md                 # This file
```

## 🔧 Step-by-Step Setup Guide

### Step 1: Fork & Clone the Repository

1.  Click the **Fork** button at the top right of this repository
2.  Clone your forked repository to your local machine:

```bash
git clone https://github.com/Xenrui/philipc.git
cd philiPC
```

### Step 2: Install Project Dependencies

With Next.js, you only have one `package.json` to manage at the root of the project.

```bash
npm install
```

### Step 3: Configure Environment Variables

1.  In the root `philipc/` folder, you'll see a file named `.env.example`.
2.  Copy it to create your actual `.env.local` file:

**Windows (PowerShell):**

```bash
Copy-Item .env.example .env.local
```

**Windows (CMD):**

```bash
copy .env.example .env.local
```

3.  Open `.env.local` in your editor and replace the values.

<!-- end list -->

```env
# Public (browser-safe) variables
# These are prefixed with NEXT_PUBLIC_
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Secret (server-side only) variables
# These have NO prefix and are NOT exposed to the browser
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ask the Supabase project owner for these values.**

> ⚠️ **IMPORTANT SECURITY NOTES:**
>
> - **NEVER** commit `.env.local` files to Git.
> - Variables prefixed with `NEXT_PUBLIC_` are "public" and can be seen in the browser.
> - Variables **without** the prefix (like `SUPABASE_SERVICE_KEY`) are **server-side only** and are **never** exposed to the browser. This is how Next.js replaces your old `server` folder.

### Step 4: Run the Application

You only need **one terminal window**.

```bash
npm run dev
```

You should see:

```
✓ Ready in XXX ms
➜ Local:    http://localhost:3000
```

### Step 5: Open the Application

Open your browser and go to:

```
http://localhost:3000
```

---

## 🔐 Environment Variables Reference

All variables live in `.env.local` at the project root.

| Variable                          | Description                               | Used On              | Required |
| :-------------------------------- | :---------------------------------------- | :------------------- | :------- |
| `NEXT_PUBLIC_SUPABASE_URL`        | Your Supabase project URL                 | **Client** (Browser) | ✅ Yes   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | Supabase anonymous/public key             | **Client** (Browser) | ✅ Yes   |
| `SUPABASE_SERVICE_KEY`            | Supabase service role key (keep secret\!) | **Server** (Next.js) | ✅ Yes   |

---

## 🤝 Contributing

1.  Fork the repository
2.  Create a feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes following our commit convention (see below)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request

### Git Commit Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for clear and structured commit messages.

#### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types

- **feat**: A new feature
    - `feat(auth): add user login functionality`
    - `feat(cart): implement add to cart feature`
- **fix**: A bug fix
    - `fix(checkout): resolve payment processing error`
    - `fix(products): correct price display formatting`
- **docs**: Documentation only changes
    - `docs(readme): update installation instructions`
    - `docs(api): add endpoint documentation`
- **style**: Changes that don't affect code meaning (formatting, missing semi-colons, etc.)
    - `style(client): format code with prettier`
    - `style(components): fix indentation`
- **refactor**: Code change that neither fixes a bug nor adds a feature
    - `refactor(api): simplify product service logic`
    - `refactor(hooks): extract custom hook for cart`
- **perf**: Performance improvements
    - `perf(products): optimize product list rendering`
    - `perf(api): add database query caching`
- **test**: Adding or correcting tests
    - `test(auth): add unit tests for login`
    - `test(cart): add integration tests`
- **build**: Changes to build system or dependencies
    - `build(deps): upgrade react to v19`
    - `build(client): update vite config`
- **ci**: Changes to CI configuration files and scripts
    - `ci(github): add deployment workflow`
    - `ci(vercel): update build settings`
- **chore**: Other changes that don't modify src or test files
    - `chore(git): update .gitignore`
    - `chore(deps): update dependencies`

#### Examples

```bash
# Simple feature addition
git commit -m "feat(products): add product search functionality"

# Bug fix with details
git commit -m "fix(cart): prevent duplicate items in cart

# Documentation update
git commit -m "docs(readme): add git commit convention section"
```

#### Best Practices

1.  **Use imperative mood** in the subject line (e.g., "add" not "added" or "adds")
2.  **Don't capitalize** the first letter of the subject
3.  **No period** at the end of the subject line
4.  **Limit subject line** to 50-72 characters

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Next.js Auth Helpers](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)

## 📝 License

This project is licensed under the MIT License.
