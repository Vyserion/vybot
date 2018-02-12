"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
class Data {
    connect() {
        // This is pretty hacky, but as we're in control of the .env variables,
        // it doesn't matter.
        const port = process.env.POSTGRES_PORT;
        this.pool = new pg_1.Pool({
            user: process.env.POSTGRES_USER,
            host: process.env.POSTGRES_HOST,
            database: process.env.POSTGRES_DATABASE,
            password: process.env.POSTGRES_PASSWORD,
            port: port
        });
    }
    ;
    query() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.pool.query('SELECT NOW()');
            console.log(result.rows[0]);
        });
    }
    ;
}
exports.Data = Data;
;
//# sourceMappingURL=data.js.map