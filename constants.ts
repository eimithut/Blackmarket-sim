
import { Product, Language, Review } from './types';

const PRODUCTS_DE: Product[] = [
  {
    id: 'contract-01',
    name: 'Auftrag: Zielperson Liquidierung (Level 3)',
    description: 'Diskrete Entfernung eines spezifischen Ziels. Unfallszenario inklusive. Keine Fragen. 48h Vorlaufzeit.',
    priceBTC: 5.5,
    seller: 'SchattenMann',
    rating: 5.0,
    trustLevel: 99,
    imageSeed: 666,
    category: 'Dienstleistung',
    stock: 3,
    origin: 'Lokal (Sektor A)',
    imageUrl: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&w=800' // Silenced Pistol
  },
  {
    id: 'smuggle-01',
    name: 'Route: Balkan-Express (Sicher)',
    description: 'Garantierter Grenzübertritt für 2 Personen oder 50kg Fracht. Umgehung der Drohnen-Patrouillen. Bestechungsgelder inklusive.',
    priceBTC: 1.2,
    seller: 'Der_Schleuser',
    rating: 4.6,
    trustLevel: 88,
    imageSeed: 888,
    category: 'Logistik',
    stock: 5,
    origin: 'Grenzzone Ost',
    imageUrl: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800'
  },
  {
    id: 'human-01',
    name: 'Arbeitskraft: Bauarbeiter (Unregistriert)',
    description: '2x Physisch starke Arbeitskräfte aus Osteuropa. Keine Papiere, keine Familie. Gehorsam garantiert durch Schuldenbindung.',
    priceBTC: 0.8,
    seller: 'HumanRessource_X',
    rating: 4.2,
    trustLevel: 70,
    imageSeed: 202,
    category: 'Personal',
    stock: 12,
    origin: 'Osteuropa',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800'
  },
  {
    id: 'id-01',
    name: 'Identität: Deutscher Pass (Clean)',
    description: 'Neuer Reisepass, Geburtsurkunde, Schufa-Historie und biometrischer Datenbank-Eintrag. Du wirst ein Geist.',
    priceBTC: 2.8,
    seller: 'PassMeister',
    rating: 4.9,
    trustLevel: 95,
    imageSeed: 123,
    category: 'Identitäten',
    stock: 10,
    origin: 'Behörden-Server',
    imageUrl: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&w=800'
  },
  {
    id: 'chem-01',
    name: 'Synthetisches Adrenalin "Red-Shift" (1kg)',
    description: 'Militärqualität. In 12 Sektoren verboten. 99.8% Reinheit. Direkt aus dem Labor.',
    priceBTC: 0.75,
    seller: 'Dr_Heisenberg',
    rating: 4.4,
    trustLevel: 75,
    imageSeed: 999,
    category: 'Substanzen',
    stock: 40,
    origin: 'Untergrund-Labor',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800'
  },
  {
    id: 'human-02',
    name: 'Begleitung: "Lola" (Permanent)',
    description: 'Weiblich, 22 Jahre. Konditioniert für Gehorsam. Inklusive Transfer-Dokumente (Eigentumsübertrag).',
    priceBTC: 4.5,
    seller: 'Venus_Corp',
    rating: 4.8,
    trustLevel: 92,
    imageSeed: 303,
    category: 'Personal',
    stock: 1,
    origin: 'Südostasien',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800' // Dark Portrait
  },
  {
    id: 'wep-01',
    name: 'EMP Emitter (Industrie-Standard)',
    description: 'Tragbares Gerät zur Deaktivierung von Überwachungsdrohnen im Umkreis von 500m.',
    priceBTC: 3.2,
    seller: 'TechRunner',
    rating: 4.8,
    trustLevel: 92,
    imageSeed: 404,
    category: 'Hardware',
    stock: 2,
    origin: 'Gestohlen (Mil-Spec)',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800'
  },
  {
    id: 'exploit-01',
    name: 'Zero-Day Exploit: Banken-Mainframe',
    description: 'Root-Zugriff auf große Finanzinstitute. Kommt mit Auto-Wipe Skripten.',
    priceBTC: 8.0,
    seller: 'NullPointer',
    rating: 4.9,
    trustLevel: 98,
    imageSeed: 101,
    category: 'Daten',
    stock: 1,
    origin: 'Deep Net',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800'
  },
  {
    id: 'service-02',
    name: 'Inkasso (Physisch / Robust)',
    description: 'Eintreibung von Schulden durch körperlichen Nachdruck. Wir brechen Widerstand (und Knochen). 20% Provision.',
    priceBTC: 0.5,
    seller: 'Knochenbrecher_GmbH',
    rating: 4.1,
    trustLevel: 60,
    imageSeed: 55,
    category: 'Dienstleistung',
    stock: 10,
    origin: 'Metro Sektor',
    imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800' // Money Pile
  },
  {
    id: 'smuggle-02',
    name: 'Route: Übersee-Container (Hamburg)',
    description: 'Sicherer Platz in versiegeltem Container. Keine Scans. Zielhafen: New York oder Santos.',
    priceBTC: 3.5,
    seller: 'HafenMeister',
    rating: 4.7,
    trustLevel: 91,
    imageSeed: 77,
    category: 'Logistik',
    stock: 2,
    origin: 'Hamburg Hafen',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800'
  }
];

