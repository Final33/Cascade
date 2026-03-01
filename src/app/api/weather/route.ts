import { NextResponse } from 'next/server';

// OpenWeatherMap API route
// Fetches real-time wind and weather data

interface WeatherResponse {
    wind: {
        speed: number;
        direction: string;
        degrees: number;
    };
    temperature: number;
    humidity: number;
    description: string;
    location: string;
}

// Convert degrees to compass direction
function degreesToDirection(degrees: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat') || process.env.DEFAULT_LATITUDE || '34.0522';
    const lon = searchParams.get('lon') || process.env.DEFAULT_LONGITUDE || '-118.2437';

    const apiKey = process.env.OPENWEATHERMAP_API_KEY;

    // If no API key, return demo data
    if (!apiKey) {
        return NextResponse.json({
            wind: {
                speed: 15,
                direction: 'NW',
                degrees: 315
            },
            temperature: 85,
            humidity: 25,
            description: 'Clear sky',
            location: 'Demo Location',
            isDemo: true
        } as WeatherResponse & { isDemo: boolean });
    }

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`,
            { next: { revalidate: 300 } } // Cache for 5 minutes
        );

        if (!response.ok) {
            throw new Error(`OpenWeatherMap API error: ${response.status}`);
        }

        const data = await response.json();

        const weatherData: WeatherResponse = {
            wind: {
                speed: Math.round(data.wind?.speed || 0),
                direction: degreesToDirection(data.wind?.deg || 0),
                degrees: data.wind?.deg || 0
            },
            temperature: Math.round(data.main?.temp || 0),
            humidity: data.main?.humidity || 0,
            description: data.weather?.[0]?.description || 'Unknown',
            location: data.name || 'Unknown'
        };

        return NextResponse.json(weatherData);
    } catch (error) {
        console.error('Weather API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch weather data' },
            { status: 500 }
        );
    }
}
