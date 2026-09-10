
⌚ EcommerceModern

A modern, responsive watch e-commerce website built with HTML, CSS, JavaScript, PHP, and MySQL. The project provides a complete storefront experience including product browsing, shopping cart functionality, checkout, order management, and order tracking.

✨ Features
🏠 Modern responsive landing page
⌚ Featured watches and product collections
🛍️ Product catalog with multiple categories
🛒 Shopping cart functionality
💳 Checkout and order placement
📦 Order tracking by order number and email
📍 Customer address collection
🗺️ Current-location support using browser geolocation
🗺️ Order/shipment map visualization with Leaflet
🌙 Dark/light theme support
📱 Responsive design for desktop, tablet, and mobile
🎞️ Swiper-powered product and testimonial sliders
📰 Newsletter subscription section
💾 MySQL database for products and orders
🔌 Backend API for communicating with the database
🛠️ Tech Stack
Frontend
HTML5
CSS3
JavaScript
Boxicons
Swiper.js
Leaflet.js
Backend
PHP
REST-style API endpoints
Database
MySQL
InnoDB
UTF-8 (utf8mb4)
📁 Project Structure
EcommerceModern/
│
├── api/
│   └── Backend API endpoints
│
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── img/
│   │   └── Product and website images
│   └── js/
│       ├── main.js
│       └── swiper-bundle.min.js
│
├── .vscode/
│   └── VS Code configuration
│
├── database.sql
├── index.html
└── README.md

🛒 Storefront

The homepage contains several sections designed for an online watch store:

Home / Hero section
Featured products
Store story
Product catalog
Customer testimonials
New arrivals
Shopping cart
Checkout
Order tracking
Newsletter subscription

The frontend currently contains products such as Jazzmaster, Ingersoll, Rose Gold, Spirit Rose, Khaki Pilot, Jubilee Black, Duchen, Longines Rose, Dreyfuss Gold, and Portuguese Rose. {"fallbackMarkdown":"(GitHub
)","reference":{"matched_text":"","prefix":null,"start_idx":2344,"end_idx":2372,"safe_urls":["https://raw.githubusercontent.com/SquartPOR1/EcommerceModern/main/database.sql","https://raw.githubusercontent.com/SquartPOR1/EcommerceModern/main/index.html"],"refs":[],"alt":"(GitHub
)","prompt_text":null,"type":"grouped_webpages","items":[{"title":"","url":"https://raw.githubusercontent.com/SquartPOR1/EcommerceModern/main/database.sql","attribution":"GitHub","pub_date":null,"snippet":null,"attribution_segments":null,"supporting_websites":[{"title":"","url":"https://raw.githubusercontent.com/SquartPOR1/EcommerceModern/main/index.html","pub_date":null,"snippet":null,"attribution":"GitHub"}],"refs":[{"turn_index":1,"ref_type":"view","ref_index":1},{"turn_index":1,"ref_type":"view","ref_index":2}],"hue":null,"attributions":null}],"status":"done","style":null,"error":null,"fallback_items":null},"showLoginRequiredCard":false}

🗄️ Database

The project includes a database.sql file that creates an ecommerce database with three main tables:

products

Stores product information such as:

Product name
Slug
Price
Image
Category
Stock
Description
Creation date
orders

Stores customer order information including:

Customer name
Email
Address
Latitude/longitude
Order total
Order status
Payment reference
Creation date

Supported order statuses include:

pending
paid
processing
shipped
cancelled

order_items

Stores the individual products associated with each order, including:

Order ID
Product ID
Product name
Price
Quantity

The database schema also uses foreign-key relationships between orders, order items, and products. {"fallbackMarkdown":"(GitHub
)","reference":{"matched_text":"","prefix":null,"start_idx":3155,"end_idx":3172,"safe_urls":["https://raw.githubusercontent.com/SquartPOR1/EcommerceModern/main/database.sql"],"refs":[],"alt":"(GitHub
)","prompt_text":null,"type":"grouped_webpages","items":[{"title":"","url":"https://raw.githubusercontent.com/SquartPOR1/EcommerceModern/main/database.sql","attribution":"GitHub","pub_date":null,"snippet":null,"attribution_segments":null,"supporting_websites":[],"refs":[{"turn_index":1,"ref_type":"view","ref_index":1}],"hue":null,"attributions":null}],"status":"done","style":null,"error":null,"fallback_items":null},"showLoginRequiredCard":false}

🚀 Getting Started
1. Clone the repository
git clone https://github.com/SquartPOR1/EcommerceModern.git
cd EcommerceModern

2. Set up the database

Make sure MySQL is installed and running.

Import the provided SQL file:

mysql -u root -p < database.sql


Or import database.sql through phpMyAdmin.

This creates the:

ecommerce


database and populates it with sample products. {"fallbackMarkdown":"(GitHub
)","reference":{"matched_text":"","prefix":null,"start_idx":3604,"end_idx":3621,"safe_urls":["https://raw.githubusercontent.com/SquartPOR1/EcommerceModern/main/database.sql"],"refs":[],"alt":"(GitHub
)","prompt_text":null,"type":"grouped_webpages","items":[{"title":"","url":"https://raw.githubusercontent.com/SquartPOR1/EcommerceModern/main/database.sql","attribution":"GitHub","pub_date":null,"snippet":null,"attribution_segments":null,"supporting_websites":[],"refs":[{"turn_index":1,"ref_type":"view","ref_index":1}],"hue":null,"attributions":null}],"status":"done","style":null,"error":null,"fallback_items":null},"showLoginRequiredCard":false}

3. Configure the backend

Open the files inside the api/ directory and configure your database connection according to your local MySQL setup.

Typical configuration values include:

Database: ecommerce
Username: root
Password: your_password
Host: localhost


