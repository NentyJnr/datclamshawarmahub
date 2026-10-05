import { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    name: 'Classic Chicken Shawarma',
    description: 'Juicy tender grilled chicken breast wrapped in warm pita with creamy garlic sauce and fresh crunchy cabbage.',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=800&q=80',
    category: 'Shawarma Wraps',
    isAvailable: true
  },
  {
    id: 'm2',
    name: 'Double Beef & Sausage Monster Wrap',
    description: 'Double grilled spiced beef, spicy sausage link, melted cheddar cheese, house special chili mayo sauce.',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
    category: 'Shawarma Wraps',
    isAvailable: true
  },
  {
    id: 'm3',
    name: 'Mixed Deluxe (Chicken + Beef + Cheese)',
    description: 'The ultimate combo wrap! Slow-roasted chicken & beef, extra mozzarella cheese blend, sweet corn, and garlic cream.',
    price: 6000,
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80',
    category: 'Shawarma Wraps',
    isAvailable: true
  },
  {
    id: 'm4',
    name: 'Crispy French Fries (Large)',
    description: 'Golden crispy crinkle-cut fries seasoned with garlic paprika salt.',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
    category: 'Sides',
    isAvailable: true
  },
  {
    id: 'm5',
    name: 'Chilled Datclam Special Lemonade',
    description: 'Freshly squeezed lemon, mint leaves, honey, and sparkling mineral water.',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    category: 'Beverages',
    isAvailable: true
  }
];
