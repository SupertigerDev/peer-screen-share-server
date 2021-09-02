import FlakeId from '@brecert/flakeid'
const flake = new FlakeId();

interface Room {
    id?: string;
    name: string;
    users?: Array<string>;
}
export class RoomDatabase {
    roomObj: {[key: string]: Room};
    constructor() {
        this.roomObj = {}
    }
    add(room: Room) {
        const id = flake.gen().toString();
        this.roomObj[id] = {...room, id};
    }
}
const rooms = new RoomDatabase();
export default rooms;