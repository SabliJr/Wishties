**Wishties:
Wishties is a web-based platform designed for creators to receive anonymous gifts and curate their personal profiles. It offers a simple, creator-friendly space where users can share all their important social media links in one place — similar to Linktree — while also managing a wishlist of items they’d love to receive from their audience. Wishties combines seamless anonymous gifting with customizable profile management for creators.

📌 Features:
- Anonymous Gifting: Fans and followers can send gifts to creators anonymously, fostering fun and surprise interactions.

- Customizable Creator Profiles: Creators can set up personal profiles, showcasing their information, wishlist items, and preferred ways to receive support.

- Link Sharing Hub: Similar to services like Linktree, creators can add and share their social media and personal links through a single, shareable Wishties profile.

- Personal Gift Management: Creators have the ability to create, manage, and display their own list of desired gifts for supporters to choose from.

**📖 Background:
Wishties was developed as a personal SaaS project to explore the creator economy space. It was my first full-stack product as an indie hacker, combining anonymous interactions with secure gift handling. While it didn’t reach a wide audience, the project reflects practical experience in designing, building, and deploying a fully functional web applications.

**🛠️ Tech Stack:
Frontend: React, TypeScript, CSS

Backend: Node.js, Express, TypeScript

Database: PostgreSQL

Storage: AWS S3

Hosting: Self-hosted on a Virtual Private Server (VPS)

**📦 Installation:
To run Wishties locally:

Clone the repository
```
git clone https://github.com/SabliJr/Wishties
cd wishties
Install dependencies
```
**Frontend:
```
cd client
npm install
```

**Backend:
```
cd server
npm install
Configure Environment Variables
```

Create a .env file in both client/ and server/ directories based on the provided .env.example files.
Run the Development Servers

**Frontend:
```
npm run dev
```

**Backend:
```
npm run dev
Access the app at http://localhost:3000
```

**📊 Lessons Learned
Managing AWS services (S3 buckets, access control)

Structuring TypeScript projects for both frontend and backend

Building and securing RESTful APIs

PostgreSQL relational data modeling

VPS deployment and server management

**🔗 Live Demo
Check it out at: www.wishties.com
