# Banking App — Claude Code Build Brief
## Based on: adrianhajdin/banking (Horizon)

---

## What We're Building

A full in-house banking platform with two roles:
- **Users** — sign up, log in, send money to other users, view balance and transaction history
- **Admins** — separate login, full control over all accounts and transactions

No Plaid. No Dwolla. No external payment processors. Everything runs on our own internal ledger using MongoDB.

---

## Phase 0 — Setup & Strip Out

### Keep from Horizon
- Next.js 15 App Router structure
- TypeScript config
- Tailwind CSS + shadcn/ui components
- UI components: forms, tables, pagination, sidebar, navbar
- Zod validation schemas
- React Hook Form setup
- Sentry config

### Rip Out Entirely
- `/lib/plaid.config.ts` — delete
- `/lib/actions/dwolla.actions.ts` — delete
- `/lib/appwrite.config.ts` — delete
- All Plaid imports and calls in `bank.actions.ts`
- All Dwolla imports and calls in `user.actions.ts`
- `PaymentTransferForm` Plaid-specific fields (sharableId, Plaid token fields)
- Remove from `package.json`: `plaid`, `dwolla-v2`, `node-appwrite`

### Install New Dependencies
```bash
npm install mongoose bcryptjs jsonwebtoken nodemailer
npm install -D @types/bcryptjs @types/jsonwebtoken @types/nodemailer
```

---

## Phase 1 — Database (MongoDB + Mongoose)

### Connection
Create `/lib/mongodb.ts`:
```
- Connect to MongoDB using MONGODB_URI env variable
- Use singleton pattern to avoid multiple connections in dev
```

### Collections / Schemas

#### 1. User
```
- _id
- firstName, lastName
- email (unique)
- passwordHash
- phone
- address
- dateOfBirth
- role: "user" | "admin"
- status: "active" | "blocked" | "pending"
- createdAt, updatedAt
```

#### 2. Account
```
- _id
- userId (ref: User)
- accountNumber (unique, auto-generated 10-digit)
- balance (Number, default: 0)
- currency (default: "USD")
- status: "active" | "frozen" | "closed"
- createdAt, updatedAt
```

#### 3. Transaction
```
- _id
- type: "transfer" | "credit" | "debit"
- senderId (ref: User, nullable for admin credits)
- receiverId (ref: User)
- senderAccountId (ref: Account, nullable)
- receiverAccountId (ref: Account)
- amount (Number)
- note (String, optional)
- status: "pending" | "approved" | "rejected" | "completed" | "blocked"
- initiatedBy: "user" | "admin"
- adminId (ref: User, nullable — populated when admin initiates)
- createdAt, updatedAt
```

#### 4. AdminLog
```
- _id
- adminId (ref: User)
- action: "credit" | "debit" | "block_account" | "unblock_account" | "block_transaction" | "approve_transaction" | "reject_transaction" | "send_email"
- targetUserId (ref: User)
- targetAccountId (ref: Account, optional)
- targetTransactionId (ref: Transaction, optional)
- amount (Number, optional)
- note (String)
- createdAt
```

---

## Phase 2 — Authentication

### Two Separate Auth Flows

#### User Auth — `/app/(auth)/sign-up` and `/app/(auth)/sign-in`
- Sign up: collect firstName, lastName, email, password, phone, address, dateOfBirth
- Hash password with bcrypt
- Create User document (role: "user", status: "active")
- Auto-create Account document for the user with generated account number
- Sign in: verify email + password, issue JWT stored in httpOnly cookie

#### Admin Auth — `/app/(admin)/login`
- Separate login page at `/admin/login`
- Admin accounts are pre-seeded in DB (not publicly registerable)
- Same JWT flow but role: "admin" in payload
- Redirect to `/admin/dashboard` on success

### Middleware — `/middleware.ts`
```
- /dashboard/* → requires valid JWT with role: "user"
- /admin/* → requires valid JWT with role: "admin"
- /auth/* → redirect to dashboard if already logged in
```

### Seed Admin — `/scripts/seed-admin.ts`
```
- Create one default admin account on first run
- Email: admin@yourbank.com
- Password: from ADMIN_SEED_PASSWORD env variable
```

---

## Phase 3 — User Dashboard

### Pages (keep Horizon's layout, replace data layer)

#### `/dashboard` — Home
- Show: account balance, account number, recent 5 transactions
- Data from MongoDB, not Plaid

#### `/dashboard/transactions` — Transaction History
- Full paginated transaction list
- Filter by: date range, type (sent/received/admin credit)
- Each row: date, description, amount, status, type (credit/debit)

