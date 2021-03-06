import {ReactNode} from "react";

export interface IProviderProps
{
    children?: ReactNode;
}

export interface IUser
{
    uid?: string;
    username?: string;

    [key: string]: any;
}

export interface IUserContext extends IUser
{
    isLoaded: boolean;
}
