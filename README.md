# Google Meet Scheduler

A modern web application that helps you create and manage Google Meet meetings effortlessly. Built with Next.js and integrated with Google Calendar API, this application allows you to schedule meetings for later or create instant meetings with just a few clicks.

## 🌟 Features

- **Instant Meetings**: Create Google Meet meetings on the fly
- **Scheduled Meetings**: Plan and schedule meetings for future dates
- **Google Calendar Integration**: Seamlessly sync with your Google Calendar
- **Modern UI**: Clean and intuitive user interface built with Tailwind CSS
- **Authentication**: Secure login using NextAuth.js
- **Real-time Updates**: Stay informed with live meeting status updates

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- Google Cloud Platform account
- Google Calendar API credentials

### Installation

1. Clone the repository:
   ```bash
   git clone [your-repository-url]
   cd gmeet-creator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Icons**: Lucide React
- **API Integration**: Google Calendar API

## 📝 Usage

1. **Sign In**: Click the sign-in button to authenticate with your Google account
2. **Create Instant Meeting**: 
   - Click "Create Instant Meeting"
   - Get your meeting link immediately
3. **Schedule Meeting**:
   - Click "Schedule Meeting"
   - Select date and time
   - Add meeting details
   - Click "Schedule"

## 🔒 Security

- All authentication is handled through NextAuth.js
- Google Calendar API credentials are securely managed
- Environment variables are used for sensitive information

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with Next.js
- Powered by Google Calendar API
- Styled with Tailwind CSS
