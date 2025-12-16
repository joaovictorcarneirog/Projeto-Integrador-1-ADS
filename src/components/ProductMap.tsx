import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface ProductLocation {
  id: number;
  nome: string;
  vendedor_nome?: string;
  preco: string;
  latitude?: number;
  longitude?: number;
}

interface ProductMapProps {
  products: ProductLocation[];
  className?: string;
  singleProduct?: boolean;
}

const ProductMap = ({ products, className = "", singleProduct = false }: ProductMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Filter products with valid coordinates
    const productsWithCoords = products.filter(
      (p) => p.latitude && p.longitude
    );

    // Default to Brazil center if no products with coordinates
    const defaultCenter: [number, number] = [-15.7801, -47.9292];
    const defaultZoom = 4;

    let center = defaultCenter;
    let zoom = defaultZoom;

    if (productsWithCoords.length > 0) {
      center = [productsWithCoords[0].latitude!, productsWithCoords[0].longitude!];
      zoom = singleProduct ? 15 : 12;
    }

    // Create map
    mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapInstanceRef.current);

    // Add markers for each product
    productsWithCoords.forEach((product) => {
      if (product.latitude && product.longitude) {
        const marker = L.marker([product.latitude, product.longitude]).addTo(
          mapInstanceRef.current!
        );

        const priceDisplay = product.preco === "0.00" || product.preco === "0" 
          ? "Grátis" 
          : `R$ ${product.preco}`;

        marker.bindPopup(`
          <div style="min-width: 150px;">
            <strong>${product.nome}</strong><br/>
            <span style="color: #666;">Por: ${product.vendedor_nome || "Vendedor"}</span><br/>
            <span style="color: #4CAF50; font-weight: bold;">${priceDisplay}</span>
          </div>
        `);
      }
    });

    // Fit bounds if multiple products
    if (productsWithCoords.length > 1) {
      const bounds = L.latLngBounds(
        productsWithCoords.map((p) => [p.latitude!, p.longitude!] as [number, number])
      );
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [products, singleProduct]);

  const productsWithCoords = products.filter((p) => p.latitude && p.longitude);

  if (productsWithCoords.length === 0) {
    return (
      <div className={`bg-muted rounded-lg flex items-center justify-center ${className}`}>
        <p className="text-muted-foreground text-sm">
          Localização não disponível
        </p>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className={`rounded-lg overflow-hidden ${className}`}
      style={{ minHeight: '200px' }}
    />
  );
};

export default ProductMap;
