# Mailfin 📫

Mailfin is an open-source application designed to enhance your Jellyfin experience by enabling email notifications for events such as new media being added. By integrating with **SendGrid** or **SMTP**, Mailfin provides a straightforward solution for sending email notifications.

---

## ✨ Features

- Sends email notifications using SendGrid or SMTP.
- Simplifies email delivery for media server events.
- Works with Jellyfin’s Webhook plugin.
- Uses TMDB API for metadata.

---

## 🚀 Motivation

While using a VPN to connect to my Jellyfin server, I noticed I couldn't pull in external data from links, such as images due to my server not being able to be accessed publicly. Jellyfin Webhook plugin is also limited in the format I would like for my email notifications. This inspired me to create Mailfin, which bridges this gap and provides a simple way to handle email notifications for server events.

---

## 📦 Installation

### Prerequisites

- Jellyfin server.
- Jellyfin Webhook plugin installed.
- SendGrid API key or SMTP server credentials.
- TMDB API key for Metadata.
- Docker (optional, for containerized deployment).
- Node.js (optional, for manual deployment).

#### Webhook Plugin Configuration

1. Open the Jellyfin dashboard.
2. Go to **Dashboard** > **Plugins** > **Catalog**.
3. Search for **Webhook** and install it.
4. Go to **Dashboard** > **Plugins** > **Webhook**.
5. Add a new generic webhook with the following settings:
   - **Webhook Name**: Mailfin
   - **Webhook URL**: `http://localhost:3000/item-added`
     (replace `localhost` with your server IP if running Mailfin on a different machine).
   - **Notification Types**: Select the `ItemAdded` event.
   - Check **Enable** and **Send All Properties**.
6. Click **Save**.

Sending all properties is important for Mailfin to receive the necessary data to send email notifications.
If you don't want to send all properties, you can customize the Webhook plugin to send only the required data.

```json
{
    "Provider_tmdb": {{Provider_tmdb}},
    "ItemType" : {{ItemType}},
}
```

## 📬 Running Mailfin

## Mailfin is an Express.js application that runs on **port 3000** by default. You can run it in two ways:

#### **Option 1: Using Docker**

1. Create an `.env` file from the `sample.env` template
2. Update the `.env` file with your TMDB Api Key and your SendGrid or SMTP credentials.
3. Run the image from Docker Hub:
   ```bash
   docker run -p 3000:3000 --env-file .env mailfin/mailfin
   ```
4. Alternatively, you can use the provided `docker-compose.yml` file:
   ```bash
   docker-compose up -d
   ```

#### **Option 2: Manual Deployment**

1. Clone the repository:
   ```bash
   git clone https://github.com/Esteban-Bermudez/mailfin.git
   cd mailfin
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create an `.env` file from the `sample.env` template:
   ```bash
   cp sample.env .env
   ```
4. Update the `.env` file with your SendGrid or SMTP credentials and TMDB Api Key.
5. Build and run the application:
   ```bash
   npm run build
   npm run serve
   ```
