'use strict';

let dbm;
let type;
let seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function(db) {
  await db.createTable('votes', {
    id: { type: 'int', primaryKey: true, autoIncrement: true},
    participant_id: 'int',
    voter_discord_id: 'string',
  });

  db.addIndex('votes', 'unique_voter_and_participant', ['participant_id', 'voter_discord_id'], true);
};

exports.down = function(db) {
  return db.dropTable('votes');
};

exports._meta = {
  "version": 1
};
