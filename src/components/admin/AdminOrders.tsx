import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Search, Filter, RefreshCw, Eye, MessageCircle, 
  CheckCircle2, Clock, Truck, XCircle, Trash2, ExternalLink, 
  FileText, Printer, ArrowUpDown, ChevronDown, ImageOff, X, AlertTriangle
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { fetchAdminOrders, updateAdminOrderStatus, deleteAdminOrder } from '../../services/api';

interface AdminOrdersProps {
  onViewOrderOnPublicSite?: (reference: string, token: string) => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminOrders();
      setOrders(data);
    } catch (err: any) {
      showToast(err.message || 'Erreur lors du chargement des commandes', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const updated = await updateAdminOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
      showToast(`Statut de la commande ${updated.reference} mis à jour : ${newStatus}`);
    } catch (err: any) {
      showToast(err.message || 'Impossible de mettre à jour le statut', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (orderId: string, reference: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la commande ${reference} ? Cette action est irréversible.`)) {
      return;
    }

    try {
      await deleteAdminOrder(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(null);
      }
      showToast(`Commande ${reference} supprimée avec succès`);
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la suppression', 'error');
    }
  };

  const formatPrice = (amount: number, currency: string = 'USD') => {
    const symbol = currency === 'USD' ? '$' : currency === 'HTG' ? 'G' : currency === 'EUR' ? '€' : '$';
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return {
          label: 'Nouvelle',
          classes: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        };
      case 'confirmed':
        return {
          label: 'Confirmée',
          classes: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
        };
      case 'processing':
        return {
          label: 'En préparation',
          classes: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
        };
      case 'shipped':
        return {
          label: 'Expédiée',
          classes: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
        };
      case 'delivered':
        return {
          label: 'Livrée',
          classes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        };
      case 'cancelled':
        return {
          label: 'Annulée',
          classes: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
        };
      default:
        return {
          label: status,
          classes: 'bg-neutral-800 text-neutral-400 border-neutral-700',
        };
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesStatus;

    const matchesQuery = 
      o.reference.toLowerCase().includes(query) ||
      o.customerName.toLowerCase().includes(query) ||
      o.customerWhatsApp.toLowerCase().includes(query) ||
      o.customerCity.toLowerCase().includes(query) ||
      o.items.some((it) => it.name.toLowerCase().includes(query));

    return matchesStatus && matchesQuery;
  });

  // Analytics
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);
  const newOrdersCount = orders.filter((o) => o.status === 'new').length;

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between shadow-lg transition-all animate-fadeIn ${
            feedback.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/80 border border-rose-500/40 text-rose-300'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-white/60 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & KPI Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-white tracking-wide">
            Commandes &amp; Transmissions WhatsApp
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Visualisez chaque commande avec les photographies exactes des créations sélectionnées par vos clients.
          </p>
        </div>

        <button
          onClick={loadOrders}
          disabled={loading}
          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-xl border border-neutral-700 inline-flex items-center gap-2 self-start sm:self-auto cursor-pointer transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Total Commandes
          </span>
          <div className="font-serif-luxury text-2xl font-bold text-white mt-1">
            {orders.length}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
            Nouvelles (À traiter)
          </span>
          <div className="font-serif-luxury text-2xl font-bold text-amber-400 mt-1">
            {newOrdersCount}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            Livrées
          </span>
          <div className="font-serif-luxury text-2xl font-bold text-emerald-400 mt-1">
            {orders.filter((o) => o.status === 'delivered').length}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Volume Ventes (USD)
          </span>
          <div className="font-serif-luxury text-xl font-bold text-honey-gold mt-1">
            ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par référence, nom, téléphone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-honey-gold"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Toutes' },
            { id: 'new', label: 'Nouvelles' },
            { id: 'confirmed', label: 'Confirmées' },
            { id: 'processing', label: 'En atelier' },
            { id: 'shipped', label: 'Expédiées' },
            { id: 'delivered', label: 'Livrées' },
            { id: 'cancelled', label: 'Annulées' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-honey-gold text-neutral-950 font-bold'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 text-center text-neutral-400 space-y-3">
            <div className="w-8 h-8 border-2 border-honey-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs">Chargement des commandes en cours...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <ShoppingBag className="w-10 h-10 text-neutral-600 mx-auto" />
            <h3 className="font-serif-luxury text-lg text-white font-semibold">
              Aucune commande trouvée
            </h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              {searchQuery
                ? 'Aucun résultat ne correspond à votre recherche.'
                : 'Les nouvelles commandes passées via le panier apparaîtront automatiquement ici.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950/80 border-b border-neutral-800 text-neutral-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Référence</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Articles &amp; Photos</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Statut</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 text-neutral-300">
                {filteredOrders.map((order) => {
                  const badge = getStatusBadge(order.status);
                  const firstItem = order.items[0];
                  return (
                    <tr key={order.id} className="hover:bg-neutral-800/40 transition-colors">
                      {/* Reference */}
                      <td className="py-4 px-4 font-mono font-bold text-white">
                        <span className="text-honey-gold">{order.reference}</span>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-white">{order.customerName}</div>
                        <div className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                          <MessageCircle className="w-3 h-3 text-emerald-400" />
                          <span>{order.customerWhatsApp}</span>
                        </div>
                        <div className="text-[10.5px] text-neutral-500">
                          {order.customerCity}, {order.customerCountry}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-neutral-400 text-[11px] whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>

                      {/* Items and Photo Thumbnails */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {/* Image stack thumbnails */}
                          <div className="flex -space-x-3 overflow-hidden">
                            {order.items.slice(0, 3).map((item, idx) => (
                              <div
                                key={idx}
                                className="inline-block w-8 h-8 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-800 shrink-0"
                              >
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-neutral-500 text-[8px]">
                                    #
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          <div className="text-[11px]">
                            <span className="font-semibold text-white">
                              {order.items.length} article{order.items.length > 1 ? 's' : ''}
                            </span>
                            {firstItem && (
                              <p className="text-neutral-400 text-[10px] truncate max-w-[140px]">
                                {firstItem.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-4 px-4 font-mono font-bold text-white whitespace-nowrap">
                        {formatPrice(order.total, order.currency)}
                      </td>

                      {/* Status Selector */}
                      <td className="py-4 px-4">
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${badge.classes} bg-neutral-900`}
                        >
                          <option value="new">Nouvelle</option>
                          <option value="confirmed">Confirmée</option>
                          <option value="processing">En atelier</option>
                          <option value="shipped">Expédiée</option>
                          <option value="delivered">Livrée</option>
                          <option value="cancelled">Annulée</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Voir les détails complets et photos"
                          >
                            <Eye className="w-3.5 h-3.5 text-honey-gold" />
                            <span>Voir</span>
                          </button>

                          <a
                            href={order.orderSummaryUrl || `/order/${order.reference}?token=${order.token}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                            title="Ouvrir la page récapitulative publique"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => handleDelete(order.id, order.reference)}
                            className="p-1.5 bg-neutral-800 hover:bg-rose-950 text-neutral-400 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                            title="Supprimer la commande"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-honey-gold/15 border border-honey-gold/30 text-honey-gold flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-base font-bold text-white">
                    Détails Commande — {selectedOrder.reference}
                  </h3>
                  <span className="text-[11px] text-neutral-400">
                    Enregistrée le {formatDate(selectedOrder.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={selectedOrder.orderSummaryUrl || `/order/${selectedOrder.reference}?token=${selectedOrder.token}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3 h-3 text-honey-gold" />
                  <span>Page Unique</span>
                </a>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Customer & Delivery Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Informations Client
                  </span>
                  <p className="font-bold text-sm text-white">{selectedOrder.customerName}</p>
                  <p className="text-neutral-300 flex items-center gap-1">
                    <MessageCircle className="w-3 h-3 text-emerald-400" />
                    <span>{selectedOrder.customerWhatsApp}</span>
                  </p>
                  <a
                    href={`https://wa.me/${selectedOrder.customerWhatsApp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold underline mt-1"
                  >
                    <span>Contacter sur WhatsApp</span>
                  </a>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Destination &amp; Livraison
                  </span>
                  <p className="text-white font-semibold">
                    {selectedOrder.customerCity}, {selectedOrder.customerCountry}
                  </p>
                  {selectedOrder.customerAddress && (
                    <p className="text-neutral-400">Adresse : {selectedOrder.customerAddress}</p>
                  )}
                  <p className="text-neutral-400">
                    Mode : <span className="text-white">{selectedOrder.shippingMethod}</span>
                  </p>
                  {selectedOrder.customerNotes && (
                    <p className="text-amber-300 italic pt-1">
                      Note client : « {selectedOrder.customerNotes} »
                    </p>
                  )}
                </div>
              </div>

              {/* Status Updater */}
              <div className="flex items-center justify-between bg-neutral-950/70 p-3 rounded-xl border border-neutral-800">
                <span className="font-semibold text-neutral-300">Modifier le Statut :</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                  className="bg-neutral-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-700 focus:outline-none focus:border-honey-gold cursor-pointer"
                >
                  <option value="new">Nouvelle Commande</option>
                  <option value="confirmed">Confirmée</option>
                  <option value="processing">En Préparation Atelier</option>
                  <option value="shipped">Expédiée</option>
                  <option value="delivered">Livrée &amp; Remise</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>

              {/* Products List with Large Photos */}
              <div className="space-y-3">
                <h4 className="font-serif-luxury font-bold text-sm text-white uppercase tracking-wider">
                  Articles et Photographies ({selectedOrder.items.length})
                </h4>

                <div className="divide-y divide-neutral-800 border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-950">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 shrink-0 relative">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-500">
                              <ImageOff className="w-4 h-4" />
                            </div>
                          )}
                          <span className="absolute bottom-0 right-0 bg-black/80 text-white font-mono text-[9px] px-1 rounded-tl">
                            x{item.quantity}
                          </span>
                        </div>

                        <div>
                          <p className="font-semibold text-white text-xs">{item.name}</p>
                          {item.subTitle && (
                            <p className="text-[10px] text-neutral-400">{item.subTitle}</p>
                          )}
                          <p className="text-[11px] text-neutral-500 font-mono">
                            {formatPrice(item.price, selectedOrder.currency)} x {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="text-right font-mono font-bold text-white text-sm">
                        {formatPrice(item.total, selectedOrder.currency)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Financial Summary */}
              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-2">
                <div className="flex justify-between text-neutral-400">
                  <span>Sous-total articles</span>
                  <span className="font-mono">{formatPrice(selectedOrder.subtotal, selectedOrder.currency)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Remise ({selectedOrder.promoCode || 'Code Promo'})</span>
                    <span className="font-mono">-{formatPrice(selectedOrder.discount, selectedOrder.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-400">
                  <span>Livraison</span>
                  <span className="font-mono">
                    {selectedOrder.shippingCost === 0 ? 'Offerte' : formatPrice(selectedOrder.shippingCost, selectedOrder.currency)}
                  </span>
                </div>
                <div className="pt-2 border-t border-neutral-800 flex justify-between font-bold text-sm text-white">
                  <span>Total à régler</span>
                  <span className="font-mono text-honey-gold text-base">
                    {formatPrice(selectedOrder.total, selectedOrder.currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex justify-end gap-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
