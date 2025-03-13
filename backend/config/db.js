import knex from 'knex';
import { development } from './knex';

const db = knex(development);

export default db;
