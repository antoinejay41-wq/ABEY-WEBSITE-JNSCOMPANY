# Security Specification & Test Matrix for Maison Abèy Storefront

## 1. Data Invariants
- Products, Categories, and SiteContent can be read by public visitors, but only authenticated administrators can create, update, or delete them.
- Orders can be placed by customers with validated fields (reference, token, customerName, customerWhatsApp, total > 0).
- Order inspection (`get`) requires either administrative privileges or valid reference/token access.
- Admins collection can only be read and written by verified admin users (`antoinejay41@gmail.com` or registered admin document).
- Global catch-all explicitly denies any undocumented paths.

## 2. The "Dirty Dozen" Payloads (Must Return PERMISSION_DENIED)
1. Anonymous write to `/products/p1` without admin authentication.
2. Anonymous update of product prices.
3. Order creation with negative total amount (`total: -50`).
4. Order creation with 10MB malicious buffer payload exceeding boundary sizes.
5. Unauthenticated read of administrative users collection `/admins/admin1`.
6. Non-admin user granting themselves admin role in `/admins/{uid}`.
7. Modifying order status from anonymous client without admin credentials.
8. Deleting order records without admin privileges.
9. Injecting ID with malicious path traversal `/products/..%2F..%2Fhack`.
10. Modifying immutable `createdAt` timestamp on an existing order.
11. Blanket scraping of private customer contact numbers in `/orders` without admin authentication.
12. Attempting to override store announcement ticker without admin verification.
