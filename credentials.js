var credentials = {};
credentials['dev'] = {
  "user": "postgres:postgres",
  "host": "localhost",
  "port": 5432,
  "database": "gisdata"
};
credentials['live'] = {
  "user": "web_access_only_user:webreader1",
  "host": "localhost",
  "port": 6832,
  "database": "gisdata"
};

module.exports = credentials