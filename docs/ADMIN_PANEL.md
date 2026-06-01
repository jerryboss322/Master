# JBET Admin Panel Documentation

## Overview

The JBET Admin Panel is a comprehensive management system designed to handle all business operations, user management, financial transactions, and platform analytics.

---

## Admin Dashboard

### Main Dashboard

The main admin dashboard provides at-a-glance metrics and key performance indicators.

#### Display Metrics

- Total Users (Active/Inactive)
- Total Revenue (Today/Month/Year)
- Total Deposits
- Total Withdrawals
- Pending Approvals
- Active Bets
- Player Retention Rate
- Average Bet Size
- Win/Loss Ratio

#### Quick Actions

- Approve Deposit
- Approve Withdrawal
- Verify KYC
- Create Promotion
- Create Fixture
- View Alerts

#### Charts & Graphs

- Revenue Trend (Line Chart)
- User Growth (Area Chart)
- Deposit/Withdrawal Comparison (Bar Chart)
- Bet Distribution by Sport (Pie Chart)
- Peak Usage Hours (Heatmap)
- Top Sports (Bar Chart)

---

## User Management

### Users List

**Features:**
- Search users by email, username, phone
- Filter by status (Active, Inactive, Suspended, Verified, Unverified)
- Filter by date joined
- Sort by various columns
- Bulk actions (Suspend, Activate, Send Message)
- Export user list

**User Details View:**
- Profile information
- Account status
- KYC status
- Wallet balance
- Betting history
- Deposit history
- Withdrawal history
- Referral information
- Fraud score
- Account notes
- Action buttons (Suspend, Verify, Send Message)

### User Actions

- **Suspend Account**: Temporarily lock user account
- **Verify Account**: Mark account as verified
- **Add Balance**: Manually add funds to user wallet
- **Deduct Balance**: Manually deduct funds
- **Send Message**: Send notification to user
- **View Activity**: See login history and actions
- **Fraud Check**: Run fraud detection algorithm

---

## Deposit Management

### Pending Deposits

**List View:**
- User name and ID
- Deposit amount
- Payment method
- Reference number
- Timestamp
- Status
- Action buttons

**Filters:**
- Date range
- Amount range
- Payment method
- Status
- User tier

**Actions:**
- Approve deposit
- Reject deposit (with reason)
- Request additional documents
- View payment proof

### Completed Deposits

- View all completed deposits
- Export transaction report
- Filter by date and method
- View payment details

---

## Withdrawal Management

### Pending Withdrawals

**List View:**
- User details
- Withdrawal amount
- Bank details
- Status
- Requested date
- Action buttons

**Filters:**
- Date range
- Amount range
- Status
- Bank
- User tier

**Actions:**
- Approve withdrawal
- Reject withdrawal (with reason)
- Request additional documents
- Mark as processed

### Withdrawal History

- View all withdrawals
- Track processing times
- Generate reports
- Export data

---

## KYC Verification

### Pending KYC

**List View:**
- User information
- Submission date
- Submitted documents
- Status
- Action buttons

