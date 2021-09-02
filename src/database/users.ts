import FlakeId from '@brecert/flakeid'
const flake = new FlakeId();

export interface User {
    id: string;
    name: string;
}
export class UserDatabase {
    userObj: {[key: string]: User};
    constructor() {
        this.userObj = {}
    }
    add(user: Partial<User> ) {
        const id = flake.gen().toString();
        this.userObj[id] = {...user, id} as any;
        return this.userObj[id];
    }
    get(id: string) {
        return this.userObj[id];
    }
}
const users = new UserDatabase();
export default users;