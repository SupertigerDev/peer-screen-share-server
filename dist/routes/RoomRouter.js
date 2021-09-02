"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomRouter = void 0;
var express_1 = require("express");
var RoomRouter = /** @class */ (function () {
    function RoomRouter() {
        this.router = express_1.Router();
    }
    RoomRouter.prototype.createRoom = function (req, res, next) {
        console.log("CreateRoom");
        console.log(req.body);
        // rooms.add()
    };
    RoomRouter.prototype.init = function () {
        this.router.post("/", this.createRoom);
    };
    return RoomRouter;
}());
exports.RoomRouter = RoomRouter;
var roomRoutes = new RoomRouter();
roomRoutes.init();
exports.default = roomRoutes.router;
