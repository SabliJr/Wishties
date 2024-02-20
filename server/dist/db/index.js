"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = exports.query = void 0;
const pg_1 = require("pg");
const index_1 = require("../constants/index");
const pool = new pg_1.Pool({
    user: index_1.DATABASE_USER,
    host: index_1.DATABASE_HOST,
    port: 5432,
    password: index_1.DATABASE_PASSWORD,
    database: index_1.DATABASE_NAME,
});
exports.pool = pool;
const query = (text, params) => __awaiter(void 0, void 0, void 0, function* () {
    return yield pool.query(text, params);
});
exports.query = query;
