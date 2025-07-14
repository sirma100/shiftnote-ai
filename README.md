# ShiftNote AI

AI-powered shift note formatter for Australian support workers in NDIS, aged care, SIL, and SDA services.

## Features

✅ **AI-Powered Formatting**: Transform raw shift notes into professional documentation using OpenAI GPT-4
✅ **Template System**: NDIS and Aged Care templates included
✅ **Authentication**: User registration and login with JWT tokens
✅ **Subscription Management**: Free tier (2 notes/day) and Pro tier ($4.99/month) with Stripe
✅ **PDF Export**: Pro users can download formatted notes as PDF
✅ **Copy to Clipboard**: Easy copying of formatted notes
✅ **Usage Tracking**: Track daily usage for free users
✅ **Responsive Design**: Works on desktop and mobile devices
✅ **Privacy Compliant**: Built with Australian privacy standards in mind

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: JSON file storage (easily upgradeable to PostgreSQL/MongoDB)
- **AI**: OpenAI GPT-4 API
- **Payments**: Stripe Checkout
- **Authentication**: JWT tokens with HTTP-only cookies
- **PDF Generation**: jsPDF
- **Styling**: Tailwind CSS with custom design system

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key
- Stripe account for payments (optional for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shiftnote-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

   Required environment variables:
   - `OPENAI_API_KEY`: Get from [OpenAI](https://platform.openai.com/api-keys)
   - `JWT_SECRET`: Generate a strong random string
   - `STRIPE_PUBLISHABLE_KEY`: Get from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
   - `STRIPE_SECRET_KEY`: Get from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### For Free Users
- Register for a free account
- Format up to 2 shift notes per day
- Copy formatted notes to clipboard
- Access all templates (NDIS, Aged Care)

### For Pro Users ($4.99/month)
- Unlimited shift note formatting
- PDF export functionality
- Priority support
- Access to new features

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Notes
- `POST /api/notes/format` - Format shift notes
- `GET /api/notes` - Get user's past notes

### Templates
- `GET /api/templates` - Get available templates

### Payments
- `POST /api/stripe/checkout` - Create Stripe checkout session

## Example Input/Output

### Input (Raw Notes)
```
leon refused meds again. oats for breakfast. noodles lunch. gp called. cleaned kitchen. no visitors.
```

### Output (Formatted NDIS Note)
```
1. House-based information – Kitchen cleaned.

2. Appointments – GP called regarding participant.

3. Visitors – No visitors today.

4. Client Information
   a. Meals – Breakfast: oats. Lunch: noodles.
   b. Medications – Participant refused medication, requested PRN.
```

## Database Schema

The application uses a JSON file for data storage (`data/database.json`):

```json
{
  "users": [
    {
      "id": "string",
      "email": "string",
      "password": "hashed_string",
      "subscription": "free|pro",
      "usageToday": "number",
      "lastUsageDate": "string",
      "createdAt": "string",
      "stripeCustomerId": "string?",
      "subscriptionId": "string?"
    }
  ],
  "notes": [
    {
      "id": "string",
      "userId": "string",
      "rawInput": "string",
      "formattedOutput": "string",
      "template": "string",
      "createdAt": "string",
      "clientName": "string?"
    }
  ],
  "templates": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "prompt": "string",
      "isDefault": "boolean"
    }
  ]
}
```

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The application can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- Heroku
- AWS Amplify

## Environment Variables

```env
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Stripe Keys
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# JWT Secret
JWT_SECRET=your_jwt_secret_here_use_a_strong_random_string

# Next.js URL
NEXTAUTH_URL=http://localhost:3000
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **HTTP-Only Cookies**: Prevent XSS attacks
- **Input Validation**: Prevent injection attacks
- **Rate Limiting**: Built-in usage limits for free users

## Privacy & Compliance

- **Data Minimization**: Only collect necessary information
- **No Long-term Storage**: Raw notes are deleted after formatting (optional)
- **Australian Privacy Standards**: Built with local regulations in mind
- **User Consent**: Clear privacy policy and terms of service

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@shiftnote.ai or create an issue in the GitHub repository.

## Roadmap

- [ ] Advanced templates (SIL, SDA specific)
- [ ] Multi-language support
- [ ] Mobile app
- [ ] Integration with case management systems
- [ ] Team collaboration features
- [ ] Advanced analytics and reporting
- [ ] Voice-to-text input
- [ ] Batch processing

## Acknowledgments

- OpenAI for the GPT-4 API
- Stripe for payment processing
- Tailwind CSS for styling
- Next.js team for the amazing framework
- Australian disability and aged care communities for inspiration
