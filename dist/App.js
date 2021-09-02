"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var RoomRouter_1 = __importDefault(require("./routes/RoomRouter"));
var App = /** @class */ (function () {
    function App() {
        this.express = express_1.default();
        this.server = new http_1.default.Server(this.express);
        this.routes();
    }
    App.prototype.routes = function () {
        this.express.use("/api/rooms", RoomRouter_1.default);
    };
    return App;
}());
exports.App = App;
var app = new App();
exports.default = app;
