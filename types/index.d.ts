/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// ========================================

declare type SignUpParams = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
};

declare type LoginUser = {
  email: string;
  password: string;
};

declare type User = {
  _id: string;
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  role: "user" | "admin";
  status: "active" | "blocked" | "pending";
  createdAt?: string;
};

declare type BankAccount = {
  _id: string;
  userId: string;
  accountNumber: string;
  accountType: "checking" | "savings";
  /** Real-time spendable funds (primary display balance). */
  availableBalance: number;
  /** Settled/posted balance (secondary). */
  ledgerBalance: number;
  currency: string;
  status: "active" | "frozen" | "closed";
  interestRate: number;
  withdrawalLimit: number;
  withdrawalCount: number;
  createdAt?: string;
};

declare type Transaction = {
  _id: string;
  type: "transfer" | "credit" | "debit";
  senderId?: string | User;
  receiverId: string | User;
  senderAccountId?: string;
  receiverAccountId: string;
  amount: number;
  note?: string;
  status: "pending" | "approved" | "rejected" | "completed" | "blocked";
  ledgerState: "pending" | "posted";
  initiatedBy: "user" | "admin";
  adminId?: string;
  createdAt: string;
  updatedAt?: string;
};

declare type VirtualCard = {
  _id: string;
  userId: string;
  accountId: string;
  lastFour: string;
  expiryMonth: number;
  expiryYear: number;
  cardHolderName: string;
  type: "virtual";
  status: "active" | "frozen" | "blocked" | "expired";
  dailyLimit: number;
  monthlyLimit: number;
  createdAt?: string;
};

declare type AdminLog = {
  _id: string;
  adminId: string | User;
  action: string;
  targetUserId: string | User;
  targetAccountId?: string;
  targetTransactionId?: string;
  amount?: number;
  note: string;
  createdAt: string;
};

declare type CategoryCount = {
  name: string;
  count: number;
  totalCount: number;
};

declare type AccountTypes =
  | "depository"
  | "credit"
  | "loan"
  | "investment"
  | "other";

declare type Category = "Food and Drink" | "Travel" | "Transfer";

// Component Props

declare interface AuthFormProps {
  type: "sign-in" | "sign-up";
}

declare interface HeaderBoxProps {
  type?: "title" | "greeting";
  title: string;
  subtext: string;
  user?: string;
}

declare interface MobileNavProps {
  user: User;
}

declare interface FooterProps {
  user: User;
  type?: "mobile" | "desktop";
}

declare interface SiderbarProps {
  user: User;
}

declare interface PaginationProps {
  page: number;
  totalPages: number;
}

declare interface RecentTransactionsProps {
  transactions: Transaction[];
  page: number;
  totalPages?: number;
  userId: string;
}

declare interface TransactionHistoryTableProps {
  transactions: Transaction[];
  page: number;
}

declare interface TransactionTableProps {
  transactions: Transaction[];
  userId: string;
}

declare interface CategoryBadgeProps {
  category: string;
}

declare interface CategoryProps {
  category: CategoryCount;
}

declare interface DoughnutChartProps {
  balance: number;
}

declare interface TotalBalanceBoxProps {
  balance: number;
  accountNumber: string;
}

declare interface RightSidebarProps {
  user: User;
  transactions: Transaction[];
  account: BankAccount | null;
  card: VirtualCard | null;
}

declare type TransferRail = "US_ACH" | "US_WIRE" | "UK_FPS" | "EU_SEPA" | "SWIFT";

declare type FXQuote = {
  fromCurrency: "USD";
  toCurrency: string;
  rate: number;
  fee: number;
  totalDebit: number;
  convertedAmount: number;
  estimatedDelivery: string;
};

declare type IntlTransaction = {
  _id: string;
  senderId: string;
  rail: TransferRail;
  transferType: "domestic" | "international";
  recipientName: string;
  recipientCountry: string;
  bankName: string;
  amount: number;
  fee: number;
  fxRate: number;
  toCurrency: string;
  convertedAmount: number;
  note?: string;
  status: string;
  createdAt: string;
};

declare type SavedRecipient = {
  _id: string;
  userId: string;
  recipientAccountNumber: string;
  recipientName: string;
  nickname: string;
  lastUsedAt: string | null;
  useCount: number;
  createdAt: string;
};

declare interface PaymentTransferFormProps {
  senderAccountNumber: string;
  senderBalance: number;
  prefillAccountNumber?: string;
}

declare interface BankCardProps {
  account: BankAccount;
  card: VirtualCard | null;
  userName: string;
  showBalance?: boolean;
}

// Legacy stubs — components kept for compatibility
declare type BankDropdownProps = Record<string, never>;
declare interface BankInfoProps {
  account: BankAccount;
  type: "full" | "card";
}
declare interface BankTabItemProps {
  account: BankAccount;
}
