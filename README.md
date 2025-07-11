# Medication Reminder App

A smart medication reminder app with notifications, logs, and user-friendly scheduling for better health management.

## Problem This App Solves
Many people forget to take their medications on time, leading to missed doses and reduced treatment effectiveness. This app helps users remember their medications with timely reminders, tracks their adherence, and provides an easy way to log and review their medication history—improving health outcomes and peace of mind.

## Features
- User authentication (register, login, JWT-based)
- Add, edit, and delete medications with flexible schedules
- Automatic reminders with notification modals 
- Log medication actions (taken, missed, snoozed)
- Dashboard with daily stats and completion rate
- Export and sync data
- Dark mode and responsive design

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT
- **API Docs:** Swagger

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or cloud)

### Setup

#### 1. Clone the repository
```sh
git clone <your-repo-url>
cd <your-repo-directory>
```

#### 2. Backend Setup
```sh
cd backend
npm install
cp .env.example .env
npm run dev
```

#### 3. Frontend Setup
```sh
cd frontend
npm install
cp .env.example .env
npm run dev
```

#### 4. Access the App
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000/api](http://localhost:5000/api)
- Swagger Docs: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

#### Kindly access the Live Link Here .....

https://med-reminder-sable.vercel.app/


## App Preview
Kindly check the flow of how the app works here

![screenshot](/frontend/public/Screenshot%20(47).png)

![screenshot](/frontend/public/Screenshot%20(48).png)

![screenshot](/frontend/public/Screenshot%20(49).png)

![screenshot](/frontend/public/Screenshot%20(51).png)

![screenshot](/frontend/public/Screenshot%20(52).png)

![screenshot](/frontend/public/Screenshot%20(53).png)

![screenshot](/frontend/public/Screenshot%20(55).png)

![screenshot](/frontend/public/Screenshot%20(56).png)

![screenshot](/frontend/public/Screenshot%20(57).png)

![screenshot](/frontend/public/Screenshot%20(58).png)

![screenshot](/frontend/public/Screenshot%20(59).png)

## Usage
- Register a new account or log in.
- Add your medications and set reminder times.
- Receive notifications and alarm when it's time to take medication.
- Log actions (taken, missed, snoozed) and view your stats on the dashboard.
- Export or sync your data as needed.

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## License
[MIT](LICENSE)

---

**Made with ❤️ by ART_Redox for better health management.** 