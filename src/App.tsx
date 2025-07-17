import React, { useState } from 'react';
import { UserPlus, Heart, MapPin, Clock, Users, Phone, Mail, CheckCircle } from 'lucide-react';

interface FoodItem {
  id: string;
  organizerName: string;
  eventName: string;
  foodType: string;
  quantity: string;
  location: string;
  address: string;
  contactPhone: string;
  contactEmail: string;
  expiryTime: string;
  status: 'available' | 'claimed' | 'collected';
  claimedBy?: string;
  postedAt: string;
  description: string;
  imageUrl?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'organizer' | 'ngo';
  organization: string;
  phone: string;
}

const mockFoodItems: FoodItem[] = [
  {
    id: '1',
    organizerName: 'Sarah Johnson',
    eventName: 'Tech Conference 2024',
    foodType: 'Sandwiches & Salads',
    quantity: '50 servings',
    location: 'Downtown Convention Center',
    address: '123 Main Street, City Center',
    contactPhone: '+1 (555) 123-4567',
    contactEmail: 'sarah@techconf.com',
    expiryTime: '2024-01-15T18:00:00',
    status: 'available',
    postedAt: '2024-01-15T14:30:00',
    description: 'Fresh sandwiches, mixed salads, and vegetarian options from our tech conference lunch. All items are properly packaged and ready for pickup.',
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    organizerName: 'Michael Chen',
    eventName: 'University Graduation Party',
    foodType: 'Catered Dinner',
    quantity: '80 servings',
    location: 'State University Campus',
    address: '456 College Avenue, University District',
    contactPhone: '+1 (555) 234-5678',
    contactEmail: 'events@stateuni.edu',
    expiryTime: '2024-01-15T20:00:00',
    status: 'claimed',
    claimedBy: 'City Food Bank',
    postedAt: '2024-01-15T16:15:00',
    description: 'Variety of hot dishes including chicken, rice, vegetables, and desserts. Perfect for community distribution.',
    imageUrl: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    organizerName: 'Emma Rodriguez',
    eventName: 'Corporate Training Workshop',
    foodType: 'Breakfast & Snacks',
    quantity: '30 servings',
    location: 'Business District Plaza',
    address: '789 Corporate Drive, Suite 200',
    contactPhone: '+1 (555) 345-6789',
    contactEmail: 'emma@corptraining.com',
    expiryTime: '2024-01-15T17:00:00',
    status: 'available',
    postedAt: '2024-01-15T13:45:00',
    description: 'Assorted pastries, fresh fruit, coffee, and healthy snacks from our morning workshop.',
    imageUrl: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@techconf.com',
    role: 'organizer',
    organization: 'Tech Conference Group',
    phone: '+1 (555) 123-4567'
  },
  {
    id: '2',
    name: 'David Martinez',
    email: 'david@cityfoodbank.org',
    role: 'ngo',
    organization: 'City Food Bank',
    phone: '+1 (555) 987-6543'
  }
];

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'dashboard' | 'post-food'>('landing');
  const [foodItems, setFoodItems] = useState<FoodItem[]>(mockFoodItems);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [loginForm, setLoginForm] = useState({ email: '', password: '', role: 'organizer' as 'organizer' | 'ngo' });
  const [newFood, setNewFood] = useState({
    eventName: '',
    foodType: '',
    quantity: '',
    location: '',
    address: '',
    contactPhone: '',
    contactEmail: '',
    expiryTime: '',
    description: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = mockUsers.find(u => u.email === loginForm.email);
    if (user && user.role === loginForm.role) {
      setCurrentUser(user);
      setCurrentPage('dashboard');
    }
  };

  const handlePostFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const newFoodItem: FoodItem = {
      id: Date.now().toString(),
      organizerName: currentUser.name,
      eventName: newFood.eventName,
      foodType: newFood.foodType,
      quantity: newFood.quantity,
      location: newFood.location,
      address: newFood.address,
      contactPhone: newFood.contactPhone,
      contactEmail: newFood.contactEmail,
      expiryTime: newFood.expiryTime,
      status: 'available',
      postedAt: new Date().toISOString(),
      description: newFood.description
    };

    setFoodItems([newFoodItem, ...foodItems]);
    setNotifications([...notifications, `New food available: ${newFood.foodType} from ${newFood.eventName}`]);
    setCurrentPage('dashboard');
    setNewFood({
      eventName: '',
      foodType: '',
      quantity: '',
      location: '',
      address: '',
      contactPhone: '',
      contactEmail: '',
      expiryTime: '',
      description: ''
    });
  };

  const handleClaimFood = (foodId: string) => {
    if (!currentUser || currentUser.role !== 'ngo') return;

    setFoodItems(items =>
      items.map(item =>
        item.id === foodId
          ? { ...item, status: 'claimed' as const, claimedBy: currentUser.organization }
          : item
      )
    );
    setNotifications([...notifications, `Food claimed by ${currentUser.organization}`]);
  };

  const handleCollectFood = (foodId: string) => {
    setFoodItems(items =>
      items.map(item =>
        item.id === foodId
          ? { ...item, status: 'collected' as const }
          : item
      )
    );
    setNotifications([...notifications, `Food collected successfully`]);
  };

  const getTimeUntilExpiry = (expiryTime: string) => {
    const now = new Date();
    const expiry = new Date(expiryTime);
    const diffMs = expiry.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffMs <= 0) return 'Expired';
    if (diffHours > 0) return `${diffHours}h ${diffMins}m left`;
    return `${diffMins}m left`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'claimed': return 'bg-yellow-100 text-yellow-800';
      case 'collected': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (currentPage === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-green-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">FoodShare Connect</h1>
                  <p className="text-sm text-green-600">Connecting surplus food with those in need</p>
                </div>
              </div>
              <button
                onClick={() => setCurrentPage('login')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Reducing Food Waste,
              <span className="text-green-600 block">Feeding Communities</span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Connect event organizers with NGOs to ensure surplus food reaches those who need it most. 
              Join our platform to make a meaningful impact in your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setLoginForm({ ...loginForm, role: 'organizer' });
                  setCurrentPage('login');
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                I'm an Event Organizer
              </button>
              <button
                onClick={() => {
                  setLoginForm({ ...loginForm, role: 'ngo' });
                  setCurrentPage('login');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                I'm an NGO
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h3>
              <p className="text-lg text-gray-600">Simple steps to make a big difference</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Post Surplus Food</h4>
                <p className="text-gray-600">Event organizers quickly post details about leftover food with location and pickup times.</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Find & Claim</h4>
                <p className="text-gray-600">NGOs receive notifications and can claim available food based on location and capacity.</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-orange-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Collect & Distribute</h4>
                <p className="text-gray-600">NGOs coordinate pickup and distribute food to communities in need.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center text-white">
              <div>
                <div className="text-4xl font-bold mb-2">12,500+</div>
                <div className="text-green-100">Meals Redistributed</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">245</div>
                <div className="text-green-100">Partner Organizations</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">89%</div>
                <div className="text-green-100">Food Waste Reduction</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLoginForm({ ...loginForm, role: 'organizer' })}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    loginForm.role === 'organizer'
                      ? 'border-green-600 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  Event Organizer
                </button>
                <button
                  type="button"
                  onClick={() => setLoginForm({ ...loginForm, role: 'ngo' })}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    loginForm.role === 'ngo'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  NGO
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentPage('landing')}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Back to Home
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Demo Credentials:</p>
            <p className="text-xs text-gray-500">Organizer: sarah@techconf.com</p>
            <p className="text-xs text-gray-500">NGO: david@cityfoodbank.org</p>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'post-food') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Post Surplus Food</h1>
              </div>
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handlePostFood} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
                  <input
                    type="text"
                    value={newFood.eventName}
                    onChange={(e) => setNewFood({ ...newFood, eventName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Annual Conference 2024"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Food Type</label>
                  <input
                    type="text"
                    value={newFood.foodType}
                    onChange={(e) => setNewFood({ ...newFood, foodType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Sandwiches, Salads, Hot Meals"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="text"
                    value={newFood.quantity}
                    onChange={(e) => setNewFood({ ...newFood, quantity: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 50 servings, 20 plates"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Time</label>
                  <input
                    type="datetime-local"
                    value={newFood.expiryTime}
                    onChange={(e) => setNewFood({ ...newFood, expiryTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location Name</label>
                <input
                  type="text"
                  value={newFood.location}
                  onChange={(e) => setNewFood({ ...newFood, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Downtown Convention Center"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                <input
                  type="text"
                  value={newFood.address}
                  onChange={(e) => setNewFood({ ...newFood, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Full street address for pickup"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                  <input
                    type="tel"
                    value={newFood.contactPhone}
                    onChange={(e) => setNewFood({ ...newFood, contactPhone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                  <input
                    type="email"
                    value={newFood.contactEmail}
                    onChange={(e) => setNewFood({ ...newFood, contactEmail: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="contact@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newFood.description}
                  onChange={(e) => setNewFood({ ...newFood, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Describe the food items, any special requirements, or additional notes..."
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Post Food Availability
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage('dashboard')}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentUser?.role === 'organizer' ? 'Organizer Dashboard' : 'NGO Dashboard'}
                </h1>
                <p className="text-sm text-gray-600">Welcome back, {currentUser?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {currentUser?.role === 'organizer' && (
                <button
                  onClick={() => setCurrentPage('post-food')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Post Food
                </button>
              )}
              <button
                onClick={() => {
                  setCurrentUser(null);
                  setCurrentPage('landing');
                }}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {notifications.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Recent Notifications</h3>
            <div className="space-y-1">
              {notifications.slice(-3).map((notification, index) => (
                <p key={index} className="text-sm text-blue-800">• {notification}</p>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-6">
          {currentUser?.role === 'organizer' ? (
            <>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">My Posted Food</h2>
                <div className="grid gap-4">
                  {foodItems.filter(item => item.organizerName === currentUser.name).map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{item.foodType}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{item.eventName}</p>
                          <p className="text-sm text-gray-500">{item.quantity} • {getTimeUntilExpiry(item.expiryTime)}</p>
                          {item.claimedBy && (
                            <p className="text-sm text-blue-600 mt-1">Claimed by: {item.claimedBy}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span>{item.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Available Food</h2>
                <div className="grid gap-6">
                  {foodItems.filter(item => item.status === 'available').map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex gap-4">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.foodType}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{item.foodType}</h3>
                              <p className="text-sm text-gray-600">{item.eventName}</p>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span>{getTimeUntilExpiry(item.expiryTime)}</span>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-3">{item.description}</p>
                          
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2 text-sm">
                                <Users className="w-4 h-4 text-gray-500" />
                                <span>Quantity: {item.quantity}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span>{item.location}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2 text-sm">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <span>{item.contactPhone}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span>{item.contactEmail}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">
                              Posted by {item.organizerName} • {new Date(item.postedAt).toLocaleDateString()}
                            </p>
                            <button
                              onClick={() => handleClaimFood(item.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                              Claim Food
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">My Claimed Food</h2>
                <div className="grid gap-4">
                  {foodItems.filter(item => item.claimedBy === currentUser.organization).map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{item.foodType}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{item.eventName}</p>
                          <p className="text-sm text-gray-500">{item.quantity} • {item.location}</p>
                          <p className="text-sm text-gray-500">Contact: {item.contactPhone}</p>
                        </div>
                        {item.status === 'claimed' && (
                          <button
                            onClick={() => handleCollectFood(item.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            Mark as Collected
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;