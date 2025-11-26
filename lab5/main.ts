import * as fs from 'fs';
import * as path from 'path'

class User {
    id: number;
    name: string;
    login: string;
    #password: string;
    email: string | undefined;
    address: string | undefined;

    constructor(
        id: number,
        name: string,
        login: string,
        password: string,
        email?: string,
        address?: string,
    ) {
        this.id = id;
        this.name = name;
        this.login = login;
        this.#password = password;
        this.email = email;
        this.address = address;
    }

    public get password(): string {
        return this.#password;
    }

    public set password(password: string) {
        this.#password = password;
    }

    public static compareByName(a: User, b: User): number {
        if (a.name < b.name) return -1;
        else if (a.name > b.name) return 1;
        else return 0;
    }

     toJSON() {
        return {
            id: this.id,
            name: this.name,
            login: this.login,
            password: this.password,
            email: this.email,
            address: this.address,
        }
    }

    toString(): string {
        return `${this.id} ${this.name} ${this.login} ${this.email} ${this.address}`;
    }
}


interface IDataRepository<T extends {id: number}>{
    getAll(): T[];

    getById(id: number): T | undefined;

    add (item: T): void;

    update(item: T): void;

    delete(item: T): void;
}


interface IUserRepository extends IDataRepository<User> {
    getByLogin(login: string): User | undefined;
}


interface IAuthService {
    signIn(user: User): void;

    signOut(user: User): void;

    isAuthorized(): boolean;

    currentUser(): User | undefined;
}


class DataRepository <T extends {id: number}> implements IDataRepository<T>{
    private readonly filepath: string;
    protected items: T[] = [];
    private readonly converter: ((obj: any) => T) | undefined;

    constructor(filepath: string, converter?: (obj: any) => T) {
        this.filepath = filepath;
        this.converter = converter;
        this.loadJson();
    }

    private loadJson(): void {
        try {
            const file = fs.readFileSync(this.filepath, 'utf8');
            const parsedJson = JSON.parse(file);
            if (Array.isArray(parsedJson)) {
                if (this.converter) {
                    this.items = parsedJson.map(item => this.converter!(item));
                } else {
                    this.items = parsedJson;
                }
            } else {
                this.items = [];
            }
        } catch (error) {
            this.items = [];
        }
    }

    private saveJson(): void {
        try {
            const json = JSON.stringify(this.items);
            fs.mkdirSync(path.dirname(this.filepath), {recursive: true});
            fs.writeFileSync(this.filepath, json, 'utf8');
        } catch (error) {
            throw error;
        }
    }

    getAll(): T[] {
        return this.items;
    }

    private getIndexById(id: number): number | undefined {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i]!.id === id) return i;
        }
        return undefined;
    }

    getById(id: number): T | undefined {
        const index = this.getIndexById(id);
        if (index === undefined) return undefined;
        else return this.items[index];
    }

    add (item: T): void {
        if (this.getById(item.id) === undefined) {
            this.items.push(item);
            this.saveJson();
        } else {
            throw new Error("Item already exists");
        }
    }

    update(item: T): void {
        const index = this.getIndexById(item.id)
        if (index !== undefined) {
            this.items[index] = item;
            this.saveJson();
        } else {
            throw new Error("Item is not exist");
        }
    }

    delete(item: T): void {
        const index = this.getIndexById(item.id);
        if (index !== undefined) {
            this.items.splice(index, 1);
            this.saveJson();
        }
    }
}


class UserRepository extends DataRepository<User> implements IUserRepository {
    constructor(filepath: string) {
        super(filepath, (obj: any) => {
            return new User(
                obj.id,
                obj.name,
                obj.login,
                obj.password,
                obj.email,
                obj.address,
            );
        });
    }

    getByLogin(login: string): User | undefined {
        for (const item of this.items) {
            if (item.login === login) {
                return item;
            }
        }
        return undefined;
    }
}


class AuthService implements IAuthService {
    private userRepository: IUserRepository;
    private readonly sessionFilepath: string;
    private _currentUser: User | undefined;

    constructor(userRepository: IUserRepository, sessionFilepath: string) {
        this.userRepository = userRepository;
        this.sessionFilepath = sessionFilepath;
        this.restoreSession();
    }

    private restoreSession(): void {
        try {
            const sessionFile = fs.readFileSync(this.sessionFilepath, 'utf8');
            const sessionId = JSON.parse(sessionFile);
            if (typeof sessionId === 'number' && Number.isInteger(sessionId)) {
                const user = this.userRepository.getById(sessionId)
                if (user !== undefined) {
                    this._currentUser = user;
                }
            }
        } catch (error) {
            // nothing
        }
    }

    private saveSession(user: User | undefined): void {
        try {
            let data: number | string;
            if (user !== undefined) {
                data = user.id
            } else {
                data = "";
            }
            fs.mkdirSync(path.dirname(this.sessionFilepath), {recursive: true});
            fs.writeFileSync(this.sessionFilepath, JSON.stringify(data));
        } catch (error) {
            throw error;
        }
    }

    public signIn(user: User): void {
        const id = user.id
        const userFromRepository = this.userRepository.getById(id)
        if (userFromRepository !== undefined) {
            if (userFromRepository.password === user.password) {
                this._currentUser = user;
                this.saveSession(user)
            }
        }
    }

    public signOut(user: User): void {
        if (this._currentUser !== undefined && this._currentUser.id === user.id) {
            this._currentUser = undefined;
            this.saveSession(undefined)
        }
    }

    public isAuthorized(): boolean {
        return this._currentUser !== undefined;
    }

    public currentUser(): User | undefined {
        return this._currentUser;
    }
}




const userRep = new UserRepository('./data/db.json')
const authServ = new AuthService(userRep, './data/auth.json')


userRep.add(new User(1, 'Jessy', 'aboba', '123', 'jessy@gmail.com', 'moon'))
userRep.add(new User(2, 'Ferb', 'fff', '001', 'ferb@gmail.com', 'sun'))

console.log("=================== GET ALL")
console.log(userRep.getAll())
console.log("===================")

console.log("=================== UPDATE")
console.log(userRep.getById(1))
userRep.update(new User(1, 'Jessy', 'llll', '123', 'jessy@gmail.com', 'moon'))
console.log(userRep.getById(1))
console.log("===================")

console.log("=================== GET BY LOGIN")
console.log(userRep.getByLogin('fff'))
console.log("===================")

console.log("=================== COMPARE BY NAME")
let users = userRep.getAll();
users = users.sort(User.compareByName)
console.log(users);
console.log("===================")


console.log("=================== SIGN IN login: fff")
authServ.signIn(userRep.getByLogin('fff')!)
console.log(authServ.isAuthorized())
console.log(authServ.currentUser())
console.log("===================")

// SIGN OUT
authServ.signOut(userRep.getByLogin('fff')!)
authServ.isAuthorized()

// SIGN IN login: llll"
authServ.signIn(userRep.getByLogin('llll')!)

// SHUT DOWN

// console.log("=================== RESTORE SESSION")
// console.log(authServ.currentUser())
// console.log("===================")
