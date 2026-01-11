
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  POS = 'POS'
}

export enum UserType {
  REGULAR = 'Regular',
  COMPULSORY = 'Compulsory'
}

export enum UserTag {
  REGULAR = 'Regular',
  VIP = 'VIP',
  STAFF = 'Staff',
  VOLUNTEER = 'Volunteer'
}

export enum DonationType {
  MONTHLY = 'Monthly',
  WEEKLY = 'Weekly',
  ONE_TIME = 'One-time',
  SADAQAH = 'Sadaqah',
  ZAKAT = 'Zakat',
  GENERAL = 'General'
}

export enum PaymentMethod {
  BKASH = 'bKash',
  CASH = 'Cash',
  NAGAD = 'Nagad',
  BANK = 'Bank',
  BALANCE = 'User Balance',
  MANUAL = 'Manual Verification'
}

export enum ReceiptTemplate {
  CLASSIC = 'Classic',
  MODERN_QR = 'Modern QR',
  ELEGANT = 'Elegant',
  POS_MINI = 'POS Mini'
}

export type ExpenseCategory = 'Imam Salary' | 'Staff Salary' | 'Electricity' | 'Maintenance' | 'Construction' | 'General';

export interface User {
  id: string;
  token_id: string;
  name?: string;
  mobile_number: string;
  assigned_monthly_amount: number;
  user_type: UserType;
  created_at: string;
  updated_at: string;
  status: 'Active' | 'Inactive' | 'Blocked';
  auto_invoice_enabled: boolean;
  balance: number; 
  total_contributed: number;
  role: UserRole;
  phone?: string;
  posPin?: string;
  address?: string;
  tags?: UserTag[];
}

export interface Admin {
  id: string;
  username: string;
  password_hash: string;
  role: 'SuperAdmin' | 'Admin';
  created_at: string;
  updated_at: string;
}

export interface PosUser {
  id: string;
  username: string;
  password_hash: string;
  assigned_pos_name: string;
  created_at: string;
  updated_at: string;
  active: boolean;
}

export interface Donation {
  id: string;
  user_id: string;
  pos_id?: string;
  admin_id?: string;
  donation_type: DonationType;
  amount: number;
  month?: string;
  payment_method: PaymentMethod;
  status: 'Paid' | 'Pending' | 'Rejected';
  transaction_reference?: string;
  created_at: string;
  updated_at: string;
  pdf_receipt_generated: boolean;
  receipt_template_type: ReceiptTemplate;
  transactionUid: string;
  timestamp: string;
  collectorType: 'ADMIN' | 'POS' | 'SYSTEM';
  collectorName?: string;
  verified_by?: string;
  rejection_reason?: string;
  void_reason?: string;
  voided_at?: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  expense_date: string;
  added_by_admin_id: string;
  added_by_name?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  category: ExpenseCategory;
  paid_to?: string;
}

export interface AuditLog {
  id: string;
  action_type: 'Donation' | 'Expense' | 'User_Edit' | 'Security' | 'Verification' | 'Admin_Action' | 'POS_Action';
  performed_by_id: string;
  performed_by_type: 'ADMIN' | 'POS' | 'SYSTEM';
  details: string;
  timestamp: string;
  ip_address?: string;
  device_info?: string;
  performed_by_name?: string;
  module?: string;
  affected_user_id?: string;
}

export interface AppSettings {
  id: string;
  mosque_name: string;
  address: string;
  establishment_year: string;
  donation_footer_text: string;
  language_default: 'Bangla' | 'English';
  monthly_goal_amount: number;
  currency_symbol: string;
  predefined_amounts: number[];
  receipt_prefix: string;
  next_receipt_number: number;
}

export interface AppData {
  users: User[];
  admins: Admin[];
  pos_users: PosUser[];
  donations: Donation[];
  expenses: Expense[];
  audit_logs: AuditLog[];
  settings: AppSettings;
}
