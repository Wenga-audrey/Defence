import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Search, 
  Filter,
  Download,
  RefreshCw,
  User,
  CreditCard,
  Calendar
} from 'lucide-react';

interface Payment {
  id: string;
  amount: number;
  method: string;
  transactionId: string;
  phoneNumber?: string;
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'REFUNDED';
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  class: {
    id: string;
    name: string;
    examType: string;
    price: number;
  };
}

const PaymentValidation: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [validationNotes, setValidationNotes] = useState('');
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    fetchPendingPayments();
  }, [statusFilter]);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/payments/pending', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPayments(data.payments);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const validatePayment = async (paymentId: string, status: 'PAID' | 'EXPIRED' | 'REFUNDED') => {
    try {
      setValidating(true);
      const response = await fetch(`/api/payments/${paymentId}/validate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          status,
          validationNotes
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update payment in local state
        setPayments(prev => prev.map(p => 
          p.id === paymentId 
            ? { ...p, status: status as any }
            : p
        ));

        setSelectedPayment(null);
        setValidationNotes('');
        
        // Show success message
        alert(`Payment ${status.toLowerCase()} successfully!${data.enrollmentActivated ? ' Enrollment activated.' : ''}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error validating payment:', error);
      alert('Failed to validate payment');
    } finally {
      setValidating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'EXPIRED':
      case 'REFUNDED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'EXPIRED':
      case 'REFUNDED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.class.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-CM', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Validation des Paiements
        </h1>
        <p className="text-gray-600">
          Gérez et validez les paiements des étudiants
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par nom, email, transaction..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="PENDING">En attente</option>
              <option value="PAID">Payé</option>
              <option value="EXPIRED">Expiré</option>
              <option value="REFUNDED">Remboursé</option>
              <option value="ALL">Tous</option>
            </select>
            
            <button
              onClick={fetchPendingPayments}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </button>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement des paiements...</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun paiement trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Étudiant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Classe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Méthode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.user.firstName} {payment.user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.class.name}</div>
                      <div className="text-sm text-gray-500">{payment.class.examType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.method}</div>
                      {payment.phoneNumber && (
                        <div className="text-sm text-gray-500">{payment.phoneNumber}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-1">{payment.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(payment.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Valider
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Validation Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Validation du Paiement
                </h2>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Payment Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Étudiant
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedPayment.user.firstName} {selectedPayment.user.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{selectedPayment.user.email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Classe
                    </label>
                    <p className="text-sm text-gray-900">{selectedPayment.class.name}</p>
                    <p className="text-sm text-gray-500">{selectedPayment.class.examType}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Montant
                    </label>
                    <p className="text-sm font-bold text-gray-900">
                      {formatCurrency(selectedPayment.amount)}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Méthode de Paiement
                    </label>
                    <p className="text-sm text-gray-900">{selectedPayment.method}</p>
                    {selectedPayment.phoneNumber && (
                      <p className="text-sm text-gray-500">{selectedPayment.phoneNumber}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID Transaction
                    </label>
                    <p className="text-sm font-mono text-gray-900">
                      {selectedPayment.transactionId}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de Création
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatDate(selectedPayment.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Validation Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes de Validation (Optionnel)
                </label>
                <textarea
                  value={validationNotes}
                  onChange={(e) => setValidationNotes(e.target.value)}
                  placeholder="Ajoutez des notes sur la validation du paiement..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => validatePayment(selectedPayment.id, 'PAID')}
                  disabled={validating}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {validating ? 'Validation...' : 'Valider comme Payé'}
                </button>
                
                <button
                  onClick={() => validatePayment(selectedPayment.id, 'EXPIRED')}
                  disabled={validating}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  {validating ? 'Validation...' : 'Marquer comme Expiré'}
                </button>
                
                <button
                  onClick={() => validatePayment(selectedPayment.id, 'REFUNDED')}
                  disabled={validating}
                  className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  {validating ? 'Validation...' : 'Rembourser'}
                </button>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> La validation d'un paiement comme "Payé" activera automatiquement 
                  l'inscription de l'étudiant à la classe et lui enverra une notification de bienvenue.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">En Attente</p>
              <p className="text-lg font-bold text-gray-900">
                {payments.filter(p => p.status === 'PENDING').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Validés</p>
              <p className="text-lg font-bold text-gray-900">
                {payments.filter(p => p.status === 'PAID').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Expirés</p>
              <p className="text-lg font-bold text-gray-900">
                {payments.filter(p => p.status === 'EXPIRED').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CreditCard className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(payments.reduce((sum, p) => sum + p.amount, 0))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentValidation;
