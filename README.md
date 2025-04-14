Wishties
Wishties is a web-based platform designed for content creators to receive anonymous gifts and effortlessly share their personalized gift links with their audience. Built with modern web technologies, Wishties provides a seamless and secure experience for both creators and their supporters.

📌 Features
- Anonymous Gifting: Fans and followers can send gifts to creators anonymously, fostering fun and surprise interactions.

- Customizable Creator Profiles: Creators can set up personal profiles, showcasing their information, wishlist items, and preferred ways to receive support.

- Link Sharing Hub: Similar to services like Linktree, creators can add and share their social media and personal links through a single, shareable Wishties profile.

- Personal Gift Management: Creators have the ability to create, manage, and display their own list of desired gifts for supporters to choose from.

📖 Background
Wishties was developed as a personal SaaS project to explore the creator economy space. It was my first full-stack product as an indie hacker, combining anonymous interactions with secure gift handling. While it didn’t reach a wide audience, the project reflects practical experience in designing, building, and deploying a fully functional web applications.

🛠️ Tech Stack
Frontend: React, TypeScript, CSS

Backend: Node.js, Express, TypeScript

Database: PostgreSQL

Storage: AWS S3

Hosting: Self-hosted on a Virtual Private Server (VPS)

📦 Installation
To run Wishties locally:

Clone the repository

bash
Copy
Edit
git clone https://github.com/your-username/wishties.git
cd wishties
Install dependencies

Frontend:

bash
Copy
Edit
cd client
npm install
Backend:

bash
Copy
Edit
cd server
npm install
Configure Environment Variables

Create a .env file in both client/ and server/ directories based on the provided .env.example files.

Run the Development Servers

Frontend:

bash
Copy
Edit
npm run dev
Backend:

bash
Copy
Edit
npm run dev
Access the app at http://localhost:3000

📊 Lessons Learned
Managing AWS services (S3 buckets, access control)

Structuring TypeScript projects for both frontend and backend

Building and securing RESTful APIs

PostgreSQL relational data modeling

VPS deployment and server management

🔗 Live Demo
Check it out at: www.wishties.com
