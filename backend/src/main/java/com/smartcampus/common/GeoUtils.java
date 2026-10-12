package com.smartcampus.common;

public final class GeoUtils {

    private static final double EARTH_RADIUS_METERS = 6371000.0;

    private GeoUtils() {}

    /**
     * Calculates the great-circle distance between two points on the Earth's surface
     * using the Haversine formula in meters.
     */
    public static double calculateDistanceMeters(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_METERS * c;
    }

    /**
     * Checks if coordinates fall within the designated radius in meters.
     */
    public static boolean isWithinRadius(double centerLat, double centerLon,
                                         double targetLat, double targetLon,
                                         double radiusMeters) {
        double distance = calculateDistanceMeters(centerLat, centerLon, targetLat, targetLon);
        return distance <= radiusMeters;
    }
}
