import React, { useState } from 'react';
import { PharmacySearch } from '../components/pharmacy/PharmacySearch';
import { InventoryList } from '../components/pharmacy/InventoryList';
import { PharmacyMap } from '../components/maps/PharmacyMap';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { PharmacyItem } from '../types';
import { CheckCircle2, ShoppingBag, Pill, Filter, HelpCircle } from 'lucide-react';
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
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [selectedItem, setSelectedItem] = useState<PharmacyItem | null>(null);
  const [reservedSuccess, setReservedSuccess] = useState(false);
  const [showGenericModal, setShowGenericModal] = useState(false);

  const filteredPharmacies = mockPharmacies.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pharmacyName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStock = stockFilter === 'all' || item.stockStatus === stockFilter;
    return matchesSearch && matchesStock;
  });

  const handleConfirmReservation = () => {
    setReservedSuccess(true);
    setTimeout(() => {
      setReservedSuccess(false);
      setSelectedItem(null);
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold font-serif text-olive-dark flex items-center justify-center gap-2">
          <Pill className="w-7 h-7 text-olive" />
          {t('pharmacy.title')}
        </h1>
        <p className="text-xs font-serif text-charcoal-light">
          Real-time stock checking across Jan Aushadhi Kendras & private outlets in Nabha Tehsil
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full">
          <PharmacySearch value={searchTerm} onChange={setSearchTerm} />
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={<HelpCircle className="w-4 h-4 text-vintage-gold" />}
          onClick={() => setShowGenericModal(true)}
        >
          Generic Alternatives Guide
        </Button>
      </div>

      {/* Stock Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <span className="text-xs font-serif font-bold text-denim flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Stock Status:
        </span>
        {(['all', 'in_stock', 'low_stock', 'out_of_stock'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStockFilter(st)}
            className={`px-3 py-1 rounded-full text-xs font-serif font-bold border transition ${
              stockFilter === st
                ? 'bg-olive text-white border-olive-dark'
                : 'bg-warm-white text-charcoal border-parchment-dark hover:bg-parchment'
            }`}
          >
            {st === 'all' ? 'All Stock' : st.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      <PharmacyMap pharmacies={filteredPharmacies} />

      <InventoryList
        items={filteredPharmacies}
        onReserve={(item) => setSelectedItem(item)}
      />

      {/* Reservation Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="Reserve Medicine at Jan Aushadhi Kendra"
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
                    Generic: <b>{selectedItem.genericName}</b>
                  </p>
                  <p className="text-xs font-mono text-charcoal-light">
                    Pharmacy: {selectedItem.pharmacyName} ({selectedItem.pharmacyAddress})
                  </p>
                  <p className="text-xs font-mono text-olive font-bold">
                    Price: ₹{selectedItem.priceInINR} per strip (Jan Aushadhi Discounted Rate)
                  </p>
                </div>

                <p className="text-xs text-charcoal-light">
                  Reserving will hold 1 strip for your patient ID for 24 hours. No advance payment required.
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

      {/* Generic Guide Modal */}
      {showGenericModal && (
        <Modal
          isOpen={showGenericModal}
          onClose={() => setShowGenericModal(false)}
          title="Jan Aushadhi Generic Equivalents Guide"
        >
          <div className="space-y-3 font-serif text-xs">
            <p className="text-charcoal-light">
              Generic medicines contain the exact same active pharmaceutical ingredients (APIs) as branded drugs at 50-80% lower cost.
            </p>
            <div className="space-y-2 border border-parchment-dark p-3 bg-warm-white rounded-lg">
              <div className="flex justify-between border-b pb-1">
                <span className="font-bold text-brick">Branded Medicine</span>
                <span className="font-bold text-olive">Jan Aushadhi Generic Name</span>
              </div>
              <div className="flex justify-between">
                <span>Sorbitrate 5mg</span>
                <span className="font-mono">Isosorbide Dinitrate 5mg</span>
              </div>
              <div className="flex justify-between">
                <span>Disprin / Ecosprin 150</span>
                <span className="font-mono">Acetylsalicylic Acid 150mg</span>
              </div>
              <div className="flex justify-between">
                <span>Lipitor 20mg</span>
                <span className="font-mono">Atorvastatin Calcium 20mg</span>
              </div>
              <div className="flex justify-between">
                <span>Crocin / Calpol 650</span>
                <span className="font-mono">Paracetamol 650mg</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
