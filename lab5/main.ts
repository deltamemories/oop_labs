import * as fs from 'fs';


class User {
    id: number;
    name: string;
    login: string;
    private password: string;
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
        this.password = password;
        this.email = email;
        this.address = address;
    }

    public getPassword() {
        return this.password;
    }

    public setPassword(password: string) {
        this.password = password;
    }

    public static compareByName(a: User, b: User):number {
        if (a.name < b.name) return -1;
        else if (a.name > b.name) return 1;
        else return 0;
    }

    public toString(): string {
        return `${this.id} ${this.name} ${this.login} *** ${this.email} ${this.address}`;
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
    filepath: string;
    protected items: T[] = [];

    constructor(filepath: string) {
        this.filepath = filepath;
        this.loadJson();
    }

    private loadJson() {
        try {
            const file = fs.readFileSync(this.filepath, 'utf8');
            const parsedJson = JSON.parse(file);
            if (Array.isArray(parsedJson)) {
                this.items = parsedJson;
            } else {
                this.items = [];
            }
        } catch (error) {
            this.items = [];
        }
    }

    private saveJson() {
        try {
            const json = JSON.stringify(this.items);
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

    delete(item: T) {
        const index = this.getIndexById(item.id);
        if (index !== undefined) {
            this.items.splice(index, 1);
            this.saveJson();
        }
    }
}


class UserRepository extends DataRepository<User> implements IUserRepository {
    getByLogin(login: string): User | undefined {
        for (const item of this.items) {
            if (item.login === login) {
                return item;
            }
        }
        return undefined;
    }
}
