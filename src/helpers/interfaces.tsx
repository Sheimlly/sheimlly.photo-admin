export interface Photos {
    id: number;
    name: string;
    session_name?: string;
    session_name_pl?: string;
    session: number;
    image: string;
    category_name: string;
    category_name_pl: string;
    category: number;
    date_created: string;
    date_uploaded: string;
    main_page: string;
}

export interface PhotoFilters {
    search: string | undefined,
    category: number | undefined,
    session: string | undefined,
    main_page: boolean | undefined
}

export interface PhotoAdd {
    image: File | undefined,
    category: number | undefined,
    session: string | undefined,
    date_created: string | undefined,
    main_page: boolean | undefined
}

export interface Categories {
    id: number;
    name: string;
    name_pl: string;
    able_to_delete?: boolean;
}

export interface CategoryAdd {
    name: string | undefined;
    name_pl: string | undefined;
}

export interface Sessions {
    id: number;
    name: string;
    name_pl: string;
    date_taken: string;
    image?: string;
}

export interface SessionAdd {
    name: string | undefined;
    name_pl: string | undefined;
    date_taken: string | undefined;
}

export interface UserInfo {
    id: number | undefined;
    email: string;
    phone_number: number;
}

export interface SocialMedia {
    id: number;
    name: string;
    username: string;
    link: string;
}