Update these values to match your local environment.

4. Run the project

Because the project contains PHP API files, it should be served through a PHP-compatible web server rather than opened directly with file://.

For example, using PHP's built-in development server:

php -S localhost:8000


Then open:

http://localhost:8000


Alternatively, place the project inside your XAMPP/WAMP web directory and access it through your local Apache server.

📍 Location & Maps

The checkout form supports collecting the customer's delivery location. Users can optionally allow browser GPS access for more accurate positioning.

The project uses Leaflet for map functionality. The frontend includes Leaflet CSS/JavaScript dependencies and a tracking map section for displaying shipment information. {"fallbackMarkdown":"(GitHub
)","reference":{"matched_text":"","prefix":null,"start_idx":4727,"end_idx":4744,"safe_urls":["https://raw.githubusercontent.com/SquartPOR1/EcommerceModern/main/index.html"],"refs":[],"alt":"(GitHub
)","prompt_text":null,"type":"grouped_webpages","items":[{"title":"","url":"https://raw.githubusercontent.com/SquartPOR1/EcommerceModern/main/index.html","attribution":"GitHub","pub_date":null,"snippet":null,"attribution_segments":null,"supporting_websites":[],"refs":[{"turn_index":1,"ref_type":"view","ref_index":2}],"hue":null,"attributions":null}],"status":"done","style":null,"error":null,"fallback_items":null},"showLoginRequiredCard":false}

🛍️ Checkout Flow

The general purchasing flow is:

Browse Products
      ↓
Add Product to Cart
      ↓
Review Cart
      ↓
Enter Delivery Information
      ↓
Optional GPS Location
      ↓
Place Order
      ↓
Order Created
      ↓
Track Order


Customers provide their name, email, country, region, city, street, and neighborhood during checkout. {"fallbackMarkdown":"(GitHub
)","reference":{"matched_text":"","prefix":null,"start_idx":5106,"end_idx":5123,"safe_urls":["https://raw.githubusercontent.com/SquartPOR1/EcommerceModern/main/index.html"],"refs":[],"alt":"(GitHub
)","prompt_text":null,"type":"grouped_webpages","items":[{"title":"","url":"https://raw.githubusercontent.com/SquartPOR1/EcommerceModern/main/index.html","attribution":"GitHub","pub_date":null,"snippet":null,"attribution_segments":null,"supporting_websites":[],"refs":[{"turn_index":1,"ref_type":"view","ref_index":2}],"hue":null,"attributions":null}],"status":"done","style":null,"error":null,"fallback_items":null},"showLoginRequiredCard":false}

📦 Order Tracking

Customers can track an order using:

Order number
Order email

The application provides an order-tracking interface and map area for shipment visualization. {"fallbackMarkdown":"(GitHub
)","reference":{"matched_text":"","prefix":null,"start_idx":5307,"end_idx":5324,"safe_urls":["https://raw.githubusercontent.com/SquartPOR1/EcommerceModern/main/index.html"],"refs":[],"alt":"(GitHub
)","prompt_text":null,"type":"grouped_webpages","items":[{"title":"","url":"https://raw.githubusercontent.com/SquartPOR1/EcommerceModern/main/index.html","attribution":"GitHub","pub_date":null,"snippet":null,"attribution_segments":null,"supporting_websites":[],"refs":[{"turn_index":1,"ref_type":"view","ref_index":2}],"hue":null,"attributions":null}],"status":"done","style":null,"error":null,"fallback_items":null},"showLoginRequiredCard":false}

🎨 UI & Design

The project focuses on a modern luxury-watch aesthetic with:

Responsive layouts
Product cards
Hero sections
Promotional sections
Smooth sliders
Dark mode
Mobile navigation
Shopping cart sidebar
Responsive checkout interface
🔧 Customization

You can customize the store by modifying:

Products

Update the product records in:

database.sql

Images

Replace product and website images inside:

assets/img/

Styling

Modify:

assets/css/styles.css

Functionality

Modify:

assets/js/main.js

Backend

Backend/API functionality is located inside:

api/

🌐 External Libraries

This project uses several frontend libraries:

Boxicons
Swiper
Leaflet
📸 Screenshots

Add screenshots of your application here:

## 📸 Screenshots

### Homepage
![Homepage](assets/screenshots/home.png)

### Products
![Products](assets/screenshots/products.png)

### Shopping Cart
![Shopping Cart](assets/screenshots/cart.png)

### Checkout
![Checkout](assets/screenshots/checkout.png)

### Order Tracking
![Order Tracking](assets/screenshots/tracking.png)

🔐 Security Notes

Before deploying this project to production, make sure to:

Use environment variables for database credentials.
Validate and sanitize all user input.
Use prepared SQL statements.
Protect API endpoints from unauthorized access.
Implement proper authentication if admin functionality is added.
Enable HTTPS.
Never commit passwords or API keys to the repository.
🚧 Future Improvements

Potential improvements include:

 User registration and authentication
 Admin dashboard
 Product search and filtering
 Product detail pages
 Wishlist functionality
 Payment gateway integration
 Email order notifications
 Inventory management
 Customer accounts
 Improved shipment tracking
 Production deployment configuration
 Automated testing
🤝 Contributing

Contributions, suggestions, and improvements are welcome.

Fork the repository.
Create a feature branch.
git checkout -b feature/my-feature

Make your changes.
Commit your changes.
git commit -m "Add my feature"

Push the branch.
git push origin feature/my-feature

Open a Pull Request.
📄 License

This project does not currently specify a license in the repository. If you plan to distribute or reuse the project, add an appropriate LICENSE file.

👨‍💻 Author

SquartPOR1

GitHub:
https://github.com/SquartPOR1

⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

Built with ❤️ for a modern e-commerce experience.
