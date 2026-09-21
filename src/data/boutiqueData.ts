import { Product, Currency } from '../types';

export const WHATSAPP_LINK = "https://wa.me/message/TPHRQAENTQM2J1";
export const SUPPORT_PHONE_HAITI = "+509 3874 9217";
export const SUPPORT_PHONE_HAITI_DIGITS = "50938749217";
export const SUPPORT_PHONE_HAITI_CALL = "tel:+50938749217";

/**
 * Returns the optimal WhatsApp URL:
 * - If text is provided, uses WhatsApp API with phone number 50938749217
 *   because WhatsApp's shortlink redirect (wa.me/message/...) drops the ?text parameter!
 * - If no text is provided, opens the WhatsApp Business profile shortlink.
 */
export const getWhatsAppOrderUrl = (text?: string, customPhone?: string): string => {
  const digits = customPhone ? customPhone.replace(/[^0-9]/g, '') : SUPPORT_PHONE_HAITI_DIGITS;
  if (!text) return WHATSAPP_LINK;
  return `https://api.whatsapp.com/send?phone=${digits}&text=${encodeURIComponent(text)}`;
};

export const LOGO_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuA__TNitA1x3gn_NZmOrRITonH-HdCpeajgtbfojKB7uQWb4zfcy78B-no5heSbmjAgIRK-DauDZJttkm5ffIbAoYBxQkccqmPoOJM0o1uDrqny3zZPROywjrRM8B4QBt0MdW0Y0EHwP8hhR2HKYBM0w4boCC_jeWV2vtM574yf-uK59dgWuqEhTQqHaf5CCtK7WgZn2FVpXpOE7NTNIIrlaAc7ENBiTr3JAfK_t67dwrcelzOaXW9SctSNMq-5r5MOeQ";
export const HERO_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuCwVWrfxNz9dhPTYMStsKzGIAiZZBO1fOTadciREK6APpvCb0px7_Yl94LsfX6RCBO2zCHuauHYj3OKnoUOPv1CkCAtw3Eoa4Xnk0F__Nwp0B3f3y-Xi3vBUTfw7bV6Mtl9Dn5nSNDtIejPOdFQSh965L7hBa4AS2DIxye0QR72P_qIQkItIh4Iea34skZbNtYg2yYoiP2GYXdxOYoc-0Jg3kZy60YHZtmZrXMdNt0qQ5kEiTN-aJrCVB5s_kSHeRb1WQ";
export const CRAFT_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuAD2fTunyPTJCCb8Zz9LnLdAOR2fzwdgIGEtuUQW6pk61dZfed8G8xKw7kC5mgEHTKqDlYZdHhIkcXH8_qWAdfzYGDhD3MCFpQOaVNtbYRiQaiJUum36IuhD5pLMwUQ30KJGJHUIYFDA41sdkI5hL9Hn94nDG-xwCRsk7idbJGoAfdB7xxaanx9Twc8lL54bJlTGNHlurPDWRE318DqujPLwCzplY-Lj07CANfvJMbz8umItil1ct9zPAWWJy4Ge_oorA";
export const PACKAGING_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuD3NMl18icZgBjjG_177QjHPLin753uKiSLsb1c6FGk2cwcziTjK5d-9UAmcwkgpriGQnwslPRplkbz-KpvQmkvTPB3wC-N29w4Ob38DkKPGbUUfd53c2hV6g8TbD-3ihNLpd2hayQR1EFFvEC51zzd7lgdQJ0pCdaJVjWFdQqV79GsCKdvhsh34e6KIHDqY4vSUgUvXcDc2JjAOh6dBU12KyFkNPdq8KFs-VQf1QRdYjfzrGvOXRTET9kDL3xHtCVeEg";

