'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { PlusCircle, FileText, User, CreditCard, Settings, LogOut, Home, Clock, Star, Bell } from 'lucide-react';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [recentNotes, setRecentNotes] = useState([]);
  const [stats, setStats] = useState({
    totalNotes: 0,
    thisWeek: 0,
    thisMonth: 0
  });

  useEffect(() => {
    // Check for success/cancelled parameters
    const success = searchParams.get('success');
    const cancelled = searchParams.get('cancelled');

    if (success === 'true') {
      toast.success('Payment successful! Welcome to Pro!');
      // Clean up the URL
      router.replace('/dashboard');
    } else if (cancelled === 'true') {
      toast.error('Payment was cancelled');
      // Clean up the URL
      router.replace('/dashboard');
    }

    // Fetch user data
    fetchUserData();
  }, [searchParams, router]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.data); // Fixed: API returns data.data, not data.user
      } else {
        // If not authenticated, redirect to login
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        toast.success('Logged out successfully');
        router.push('/');
      } else {
        toast.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const handleUpgradeToPro = async () => {
    try {
      setUpgrading(true);
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (data.success && data.data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.data.url;
      } else {
        toast.error(data.error || 'Failed to create checkout session');
        setUpgrading(false);
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      toast.error('Failed to start upgrade process');
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'notes', label: 'Raw Shift Notes', icon: FileText },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderMainContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{stats.totalNotes}</h3>
                    <p className="text-sm text-gray-600">Total Notes</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{stats.thisWeek}</h3>
                    <p className="text-sm text-gray-600">This Week</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Star className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{stats.thisMonth}</h3>
                    <p className="text-sm text-gray-600">This Month</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => router.push('/')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left flex items-center"
                >
                  <PlusCircle className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">Create New Note</h4>
                    <p className="text-sm text-gray-600 mt-1">Format a new shift note with AI</p>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left flex items-center"
                >
                  <FileText className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">View Notes</h4>
                    <p className="text-sm text-gray-600 mt-1">Browse your shift notes</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
      case 'notes':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Raw Shift Notes</h3>
                <p className="text-sm text-gray-600 mt-1">Your recent shift notes and documentation</p>
              </div>
              <div className="p-6">
                {recentNotes.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h4>
                    <p className="text-gray-600 mb-4">Start creating your first shift note to see it here.</p>
                    <button
                      onClick={() => router.push('/')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Create First Note
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentNotes.map((note: any) => (
                      <div key={note.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{note.clientName || 'Client Note'}</h4>
                          <span className="text-sm text-gray-500">{new Date(note.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{note.rawInput}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">{note.template}</span>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'subscription':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Details</h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    user?.subscription === 'pro' ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {user?.subscription === 'pro' ? 'Pro Plan' : 'Free Plan'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {user?.subscription === 'pro' 
                        ? 'Unlimited notes and premium features' 
                        : 'Limited to 5 notes per day'
                      }
                    </p>
                  </div>
                </div>
                {user?.subscription !== 'pro' && (
                  <button
                    onClick={handleUpgradeToPro}
                    disabled={upgrading}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      upgrading 
                        ? 'bg-blue-400 text-white cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {upgrading ? 'Loading...' : 'Upgrade to Pro'}
                  </button>
                )}
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Plan Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      user?.subscription === 'pro' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <span className="text-sm text-gray-600">Unlimited shift notes</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      user?.subscription === 'pro' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <span className="text-sm text-gray-600">Advanced AI formatting</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      user?.subscription === 'pro' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <span className="text-sm text-gray-600">PDF export</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      user?.subscription === 'pro' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <span className="text-sm text-gray-600">Priority support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                  <input
                    type="text"
                    value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome back, {user?.email?.split('@')[0]}!</p>
        </div>
        
        <nav className="mt-6">
          <div className="px-3">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium mb-1 transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>
        
        {/* Subscription Status in Sidebar */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              user?.subscription === 'pro' ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
            <span className="text-xs text-gray-600">
              {user?.subscription === 'pro' ? 'Pro Plan' : 'Free Plan'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
