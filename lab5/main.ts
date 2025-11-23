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

}


interface IDataRepository<T extends {id: number}>{
    getAll(): T[];

    getById(id: number): T | undefined;

    add (item: T): void;

    update(item: T): void;

    delete(item: T): void;
}

interface IUserRepository {
    getByLogin(login: string): User | undefined;
}

interface IAuthService {
    signIn(user: User): void;

    signOut(user: User): void;

    isAuthorized(): boolean;

    currentUser(): User;
}