export const CATEGORY_CARDS = [
  {
    id: 'necklaces',
    title: 'Chains & Necklaces',
    subtitle: 'Choker & Sautoirs sculptés',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnNml_y55mEBzaQ2LFBIVOIhbqV7fze6ZfjrK2qruh4jdMDALgP6tYk73jTZkX3xHOv1IT8MDd6s8k_Tt-ynADcbNeXshID1Gt-N-mnKW56j896RiPtiwsMQeOMcLd1wJ3bM09Qnsm7hn8ws0s4H-OCEpeaV32LfwhtKrU0pSFSSMOSTWiOYAO_NKji0R5MJwnY5Ap-j_f4rDwk04K39ey2gjeRi164KZVkC-sbpZbQ2nC8duvttM6lKBtquW8RuS-2Q',
    count: '14 Pièces'
  },
  {
    id: 'earrings',
    title: 'Statement Earrings',
    subtitle: 'Boucles architecturales et dorures',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKRc6YSjTIsEga0pW9H6p820c4eUQWqvPahuPVAlJTW1Q8-933E_akCJpLu4QC-hv1wD6Mijg7X8m0IqhBAIU6yYrQllayLfPEtkw_539SLvtkXdcRfYS_f8KaFwBL9kG0-Jmrg6N1K5mBlD5j4u-0zov1ecwqRE1B9_hIaoDKX8rUOJnUf3omo0S3rLBSAdRldGcev7BfEALy2YK_82Rsad7MTRzVzKqLB2za5EbMBgsRZjcGPoYTgr9H62nkt0Y8ww',
    count: '26 Pièces'
  },
  {
    id: 'rings',
    title: 'Artisan Rings',
    subtitle: 'Bagues martelées & pierres fines',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0wTH7MX-8DrDi-sq8DRatatgKc-9gCt71bzeefObC5bWfXaNWn6HR7VbkC7q8MMPTSlGvanTbvpserOIJExKxKBsXVlDUnwjoc4OhJ1l9vU_zNOY3-B_HmbBXIm48TPK7INWenbtDh_KkgPI_Sl_ZCfne25zRzoMBC19Acfe3xs41r5E8eGRvhcHonwi-YP--8rr-HBfQaAE7DQRWvsJ_eJBxbI2b7iC52LZO_BEje_Abg3GnX-WGxxLVWhv9sP9a7g',
    count: '18 Pièces'
  },
  {
    id: 'bags',
    title: 'Sculptural Bags & Clutches',
    subtitle: 'Minaudières nacrées, velours & laiton',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDieAruG5tswY-QpT0OuWtUQtVwpyIUl0_PmljFtYmBXhN5mI-U2-OtWLDugDYwO6gWikOTg6HrJw5lHW4ojJygcEti4ILII6YvZ3qu2lnMeEn1ifpniu-szJ2wGqBrC_Cv3wWSOfai_VpuwElklfTlJMPofSDU12DrloCwVGAxhuOnBGjjB-NBQFCz8Lezzt6S-NV-GpS2f_Rw9I-vbcjQLecpF4uedjL_nd_BJD4oVgY5Vkwh5qVD6dK1a77qfCdSIA',
    count: '12 Pièces'
  },
  {
    id: 'footwear',
    title: 'Evening Footwear & Sandals',
    subtitle: 'Mules et sandales de gala dorées',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDybdBbYlxlk401cWgMxcMzKZCTsouNvhZo8xBg7kO2cHdO_k6z7pGA9mH1VSNfmcIQeC4b9mlpzLwEYznOTxZ7xvqMp8Pcu0l9jyarcQFYXHiDEEXouofEj8gZ70kEqZTIitfZ8_k3nv8YLwBhY45N61JwN0UpSKFsA_cSEmwUyPRqcHjtV0ewjJpkNvEA2DdvGwUSr5NL2uFpZdBDojrl2Mi_5XxHy49_KtHjYw0B-WaBxnRiHFt3w4F4a0jT4Et4gQ',
    count: '8 Pièces'
  },
  {
    id: 'cases',
    title: 'Luxury Keepsake Cases',
    subtitle: 'Coffrets à bijoux capitonnés & velours',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdTy4pHNfx7C6U-q1uJrEjBeiphAwyQgaHyI7qpxiLD-wU1EqyItyHejLACoKZp9eDEvVFLuEGAetQoEM_aw41_8TEl10DVopb3vm8IO4gszTw0_5D7hDqJYCK5f2jJ0uMqOTvJk3LB1Sdx_DDsHBP_RnwWgcVlt3lSofNWzhu_6NC1sMbyJ9haWPJyAcnDwYRu7Fxku-4N9EITtI20X6n7C1e83oP61iHrXJCba88RsVDqWjpUt_bczHKdVrNY5Ye5w',
    count: '6 Coffrets'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'reine-soleil',
    name: 'Reine Soleil Floral Earrings',
    subTitle: 'Boucles Fleur en Nacre & Laiton Doré',
    category: 'earrings',
    price: 48,
    originalPrice: 58,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBZqGC9SAJ-3pYkmZSR7wpo2zFeXGnCouo-quSeVEdCKT2323ZKYo8KyCp8chJ1E3YO8QyBBhu9isjlhCBrwUyfolkb9J3HIgDUDSERL36l34z1IzXGi6Pu4dMNAceiIcLtigpzBV5qsS-M7WDmxLPp0tT4R0M4thOJv4YkKgbGVcIJjXk1e7THBn6eS1676_RJtlarAt4JwpeVxbCnTuTCePxJDxbcyj8ADgsiKFEqKKsg97wqL0z8p19YidYwWGj8A',
    badge: 'Nouveau',
    tag: 'Handcrafted Flora',
    description: "Inspirée des floraisons impériales caribéennes, la paire Reine Soleil unit des pétales sculptés en nacre naturelle blanche et une monture dorée à l'or fin 18 carats. Une silhouette d'une légèreté exceptionnelle qui illumine le port de tête lors des grandes occasions.",
    material: "Nacre d'huître perlière naturelle, monture en laiton trempé or 18k antiallergique, tiges hypoallergéniques en titane.",
    dimensions: "Longueur : 6.8 cm | Largeur : 3.2 cm | Poids : 9.5g par boucle",
    origin: "Atelier Abèy / Port-au-Prince & Santo Domingo",
    inStock: true
  },
  {
    id: 'imperatrice-cascade',
    name: "L'Impératrice Crystal & Gold Cascade Set",
    subTitle: 'Parure Royale Collier Plastron & Pendantes',
    category: 'necklaces',
    price: 115,
    originalPrice: 135,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCROyVf8wLg2fsYqmexOpvRu2M6-rX3eGPHzgnfpN9XVd8MTdLmoPCmVH_V7FigSdozd9pqE4oiXU0KrGLnS0iOMozSdE5owFKh-fz58dYaeO9JFF999oVcr8LWrgiyjS_OKlZfaHxnmqmf6aWxRRUEJs4DcN_JUmkFqKkFXMkQoBLG7og-yMQutXLi8O_aV60cDahcvXMAFtel8RB2VJ6tyxzogHWj5Ob9mev6UbyyqrMpNyaVhtE64kld4H1MPLX_Vg',
    badge: 'Pièce Maîtresse',
    tag: 'Haute Couture',
    description: "Une cascade scintillante de cristaux taillés facette par facette et de maillons ciselés à la main. L'ensemble comprend le ras-de-cou sculptural réglable et les pendants d'oreilles assortis. La signature par excellence des galas de la diaspora.",
    material: "Cristaux autrichiens haute réfraction, sertis griffes dorés or fin 24k, fermoir sécurisé à cliquet bijoutier.",
    dimensions: "Tour de cou : 38 à 46 cm avec chaînette de confort | Gouttes : 5.5 cm",
    origin: "Collection Prestige Abèy",
    inStock: true
  },
  {
    id: 'coquille-doree',
    name: 'Coquille Dorée Fan Minaudière',
    subTitle: 'Pochette Éventail Festonnée en Métal Doré',
    category: 'bags',
    price: 88,
    originalPrice: 105,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlnT9ifLKgbjuMmWZXXjT5ZyT-SAvfUYzOMlDgPfiUj5BiKuvhoH5QPE-yaKPrjD0YtuUd9KMzd-qnBt5kX-X7uUvia5V23f5Sh-FbXMxkd7TABnmtg3-8-PVE0L5yca2fvRCJsV747A3qCQaQp5xh_xQxtdDL57MLbOzBSn7BVHx7EIAjUld1d9lPmAc7_FsAQwBdTsky6pK0J2-yIvQyEJPK0itcRQyHMIACA48B0hiBQVQBiQ-uPn-ixjID8H9E0w',
    badge: 'Édition Limitée',
    tag: 'Artisanal Clutch',
    description: "Minaudière rigide structurée évoquant les coquillages solaires de nos mers turquoise. Coque en laiton cannelé avec fermoir cabochon et chaîne serpent amovible pour un porté épaule ou main.",
    material: "Coque en alliage de laiton brossé or brillant, doublure velours noir profond, chaîne bandoulière dorée 110 cm.",
    dimensions: "21 cm x 13 cm x 5 cm (convient à tous les smartphones grands formats et essentiels)",
    origin: "Atelier Maroquinerie Abèy",
    inStock: true
  },
  {
    id: 'spiral-pearl-conch',
    name: 'Spiral Pearl Conch Drops & Geometric Studs',
    subTitle: 'Duo Boucles Perles Baroques & Spirales',
    category: 'earrings',
    price: 38,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2WQkWm-o_vtoGXQSOx9UcH69BgtG1EYdgntHUg4HiZQdUhL4eSKP9LCoQWO5orKT8DXjiLXcAjKyhZwidMgDSKv1EetfzahyUjjGwg_QfbKUcI4oHoS7snRuIoQajUgBei4KIRjgkG-q-867Sci1YEDEpo0vsHPJggRyk-by4MexfTeWVRB7Dz6Kkz7uoVtqA4T66EovYLIE78Qr9yDCsL--BZf9KjyhQWwdK8V-aDirSAhYxSLBk0esqJb5O2ZxJPg',
    badge: 'Bestseller',
    tag: 'Baroque Pearl',
    description: "Perles d'eau douce sélectionnées individuellement pour leur lustre nacré et leurs reflets irisés, suspendues sous une volute géométrique spiralée en laiton martelé.",
    material: "Perles baroques véritables de culture, laiton finition satinée or 18k sans nickel.",
    dimensions: "Longueur : 5.2 cm | Diamètre perle : 11-13 mm",
    origin: "Atelier Bijouterie Abèy",
    inStock: true
  },
  {
    id: 'marbre-blanc-stone-bag',
    name: 'Marbre Blanc Organic Evening Stone Bag',
    subTitle: 'Minaudière Galet Marbré & Anse Sculpturale',
    category: 'bags',
    price: 96,
    originalPrice: 110,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxxysSIqUCypx95HENxKdMVVSV0u_H9rdnjDlF-LxhqHtNUAC735_VL-2rH4uPAwBVIvii92P0gtmyuc4dXsAg31cVY5YOEfTpVsZpVChJ7w9T4KZ40KSIhHzx-YTcC7CrozgG0PBTdGktjvcnnkT_dEPVbi_F81xVHCERXiqd15mDYiUdifLLKvPYkKAI_MEjPsjXGuiWT2kjcDdg6yxG1ULoL_MPDQdFfExKkXLNLbziiZ28T5DbBJL732QKIx93Og',
    badge: 'Coup de Cœur',
    tag: 'Organic Luxury',
    description: "Une pièce sculpturale qui transcende la maroquinerie pour devenir œuvre d'art portable. Corps moulé aux veines minérales marbrées blanches et ivoire, souligné d'une anse asymétrique en métal doré poli miroir.",
    material: "Résine minérale effet travertin blanc, quincaillerie or chaud satiné, intérieur en suédine beige.",
    dimensions: "19 cm x 14 cm x 6.5 cm | Poids équilibré 480g",
    origin: "Collection Marbre & Soleil",
    inStock: true
  },
  {
    id: 'papillon-armature-cuff',
    name: 'Papillon Armature Cuff in Brushed Honey Gold',
    subTitle: 'Manchette Ajourée Papillon Or Chaud',
    category: 'necklaces',
    price: 52,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwcIrLKM2o3JSA6P1B-qc9kKOw8Aaf6AbSnvy8ubJ72fnJjE-U77qAB_UJnBm8z9B9LeqktWui2wTKLqT090crkp_fOaGOc5a4tpHCzcWWq-PWylYFwOBVc1drvUzeGYefrQyzIDDVGjUljABnJIj-mJUwt68nxrHRn9TP4dkU2m-5QXNiqtTG-hiR2SOjBFVHjU6Xk1mM7rOaod-tDKL-cF9Jbche46UHG118nMud-R3xIwUgGTvgCqroS0a5Fr5VsA',
    badge: 'Nouveau',
    tag: 'Sculptural Cuff',
    description: "Une silhouette aérienne mimant l'envolée d'un papillon royal. Manchette malléable conçue pour s'ajuster délicatement à tout poignet ou avant-bras pour une allure royale instantanée.",
    material: "Laiton brossé haute résistance, placage or 18k multicouche, traitement anti-oxydation longue durée.",
    dimensions: "Largeur cuff : 5.8 cm | Diamètre intérieur ajustable 55 à 68 mm",
    origin: "Atelier Abèy Métaux Précieux",
    inStock: true
  },
  {
    id: 'kouron-ren-swirls',
    name: 'Kouròn Rèn Dual Golden Swirls',
    subTitle: 'Créoles Ondulées Couronne de Reine',
    category: 'earrings',
    price: 34,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKRc6YSjTIsEga0pW9H6p820c4eUQWqvPahuPVAlJTW1Q8-933E_akCJpLu4QC-hv1wD6Mijg7X8m0IqhBAIU6yYrQllayLfPEtkw_539SLvtkXdcRfYS_f8KaFwBL9kG0-Jmrg6N1K5mBlD5j4u-0zov1ecwqRE1B9_hIaoDKX8rUOJnUf3omo0S3rLBSAdRldGcev7BfEALy2YK_82Rsad7MTRzVzKqLB2za5EbMBgsRZjcGPoYTgr9H62nkt0Y8ww',
    badge: 'Bestseller',
    tag: 'Golden Swirls',
    description: "Évoquant la couronne royale kreyòl, ces doubles spirales captent et renvoient chaque faisceau lumineux. Fermoir sécurisé pour une tenue impeccable du matin jusqu'au bout de la nuit.",
    material: "Plaqué or fin 18 carats sur base laiton bijoutier.",
    dimensions: "Diamètre : 4.2 cm",
    origin: "Atelier Port-au-Prince",
    inStock: true
  },
  {
    id: 'perle-royale-donut',
    name: 'Perle Royale Floating Donut Studs',
    subTitle: 'Puces Géométriques & Perles d\'Eau Douce',
    category: 'earrings',
    price: 29,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2WQkWm-o_vtoGXQSOx9UcH69BgtG1EYdgntHUg4HiZQdUhL4eSKP9LCoQWO5orKT8DXjiLXcAjKyhZwidMgDSKv1EetfzahyUjjGwg_QfbKUcI4oHoS7snRuIoQajUgBei4KIRjgkG-q-867Sci1YEDEpo0vsHPJggRyk-by4MexfTeWVRB7Dz6Kkz7uoVtqA4T66EovYLIE78Qr9yDCsL--BZf9KjyhQWwdK8V-aDirSAhYxSLBk0esqJb5O2ZxJPg',
    tag: 'Classic Studs',
    description: "Un anneau doré délicatement percé accueillant en son cœur une perle baroque ronde. La fusion sublime du minimalisme moderne et du faste insulaire.",
    material: "Perle de culture d'eau douce A+, laiton doré 18k.",
    dimensions: "2.5 cm x 2.5 cm",
    origin: "Écrin Abèy",
    inStock: true
  },
  {
    id: 'trinite-safety-rings',
    name: 'Trinité Safety Pin & Open Heart Trio',
    subTitle: 'Trio Bagues Épingle à Nourrice & Cœur Ouvert',
    category: 'rings',
    price: 42,
    originalPrice: 49,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0wTH7MX-8DrDi-sq8DRatatgKc-9gCt71bzeefObC5bWfXaNWn6HR7VbkC7q8MMPTSlGvanTbvpserOIJExKxKBsXVlDUnwjoc4OhJ1l9vU_zNOY3-B_HmbBXIm48TPK7INWenbtDh_KkgPI_Sl_ZCfne25zRzoMBC19Acfe3xs41r5E8eGRvhcHonwi-YP--8rr-HBfQaAE7DQRWvsJ_eJBxbI2b7iC52LZO_BEje_Abg3GnX-WGxxLVWhv9sP9a7g',
    badge: 'Nouveau',
    tag: 'Stackable Rings',
    description: "Un ensemble de 3 bagues empilables au design audacieux : le motif épingle de sûreté haute joaillerie, la bande pavée et le cœur contour sculpté.",
    material: "Laiton plaqué or 18k résistant à l'eau, micro-oxydes de zirconium scintillants.",
    dimensions: "Anneaux ajustables (tailles 50 à 58)",
    origin: "Atelier Bijouterie Abèy",
    inStock: true
  },
  {
    id: 'perla-imperial-minaudiere',
    name: 'Perla Imperial Beaded Minaudière',
    subTitle: 'Pochette de Soirée Broderie Perles et Strass',
    category: 'bags',
    price: 95,
    originalPrice: 120,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDieAruG5tswY-QpT0OuWtUQtVwpyIUl0_PmljFtYmBXhN5mI-U2-OtWLDugDYwO6gWikOTg6HrJw5lHW4ojJygcEti4ILII6YvZ3qu2lnMeEn1ifpniu-szJ2wGqBrC_Cv3wWSOfai_VpuwElklfTlJMPofSDU12DrloCwVGAxhuOnBGjjB-NBQFCz8Lezzt6S-NV-GpS2f_Rw9I-vbcjQLecpF4uedjL_nd_BJD4oVgY5Vkwh5qVD6dK1a77qfCdSIA',
    badge: 'Pièce Maîtresse',
    tag: 'Evening Pearls',
    description: "Entièrement tissée de milliers de perles blanches nacrées et de touches de perles dorées. Une texture sensorielle somptueuse avec fermoir bijou surmonté d'un bouton or serti.",
    material: "Perles en verre laqué et perles baroques synthétiques haute densité, armature métallique dorée, doublure satin.",
    dimensions: "20 cm x 12 cm x 6 cm",
    origin: "Atelier Haute Maroquinerie Abèy",
    inStock: true
  },
  {
    id: 'velours-royal-bordeaux',
    name: 'Velours Royal Bordeaux & Onyx Clutches',
    subTitle: 'Duo Pochettes Velours & Anneaux Bijoux',
    category: 'bags',
    price: 78,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlnT9ifLKgbjuMmWZXXjT5ZyT-SAvfUYzOMlDgPfiUj5BiKuvhoH5QPE-yaKPrjD0YtuUd9KMzd-qnBt5kX-X7uUvia5V23f5Sh-FbXMxkd7TABnmtg3-8-PVE0L5yca2fvRCJsV747A3qCQaQp5xh_xQxtdDL57MLbOzBSn7BVHx7EIAjUld1d9lPmAc7_FsAQwBdTsky6pK0J2-yIvQyEJPK0itcRQyHMIACA48B0hiBQVQBiQ-uPn-ixjID8H9E0w',
    badge: 'Coup de Cœur',
    tag: 'Royal Velvet',
    description: "Le toucher velouté du tissu bordeaux noble combiné à un anneau poignée en laiton doré massif. Le parfait compagnon des mariages caribéens et réceptions privées.",
    material: "Velours de soie et coton épais, poignée or massif anodisé, chaîne crossbody détachable.",
    dimensions: "23 cm x 16 cm x 4 cm",
    origin: "Atelier Maroquinerie Abèy",
    inStock: true
  },
  {
    id: 'prestige-jewelry-vault',
    name: 'Prestige 3-Tier Champagne Shimmer Case',
    subTitle: 'Coffret Coffre à Bijoux 3 Niveaux & Miroir',
    category: 'cases',
    price: 65,
    originalPrice: 80,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdTy4pHNfx7C6U-q1uJrEjBeiphAwyQgaHyI7qpxiLD-wU1EqyItyHejLACoKZp9eDEvVFLuEGAetQoEM_aw41_8TEl10DVopb3vm8IO4gszTw0_5D7hDqJYCK5f2jJ0uMqOTvJk3LB1Sdx_DDsHBP_RnwWgcVlt3lSofNWzhu_6NC1sMbyJ9haWPJyAcnDwYRu7Fxku-4N9EITtI20X6n7C1e83oP61iHrXJCba88RsVDqWjpUt_bczHKdVrNY5Ye5w',
    badge: 'Bestseller',
    tag: 'Jewelry Storage',
    description: "Écrin protecteur capitonné de suédine anti-ternissement. 3 tiroirs compartimentés avec rouleaux pour bagues, crochets anti-nœud pour colliers et casiers amovibles.",
    material: "Cuir végan texturé champagne miroitant, doublure en microfibre velours rose poudré, serrure bijou dorée.",
    dimensions: "24 cm x 18 cm x 14 cm",
    origin: "Atelier Présentoirs Abèy",
    inStock: true
  }
];

