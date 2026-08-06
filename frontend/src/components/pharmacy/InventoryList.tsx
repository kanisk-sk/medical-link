import React from 'react';
import { PharmacyItem } from '../../types';
import { StockBadge } from './StockBadge';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { MapPin, Phone, Check, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface InventoryListProps {
  items: PharmacyItem[];
  onReserve: (item: PharmacyItem) => void;
}

export const InventoryList: React.FC<InventoryListProps> = ({ items, onReserve }) => {
  const { t } = useTranslation();

  if (items.length === 0) {
    return (
      <Card variant="paper" className="p-8 text-center text-charcoal-light">
        <p className="font-serif">No matching medicines found in nearby Nabha pharmacies.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} variant="paper" className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-serif font-bold text-lg text-denim">{item.name}</h3>
                <StockBadge status={item.stockStatus} />
              </div>
              <p className="text-xs font-mono text-charcoal-light">
                Generic: {item.genericName} • ₹{item.priceInINR} per strip
              </p>
              <div className="flex items-center space-x-3 text-xs text-charcoal font-serif pt-1">
                <span className="flex items-center text-olive font-semibold">
                  <MapPin className="w-3.5 h-3.5 mr-1" />
                  {item.pharmacyName} ({item.distanceKm} km away)
                </span>
                <span className="flex items-center text-charcoal-light">
                  <Phone className="w-3.5 h-3.5 mr-1" />
                  {item.contactNumber}
                </span>
              </div>
            </div>

            <Button
              variant={item.stockStatus === 'out_of_stock' ? 'outline' : 'olive'}
              size="md"
              disabled={item.stockStatus === 'out_of_stock'}
              icon={<ShoppingBag className="w-4 h-4" />}
              onClick={() => onReserve(item)}
            >
              {t('pharmacy.reserve')}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
