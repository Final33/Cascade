import { NextResponse } from 'next/server';

// AirNow API route
// Fetches real-time Air Quality Index data

interface AQIResponse {
    aqi: number;
    category: string;
    categoryNumber: number;
    pollutant: string;
    color: string;
    isDemo?: boolean;
}

// AQI category colors
const AQI_COLORS: Record<number, string> = {
    1: '#00E400', // Good - Green
    2: '#FFFF00', // Moderate - Yellow
    3: '#FF7E00', // Unhealthy for Sensitive - Orange
    4: '#FF0000', // Unhealthy - Red
    5: '#8F3F97', // Very Unhealthy - Purple
    6: '#7E0023', // Hazardous - Maroon
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat') || process.env.DEFAULT_LATITUDE || '34.0522';
    const lon = searchParams.get('lon') || process.env.DEFAULT_LONGITUDE || '-118.2437';

    const apiKey = process.env.AIRNOW_API_KEY;

    // If no API key, return demo data
    if (!apiKey) {
        return NextResponse.json({
            aqi: 142,
            category: 'Unhealthy for Sensitive Groups',
            categoryNumber: 3,
            pollutant: 'PM2.5',
            color: AQI_COLORS[3],
            isDemo: true
        } as AQIResponse);
    }

    try {
        const response = await fetch(
            `https://www.airnowapi.org/aq/observation/latLong/current/?format=application/json&latitude=${lat}&longitude=${lon}&distance=25&API_KEY=${apiKey}`,
            { next: { revalidate: 900 } } // Cache for 15 minutes (data updates hourly)
        );

        if (!response.ok) {
            throw new Error(`AirNow API error: ${response.status}`);
        }

        const data = await response.json();

        // Find the highest AQI value from all pollutants
        if (!data || data.length === 0) {
            return NextResponse.json({
                aqi: 0,
                category: 'No Data',
                categoryNumber: 0,
                pollutant: 'N/A',
                color: '#808080'
            } as AQIResponse);
        }

        // Get the pollutant with the highest AQI
        const maxAqi = data.reduce((max: any, current: any) =>
            current.AQI > (max?.AQI || 0) ? current : max, data[0]);

        const aqiData: AQIResponse = {
            aqi: maxAqi.AQI,
            category: maxAqi.Category?.Name || 'Unknown',
            categoryNumber: maxAqi.Category?.Number || 0,
            pollutant: maxAqi.ParameterName || 'Unknown',
            color: AQI_COLORS[maxAqi.Category?.Number] || '#808080'
        };

        return NextResponse.json(aqiData);
    } catch (error) {
        console.error('AirNow API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch air quality data' },
            { status: 500 }
        );
    }
}