#### `/dashboard/transfer` — Send Money
- Form fields: recipient account number, amount, note
- Validate: sender has enough balance, recipient account exists and is active
- On submit: create Transaction with status "pending" (or "completed" if auto-approve is on)
- Deduct from sender balance, add to receiver balance atomically

#### `/dashboard/profile` — Profile
- Show user info
- Allow update: phone, address

---

## Phase 4 — Admin Dashboard

### Pages at `/admin/*`

#### `/admin/dashboard` — Overview
- Total users, total accounts, total transactions today
- Recent activity feed
- Pending transactions list

#### `/admin/users` — User Management
- Table: all users with status badge
- Actions per user: View, Block Account, Unblock Account, Send Email

#### `/admin/users/[userId]` — User Detail
- Full user info
- Their account balance and account number
- Full transaction history
- Action buttons:
  - **Credit Account** — add money (modal: amount + reason)
  - **Debit Account** — remove money (modal: amount + reason)
  - **Block Account** — freeze all activity
  - **Unblock Account**
  - **Send Email** — compose and send email to user

#### `/admin/transactions` — All Transactions
- Full transaction list across all users
- Filter by: status, type, date
- Actions: Approve, Reject, Block (per transaction)

#### `/admin/logs` — Admin Activity Log
- All admin actions with timestamp, admin name, action taken, target user

---

## Phase 5 — Core Business Logic

### `/lib/actions/account.actions.ts`
```
- getAccount(userId)
- getAccountByNumber(accountNumber)
- creditAccount(accountId, amount, adminId, note) → creates Transaction + AdminLog
- debitAccount(accountId, amount, adminId, note) → creates Transaction + AdminLog
- blockAccount(accountId, adminId, reason) → creates AdminLog
- unblockAccount(accountId, adminId) → creates AdminLog
```

### `/lib/actions/transaction.actions.ts`
```
- createTransfer(senderId, receiverAccountNumber, amount, note)
  → validates balance
  → creates Transaction (status: completed)
  → updates both account balances atomically (MongoDB session/transaction)
- approveTransaction(transactionId, adminId)
- rejectTransaction(transactionId, adminId)
- blockTransaction(transactionId, adminId)
- getTransactionsByUser(userId, page, filters)
- getAllTransactions(page, filters)  ← admin only
```

### `/lib/actions/email.actions.ts`
```
- sendEmailToUser(userId, subject, body, adminId)
  → sends via Nodemailer
  → logs in AdminLog
```

### `/lib/actions/admin.actions.ts`
```
- getAllUsers(page, filters)
- getUserById(userId)
- getAdminLogs(page, filters)
- getDashboardStats() → { totalUsers, totalTransactions, totalVolume, pendingTransactions }
```

---

## Phase 6 — Environment Variables

Add to `.env`:
```
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
ADMIN_SEED_PASSWORD=

# Email (Nodemailer)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

---

## Phase 7 — Account Number Generation

In `/lib/utils.ts`, add:
```
- generateAccountNumber() → random unique 10-digit number
- Check uniqueness against DB before saving
- Format for display: XXXX-XXXX-XX
```

---

## File Structure After Build

```
app/
  (auth)/
    sign-in/
    sign-up/
  (root)/
    dashboard/
      page.tsx
      transactions/
      transfer/
      profile/
  (admin)/
    login/
    dashboard/
    users/
      [userId]/
    transactions/
    logs/

lib/
  mongodb.ts
  auth.ts
  actions/
    account.actions.ts
    transaction.actions.ts
    admin.actions.ts
    user.actions.ts
    email.actions.ts
  models/
    User.ts
    Account.ts
    Transaction.ts
    AdminLog.ts

middleware.ts
scripts/
  seed-admin.ts
```

---

## Important Rules for Claude Code

1. All money operations (transfer, credit, debit) must use MongoDB transactions (sessions) to ensure atomicity — never update balances without a session
2. Never expose passwordHash in any API response
3. All admin actions must create an AdminLog entry — no exceptions
4. Account balance must never go below 0 — validate before every debit
5. JWT must be stored in httpOnly cookies only — never localStorage
6. All server actions must be in `/lib/actions/` as `"use server"` functions
7. Use Zod for all input validation before hitting the database
8. Admin routes must check role: "admin" in JWT — do not rely on UI alone

---

## Start Here (First Task for Claude Code)

1. Install new dependencies and remove old ones from `package.json`
2. Create `/lib/mongodb.ts` connection file
3. Create all 4 Mongoose models in `/lib/models/`
4. Create `/lib/auth.ts` with signToken and verifyToken helpers
5. Update `/middleware.ts` for role-based route protection
6. Run seed script to create first admin account

Then proceed phase by phase.
