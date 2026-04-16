# Strategic Planner - Kanban Task Management System

A local-first, highly responsive, and interactive Kanban board application built with React and Vite. Designed with a premium aesthetic and smooth animations, it allows users to efficiently manage their workflow and track tasks seamlessly.

## 🚀 Features

- **Interactive Kanban Board**: Fully functional drag-and-drop interface mapping across "Todo", "Doing", and "Done" statuses.
- **Advanced Sorting & Filtering**: 
  - Filter tasks by Priority (Low, Medium, High).
  - Sort by Due Date (Earliest, Latest) and Creation Date (Newest First).
- **Local-First Architecture**: All tasks and activities are securely persisted in the browser's `localStorage` ensuring your data is always available without backend latency.
- **Premium User Interface**: Styled with Tailwind CSS offering a polished "Editorial / Modern Cream" clean aesthetic.
- **Activity Logging**: Tracks and logs recent edits, creations, and movements of tasks.
- **Fluid Animations**: Uses `GSAP` to orchestrate smooth UI transitions and interactions.
- **Responsive Design**: Designed to work beautifully across desktop platforms and mobile devices alike.

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **Drag and Drop**: `@dnd-kit/core` & `@dnd-kit/sortable`
- **Animations**: GSAP
- **State Management**: React Context API (`BoardContext`)
- **Date Formatting**: `date-fns`

## ⚙️ How to Run Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Dhruv107ag/hintro_assi.git
   cd hintro_assi
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   Visit `https://hintro-round.vercel.app/` in your browser to view the application.

## 📦 Deployment
The application is pre-configured to be easily deployable on Vercel or Netlify. Since it is entirely frontend and local-first, no backend database setup is required.

---
*Developed for optimal productivity and user experience.*