export const STYLING_TIPS = [
  {
    title: 'The Baroque Pearl Equation',
    description: 'Associez nos perles baroques organiques à une robe de cocktail fluide ou un tailleur en lin immaculé. Le contraste entre le lustre imparfait de la perle et la netteté du vêtement incarne le chic insulaire intemporel.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAD2fTunyPTJCCb8Zz9LnLdAOR2fzwdgIGEtuUQW6pk61dZfed8G8xKw7kC5mgEHTKqDlYZdHhIkcXH8_qWAdfzYGDhD3MCFpQOaVNtbYRiQaiJUum36IuhD5pLMwUQ30KJGJHUIYFDA41sdkI5hL9Hn94nDG-xwCRsk7idbJGoAfdB7xxaanx9Twc8lL54bJlTGNHlurPDWRE318DqujPLwCzplY-Lj07CANfvJMbz8umItil1ct9zPAWWJy4Ge_oorA'
  },
  {
    title: 'Molten Gold & Velvet Contrast',
    description: 'Une minaudière en métal martelé ou éventail cannelé rehausse instantanément un velours royal ou un tissu satiné noir. Portez-la à la main avec notre manchette Papillon pour une harmonie parfaite.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwVWrfxNz9dhPTYMStsKzGIAiZZBO1fOTadciREK6APpvCb0px7_Yl94LsfX6RCBO2zCHuauHYj3OKnoUOPv1CkCAtw3Eoa4Xnk0F__Nwp0B3f3y-Xi3vBUTfw7bV6Mtl9Dn5nSNDtIejPOdFQSh965L7hBa4AS2DIxye0QR72P_qIQkItIh4Iea34skZbNtYg2yYoiP2GYXdxOYoc-0Jg3kZy60YHZtmZrXMdNt0qQ5kEiTN-aJrCVB5s_kSHeRb1WQ'
  },
  {
    title: 'Boutique Packaging & Unboxing',
    description: 'Chaque création Abèy est livrée dans notre boîte écrin signature noire gaufrée au fer doré, accompagnée de son pochon de voyage en satin de soie et d\'un certificat d\'authenticité.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3NMl18icZgBjjG_177QjHPLin753uKiSLsb1c6FGk2cwcziTjK5d-9UAmcwkgpriGQnwslPRplkbz-KpvQmkvTPB3wC-N29w4Ob38DkKPGbUUfd53c2hV6g8TbD-3ihNLpd2hayQR1EFFvEC51zzd7lgdQJ0pCdaJVjWFdQqV79GsCKdvhsh34e6KIHDqY4vSUgUvXcDc2JjAOh6dBU12KyFkNPdq8KFs-VQf1QRdYjfzrGvOXRTET9kDL3xHtCVeEg'
  }
];

