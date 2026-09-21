import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, CheckCircle2, Clock, Phone, MapPin, 
  Truck, FileText, Printer, ArrowLeft, MessageCircle, 
  ShieldCheck, AlertCircle, Share2, Copy, ExternalLink, ImageOff
} from 'lucide-react';
import { Order, OrderStatus, Currency } from '../types';
import { fetchOrderByReference, updateAdminOrderStatus } from '../services/api';
import { useBoutique } from '../context/BoutiqueContext';

interface OrderSummaryViewProps {
  orderReference: string;
  orderToken?: string;
  onBackToShop: () => void;
}

export const OrderSummaryView: React.FC<OrderSummaryViewProps> = ({
  orderReference,
  orderToken,
  onBackToShop,
}) => {
  const { siteContent, isAdminAuthenticated } = useBoutique();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;

    async function loadOrder() {
      if (!orderReference) {
        setError('Référence de commande manquante.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const fetched = await fetchOrderByReference(orderReference, orderToken);
        if (isMounted) {
          setOrder(fetched);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(
            err.message || 
            'Cette commande est introuvable ou le lien d’accès sécurisé est incorrect.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [orderReference, orderToken]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order || !isAdminAuthenticated) return;
    setUpdatingStatus(true);
    try {
      const updated = await updateAdminOrderStatus(order.id, newStatus);
      setOrder(updated);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la mise à jour du statut.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCopyOrderLink = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return {
          label: 'Nouvelle Commande',
          classes: 'bg-amber-100 text-amber-900 border-amber-300',
        };
      case 'confirmed':
        return {
          label: 'Confirmée',
          classes: 'bg-blue-100 text-blue-900 border-blue-300',
        };
      case 'processing':
        return {
          label: 'En Préparation Atelier',
          classes: 'bg-purple-100 text-purple-900 border-purple-300',
        };
      case 'shipped':
        return {
          label: 'Expédiée',
          classes: 'bg-indigo-100 text-indigo-900 border-indigo-300',
        };
      case 'delivered':
        return {
          label: 'Livrée & Remise',
          classes: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        };
      case 'cancelled':
        return {
          label: 'Annulée',
          classes: 'bg-rose-100 text-rose-900 border-rose-300',
        };
      default:
        return {
          label: status,
          classes: 'bg-neutral-100 text-neutral-800 border-neutral-300',
        };
    }
  };

  const formatPrice = (amount: number, currency: Currency | string = 'USD') => {
    const symbol = currency === 'USD' ? '$' : currency === 'HTG' ? 'G' : currency === 'EUR' ? '€' : '$';
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  // Clean WhatsApp phone number for link
  const getCleanPhone = (phoneStr: string) => {
    return phoneStr.replace(/[^0-9]/g, '');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-4 text-center">
        <div className="w-12 h-12 border-3 border-honey-gold/30 border-t-honey-gold rounded-full animate-spin" />
        <p className="font-serif-luxury text-lg text-pure-black font-semibold">
          Chargement de votre récapitulatif de commande...
        </p>
        <p className="text-xs text-text-muted">
          Sécurisation et vérification des pièces de haute parure
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-pure-black">
            Commande Introuvable
          </h1>
          <p className="text-sm text-neutral-600 max-w-md mx-auto">
            {error || 'Le lien d’accès est invalide, incomplet ou la commande n’existe pas.'}
          </p>
        </div>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onBackToShop}
            className="w-full sm:w-auto px-6 py-3 bg-pure-black text-white hover:bg-neutral-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à la Boutique</span>
          </button>
        </div>
      </div>
    );
  }

  const badge = getStatusBadge(order.status);
  const cleanCustomerPhone = getCleanPhone(order.customerWhatsApp);
  const customerWhatsAppLink = `https://wa.me/${cleanCustomerPhone}?text=${encodeURIComponent(
    `Bonjour ${order.customerName}, concernant votre commande ${order.reference} chez Maison Abèy...`
  )}`;

  return (
    <div className="min-h-screen bg-surface-offwhite py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation & Actions Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
          <button
            onClick={onBackToShop}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pure-black hover:text-honey-gold transition-colors cursor-pointer bg-white px-4 py-2.5 rounded-xl border border-border-hairline shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à la Boutique</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopyOrderLink}
              className="inline-flex items-center gap-2 text-xs font-semibold text-pure-black hover:bg-white bg-surface-offwhite px-3.5 py-2.5 rounded-xl border border-border-hairline transition-colors cursor-pointer"
              title="Copier le lien sécurisé de cette commande"
            >
              <Share2 className="w-4 h-4 text-honey-gold" />
              <span>{copiedLink ? '✓ Lien copié !' : 'Partager / Copier le lien'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pure-black hover:bg-white bg-surface-offwhite px-4 py-2.5 rounded-xl border border-border-hairline transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer</span>
            </button>
          </div>
        </div>

        {/* Admin Quick Action Banner (if logged in as Admin) */}
        {isAdminAuthenticated && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl print:hidden">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-honey-gold/20 text-honey-gold flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-wider uppercase text-honey-gold">
                  Accès Propriétaire / Gestionnaire
                </p>
                <p className="text-xs text-neutral-300">
                  Modifiez le statut de cette commande directement depuis cette vue.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs text-neutral-400">Statut :</span>
              <select
                value={order.status}
                disabled={updatingStatus}
                onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                className="bg-neutral-800 text-white text-xs font-semibold px-3 py-2 rounded-lg border border-neutral-700 focus:outline-none focus:border-honey-gold cursor-pointer"
              >
                <option value="new">Nouvelle Commande</option>
                <option value="confirmed">Confirmée</option>
                <option value="processing">En Préparation Atelier</option>
                <option value="shipped">Expédiée</option>
                <option value="delivered">Livrée &amp; Remise</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>
          </div>
        )}

        {/* Main Luxury Receipt Paper Card */}
        <div className="bg-white border border-border-hairline rounded-3xl shadow-xl overflow-hidden print:border-none print:shadow-none print:rounded-none">
          
          {/* Header Banner */}
          <div className="bg-pure-black text-white px-6 sm:px-10 py-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-honey-gold/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-honey-gold/15 border border-honey-gold/30 text-honey-gold text-xs font-mono font-semibold mb-3">
                  <span>👑 MAISON ABÈY ACCESSORIES</span>
                </div>
                <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-wide">
                  Récapitulatif de Commande
                </h1>
                <p className="text-xs sm:text-sm text-neutral-300 mt-1">
                  Enregistrée le {formatDate(order.createdAt)}
                </p>
              </div>

              <div className="text-left sm:text-right space-y-2">
                <div className="font-mono text-sm sm:text-base font-bold text-honey-gold tracking-wider bg-neutral-900/90 sm:bg-transparent px-3 py-1.5 rounded-lg sm:p-0 border border-neutral-800 sm:border-none inline-block">
                  Réf: {order.reference}
                </div>
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase ${badge.classes}`}>
                    {badge.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Summary Grid */}
          <div className="p-6 sm:p-10 border-b border-border-hairline bg-surface-offwhite/50">
            <h2 className="font-serif-luxury text-base font-bold text-pure-black uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-honey-gold" />
              <span>Informations Client &amp; Livraison</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              {/* Customer details */}
              <div className="bg-white p-5 rounded-2xl border border-border-hairline space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Client</span>
                  <span className="text-xs font-mono text-neutral-400">#Client</span>
                </div>
                <div>
                  <p className="font-bold text-base text-pure-black">{order.customerName}</p>
                  <p className="text-xs text-neutral-600 mt-0.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-honey-gold" />
                    <span>WhatsApp : {order.customerWhatsApp}</span>
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href={customerWhatsAppLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white" />
                    <span>Ouvrir la conversation WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Delivery info */}
              <div className="bg-white p-5 rounded-2xl border border-border-hairline space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Destination</span>
                  <Truck className="w-4 h-4 text-honey-gold" />
                </div>
                <div>
                  <p className="font-semibold text-pure-black flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-honey-gold shrink-0" />
                    <span>{order.customerCity}, {order.customerCountry}</span>
                  </p>
                  {order.customerAddress && (
                    <p className="text-xs text-neutral-600 mt-1 pl-5.5">
                      Repère / Adresse : {order.customerAddress}
                    </p>
                  )}
                  <p className="text-xs text-neutral-500 mt-2 font-medium">
                    Mode d'expédition :{' '}
                    <strong className="text-pure-black">
                      {order.shippingMethod === 'express_local'
                        ? 'Livraison Locale Express (Port-au-Prince / Pétion-Ville)'
                        : order.shippingMethod === 'diaspora_dhl'
                        ? 'Expédition Internationale Diaspora DHL / FedEx'
                        : 'Retrait Privé Showroom Pétion-Ville'}
                    </strong>
                  </p>
                </div>

                {order.customerNotes && (
                  <div className="pt-2 border-t border-border-hairline">
                    <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-0.5">
                      Notes &amp; Personnalisation :
                    </span>
                    <p className="text-xs text-neutral-700 italic bg-surface-offwhite p-2.5 rounded-lg border border-border-hairline">
                      « {order.customerNotes} »
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ordered Products Section with Large Visual Images */}
          <div className="p-6 sm:p-10 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif-luxury text-xl font-bold text-pure-black">
                  Articles Commandés
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Photographies des pièces sélectionnées au moment de l'enregistrement
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-surface-offwhite px-3 py-1 rounded-full border border-border-hairline text-pure-black">
                {order.items.length} article{order.items.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="divide-y divide-border-hairline border border-border-hairline rounded-2xl overflow-hidden bg-white shadow-2xs">
              {order.items.map((item, index) => {
                const hasImgError = imageErrors[`${order.id}_${index}`];
                return (
                  <div 
                    key={index}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-surface-offwhite/40 transition-colors"
                  >
                    {/* Product Image & Name */}
                    <div className="flex items-center gap-4 sm:gap-5 w-full sm:w-auto">
                      {/* Product Image Container */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-surface-offwhite border border-border-hairline shrink-0 relative shadow-xs">
                        {item.image && !hasImgError ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-center"
                            onError={() => {
                              setImageErrors((prev) => ({ ...prev, [`${order.id}_${index}`]: true }));
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 p-2 text-center bg-neutral-100">
                            <ImageOff className="w-6 h-6 mb-1 text-neutral-300" />
                            <span className="text-[9px] uppercase font-bold tracking-wider">Maison Abèy</span>
                          </div>
                        )}
                        <span className="absolute top-1 left-1 bg-pure-black/80 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
                          x{item.quantity}
                        </span>
                      </div>

                      {/* Product Details */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-honey-gold font-bold">
                          {item.category || 'Haute Parure'}
                        </span>
                        <h3 className="font-serif-luxury font-bold text-pure-black text-base sm:text-lg leading-snug">
                          {item.name}
                        </h3>
                        {item.subTitle && (
                          <p className="text-xs text-text-muted">{item.subTitle}</p>
                        )}
                        {item.selectedColor && (
                          <p className="text-xs text-neutral-600 font-medium">
                            Option : {item.selectedColor}
                          </p>
                        )}
                        <p className="text-xs text-neutral-500 sm:hidden">
                          Prix unitaire : {formatPrice(item.price, order.currency)}
                        </p>
                      </div>
                    </div>

                    {/* Price and Quantity Column */}
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-border-hairline">
                      <div className="hidden sm:block">
                        <span className="text-xs text-text-muted block">Prix unitaire</span>
                        <span className="font-mono text-sm text-neutral-700">
                          {formatPrice(item.price, order.currency)}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs text-text-muted block sm:text-right">Total article</span>
                        <span className="font-mono text-base sm:text-lg font-bold text-pure-black">
                          {formatPrice(item.total, order.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Financial Totals Breakdown */}
            <div className="bg-surface-offwhite/70 border border-border-hairline rounded-2xl p-6 sm:p-8 space-y-3 max-w-md ml-auto">
              <div className="flex justify-between text-sm text-neutral-600">
                <span>Sous-total articles</span>
                <span className="font-mono">{formatPrice(order.subtotal, order.currency)}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-700 font-medium">
                  <span>
                    Remise appliquée {order.promoCode ? `(${order.promoCode})` : ''}
                  </span>
                  <span className="font-mono">-{formatPrice(order.discount, order.currency)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm text-neutral-600">
                <span>Frais d'expédition</span>
                <span className="font-mono">
                  {order.shippingCost === 0 ? 'Offerte' : formatPrice(order.shippingCost, order.currency)}
                </span>
              </div>

              <div className="pt-3 border-t border-neutral-300 flex justify-between items-baseline">
                <div>
                  <span className="font-serif-luxury font-bold text-base sm:text-lg text-pure-black block">
                    Total de la Commande
                  </span>
                  <span className="text-[11px] text-text-muted">
                    Devise : {order.currency}
                  </span>
                </div>
                <span className="font-mono text-xl sm:text-2xl font-bold text-pure-black">
                  {formatPrice(order.total, order.currency)}
                </span>
              </div>
            </div>

          </div>

          {/* Footer Assistance & Concierge */}
          <div className="bg-surface-offwhite border-t border-border-hairline px-6 sm:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600">
            <div className="space-y-1 text-center sm:text-left">
              <p className="font-bold text-pure-black">
                Maison Abèy Accessories — Conciergerie Privée
              </p>
              <p>
                Service client : {siteContent.supportPhoneHaiti || '+509 3712-3456'} • Pétion-Ville, Haïti
              </p>
            </div>

            <div className="flex items-center gap-3 print:hidden">
              <a
                href={siteContent.whatsappLink || 'https://wa.me/message/TPHRQAENTQM2J1'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-pure-black hover:bg-neutral-800 text-white rounded-xl font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-honey-gold" />
                <span>Contacter la Boutique</span>
              </a>
            </div>
          </div>

        </div>

        {/* Security & Verification Note */}
        <div className="text-center text-xs text-text-muted space-y-1 print:hidden">
          <p className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-honey-gold" />
            <span>Lien sécurisé et horodaté généré par la plateforme officielle Maison Abèy</span>
          </p>
          <p>
            Conservez ce récapitulatif pour le suivi de votre commande et la livraison.
          </p>
        </div>

      </div>
    </div>
  );
};
