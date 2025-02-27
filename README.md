# Mailfin 📫

Mailfin is an open-source application designed to enhance your Jellyfin experience by enabling email notifications for events such as adding new media. By integrating with **SendGrid** or **SMTP**, Mailfin provides a straightforward solution for sending email notifications.

<img width="319" alt="image" src="https://github.com/user-attachments/assets/6ac7d8f6-b988-4f7d-bcb5-cf78045a8461" />

<img width="409" height="731" alt="image" src="https://github.com/user-attachments/assets/5e61a99b-a4e1-4038-bf82-c61523b80e05" />

---

## ✨ Features

- Sends email notifications using SendGrid or SMTP.
- Simplifies email delivery for media server events.
- Works with Jellyfin’s Webhook plugin.
- Uses TMDB API for metadata.

---

## 🚀 Motivation

While using a VPN to connect to my Jellyfin server, I noticed I couldn't pull in external data from links, such as images due to my server being unable to be accessed publicly. The Jellyfin Webhook plugin is also limited in the format I want for my email notifications. This inspired me to create Mailfin, which bridges this gap and provides a simple way to handle email notifications for server events.

---

## 📦 Installation

### Prerequisites

- Jellyfin server.
- Jellyfin Webhook plugin installed.
- SendGrid API key or SMTP server credentials.
- TMDB API key for Metadata.
- Docker (optional, for containerized deployment).
- Node.js (optional, for manual deployment).

### Webhook Plugin Configuration

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

#### Choosing Data to Send

- **ItemType**: Required for Mailfin to determine the type of media being added.
- **Name**: The name of the media item.
- **SeriesName**: The name of the series.
- **Emails**: The email addresses to send notifications to (comma-separated). (ie. `name@email.com, user@example.com`).
- **SeasonNumber**: The season number of the series.
- **EpisodeNumber**: The episode number of the series.

Here is an example of how you can add more data to your handlebars template in the webhook for more information see the
`templates` directory in the project. (`Provider_tmdb` is optional and is used to fetch metadata for movies with TMDB, if
not provided, Mailfin will use the data from the webhook and the first result based on `Name`.)

**Minimal Example**:
```json
{
  "ItemType": "{{ItemType}}",
  "Name": "{{Name}}",
  "SeriesName": "{{SeriesName}}",
  "Emails": ""
  "SeasonNumber": "{{SeasonNumber}}",
  "EpisodeNumber": "{{EpisodeNumber}}"

  "Provider_tmdb": "{{Provider_tmdb}}",
}
```

**Using Metadata from Jellyfin**:

```json
{
  "Overview": "{{Overview}}",
  "PremiereDate": "{{PremiereDate}}",
  "RunTime": "{{RunTime}}",
  "Genres": "{{Genres}}",
  "ReleaseDate": "{{ReleaseDate}}",
  "Year": "{{Year}}",
  "Tagline": "{{Tagline}}",
  "Provider_imdb": "{{Provider_imdb}}"
}
```

**Using Server Information**:

Not required but can be used for custom poster + thumbnail images and direct links to added media.
One of the main reasons I made Mailfin was so that images could be loaded if your server is protected by a VPN.

```json
{
  "ServerUrl": "{{ServerUrl}}",
  "ItemId": "{{ItemId}}",
  "SeriesId": "{{SeriesId}}",
}
```

**NOTE**: `ItemType` is required for Mailfin to determine the type of media being added. Removing this will cause
Mailfin to fail. `Provider_tmdb` is optional and is used to fetch metadata for movies with TMDB, if not provided, Mailfin will use the data from the webhook and the first result based on `Name`. `SeriesName` and Season and Episode information.

## 📬 Running Mailfin

Mailfin is an Express.js application that runs on **port 3000** by default. You can run it in two ways:

#### **Option 1: Using Docker**

1. Create a `.env` file from the `sample.env` template
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
3. Create a `.env` file from the `sample.env` template:
   ```bash
   cp sample.env .env
   ```
4. Update the `.env` file with your SendGrid or SMTP credentials and TMDB API Key.
5. Build and run the application:
   ```bash
   npm run build
   npm run serve
   ```