export const CLIENT_REVIEWS = [
  {
    name: 'Marie-Carmel V.',
    city: 'Montréal, Canada',
    text: "La parure L'Impératrice portée au gala caribéen a fait sensation toute la soirée ! La qualité du placage et l'éclat des pierres sont dignes de la place Vendôme. Livraison rapide et emballage raffiné.",
    rating: 5,
    product: "L'Impératrice Crystal Set"
  },
  {
    name: 'Vanessa D.',
    city: 'Pétion-Ville, Haïti',
    text: "J'ai commandé sur WhatsApp en 2 minutes et j'ai été livrée le lendemain au showroom. Les boucles Reine Soleil sont légères comme une plume et illuminent le visage. Bravo Abèy !",
    rating: 5,
    product: 'Reine Soleil Floral Earrings'
  },
  {
    name: 'Nathalie B.',
    city: 'Miami, FL',
    text: "La minaudière Coquille Dorée est sublime. La finition or brossé a beaucoup de caractère, rien à voir avec les sacs industriels. Je recommanderai pour le prochain mariage !",
    rating: 5,
    product: 'Coquille Dorée Fan Minaudière'
  }
];

export const CURRENCIES: Record<Currency, { symbol: string; rate: number; label: string }> = {
  USD: { symbol: '$', rate: 1, label: 'USD ($)' },
  HTG: { symbol: 'G', rate: 132, label: 'Gourdes (HTG)' },
  CAD: { symbol: 'CA$', rate: 1.38, label: 'CAD ($)' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)' }
};
