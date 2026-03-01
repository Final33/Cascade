# Mapbox GL JS Setup Instructions

## Installation

Run the following command to install Mapbox GL JS and its type definitions:

```bash
npm install mapbox-gl @types/mapbox-gl
```

## Environment Variables

Add your Mapbox access token to `.env.local`:

```env
NEXT_PUBLIC_MAPBOX=your_mapbox_access_token_here
```

## Getting a Mapbox Access Token

1. Go to https://account.mapbox.com/
2. Sign up or log in
3. Navigate to "Access tokens" in your account
4. Copy your default public token or create a new one
5. Add it to your `.env.local` file

## Mapbox Documentation

- [Mapbox GL JS Guides](https://docs.mapbox.com/mapbox-gl-js/guides/)
- [Mapbox Style Specification](https://docs.mapbox.com/mapbox-gl-js/style-spec/)
- [Custom Styles](https://docs.mapbox.com/studio/manual/overview/)

The fire surveillance dashboard uses Mapbox's dark tactical style (`mapbox://styles/mapbox/dark-v11`) which is perfect for emergency dispatch and military applications.

