'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Star, 
  Users, 
  Shield,
  ChevronDown,
  Brain,
  Clock,
  Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Header from '@/components/Header';

interface Template {
  id: string;
  name: string;
  description: string;
}

interface User {
  id: string;
  email: string;
  subscription: 'free' | 'pro';
  usageToday: number;
}

export default function HomePage() {
  const [rawInput, setRawInput] = useState('');
  const [formattedOutput, setFormattedOutput] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [clientName, setClientName] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchTemplates();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const result = await response.json();
        setUser(result.data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      if (response.ok) {
        const result = await response.json();
        setTemplates(result.data);
        if (result.data.length > 0) {
          setSelectedTemplate(result.data[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const handleFormat = async () => {
    if (!rawInput.trim()) {
      toast.error('Please enter some shift notes to format');
      return;
    }

    if (!selectedTemplate) {
      toast.error('Please select a template');
      return;
    }

    if (!user) {
      toast.error('Please log in to format notes');
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/notes/format', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rawInput,
          templateId: selectedTemplate,
          clientName: clientName || undefined,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setFormattedOutput(result.data.formattedOutput);
        toast.success('Notes formatted successfully!');
        // Update user usage count
        setUser(prev => prev ? { ...prev, usageToday: prev.usageToday + 1 } : null);
      } else {
        if (response.status === 429) {
          setShowUpgradeModal(true);
        } else {
          toast.error(result.error || 'Failed to format notes');
        }
      }
    } catch (error) {
      console.error('Format failed:', error);
      toast.error('Failed to format notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!formattedOutput) return;

    try {
      await navigator.clipboard.writeText(formattedOutput);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleDownloadPDF = async () => {
    if (!formattedOutput) return;

    if (user?.subscription !== 'pro') {
      setShowUpgradeModal(true);
      return;
    }

    try {
      const { generatePDF } = await import('@/lib/pdf');
      const pdfData = generatePDF(
        formattedOutput,
        clientName || undefined,
        templates.find(t => t.id === selectedTemplate)?.name
      );
      
      const link = document.createElement('a');
      link.href = pdfData;
      link.download = `shift-note-${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleUpgrade = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
      });

      if (response.ok) {
        const result = await response.json();
        window.location.href = result.data.url;
      } else {
        toast.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
      toast.error('Failed to start upgrade process');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Transform Your Shift Notes with{' '}
              <span className="text-primary-600">AI Magic</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Professional shift note formatting for Australian support workers in NDIS, 
              aged care, SIL, and SDA services. Turn your quick notes into polished documentation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <Link
                  href="/register"
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Get Started Free
                </Link>
              ) : (
                <button
                  onClick={() => document.getElementById('formatter')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Start Formatting
                </button>
              )}
              <Link
                href="/about"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ShiftNote AI?
            </h2>
            <p className="text-xl text-gray-600">
              Designed specifically for Australian support workers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Formatting</h3>
              <p className="text-gray-600">
                Advanced AI understands Australian support work terminology and formats your notes professionally.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Save Time</h3>
              <p className="text-gray-600">
                Transform messy notes into professional documentation in seconds, not minutes.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-warning-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Compliant & Secure</h3>
              <p className="text-gray-600">
                Built with Australian privacy standards in mind. Your data stays secure and compliant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Note Formatter Section */}
      <section id="formatter" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Try It Now
            </h2>
            <p className="text-xl text-gray-600">
              Paste your raw shift notes and see the magic happen
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Raw Shift Notes
                </h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template
                  </label>
                  <div className="relative">
                    <select
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white cursor-pointer"
                    >
                      <option value="" disabled>
                        Select a template...
                      </option>
                      {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  {selectedTemplate && (
                    <p className="mt-2 text-sm text-gray-600">
                      {templates.find(t => t.id === selectedTemplate)?.description}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Enter client name if needed"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <textarea
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                  placeholder="leon refused meds again. oats for breakfast. noodles lunch. gp called. cleaned kitchen. no visitors."
                  className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />

                <button
                  onClick={handleFormat}
                  disabled={loading || !rawInput.trim()}
                  className={`w-full mt-4 px-6 py-3 rounded-lg font-semibold transition-all ${
                    loading || !rawInput.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  } ${loading ? 'btn-loading' : ''}`}
                >
                  {loading ? 'Formatting...' : 'Format Notes'}
                </button>
              </div>

              {/* Output Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Formatted Output
                </h3>
                
                <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto mb-4">
                  {formattedOutput ? (
                    <div className="whitespace-pre-wrap text-sm text-gray-800">
                      {formattedOutput}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center py-16">
                      Your formatted notes will appear here
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    disabled={!formattedOutput}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      !formattedOutput
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : copied
                        ? 'bg-success-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  
                  <button
                    onClick={handleDownloadPDF}
                    disabled={!formattedOutput}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      !formattedOutput
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that works for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-gray-50 rounded-xl p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Free</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                $0<span className="text-lg font-normal text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-success-600 mr-2" />
                  <span>2 formatted notes per day</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-success-600 mr-2" />
                  <span>All templates included</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-success-600 mr-2" />
                  <span>Copy to clipboard</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-success-600 mr-2" />
                  <span>Basic support</span>
                </li>
              </ul>
              <Link
                href="/register"
                className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors block text-center"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-primary-50 rounded-xl p-8 border-2 border-primary-200 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Pro</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                $4.99<span className="text-lg font-normal text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-success-600 mr-2" />
                  <span>Unlimited formatted notes</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-success-600 mr-2" />
                  <span>All templates included</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-success-600 mr-2" />
                  <span>PDF export</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-success-600 mr-2" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-success-600 mr-2" />
                  <span>Access to new features</span>
                </li>
              </ul>
              <button
                onClick={handleUpgrade}
                className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Stats */}
      {user && (
        <section className="py-12 bg-primary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Your Usage Today
              </h3>
              {user.subscription === 'pro' ? (
                <p className="text-lg text-primary-600 font-medium">
                  Unlimited notes available ✨
                </p>
              ) : (
                <p className="text-lg text-gray-600">
                  {user.usageToday}/2 free notes used
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SN</span>
                </div>
                <span className="text-xl font-bold">ShiftNote AI</span>
              </div>
              <p className="text-gray-400">
                Professional shift note formatting for Australian support workers.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Disclaimer</h4>
              <p className="text-gray-400 text-sm">
                Designed for NDIS and aged care workers. Not a replacement for professional 
                case management systems. Please review all generated content for accuracy.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ShiftNote AI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Upgrade to Pro</h3>
            <p className="text-gray-600 mb-6">
              You've reached your daily limit of 2 free notes. Upgrade to Pro for unlimited 
              formatting and PDF downloads.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Maybe Later
              </button>
              <button
                onClick={handleUpgrade}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
