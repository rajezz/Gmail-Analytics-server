export const encodeAPIKEY = (data: string) => {
    return Buffer.from(data).toString("base64");
};
export const decodeAPIKEY = (key: string) => {
    return Buffer.from(key, "base64").toString("ascii");
};

export const validateAPIKEY = (key: string, email: string, googleId: string) => {
    return decodeAPIKEY(key) === `${email}:${googleId}`;
};

export const generateAPIKEY = (email: string, googleId: string) => {
    return encodeAPIKEY(`${email}:${googleId}`);
};
