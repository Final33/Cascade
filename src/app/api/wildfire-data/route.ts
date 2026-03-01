import { NextResponse } from 'next/server';

// NIFC ArcGIS API route
// Fetches active wildfire perimeters and incident data

interface FireIncident {
    id: string;
    name: string;
    acres: number;
    containment: number;
    startDate: string;
    fireType: string;
    distance?: number;
}

interface WildfireResponse {
    nearbyFires: FireIncident[];
    totalFires: number;
    lastUpdated: string;
    isDemo?: boolean;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || process.env.DEFAULT_LATITUDE || '34.0522');
    const lon = parseFloat(searchParams.get('lon') || process.env.DEFAULT_LONGITUDE || '-118.2437');
    const radius = parseFloat(searchParams.get('radius') || '100'); // Default 100 mile radius

    // NIFC ArcGIS is public, no API key needed
    const baseUrl = 'https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services';

    try {
        // Query active fire perimeters within radius
        // Using a bounding box around the coordinates
        const buffer = radius * 0.0145; // Rough conversion: 1 degree ≈ 69 miles
        const bbox = `${lon - buffer},${lat - buffer},${lon + buffer},${lat + buffer}`;

        const response = await fetch(
            `${baseUrl}/WFIGS_Interagency_Perimeters/FeatureServer/0/query?` +
            `where=1=1&` +
            `geometry=${encodeURIComponent(bbox)}&` +
            `geometryType=esriGeometryEnvelope&` +
            `inSR=4326&` +
            `spatialRel=esriSpatialRelIntersects&` +
            `outFields=poly_IncidentName,poly_GISAcres,poly_PercentContained,poly_CreateDate,poly_FeatureCategory&` +
            `returnGeometry=false&` +
            `f=json`,
            { next: { revalidate: 300 } } // Cache for 5 minutes
        );

        if (!response.ok) {
            throw new Error(`NIFC API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.features || data.features.length === 0) {
            return NextResponse.json({
                nearbyFires: [],
                totalFires: 0,
                lastUpdated: new Date().toISOString(),
                isDemo: false
            } as WildfireResponse);
        }

        const fires: FireIncident[] = data.features.map((feature: any, index: number) => ({
            id: `fire-${index}`,
            name: feature.attributes.poly_IncidentName || 'Unknown Fire',
            acres: Math.round(feature.attributes.poly_GISAcres || 0),
            containment: feature.attributes.poly_PercentContained || 0,
            startDate: feature.attributes.poly_CreateDate
                ? new Date(feature.attributes.poly_CreateDate).toLocaleDateString()
                : 'Unknown',
            fireType: feature.attributes.poly_FeatureCategory || 'Wildfire'
        }));

        // Sort by acres (largest first)
        fires.sort((a, b) => b.acres - a.acres);

        return NextResponse.json({
            nearbyFires: fires.slice(0, 10), // Return top 10
            totalFires: fires.length,
            lastUpdated: new Date().toISOString()
        } as WildfireResponse);

    } catch (error) {
        console.error('NIFC API error:', error);

        // Return demo data on error
        return NextResponse.json({
            nearbyFires: [
                {
                    id: 'demo-1',
                    name: 'Sample Fire',
                    acres: 5000,
                    containment: 35,
                    startDate: new Date().toLocaleDateString(),
                    fireType: 'Wildfire'
                }
            ],
            totalFires: 1,
            lastUpdated: new Date().toISOString(),
            isDemo: true
        } as WildfireResponse);
    }
}
