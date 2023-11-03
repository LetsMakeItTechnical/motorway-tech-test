exports.up = (pgm) => {
  pgm.createTable('vehicles', {
    id: { type: 'integer', primaryKey: true, notNull: true },
    make: { type: 'text', notNull: true },
    model: { type: 'text', notNull: true },
    state: { type: 'text', notNull: true }
  }, { ifNotExists: true });

  // Seed Vehicles Data
  pgm.sql(`
      INSERT INTO "vehicles" (id, make, model, state) VALUES
      (1, 'BMW', 'X1', 'quoted'),
      (2, 'AUDI', 'A4', 'selling'),
      (3, 'VW', 'GOLF', 'sold');
    `);

  pgm.createTable('stateLogs', {
    vehicleId: {
      type: 'integer',
      notNull: true,
      references: '"vehicles"',
      onDelete: 'cascade'
    },
    state: { type: 'text', notNull: true },
    timestamp: { type: 'timestamp with time zone', notNull: true }
  }, { ifNotExists: true });


  // Seed StateLogs Data
  pgm.sql(`
      INSERT INTO "stateLogs" ("vehicleId", "state", "timestamp") VALUES
      (1, 'quoted', '2022-09-10 10:23:54+00'),
      (2, 'quoted', '2022-09-10 14:59:01+00'),
      (2, 'selling', '2022-09-11 17:03:17+00'),
      (3, 'quoted', '2022-09-11 09:11:45+00'),
      (3, 'selling', '2022-09-11 23:21:38+00'),
      (3, 'sold', '2022-09-12 12:41:41+00');
    `);
};
