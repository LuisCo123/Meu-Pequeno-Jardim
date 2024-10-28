export const AuthService = {
    async authUser():Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            resolve(true);
        });
    }
}