import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';

type MapaProps = {
  latitude: string;
  longitude: string;
};

export const Mapa = ({ latitude, longitude }: MapaProps) => {
  const position: LatLngExpression = [
    parseFloat(latitude),
    parseFloat(longitude),
  ];

  return (
    <div className="h-64 w-full rounded overflow-hidden shadow mt-4">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>Localização da estação</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