const PRODUCTS_EN: Product[] = [
  {
    id: 'contract-01',
    name: 'Contract: Target Liquidation (Level 3)',
    description: 'Discrete removal of specific target. Accident scenario included. No questions. 48h lead time.',
    priceBTC: 5.5,
    seller: 'ShadowMan',
    rating: 5.0,
    trustLevel: 99,
    imageSeed: 666,
    category: 'Services',
    stock: 3,
    origin: 'Local (Sector A)',
    imageUrl: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&w=800' // Silenced Pistol
  },
  {
    id: 'smuggle-01',
    name: 'Route: Balkan Express (Safe)',
    description: 'Guaranteed border crossing for 2 pax or 50kg cargo. Bypasses drone patrols. Bribes included.',
    priceBTC: 1.2,
    seller: 'The_Smuggler',
    rating: 4.6,
    trustLevel: 88,
    imageSeed: 888,
    category: 'Logistics',
    stock: 5,
    origin: 'East Border Zone',
    imageUrl: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800'
  },
  {
    id: 'human-01',
    name: 'Labor: Construction Unit (Unregistered)',
    description: '2x Physically strong laborers from Eastern Europe. No papers, no family. Obedience guaranteed via debt bondage.',
    priceBTC: 0.8,
    seller: 'HumanResource_X',
    rating: 4.2,
    trustLevel: 70,
    imageSeed: 202,
    category: 'Personnel',
    stock: 12,
    origin: 'Eastern Europe',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800'
  },
  {
    id: 'id-01',
    name: 'Identity: German Passport (Clean)',
    description: 'New passport, birth certificate, credit history, and biometric DB entry. Become a ghost.',
    priceBTC: 2.8,
    seller: 'PassMaster',
    rating: 4.9,
    trustLevel: 95,
    imageSeed: 123,
    category: 'Identities',
    stock: 10,
    origin: 'Gov Servers',
    imageUrl: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&w=800'
  },
  {
    id: 'chem-01',
    name: 'Synthetic Adrenaline "Red-Shift" (1kg)',
    description: 'Mil-spec. Banned in 12 sectors. 99.8% purity. Direct from the lab.',
    priceBTC: 0.75,
    seller: 'Dr_Heisenberg',
    rating: 4.4,
    trustLevel: 75,
    imageSeed: 999,
    category: 'Substances',
    stock: 40,
    origin: 'Underground Lab',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800'
  },
  {
    id: 'human-02',
    name: 'Companion: "Lola" (Permanent)',
    description: 'Female, 22. Conditioned for obedience. Transfer docs included (Ownership Transfer).',
    priceBTC: 4.5,
    seller: 'Venus_Corp',
    rating: 4.8,
    trustLevel: 92,
    imageSeed: 303,
    category: 'Personnel',
    stock: 1,
    origin: 'Southeast Asia',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800' // Dark Portrait
  },
  {
    id: 'wep-01',
    name: 'EMP Emitter (Industrial Standard)',
    description: 'Portable device to disable surveillance drones within 500m radius.',
    priceBTC: 3.2,
    seller: 'TechRunner',
    rating: 4.8,
    trustLevel: 92,
    imageSeed: 404,
    category: 'Hardware',
    stock: 2,
    origin: 'Stolen (Mil-Spec)',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800'
  },
  {
    id: 'exploit-01',
    name: 'Zero-Day Exploit: Bank Mainframe',
    description: 'Root access to major financial institutions. Comes with auto-wipe scripts.',
    priceBTC: 8.0,
    seller: 'NullPointer',
    rating: 4.9,
    trustLevel: 98,
    imageSeed: 101,
    category: 'Data',
    stock: 1,
    origin: 'Deep Net',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800'
  },
  {
    id: 'service-02',
    name: 'Debt Collection (Physical / Robust)',
    description: 'Recovery of funds via physical coercion. We break resistance (and bones). 20% commission.',
    priceBTC: 0.5,
    seller: 'BoneBreaker_Inc',
    rating: 4.1,
    trustLevel: 60,
    imageSeed: 55,
    category: 'Services',
    stock: 10,
    origin: 'Metro Sector',
    imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800' // Money Pile
  },
  {
    id: 'smuggle-02',
    name: 'Route: Overseas Container (Hamburg)',
    description: 'Secure spot in sealed container. No scans. Destination: New York or Santos.',
    priceBTC: 3.5,
    seller: 'HarborMaster',
    rating: 4.7,
    trustLevel: 91,
    imageSeed: 77,
    category: 'Logistics',
    stock: 2,
    origin: 'Hamburg Port',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800'
  }
];

export const getProducts = (lang: Language): Product[] => {
    return lang === 'de' ? PRODUCTS_DE : PRODUCTS_EN;
}

export const getCategories = (lang: Language): string[] => {
    const products = lang === 'de' ? PRODUCTS_DE : PRODUCTS_EN;
    const cats = Array.from(new Set(products.map(p => p.category)));
    return [lang === 'de' ? 'Alle' : 'All', ...cats];
}

export const getReviews = (lang: Language): Review[] => {
    if (lang === 'de') {
        return [
            { user: 'Anon_88', rating: 5, comment: 'Schnell und diskret. Ware wie beschrieben.', date: '2 Std' },
            { user: 'GhostWalker', rating: 5, comment: 'Verkäufer ist Profi. PGP Key korrekt.', date: '1 Tag' },
            { user: 'CyberPunk_X', rating: 4, comment: 'Dauerte etwas länger, aber Qualität top.', date: '3 Tage' },
        ];
    } else {
         return [
            { user: 'Anon_88', rating: 5, comment: 'Fast and discrete. Goods as described.', date: '2 hrs' },
            { user: 'GhostWalker', rating: 5, comment: 'Seller is a pro. PGP key verified.', date: '1 day' },
            { user: 'CyberPunk_X', rating: 4, comment: 'Took a bit longer, but quality is top.', date: '3 days' },
        ];
    }
}
