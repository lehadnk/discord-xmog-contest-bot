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
  await db.addColumn('votes', 'voter_discord_name', 'string');
};

exports.down = function(db) {
  db.removeColumn('votes');
};

exports._meta = {
  "version": 2
};
