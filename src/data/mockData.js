// FlashBites Enterprise Dataset - Guntur City, Andhra Pradesh (1 Customer + 5 Kitchens + 8 Delivery Partners)

export const ORDER_LIFECYCLE_STEPS = [
  { status: 'PLACED', label: 'Order Placed', icon: '📝', description: 'Customer confirmed order & payment' },
  { status: 'CONFIRMED', label: 'Accepted by Kitchen', icon: '👨‍🍳', description: 'Kitchen approved ticket for cooking' },
  { status: 'PREPARING', label: 'Cooking Food', icon: '🔥', description: 'Chef preparing fresh dishes' },
  { status: 'READY_FOR_PICKUP', label: 'Ready for Pickup', icon: '🛍️', description: 'Packed & ready at pickup counter' },
  { status: 'OUT_FOR_DELIVERY', label: 'Driver Out for Delivery', icon: '🛵', description: 'Partner navigating live to dropoff' },
  { status: 'DELIVERED', label: 'Order Delivered', icon: '✅', description: 'Handed over to customer' }
];

// 5 KITCHENS LOCALIZED TO GUNTUR CITY, ANDHRA PRADESH
export const RESTAURANTS = [
  {
    id: 'rest-udipi',
    name: 'Sri Udipi Grand',
    owner_id: 'usr-k-udipi',
    owner_email: 'udipi@flashbites.com',
    cuisine: 'Guntur Spicy Tiffin & Filter Coffee',
    rating: 4.9,
    prepTime: '12-15 mins',
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=600&auto=format&fit=crop&q=80',
    location: { address: 'Arundelpet 14th Line, Guntur, Andhra Pradesh', lat: 16.3070, lng: 80.4370 },
    menu: [
      {
        id: 'm-udipi-1',
        name: 'Guntur Karam Masala Dosa',
        description: 'Crispy golden crepe smeared with spicy red chilli paste & potato masala',
        price: 120,
        category: 'Dosa',
        is_veg: true,
        is_available: true,
        image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'm-udipi-2',
        name: 'Ghee Roast Paper Dosa',
        description: 'Ultra-thin long paper dosa roasted with pure Guntur cow ghee',
        price: 160,
        category: 'Dosa',
        is_veg: true,
        is_available: true,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'm-udipi-3',
        name: 'Steam Idli & Medu Vada Combo',
        description: '3 fluffy rice idlis & 2 crispy urad dal vadas served with peanut chutney & sambar',
        price: 90,
        category: 'Dosa',
        is_veg: true,
        is_available: true,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'm-udipi-4',
        name: 'Degree Filter Coffee',
        description: 'Authentic frothy South Indian chicory filter coffee brewed fresh',
        price: 45,
        category: 'Drinks',
        is_veg: true,
        is_available: true,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'rest-saravana',
    name: 'Saravana Bhavan Express',
    owner_id: 'usr-k-saravana',
    owner_email: 'saravana@flashbites.com',
    cuisine: 'Pure Veg Andhra & Chettinad Meals',
    rating: 4.8,
    prepTime: '15-20 mins',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
    location: { address: 'Brodipet 4/12, Guntur, Andhra Pradesh', lat: 16.3020, lng: 80.4320 },
    menu: [
      {
        id: 'm-sar-1',
        name: 'Guntur Onion Rava Dosa',
        description: 'Crispy semolina crepe studded with Guntur onions & green chillies',
        price: 140,
        category: 'Dosa',
        is_veg: true,
        is_available: true,
        image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'm-sar-2',
        name: 'Andhra Full Meals Thali',
        description: 'Hot rice, Pappu, Gongura Chutney, Sambar, Rasam, Curd & Pappadam',
        price: 210,
        category: 'Curry',
        is_veg: true,
        is_available: true,
        image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'rest-paradise',
    name: 'Hyderabadi Paradise Biryani',
    owner_id: 'usr-k-paradise',
    owner_email: 'paradise@flashbites.com',
    cuisine: 'Hyderabadi Dum Biryani & Guntur Chicken Fry',
    rating: 4.9,
    prepTime: '18-22 mins',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    location: { address: 'RTC Bus Stand Road, Guntur, Andhra Pradesh', lat: 16.3120, lng: 80.4420 },
    menu: [
      {
        id: 'm-par-1',
        name: 'Spicy Guntur Chicken Dum Biryani',
        description: 'Aromatic basmati rice cooked on coal dum with Guntur red chilli chicken',
        price: 320,
        category: 'Biryani',
        is_veg: false,
        is_available: true,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'm-par-2',
        name: 'Paneer Tikka Biryani',
        description: 'Charcoal roasted cottage cheese cubes layered with spices & saffron rice',
        price: 280,
        category: 'Biryani',
        is_veg: true,
        is_available: true,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'rest-mtr',
    name: 'MTR (Mavalli Tiffin Room)',
    owner_id: 'usr-k-mtr',
    owner_email: 'mtr@flashbites.com',
    cuisine: 'Heritage Rava Dosa & Filter Coffee',
    rating: 4.9,
    prepTime: '10-15 mins',
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=600&auto=format&fit=crop&q=80',
    location: { address: 'Lakshmipuram Main Road, Guntur, Andhra Pradesh', lat: 16.2980, lng: 80.4280 },
    menu: [
      {
        id: 'm-mtr-1',
        name: 'MTR Special Rava Dosa',
        description: 'Heritage semolina dosa served with ghee & coconut chutney',
        price: 150,
        category: 'Dosa',
        is_veg: true,
        is_available: true,
        image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'rest-anandbhavan',
    name: 'Anand Bhavan Tiffin Center',
    owner_id: 'usr-k-anandbhavan',
    owner_email: 'anandbhavan@flashbites.com',
    cuisine: 'Guntur Karam Podi Dosa & Chutneys',
    rating: 4.7,
    prepTime: '10-12 mins',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
    location: { address: 'Kothapet Market, Guntur, Andhra Pradesh', lat: 16.3100, lng: 80.4390 },
    menu: [
      {
        id: 'm-ab-1',
        name: 'Guntur Special Podi Dosa',
        description: 'Crispy dosa smeared with hot spicy Guntur chilli gunpowder & ghee',
        price: 135,
        category: 'Dosa',
        is_veg: true,
        is_available: true,
        image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=400&auto=format&fit=crop&q=80'
      }
    ]
  }
];

// 8 DELIVERY PARTNERS IN GUNTUR CITY
export const DRIVERS = [
  { id: 'd-1', name: 'Marcus Chen', email: 'driver1@flashbites.com', phone: '+91 98765 00001', vehicle: 'Ather 450X EV', status: 'AVAILABLE', rating: 4.9, location: { lat: 16.3075, lng: 80.4375 } },
  { id: 'd-2', name: 'Rajesh V', email: 'driver2@flashbites.com', phone: '+91 98765 00002', vehicle: 'TVS iQube EV', status: 'AVAILABLE', rating: 4.8, location: { lat: 16.3030, lng: 80.4330 } },
  { id: 'd-3', name: 'Karthik Raja', email: 'driver3@flashbites.com', phone: '+91 98765 00003', vehicle: 'Ola S1 Pro EV', status: 'AVAILABLE', rating: 4.9, location: { lat: 16.3115, lng: 80.4415 } },
  { id: 'd-4', name: 'Suresh Kumar', email: 'driver4@flashbites.com', phone: '+91 98765 00004', vehicle: 'Hero Vida V1 EV', status: 'AVAILABLE', rating: 4.7, location: { lat: 16.2990, lng: 80.4290 } },
  { id: 'd-5', name: 'Venkatesh Prasad', email: 'driver5@flashbites.com', phone: '+91 98765 00005', vehicle: 'Bajaj Chetak EV', status: 'AVAILABLE', rating: 4.9, location: { lat: 16.3090, lng: 80.4380 } },
  { id: 'd-6', name: 'Arun Swaminathan', email: 'driver6@flashbites.com', phone: '+91 98765 00006', vehicle: 'Revolt RV400 EV', status: 'AVAILABLE', rating: 4.8, location: { lat: 16.3040, lng: 80.4340 } },
  { id: 'd-7', name: 'Praveen Reddy', email: 'driver7@flashbites.com', phone: '+91 98765 00007', vehicle: 'TVS Apache 160', status: 'AVAILABLE', rating: 4.8, location: { lat: 16.3130, lng: 80.4430 } },
  { id: 'd-8', name: 'Deepak Sharma', email: 'driver8@flashbites.com', phone: '+91 98765 00008', vehicle: 'Honda Activa 6G', status: 'AVAILABLE', rating: 4.9, location: { lat: 16.2970, lng: 80.4270 } }
];

export const INITIAL_ORDERS = [];
