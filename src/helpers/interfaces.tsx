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

export interface Categories {
    id: number;
    name: string;
    name_pl: string;
}

export interface Sessions {
    id: number;
    name: string;
    name_pl: string;
    date_taken: string;
}