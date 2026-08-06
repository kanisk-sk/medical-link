import React, { useState } from 'react';
import { PharmacySearch } from '../components/pharmacy/PharmacySearch';
import { InventoryList } from '../components/pharmacy/InventoryList';
import { PharmacyMap } from '../components/maps/PharmacyMap';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { PharmacyItem } from '../types';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const mockPharmacies: PharmacyItem[] = [
  {
    id: 'ph-1',
    name: 'Tab. Sorbitrate (Isosorbide Dinitrate 5mg)',
    genericName: 'Isosorbide Dinitrate',
    category: 'Cardiovascular',
    stockStatus: 'in_stock',
    quantity: 45,
    priceInINR: 12.5,
    pharmacyName: 'Jan Aushadhi Kendra (Govt Hospital)',
    pharmacyAddress: 'Near Circular Road, Nabha',
    distanceKm: 0.8,
    contactNumber: '+91 98140 12345',
  },
  {
    id: 'ph-2',
    name: 'Tab. Aspirin 150mg',
    genericName: 'Acetylsalicylic Acid',
    category: 'Antiplatelet',
    stockStatus: 'in_stock',
    quantity: 120,
    priceInINR: 8.0,
    pharmacyName: 'Jan Aushadhi Kendra (Govt Hospital)',
    pharmacyAddress: 'Near Circular Road, Nabha',
    distanceKm: 0.8,
    contactNumber: '+91 98140 12345',
  },
  {
    id: 'ph-3',
    name: 'Tab. Atorvastatin 20mg',
    genericName: 'Atorvastatin Calcium',
    category: 'Lipid Lowering',
    stockStatus: 'low_stock',
    quantity: 8,
    priceInINR: 35.0,
    pharmacyName: 'Patiala District Pharmacy Outlet',
    pharmacyAddress: 'Main Bazaar, Bhadson',
    distanceKm: 4.2,
    contactNumber: '+91 97790 67890',
  },
  {
    id: 'ph-4',
    name: 'Inj. Nitroglycerin 5mg/ml',
    genericName: 'Nitroglycerin',
    category: 'Emergency Cardiac',
    stockStatus: 'out_of_stock',
    quantity: 0,
    priceInINR: 110.0,
    pharmacyName: 'Nabha Rural Pharmacy Store',
    pharmacyAddress: 'Alhoran Road, Nabha',
    distanceKm: 1.5,
    contactNumber: '+91 98720 54321',
  },
];

export const PharmacyPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<PharmacyItem | null>(null);
  const [reservedSuccess, setReservedSuccess] = useState(false);

  const filteredPharmacies = mockPharmacies.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pharmacyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirmReservation = () => {
    setReservedSuccess(true);
    setTimeout(() => {
      setReservedSuccess(false);
      setSelectedItem(null);
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold font-serif text-olive-dark">
          💊 {t('pharmacy.title')}
        </h1>
        <p className="text-xs font-serif text-charcoal-light">
          Real-time stock checking across Jan Aushadhi Kendras & private outlets in Nabha
        </p>
      </div>

      <PharmacySearch value={searchTerm} onChange={setSearchTerm} />

      <PharmacyMap pharmacies={filteredPharmacies} />

      <InventoryList
        items={filteredPharmacies}
        onReserve={(item) => setSelectedItem(item)}
      />

      {/* Reservation Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="Reserve Medicine at Pharmacy"
      >
        {selectedItem && (
          <div className="space-y-4 font-serif">
            {reservedSuccess ? (
              <div className="text-center py-6 space-y-2 text-success-green">
                <CheckCircle2 className="w-12 h-12 mx-auto animate-bounce" />
                <h3 className="text-lg font-bold">Medicine Reserved Successfully!</h3>
                <p className="text-xs text-charcoal-light">
                  A reservation token has been sent to your mobile. Present this code at{' '}
                  <b>{selectedItem.pharmacyName}</b> within 24 hours.
                </p>
              </div>
            ) : (
              <>
                <div className="bg-parchment p-4 rounded-lg border border-parchment-dark space-y-1">
                  <h4 className="font-bold text-base text-denim">{selectedItem.name}</h4>
                  <p className="text-xs font-mono text-charcoal-light">
                    Pharmacy: {selectedItem.pharmacyName} ({selectedItem.pharmacyAddress})
                  </p>
                  <p className="text-xs font-mono text-olive font-bold">
                    Price: ₹{selectedItem.priceInINR} per strip
                  </p>
                </div>

                <p className="text-xs text-charcoal-light">
                  Reserving will hold 1 strip for Gurpreet Singh for 24 hours. No advance payment required.
                </p>

                <div className="flex space-x-3 pt-2">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setSelectedItem(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="olive"
                    fullWidth
                    icon={<ShoppingBag className="w-4 h-4" />}
                    onClick={handleConfirmReservation}
                  >
                    Confirm Reservation
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
