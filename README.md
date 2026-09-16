EcommerceModern ⌚

A modern and responsive watch e-commerce website built with HTML, CSS, JavaScript, PHP, and MySQL.

Features
🛍️ Product catalog
🛒 Shopping cart
💳 Checkout system
📦 Order tracking
📍 Location & map support
🌙 Dark/light mode
📱 Responsive design
Tech Stack
Frontend: HTML, CSS, JavaScript
Backend: PHP
Database: MySQL
Libraries: Swiper.js, Leaflet.js, Boxicons
Setup
git clone https://github.com/SquartPOR1/EcommerceModern.git
cd EcommerceModern


Import database.sql into MySQL, configure the database connection in api/, then run the project using XAMPP or PHP's built-in server.

Courier simulation

This project can optionally connect to https://github.com/fudaylcavus/courier-simulation-api for simulated street-level courier tracking.

1. Clone the courier API beside this project and run `npm install`.
2. No API key is required. The local service uses Nominatim for geocoding and OSRM for free street routing.
3. Start it with `npm start` so it listens on `http://localhost:3000`.
4. Open this store through XAMPP at `http://localhost/responsive-watches-website-main/`.

New orders automatically create a courier simulation when the service is available. The existing order tracker polls the courier position, route, progress, and ETA every 10 seconds. If the service is offline, checkout still succeeds and the tracker shows the confirmed delivery destination instead.

The `courier_id` column is added automatically for existing databases when an API request is received. The standalone `database-courier-migration.sql` file is also available for manual database setup. The public geocoding and routing services have rate limits, so use this setup for development/testing rather than high-volume production traffic.

Author

SquartPOR1

⭐ If you like the project, consider giving it a star!
