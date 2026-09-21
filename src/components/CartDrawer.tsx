import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, MessageCircle, ArrowRight, Check, Tag, ShieldCheck, Truck, Package, Copy, Phone, AlertCircle, ExternalLink, Eye } from 'lucide-react';
import { CartItem, Currency, CheckoutForm } from '../types';
import { CURRENCIES, getWhatsAppOrderUrl, SUPPORT_PHONE_HAITI, SUPPORT_PHONE_HAITI_CALL, WHATSAPP_LINK } from '../data/boutiqueData';
import { useBoutique } from '../context/BoutiqueContext';
import { createOrder } from '../services/api';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onContinueShopping: () => void;
  onOpenOrderSummary?: (reference: string, token: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onContinueShopping,
  onOpenOrderSummary,
}) => {
  const { siteContent } = useBoutique();
  const validPromoCode = (siteContent?.promoCode || 'ABEYGOLD').toUpperCase();
  const promoDiscountPercentage = (siteContent?.promoDiscount ?? 10) / 100;
  const phoneHaiti = siteContent?.supportPhoneHaiti || SUPPORT_PHONE_HAITI;
  const phoneCallUrl = phoneHaiti ? `tel:${phoneHaiti.replace(/[^0-9+]/g, '')}` : SUPPORT_PHONE_HAITI_CALL;

  const [form, setForm] = useState<CheckoutForm>({
    fullName: '',
    whatsappNumber: '',
    countryCode: '+1',
    city: 'Port-au-Prince',
    country: 'Haïti',
    address: '',
    deliveryMethod: 'express_local',
    notes: '',
    promoCode: '',
  });

  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [orderConfirmed, setOrderConfirmed] = useState<string | null>(null);
  const [orderMessage, setOrderMessage] = useState<string>('');
  const [orderLink, setOrderLink] = useState<string | null>(null);
  const [orderToken, setOrderToken] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentCurrencyInfo = CURRENCIES[currency];

  // Calculate pricing
  const subtotalUSD = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountRate = appliedPromo ? promoDiscountPercentage : 0;
  const discountUSD = subtotalUSD * discountRate;

  // Shipping fees
  let shippingUSD = 0;
  if (form.deliveryMethod === 'express_local') {
    shippingUSD = subtotalUSD > 100 ? 0 : 8;
  } else if (form.deliveryMethod === 'diaspora_dhl') {
    shippingUSD = 25;
  } else {
    shippingUSD = 0; // Showroom pickup free
  }

  const totalUSD = Math.max(0, subtotalUSD - discountUSD + shippingUSD);

  const formatPrice = (amount: number) => {
    return (amount * currentCurrencyInfo.rate).toLocaleString('fr-FR', {
      maximumFractionDigits: currency === 'HTG' ? 0 : 2,
      minimumFractionDigits: currency === 'HTG' ? 0 : 2,
    });
  };

  const handleApplyPromo = () => {
    const entered = form.promoCode.trim().toUpperCase();
    if (entered && (entered === validPromoCode || entered === 'ABEYGOLD')) {
      setAppliedPromo(entered);
      setPromoError(null);
    } else {
      setPromoError(`Code promo invalide. Essayez "${validPromoCode}" pour ${siteContent?.promoDiscount ?? 10}% de réduction.`);
    }
  };

  const generateWhatsAppMessageWithLink = (orderRef: string, secureSummaryUrl: string) => {
    const discountPct = siteContent?.promoDiscount ?? 10;
    let text = `👑 *NOUVELLE COMMANDE MAISON ABÈY ACCESSORIES*\n`;
    text += `*Réf:* ${orderRef}\n\n`;
    text += `*ARTICLES SÉLECTIONNÉS :*\n\n`;
    items.forEach((item, idx) => {
      text += `${idx + 1}. ${item.product.name} x${item.quantity} (${currentCurrencyInfo.symbol}${formatPrice(item.product.price * item.quantity)})\n`;
    });
    text += `\n*RÉCAPITULATIF FINANCIER :*\n`;
    text += `• Sous-total : ${currentCurrencyInfo.symbol}${formatPrice(subtotalUSD)}\n`;
    if (discountUSD > 0) {
      text += `• Réduction promo (${appliedPromo} ${discountPct}%) : -${currentCurrencyInfo.symbol}${formatPrice(discountUSD)}\n`;
    }
    text += `• Livraison : ${shippingUSD === 0 ? 'Offerte' : `${currentCurrencyInfo.symbol}${formatPrice(shippingUSD)}`}\n`;
    text += `• *TOTAL À RÉGLER : ${currentCurrencyInfo.symbol}${formatPrice(totalUSD)}*\n\n`;
    text += `*INFORMATIONS CLIENT :*\n`;
    text += `• Nom complet : ${form.fullName.trim()}\n`;
    text += `• WhatsApp : ${form.countryCode} ${form.whatsappNumber.trim()}\n`;
    text += `• Ville & Pays : ${form.city}, ${form.country}\n`;
    if (form.address) text += `• Adresse / Repère : ${form.address.trim()}\n`;
    text += `• Mode d'expédition : ${
      form.deliveryMethod === 'express_local'
        ? 'Livraison Locale Express'
        : form.deliveryMethod === 'diaspora_dhl'
        ? 'Expédition Diaspora DHL/FedEx'
        : 'Retrait Showroom Pétion-Ville'
    }\n`;
    if (form.notes) text += `• Notes / Paquet cadeau : ${form.notes.trim()}\n`;
    text += `\n📸 *PHOTOS ET DÉTAILS DE LA COMMANDE :*\n`;
    text += `${secureSummaryUrl}\n\n`;
    text += `Merci de me confirmer la prise en charge et les modalités de paiement ! ✨`;
    return text;
  };

  const handleCheckoutWhatsApp = async () => {
    // 1. Validation
    const errors: Record<string, string> = {};
    if (!form.fullName.trim()) {
      errors.fullName = 'Veuillez indiquer votre nom complet.';
    }
    if (!form.whatsappNumber.trim()) {
      errors.whatsappNumber = 'Veuillez renseigner votre numéro WhatsApp.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setOrderError('Veuillez compléter vos coordonnées de contact ci-dessous.');
      return;
    }

    setValidationErrors({});
    setOrderError(null);
    setIsCreatingOrder(true);

    try {
      // 2. Snapshot of product images and prices at order time
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        subTitle: item.product.subTitle,
        category: item.product.category,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.image || '', // PRESERVE EXACT IMAGE SNAPSHOT
        selectedColor: item.selectedColor,
      }));

      const payload = {
        customerName: form.fullName.trim(),
        customerWhatsApp: `${form.countryCode} ${form.whatsappNumber.trim()}`,
        customerCity: form.city || 'Port-au-Prince',
        customerCountry: form.country || 'Haïti',
        customerAddress: form.address?.trim() || undefined,
        shippingMethod: form.deliveryMethod,
        customerNotes: form.notes?.trim() || undefined,
        items: orderItems,
        subtotal: subtotalUSD,
        shippingCost: shippingUSD,
        discount: discountUSD,
        promoCode: appliedPromo || undefined,
        total: totalUSD,
        currency,
      };

      // 3. Save order to database
      const result = await createOrder(payload);
      const secureUrl = result.orderSummaryUrl || `${window.location.origin}/order/${result.reference}?token=${result.token}`;

      // 4. Generate formatted WhatsApp text containing the secure link
      const message = generateWhatsAppMessageWithLink(result.reference, secureUrl);
      setOrderConfirmed(result.reference);
      setOrderMessage(message);
      setOrderLink(secureUrl);
      setOrderToken(result.token);

      // Auto-copy order text to clipboard
      try {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(message);
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
        }
      } catch {
        // ignore
      }

      // 5. Open WhatsApp with prefilled message
      const waUrl = getWhatsAppOrderUrl(message, siteContent?.supportPhoneHaiti);
      window.open(waUrl, '_blank');
    } catch (err: any) {
      console.error('Erreur enregistrement commande:', err);
      setOrderError(
        err.message || 
        'Impossible de créer la commande pour le moment. Veuillez vérifier votre connexion et réessayer.'
      );
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleCopyOrder = () => {
    if (navigator.clipboard && orderMessage) {
      navigator.clipboard.writeText(orderMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-pure-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-border-hairline">
        {/* Cart Header */}
        <div className="px-6 py-5 border-b border-border-hairline flex items-center justify-between bg-surface-offwhite">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-honey-gold" />
            <div>
              <h2 className="font-serif-luxury text-xl font-bold text-pure-black">
                Votre Panier d'Élégance
              </h2>
              <span className="text-[11px] text-text-muted">
                {items.length} création{items.length > 1 ? 's' : ''} sélectionnée{items.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer le panier"
            className="w-9 h-9 rounded-full bg-white border border-border-hairline text-pure-black hover:bg-pure-black hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-surface-offwhite border border-border-hairline mx-auto flex items-center justify-center text-text-muted">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-pure-black">
                Votre panier est encore vide
              </h3>
              <p className="text-xs text-text-muted max-w-xs mx-auto">
                Laissez-vous tenter par nos parures impériales ou nos minaudières sculptées de soirée.
              </p>
              <button
                onClick={onContinueShopping}
                className="px-6 py-3 bg-pure-black hover:bg-black/85 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Explorer le Catalogue
              </button>
            </div>
          ) : orderConfirmed ? (
            /* Dedicated Order Ready & WhatsApp Transmission Screen */
            <div className="space-y-6 animate-fadeIn">
              {/* Order Status Card */}
              <div className="bg-emerald-50 border-2 border-emerald-400/80 rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div className="space-y-1">
                    <span className="inline-block px-2 py-0.5 bg-emerald-200/80 text-emerald-900 rounded font-mono text-[11px] font-bold tracking-wider">
                      {orderConfirmed}
                    </span>
                    <h3 className="font-serif-luxury text-lg font-bold text-emerald-950">
                      Votre commande est prête pour WhatsApp !
                    </h3>
                  </div>
                </div>

                {/* Critical User Instruction */}
                <div className="bg-white rounded-xl p-4 border border-emerald-200 text-xs space-y-2 text-neutral-800 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-emerald-900 text-xs uppercase tracking-wide">
                    <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Instruction pour que la propriétaire reçoive votre message :</span>
                  </div>
                  <p className="text-[12.5px] leading-relaxed text-neutral-700">
                    Lorsque WhatsApp s'ouvre avec le numéro de la boutique (<strong>{SUPPORT_PHONE_HAITI}</strong>), l'ensemble de votre commande est <strong>déjà écrit dans le champ de discussion</strong>.
                  </p>
                  <p className="text-[12.5px] font-semibold text-emerald-950 bg-emerald-50/80 p-2 rounded-lg border border-emerald-100">
                    👉 Appuyez simplement sur le <strong>bouton d'envoi vert (l'icône d'avion ou flèche WhatsApp)</strong> pour que le message soit instantanément remis à la propriétaire.
                  </p>
                </div>
              </div>

              {/* Main Action Buttons */}
              <div className="space-y-3">
                <a
                  href={getWhatsAppOrderUrl(orderMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg transition-all cursor-pointer text-center"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                  <span>1. Ouvrir WhatsApp &amp; Envoyer ({SUPPORT_PHONE_HAITI})</span>
                </a>

                {orderLink && (
                  <a
                    href={orderLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer text-center border border-neutral-700"
                  >
                    <Eye className="w-4 h-4 text-honey-gold" />
                    <span>Voir le Récapitulatif avec Photos</span>
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                  </a>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={handleCopyOrder}
                    className="py-3 px-3 rounded-xl border border-border-hairline bg-white hover:bg-surface-offwhite text-pure-black font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Copy className="w-4 h-4 text-honey-gold" />
                    <span>{copied ? '✓ Texte copié !' : '2. Copier le texte complet'}</span>
                  </button>

                  <a
                    href={SUPPORT_PHONE_HAITI_CALL}
                    className="py-3 px-3 rounded-xl border border-border-hairline bg-white hover:bg-surface-offwhite text-pure-black font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Phone className="w-4 h-4 text-honey-gold" />
                    <span>Appeler {SUPPORT_PHONE_HAITI}</span>
                  </a>
                </div>

                {/* Alternative Direct Link */}
                <div className="text-center pt-1">
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-honey-gold transition-colors font-medium underline"
                  >
                    <span>Lien alternatif WhatsApp Business : wa.me/message/TPHRQAENTQM2J1</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Order Message Preview */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span className="font-semibold uppercase tracking-wider">Aperçu du texte préparé</span>
                  <button
                    onClick={handleCopyOrder}
                    className="text-honey-gold font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? 'Copié !' : 'Copier'}</span>
                  </button>
                </div>
                <div className="bg-surface-offwhite border border-border-hairline rounded-xl p-3.5 text-xs text-pure-black font-mono whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed select-all">
                  {orderMessage}
                </div>
              </div>

              {/* Back or Reset Controls */}
              <div className="pt-4 border-t border-border-hairline flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <button
                  onClick={() => setOrderConfirmed(null)}
                  className="text-text-muted hover:text-pure-black underline cursor-pointer"
                >
                  ← Modifier mes coordonnées / mon panier
                </button>
                <button
                  onClick={() => {
                    onClearCart();
                    setOrderConfirmed(null);
                    onClose();
                  }}
                  className="text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  Terminer &amp; Nouveau Panier
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-4">
                {items.map((item) => {
                  const itemConverted = (item.product.price * currentCurrencyInfo.rate).toLocaleString('fr-FR', {
                    maximumFractionDigits: currency === 'HTG' ? 0 : 2,
                    minimumFractionDigits: currency === 'HTG' ? 0 : 2,
                  });

                  return (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-4 p-3.5 bg-surface-offwhite border border-border-hairline rounded-xl"
                    >
                      {/* Image */}
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-20 object-cover rounded-lg border border-border-hairline bg-white shrink-0"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-honey-gold block truncate">
                          {item.product.tag}
                        </span>
                        <h4 className="font-serif-luxury text-sm font-bold text-pure-black truncate">
                          {item.product.name}
                        </h4>
                        <div className="font-serif-luxury text-xs font-bold text-pure-black mt-0.5">
                          {currentCurrencyInfo.symbol} {itemConverted}
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-border-hairline rounded bg-white text-xs">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="px-2 py-0.5 text-pure-black hover:bg-surface-offwhite font-bold cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-2 font-bold text-pure-black">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="px-2 py-0.5 text-pure-black hover:bg-surface-offwhite font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-text-muted hover:text-red-500 p-1 cursor-pointer transition-colors"
                            aria-label="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Promo Code Input */}
              <div className="bg-surface-offwhite p-4 rounded-xl border border-border-hairline space-y-2">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-honey-gold" />
                  <span className="text-xs font-bold text-pure-black">Code Privilège / Promo</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.promoCode}
                    onChange={(e) => setForm({ ...form, promoCode: e.target.value })}
                    placeholder={`Ex: ${validPromoCode} (${siteContent?.promoDiscount ?? 10}% off)`}
                    className="flex-1 bg-white border border-border-hairline rounded-lg px-3 py-2 text-xs uppercase outline-none focus:border-honey-gold"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-pure-black hover:bg-black/85 text-white rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Appliquer
                  </button>
                </div>
                {appliedPromo && (
                  <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Code {appliedPromo} appliqué (-{siteContent?.promoDiscount ?? 10}%)
                  </p>
                )}
                {promoError && (
                  <p className="text-[11px] text-red-600">{promoError}</p>
                )}
              </div>

              {/* Customer Checkout Form */}
              <div className="bg-surface-offwhite p-4 rounded-xl border border-border-hairline space-y-3.5">
                <h3 className="font-serif-luxury text-sm font-bold text-pure-black flex items-center gap-2">
                  <Truck className="w-4 h-4 text-honey-gold" />
                  <span>Informations de Livraison & WhatsApp</span>
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="block font-semibold text-pure-black mb-1">Nom Complet *</label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => {
                        setForm({ ...form, fullName: e.target.value });
                        if (validationErrors.fullName) {
                          setValidationErrors({ ...validationErrors, fullName: '' });
                        }
                      }}
                      placeholder="Ex: Marie-Ange Saint-Fleur"
                      className={`w-full bg-white border ${validationErrors.fullName ? 'border-red-500 bg-red-50/20' : 'border-border-hairline'} rounded-lg px-3 py-2 outline-none focus:border-honey-gold`}
                    />
                    {validationErrors.fullName && (
                      <p className="text-[11px] text-red-600 mt-1 font-medium">{validationErrors.fullName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-semibold text-pure-black mb-1">Indicatif</label>
                      <select
                        value={form.countryCode}
                        onChange={(e) => setForm({ ...form, countryCode: e.target.value })}
                        className="w-full bg-white border border-border-hairline rounded-lg px-2 py-2 outline-none text-xs"
                      >
                        <option value="+509">+509 (Haïti)</option>
                        <option value="+1">+1 (USA/Can)</option>
                        <option value="+1-809">+1-809 (RD)</option>
                        <option value="+33">+33 (France)</option>
                        <option value="+590">+590 (Antilles)</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block font-semibold text-pure-black mb-1">Numéro WhatsApp *</label>
                      <input
                        type="tel"
                        value={form.whatsappNumber}
                        onChange={(e) => {
                          setForm({ ...form, whatsappNumber: e.target.value });
                          if (validationErrors.whatsappNumber) {
                            setValidationErrors({ ...validationErrors, whatsappNumber: '' });
                          }
                        }}
                        placeholder="Ex: 3712-3456"
                        className={`w-full bg-white border ${validationErrors.whatsappNumber ? 'border-red-500 bg-red-50/20' : 'border-border-hairline'} rounded-lg px-3 py-2 outline-none focus:border-honey-gold`}
                      />
                      {validationErrors.whatsappNumber && (
                        <p className="text-[11px] text-red-600 mt-1 font-medium">{validationErrors.whatsappNumber}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-pure-black mb-1">Ville</label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="Port-au-Prince / Miami..."
                        className="w-full bg-white border border-border-hairline rounded-lg px-3 py-2 outline-none focus:border-honey-gold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-pure-black mb-1">Pays</label>
                      <input
                        type="text"
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                        placeholder="Haïti / USA / Canada..."
                        className="w-full bg-white border border-border-hairline rounded-lg px-3 py-2 outline-none focus:border-honey-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-pure-black mb-1">Mode d'Expédition</label>
                    <select
                      value={form.deliveryMethod}
                      onChange={(e: any) => setForm({ ...form, deliveryMethod: e.target.value })}
                      className="w-full bg-white border border-border-hairline rounded-lg px-3 py-2 outline-none text-xs"
                    >
                      <option value="express_local">Livraison Locale Express (Gratuit dès $100)</option>
                      <option value="diaspora_dhl">Expédition Internationale DHL/FedEx ($25)</option>
                      <option value="showroom_pickup">Retrait au Showroom Pétion-Ville (Gratuit)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-pure-black mb-1">Instructions / Note cadeau (Optionnel)</label>
                    <input
                      type="text"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Ex: Paquet cadeau pour un mariage samedi..."
                      className="w-full bg-white border border-border-hairline rounded-lg px-3 py-2 outline-none focus:border-honey-gold"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Cart Footer */}
        {items.length > 0 && !orderConfirmed && (
          <div className="p-6 border-t border-border-hairline bg-surface-offwhite space-y-4">
            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-text-muted">
              <div className="flex justify-between">
                <span>Sous-total ({items.length} créations)</span>
                <span className="font-semibold text-pure-black font-serif-luxury">
                  {currentCurrencyInfo.symbol} {formatPrice(subtotalUSD)}
                </span>
              </div>

              {discountUSD > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Remise Promo ({appliedPromo} {siteContent?.promoDiscount ?? 10}%)</span>
                  <span>-{currentCurrencyInfo.symbol} {formatPrice(discountUSD)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Frais d'expédition</span>
                <span>
                  {shippingUSD === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase">Offert</span>
                  ) : (
                    `${currentCurrencyInfo.symbol} ${formatPrice(shippingUSD)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-pure-black pt-2 border-t border-border-hairline">
                <span className="font-serif-luxury">Total Estimé</span>
                <span className="font-serif-luxury text-lg text-pure-black">
                  {currentCurrencyInfo.symbol} {formatPrice(totalUSD)}
                </span>
              </div>
            </div>

            {/* Order Action Buttons */}
            <div className="space-y-2">
              {orderError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{orderError}</span>
                </div>
              )}

              <button
                onClick={handleCheckoutWhatsApp}
                disabled={isCreatingOrder}
                className="w-full py-3.5 px-4 rounded-xl bg-pure-black hover:bg-black/85 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                {isCreatingOrder ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Création de votre récapitulatif avec photos...</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Finaliser la Commande sur WhatsApp</span>
                  </>
                )}
              </button>

              <button
                onClick={onContinueShopping}
                disabled={isCreatingOrder}
                className="w-full py-2.5 px-4 rounded-xl bg-transparent hover:bg-white text-pure-black border border-border-hairline text-xs font-semibold uppercase tracking-wider text-center transition-colors cursor-pointer"
              >
                Poursuivre mes achats
              </button>
            </div>

            {/* Support Call Haiti */}
            <div className="pt-2 border-t border-border-hairline flex items-center justify-between text-xs">
              <span className="text-text-muted">Besoin d'aide immédiate ?</span>
              <a
                href={phoneCallUrl}
                className="inline-flex items-center gap-1.5 font-bold text-pure-black hover:text-honey-gold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-honey-gold" />
                <span>Support Haïti : {phoneHaiti}</span>
              </a>
            </div>

            {/* Security note */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-text-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-honey-gold" />
              <span>Commande sécurisée et confirmée directement par notre conciergerie</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
