export const HOME = "home";
export const CATALOG = "catalog";
export const ABOUT = "about";
export const ACCOUNT = "account";
export const LOGIN = "login";
export const LOGOUT = "logout";
export const DASHBOARD = "dashboard";
export const TRANSACTION_SELLING = "selling";
export const TRANSACTION_PURCHASING = "purchasing";
export const SUPPLIERLIST = "supplierlist";
export const MANAGEMENT = "management";
export const CHATROOM = "chatroom";
export const CART = "cart";

export const menus = [
    {
        code: HOME,
        name: "Home",
        url: "/home",
        menuClass: "fa fa-home",
        active: false,
        authenticated: false
    },
    {
        code: CATALOG,
        name: "Catalog",
        url: "/catalog",
        menuClass: "fa fa-store-alt",
        active: false,
        authenticated: false
    },
    
    {
        code: SUPPLIERLIST,
        name: "Our Supplier",
        url: "/suppliers",
        menuClass: "fas fa-warehouse",
        active: false,
        authenticated: false
    },
    {
        code: CHATROOM,
        name: "Chat Room",
        url: "/chatroom",
        menuClass: "fas fa-comments",
        active: false,
        authenticated: false
    },
    {
        code: CART,
        name: "My Cart",
        url: "/cart",
        menuClass: "fa fa-shopping-cart",
        active: false,
        authenticated: false
    },
    {
        code: LOGIN,
        name: "Login",
        url: "/login",
        menuClass: "fas fa-sign-in-alt",
        active: false,
        authenticated: false
    },
    {
        code: DASHBOARD,
        name: "Dashboard",
        url: "/dashboard",
        menuClass: "fas fa-tachometer-alt",
        active: false,
        authenticated: true
    },
    {
        code: TRANSACTION_SELLING,
        name: "Selling",
        url: "/transaction/selling",
        menuClass: "fas fa-cash-register",
        active: false,
        authenticated: true
    },
    {
        code: TRANSACTION_PURCHASING,
        name: "Purchasing",
        url: "/transaction/purchasing",
        menuClass: "fas fa-truck-loading",
        active: false,
        authenticated: true
    },
    {
        code: MANAGEMENT,
        name: "Management",
        url: "/management",
        menuClass: "fa fa-database",
        active: false,
        authenticated: true
    },
    {
        code: ABOUT,
        name: "About",
        url: "/about",
        menuClass: "fa fa-address-book",
        active: false,
        authenticated: false
    },
    {
        code: LOGOUT,
        name: "Logout",
        url: "#",
        menuClass: "fas fa-sign-out-alt",
        active: false,
        authenticated: true
    }
];
