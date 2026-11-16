export interface rootObject {
    signUptypes: signuptypes;
    logintypes: logintypes;
}



export interface signuptypes {
    fullName: String;
    email: String;
    password: String;
}

export interface logintypes {
    user: {
        id: string;
        name: string;
        email: string;
    };
    token: string;
}

export interface loginPayload {
    email: string;
    password: string;
}


export interface logouttypes {
    status: string;
    message: string;
}


