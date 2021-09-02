"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomDatabase = void 0;
var flakeid_1 = __importDefault(require("@brecert/flakeid"));
var flake = new flakeid_1.default();
var RoomDatabase = /** @class */ (function () {
    function RoomDatabase() {
        this.roomObj = {};
    }
    RoomDatabase.prototype.add = function (room) {
        var id = flake.gen().toString();
        this.roomObj[id] = __assign(__assign({}, room), { id: id });
    };
    return RoomDatabase;
}());
exports.RoomDatabase = RoomDatabase;
var rooms = new RoomDatabase();
exports.default = rooms;
