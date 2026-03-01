/**
 * Type definitions for Fire Surveillance System
 * These types will be used when integrating with the smart fire helmet API
 */

export interface HelmetData {
  helmetId: string;
  personnelId: string;
  personnelName: string;
  unitCode: string;
  timestamp: string;
  videoStream?: {
    url: string;
    quality: 'high' | 'medium' | 'low';
    format: 'h264' | 'h265';
  };
  sensorData: {
    temperature: number; // Celsius
    humidity: number; // Percentage
    airQuality: number; // AQI
    oxygenLevel: number; // Percentage
    heartRate?: number; // BPM
    motion?: {
      acceleration: { x: number; y: number; z: number };
      gyroscope: { x: number; y: number; z: number };
    };
  };
  location?: {
    latitude: number;
    longitude: number;
    altitude?: number;
    accuracy: number; // meters
  };
  status: 'active' | 'standby' | 'critical' | 'offline';
  batteryLevel: number; // Percentage
  signalStrength: number; // Percentage
}

export interface Unit {
  id: string;
  code: string;
  name: string;
  type: 'engine' | 'truck' | 'rescue' | 'battalion' | 'ladder' | 'medical' | 'hazmat';
  status: 'active' | 'standby' | 'critical' | 'offline';
  personnel: string[]; // Personnel IDs
  location?: {
    latitude: number;
    longitude: number;
  };
  lastUpdate: string;
}

export interface Personnel {
  id: string;
  name: string;
  unitId?: string;
  unitCode?: string;
  helmetId?: string;
  status: 'active' | 'critical' | 'offline';
  lastUpdate: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'target' | 'fire' | 'question' | 'milestone' | 'alert';
  label?: string;
  description?: string;
  unitId?: string;
  personnelId?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  severity?: 'low' | 'medium' | 'high' | 'critical';
  isActive?: boolean;
}

export interface MapZone {
  id: string;
  name: string;
  type: 'room' | 'zone' | 'floor' | 'building';
  coordinates: Array<{ x: number; y: number }>;
  status: 'safe' | 'caution' | 'danger' | 'unknown';
  temperature?: number;
  units?: string[]; // Unit IDs in this zone
  personnel?: string[]; // Personnel IDs in this zone
}

export interface ForensicsData {
  count: number;
  items: Array<{
    id: string;
    type: 'evidence' | 'victim' | 'hazard' | 'equipment';
    location: {
      latitude: number;
      longitude: number;
    };
    timestamp: string;
    description?: string;
    collectedBy?: string;
  }>;
}

export interface CommandStatus {
  commandUnit: string;
  commandName: string;
  incidentId: string;
  startTime: string;
  elapsedTime: string;
  status: 'active' | 'resolved' | 'standby';
}

export interface FireSurveillanceState {
  commandStatus: CommandStatus;
  units: Unit[];
  personnel: Personnel[];
  helmetData: Record<string, HelmetData>; // Keyed by helmetId
  timeline: TimelineEvent[];
  mapZones: MapZone[];
  forensics: ForensicsData;
  selectedUnit?: string;
  selectedPersonnel?: string;
  selectedHelmet?: string;
}

