
export const MENUS = [
    {
        name: 'Umum',
        children: [
            {
                name: 'Home',
                link: '/home',
                iconClassName: 'fas fa-home',
            }, {
                name: 'Dashboard',
                link: '/dashboard',
                iconClassName: 'fas fa-tachometer-alt',
                authenticated: true,

            }, {
                name: 'Aduan',
                link: '/issues-public',
                iconClassName: 'fas fa-envelope-open-text',
                // authenticated: true,
            }]
    }, {
        name: 'Notulensi',
        children: [{
            name: 'List',
            link: '/meetingnote',
            authenticated: true,
            iconClassName: 'fas fa-list',
        }, {
            name: 'Tambah Notulensi',
            link: '/meetingnote/create',
            authenticated: true,
            iconClassName: 'fas fa-plus-square',
        }]
    }, {
        name: 'Aduan',
        children: [{
            name: 'List',
            link: '/issues',
            authenticated: true,
            iconClassName: 'fas fa-list',
        },
        {
            name: 'Tambah',
            link: '/issues/create',
            authenticated: true,
            iconClassName: 'fas fa-plus-square',
            role: 'admin'
        }]
    }, {
        name: 'Tema Pembahasan',
        children: [{
            name: 'List',
            link: '/discussiontopics',
            authenticated: true,
            iconClassName: 'fas fa-list',
        }]
    }, {
        name: 'Master Data',
        children: [
            {
                name: 'Menu',
                link: '/management',
                authenticated: true,
                role: 'admin',
                // iconClassName: 'fas fa-database'
            },
            {
                name: 'User',
                link: '/management/users',
                authenticated: true,
                role: 'admin',
                iconClassName: 'fas fa-users',
            }, {
                name: 'Bidang',
                link: '/management/departements',
                authenticated: true,
                role: 'admin',
                iconClassName: 'fas fa-object-group',
            }]
    }
]
