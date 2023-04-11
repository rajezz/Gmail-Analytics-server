
export interface UserDocument {
    name: string;
    email: string;
    picture?: string;
    googleId: string;
    refreshToken: string;
    scopePref: string;
}
