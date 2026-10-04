DELETE FROM commercial_markets;

INSERT INTO commercial_markets (
    market_id,
    period,
    property_type,
    asking_rent,
    effective_rent,
    vacancy_rate,
    availability_rate,
    absorption,
    cap_rate,
    inventory_sqft,
    ti_allowance
)
VALUES

((SELECT id FROM markets WHERE city = 'Toronto'), '2026-09-01', 'Office',
39.20, 31.40, 17.8, 19.6, -421000, 6.1, 189000000, 85),

((SELECT id FROM markets WHERE city = 'Vancouver'), '2026-09-01', 'Office',
42.80, 35.20, 12.4, 14.1, 142000, 5.7, 69000000, 78),

((SELECT id FROM markets WHERE city = 'Calgary'), '2026-09-01', 'Office',
27.50, 22.40, 21.6, 24.2, 285000, 7.1, 74000000, 65),

((SELECT id FROM markets WHERE city = 'New York'), '2026-09-01', 'Office',
78.50, 64.20, 16.2, 18.8, -1180000, 6.3, 470000000, 145),

((SELECT id FROM markets WHERE city = 'Chicago'), '2026-09-01', 'Office',
41.80, 33.60, 22.4, 25.1, -590000, 7.4, 145000000, 95),

((SELECT id FROM markets WHERE city = 'Miami'), '2026-09-01', 'Office',
55.40, 46.80, 13.7, 15.4, 360000, 6.6, 58000000, 88),


((SELECT id FROM markets WHERE city = 'Toronto'), '2026-09-01', 'Retail',
46.50, 40.20, 6.4, 7.1, 225000, 5.9, 123000000, 55),

((SELECT id FROM markets WHERE city = 'Vancouver'), '2026-09-01', 'Retail',
52.40, 45.10, 4.9, 5.8, 115000, 5.5, 71000000, 60),

((SELECT id FROM markets WHERE city = 'Chicago'), '2026-09-01', 'Retail',
34.80, 29.60, 7.2, 8.4, 198000, 6.8, 122000000, 48),

((SELECT id FROM markets WHERE city = 'Miami'), '2026-09-01', 'Retail',
43.70, 37.90, 5.8, 6.6, 312000, 6.2, 88000000, 52),


((SELECT id FROM markets WHERE city = 'Toronto'), '2026-09-01', 'Industrial',
18.90, 17.60, 3.1, 4.0, 780000, 5.3, 940000000, 18),

((SELECT id FROM markets WHERE city = 'Calgary'), '2026-09-01', 'Industrial',
15.80, 14.90, 4.4, 5.2, 890000, 6.1, 260000000, 16),

((SELECT id FROM markets WHERE city = 'Chicago'), '2026-09-01', 'Industrial',
12.90, 12.20, 5.1, 6.0, 1800000, 6.4, 1300000000, 14),

((SELECT id FROM markets WHERE city = 'Austin'), '2026-09-01', 'Industrial',
13.70, 12.80, 8.3, 9.2, 540000, 6.6, 245000000, 15),


((SELECT id FROM markets WHERE city = 'Toronto'), '2026-09-01', 'Multifamily',
32.40, 31.10, 2.6, 3.1, 690000, 4.7, 215000000, 0),

((SELECT id FROM markets WHERE city = 'Vancouver'), '2026-09-01', 'Multifamily',
36.20, 34.80, 1.9, 2.5, 510000, 4.3, 128000000, 0),

((SELECT id FROM markets WHERE city = 'New York'), '2026-09-01', 'Multifamily',
48.50, 46.30, 3.4, 4.0, 1250000, 5.1, 610000000, 0),

((SELECT id FROM markets WHERE city = 'Chicago'), '2026-09-01', 'Multifamily',
29.80, 28.70, 5.2, 6.1, 720000, 5.8, 280000000, 0);