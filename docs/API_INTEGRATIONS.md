# JBET API Integrations

## Payment Gateway Integrations

### Paystack Integration

#### Configuration

```typescript
PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
PAYSTACK_SECRET_KEY=sk_live_xxxxx
PAYSTACK_BASE_URL=https://api.paystack.co
```

#### Implementation

**Deposit Flow:**
1. User selects Paystack as payment method
2. Frontend initiates payment
3. User redirected to Paystack checkout
4. User completes payment
5. Paystack calls webhook with transaction status
6. Backend verifies transaction
7. Update user wallet
8. Redirect to success page

**API Endpoints:**

```typescript
POST /api/payments/paystack/initialize
  Request: { email, amount, userId }
  Response: { authorizationUrl }

POST /api/payments/paystack/verify
  Request: { reference }
  Response: { status, message, data }

POST /api/payments/paystack/webhook
  Receives: Paystack transaction events
```

**Key Methods:**

```typescript
// Initialize payment
async initializePayment(email: string, amount: number) {
  const response = await axios.post(
    'https://api.paystack.co/transaction/initialize',
    { email, amount: amount * 100 },
    { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
  );
  return response.data;
}

// Verify payment
async verifyPayment(reference: string) {
  const response = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
  );
  return response.data;
}
```

#### Webhook Handling

```typescript
POST /api/payments/paystack/webhook
Headers: {
  'x-paystack-signature': signature_hash
}
Body: {
  event: 'charge.success',
  data: {
    reference: 'transaction_reference',
    amount: 100000,
    customer: { email: 'user@example.com' },
    status: 'success'
  }
}
```

---

### Flutterwave Integration

#### Configuration

```typescript
FLUTTERWAVE_PUBLIC_KEY=pk_live_xxxxx
FLUTTERWAVE_SECRET_KEY=sk_live_xxxxx
FLUTTERWAVE_BASE_URL=https://api.flutterwave.com/v3
```

#### Implementation

**Deposit Flow:**
1. User selects Flutterwave as payment method
2. Generate Flutterwave payment link
3. User completes payment through Flutterwave
4. Webhook notification received
5. Verify payment status
6. Update wallet
7. Send confirmation

**API Endpoints:**

```typescript
POST /api/payments/flutterwave/initialize
  Request: { email, amount, userId, phone }
  Response: { paymentLink }

GET /api/payments/flutterwave/verify/:transactionId
  Response: { status, data }

POST /api/payments/flutterwave/webhook
  Receives: Flutterwave transaction events
```

**Key Methods:**

```typescript
// Initialize payment
async initializePayment(
  email: string,
  amount: number,
  phone: string,
  userId: string
) {
  const response = await axios.post(
    `${FLUTTERWAVE_BASE_URL}/payments`,
    {
      tx_ref: `jbet-${userId}-${Date.now()}`,
      amount,
      currency: 'NGN',
      customer: { email, phone_number: phone },
      customizations: { title: 'JBET Deposit' }
    },
    {
      headers: {
        Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`
      }
    }
  );
  return response.data;
}

