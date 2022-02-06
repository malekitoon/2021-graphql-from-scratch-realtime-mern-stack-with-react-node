const { gql } = require('apollo-server-express');

const me = () => 'Malekitoon';

module.exports = {
  Query: {
    me,
  },
};
