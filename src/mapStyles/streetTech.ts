export const streetTechStyle: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.arterial', stylers: [{ color: '#fafafa' }] },
  { featureType: 'road.highway', stylers: [{ color: '#f0f0f0' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#dbe9f3' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
]