// Verify payment
async verifyPayment(transactionId: string) {
  const response = await axios.get(
    `${FLUTTERWAVE_BASE_URL}/transactions/${transactionId}/verify`,
    {
      headers: { Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}` }
    }
  );
  return response.data;
}
```

#### Webhook Handling

```typescript
POST /api/payments/flutterwave/webhook
Headers: {
  'verif-hash': signature_hash
}
Body: {
  event: 'charge.completed',
  data: {
    id: transaction_id,
    tx_ref: 'jbet-user-timestamp',
    amount: 10000,
    currency: 'NGN',
    status: 'successful'
  }
}
```

---

### Monnify Integration

#### Configuration

```typescript
MONNIFY_API_KEY=xxxxx
MONNIFY_SECRET_KEY=xxxxx
MONNIFY_CONTRACT_CODE=xxxxx
MONNIFY_BASE_URL=https://api.monnify.com/api/v1
```

#### Implementation

**Deposit Flow:**
1. User selects Monnify as payment method
2. Get reserved account or generate payment link
3. User pays to account/link
4. Webhook confirms payment
5. Update wallet
6. Send confirmation

**API Endpoints:**

```typescript
POST /api/payments/monnify/initialize
  Request: { email, amount, userId, phone }
  Response: { paymentLink }

GET /api/payments/monnify/verify/:transactionRef
  Response: { status, data }

POST /api/payments/monnify/webhook
  Receives: Monnify transaction events
```

**Key Methods:**

```typescript
// Initialize payment
async initializePayment(
  email: string,
  amount: number,
  phone: string,
  userId: string
) {
  const response = await axios.post(
    `${MONNIFY_BASE_URL}/merchant/transactions/init`,
    {
      amount,
      currencyCode: 'NGN',
      customerEmail: email,
      customerName: userId,
      paymentReference: `jbet-${userId}-${Date.now()}`,
      paymentDescription: 'JBET Deposit',
      incomeSplitConfig: [],
      redirectUrl: `${process.env.FRONTEND_URL}/wallet/deposit/callback`
    },
    {
      auth: {
        username: MONNIFY_API_KEY,
        password: MONNIFY_SECRET_KEY
      }
    }
  );
  return response.data;
}

// Verify payment
async verifyPayment(transactionRef: string) {
  const response = await axios.get(
    `${MONNIFY_BASE_URL}/merchant/transactions/query?transactionReference=${transactionRef}`,
    {
      auth: {
        username: MONNIFY_API_KEY,
        password: MONNIFY_SECRET_KEY
      }
    }
  );
  return response.data;
}
```

#### Webhook Handling

```typescript
POST /api/payments/monnify/webhook
Headers: {
  'monnify-signature': signature_hash
}
Body: {
  eventType: 'SUCCESSFUL_TRANSACTION',
  eventData: {
    transactionReference: 'jbet-user-timestamp',
    amountPaid: 10000,
    customerEmail: 'user@example.com',
    paymentStatus: 'PAID'
  }
}
```

---

## Third-Party Service Integrations

### Email Service (SendGrid/Mailgun)

```typescript
// Send welcome email
async sendWelcomeEmail(email: string, userName: string) {
  const msg = {
    to: email,
    from: 'noreply@jbet.com',
    subject: 'Welcome to JBET',
    html: '<h1>Welcome</h1><p>Thank you for joining JBET</p>'
  };
  await sendgrid.send(msg);
}

// Send betting confirmation
async sendBetConfirmation(email: string, betDetails: object) {
  // Implementation
}

// Send OTP
async sendOTP(email: string, otp: string) {
  // Implementation
}

// Send withdrawal confirmation
async sendWithdrawalConfirmation(email: string, amount: number) {
  // Implementation
}
```

### SMS Service (Twilio/Nexmo)

```typescript
// Send OTP via SMS
async sendOTPSMS(phone: string, otp: string) {
  await client.messages.create({
    body: `Your JBET OTP is: ${otp}`,
    from: TWILIO_PHONE,
    to: phone
  });
}

// Send bet notifications
async sendBetNotificationSMS(phone: string, message: string) {
  // Implementation
}
```

### Push Notification Service (Firebase Cloud Messaging)

```typescript
// Send push notification
async sendPushNotification(
  userId: string,
  title: string,
  body: string,
  data?: object
) {
  const message = {
    notification: { title, body },
    data: data || {},
    token: userDeviceToken
  };
  await admin.messaging().send(message);
}

// Send to topic
async sendToTopic(
  topic: string,
  title: string,
  body: string
) {
  const message = {
    notification: { title, body },
    topic
  };
  await admin.messaging().send(message);
}
```

### Analytics Service (Google Analytics/Mixpanel)

```typescript
// Track user event
async trackEvent(userId: string, eventName: string, properties: object) {
  analytics.track({
    userId,
    event: eventName,
    properties
  });
}

// Track bet placement
async trackBetPlaced(userId: string, bet: object) {
  trackEvent(userId, 'bet_placed', {
    amount: bet.amount,
    sport: bet.sport,
    markets: bet.markets.length
  });
}
```

---

## Sports Data Integrations

### Sports Data API

#### Configuration

```typescript
SPORTS_DATA_API_KEY=xxxxx
SPORTS_DATA_BASE_URL=https://api.sportsdata.io/v3
```

#### Endpoints Used

```typescript
// Get live scores
GET /api/sportsdata/live-scores
Response: [
  {
    GameId: 'xxxxx',
    Status: 'InProgress',
    Away: { TeamId: 1, Team: 'Team A', Score: 1 },
    Home: { TeamId: 2, Team: 'Team B', Score: 2 }
  }
]

// Get player statistics
GET /api/sportsdata/players/:playerId/stats
Response: {
  PlayerId: xxxxx,
  Goals: 10,
  Assists: 5,
  Games: 15
}

// Get team statistics
GET /api/sportsdata/teams/:teamId/stats
Response: {
  TeamId: xxxxx,
  Wins: 5,
  Draws: 2,
  Losses: 3,
  GoalsFor: 15,
  GoalsAgainst: 8
}
```

---

## WebSocket Integration

### Real-Time Data Streams

```typescript
// Live odds updates
socket.on('live:odds-update', (data) => {
  // { matchId, odds, timestamp }
});

// Live match updates
socket.on('live:match-update', (data) => {
  // { matchId, score, possession, corners }
});

// Live events
socket.on('live:event', (data) => {
  // { matchId, eventType, player, team, minute }
});
```

---

## Rate Limiting & Quotas

### API Rate Limits

| Service | Rate Limit | Reset Period |
|---------|-----------|--------------|
| Paystack | 3500 req/min | 1 minute |
| Flutterwave | 1000 req/min | 1 minute |
| Monnify | 500 req/min | 1 minute |
| SendGrid | 600 msg/min | 1 minute |
| Firebase | 500 req/sec | Real-time |

### Quota Management

```typescript
// Check rate limit
async checkRateLimit(service: string, userId: string) {
  const key = `ratelimit:${service}:${userId}`;
  const count = await redis.incr(key);
  
  if (count === 1) {
    await redis.expire(key, 60);
  }
  
  return count <= LIMITS[service];
}
```

---

## Error Handling

### Payment Error Handling

```typescript
try {
  const payment = await initializePayment(email, amount);
} catch (error) {
  if (error.response?.status === 401) {
    // Invalid credentials
  } else if (error.response?.status === 422) {
    // Validation error
  } else {
    // Generic error
  }
  
  // Log error
  await logPaymentError({
    service: 'paystack',
    error: error.message,
    userId,
    timestamp: new Date()
  });
}
```

---

## Testing

### Payment Gateway Testing

```typescript
// Test Paystack
const testPaymentPaystack = async () => {
  const result = await initializePayment(
    'test@example.com',
    50000
  );
  assert(result.status === true);
};

// Test Flutterwave
const testPaymentFlutterwave = async () => {
  const result = await initializePayment(
    'test@example.com',
    50000,
    '08012345678'
  );
  assert(result.data.link);
};
```

---

## Webhook Security

### Signature Verification

```typescript
// Verify Paystack signature
function verifyPaystackSignature(signature: string, body: object) {
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(body))
    .digest('hex');
  
  return hash === signature;
}

// Verify Flutterwave signature
function verifyFlutterwaveSignature(signature: string, body: object) {
  const hash = crypto
    .createHmac('sha256', FLUTTERWAVE_SECRET_KEY)
    .update(JSON.stringify(body))
    .digest('hex');
  
  return hash === signature;
}
```