**Document Types:**
- ID (Passport, Driver's License, National ID)
- Address Proof (Utility Bill, Bank Statement)
- Selfie Verification
- Business Registration (For Business Accounts)

**Verification Process:**
1. Review submitted documents
2. Check document validity
3. Compare with government databases (if available)
4. Verify selfie matches ID
5. Approve or reject

**Actions:**
- Approve verification
- Reject with feedback
- Request additional documents
- Request new submission

### Verification History

- View all verified users
- View rejection reasons
- Track verification timeline

---

## Fixtures Management

### Create Fixture

**Form Fields:**
- Sport (Football, Basketball, etc.)
- League
- Home Team
- Away Team
- Match Date/Time
- Venue
- Competition Type
- Status (Pending, Live, Completed)

**Odds Setup:**
- Match Winner (Home/Draw/Away)
- Double Chance
- Over/Under (1.5, 2.5, 3.5, etc.)
- Both Teams To Score
- Correct Score
- Handicap
- Corners
- Cards
- First Goal Scorer
- Half-Time/Full-Time

### Fixtures List

**Display:**
- Match details
- Date/Time
- Status
- Odds
- Total bets
- Total wagered
- Payout status

**Actions:**
- Edit fixture
- Delete fixture
- Update odds
- Mark as live
- Mark as completed
- Close betting
- Settle bets

---

## Odds Management

### Update Odds

**Interface:**
- Select match/fixture
- Current odds display
- Update form for each market
- Change odds
- Margin adjustment
- Preview new odds

**Odds Settings:**
- Minimum odds
- Maximum odds
- Margin percentage
- Auto-adjust based on volume

**Actions:**
- Apply changes
- Save as template
- Schedule odds change
- Rollback to previous odds

### Odds History

- View odds changes over time
- Compare odds snapshots
- Track margin adjustments
- Analyze bet distributions

---

## Promotions Management

### Create Promotion

**Promotion Types:**
- Welcome Bonus
- Deposit Bonus
- Free Bet
- Cashback
- Reload Bonus
- VIP Bonus
- Referral Bonus

**Setup:**
- Promotion name
- Description
- Type
- Start date/time
- End date/time
- Bonus amount/percentage
- Terms and conditions
- Usage limits
- Eligible users/tiers

**Configuration:**
- Minimum deposit required
- Wagering requirements
- Eligible markets
- Maximum withdrawal
- Number of uses per user
- Promo code (if applicable)

### Promotions List

**Display:**
- Active promotions
- Completed promotions
- Performance metrics
- Usage count
- Cost analysis

**Actions:**
- Edit promotion
- Deactivate promotion
- View user claims
- Export promotion data

---

## Analytics Dashboard

### Revenue Analytics

- Total revenue
- Net revenue (Revenue - Payouts)
- Revenue by sport
- Revenue by market
- Daily/Weekly/Monthly trends
- Profit margin analysis

### User Analytics

- Total users
- New users today/month
- Active users
- Retention rate
- Churn rate
- User lifetime value
- Geographic distribution

### Betting Analytics

- Total bets placed
- Total wagered
- Total paid out
- Win rate
- Average bet size
- Popular markets
- Popular sports
- Peak betting hours

### Payment Analytics

- Total deposits
- Total withdrawals
- Deposit methods breakdown
- Withdrawal methods breakdown
- Average deposit size
- Average withdrawal size
- Payment success rate
- Chargeback rate

### Visualization

- Line charts for trends
- Pie charts for distribution
- Bar charts for comparison
- Heatmaps for time patterns
- Geographic maps for user distribution

---

## Reports

### Pre-built Reports

1. **Daily Summary Report**
   - Users added
   - Total revenue
   - Total payouts
   - Active bets

2. **Weekly Report**
   - Performance metrics
   - Top performers
   - Issues and alerts

3. **Monthly Report**
   - Revenue breakdown
   - User metrics
   - Payment metrics
   - Compliance status

4. **Betting Report**
   - Bets by sport
   - Bets by market
   - Win rates
   - Profit analysis

5. **User Report**
   - New users
   - Active users
   - Churned users
   - VIP users

6. **Financial Report**
   - Deposits
   - Withdrawals
   - Fees
   - Net profit

### Custom Reports

- Select metrics
- Choose date range
- Filter by parameters
- Generate report
- Export to PDF/Excel

### Report Scheduling

- Schedule automatic reports
- Email delivery
- Recurring schedules
- Report templates

---

## Support Tickets

### Ticket Management

**List View:**
- Ticket ID
- User
- Category
- Subject
- Priority
- Status
- Created date
- Last response date

**Filters:**
- Status (Open, In Progress, Resolved)
- Priority (Low, Medium, High, Critical)
- Category
- Date range
- Assigned to

**Actions:**
- Assign ticket
- Change priority
- Add response
- Close ticket
- Reopen ticket
- View ticket history

### Ticket Categories

- Account Issues
- Withdrawal/Deposit Issues
- Betting Issues
- Technical Issues
- Complaints
- Feedback
- Other

---

## Activity Logs

### Admin Activity Log

**Tracked Actions:**
- Login/Logout
- User approval/rejection
- Balance modifications
- Odds changes
- Promotion creation
- Report generation
- Settings changes

**Log Details:**
- Admin name
- Action type
- Target (user, fixture, etc.)
- Changes made
- Timestamp
- IP address

**Filters:**
- Date range
- Admin
- Action type
- Target type

---

## System Settings

### General Settings

- Platform name
- Logo and branding
- Support email
- Support phone
- Maintenance mode
- Terms and conditions
- Privacy policy

### Betting Settings

- Minimum bet amount
- Maximum bet amount
- Maximum payout
- Betting limits by user
- Allowed markets
- Odds decimal places
- Minimum odds

### Payment Settings

- Payment methods enabled
- Minimum deposit
- Maximum deposit
- Minimum withdrawal
- Maximum withdrawal
- Processing fees
- Settlement time

### Security Settings

- API rate limits
- Session timeout
- Password requirements
- 2FA enforcement
- IP whitelisting
- Suspicious activity threshold

### Notification Settings

- Email notifications
- SMS notifications
- Push notifications
- Notification templates
- Notification scheduling

---

## User Roles & Permissions

### Admin Roles

1. **Super Admin**
   - Full system access
   - User management
   - Financial management
   - Settings management
   - Report generation

2. **Finance Admin**
   - Manage deposits
   - Manage withdrawals
   - View financial reports
   - Cannot modify odds

3. **Content Admin**
   - Manage fixtures
   - Manage odds
   - Create promotions
   - Cannot modify users

4. **Support Admin**
   - Manage support tickets
   - View user profiles (read-only)
   - Cannot approve payments

5. **Compliance Admin**
   - Approve KYC
   - Manage suspended accounts
   - View audit logs
   - Cannot manage finances

---

## Alerts & Notifications

### Alert Types

- High payout event
- Unusual betting pattern
- Multiple failed logins
- Large withdrawal
- System errors
- Payment failures
- KYC rejections

### Alert Configuration

- Set thresholds
- Choose alert recipients
- Enable/disable alerts
- Email and SMS alerts

---

## Export & Import

### Export Features

- User data export
- Transaction data export
- Betting data export
- Analytics export
- Report export

**Formats:**
- CSV
- Excel
- PDF (for reports)
- JSON (for data migration)

### Import Features

- Bulk user import
- Fixture import
- Settings import

---

## Security Features

- All admin actions logged
- Role-based access control
- Admin session management
- 2FA for admin accounts
- IP whitelist capability
- Activity audit trail
- Data encryption

