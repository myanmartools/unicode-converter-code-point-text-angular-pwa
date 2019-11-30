import { AppConfig } from './shared/app-config';

export const appSettings: { app: AppConfig } = {
    app: {
        appVersion: 'dev',
        releaseDateUtc: '2019-11-29T07:30:00Z',
        appName: 'Unicode Code Points Lookup',
        appDescription: 'Unicode Code Points Lookup is a Unicode encode decode online tool to convert UTF-32/UTF-16/UTF-8/hex numbers codepoint sequences to text and vice versa created by DagonMetric Myanmar Tools team.',
        baseUrl: 'https://unicode-code-points-lookup.myanmartools.org/',
        navLinks: [
            {
                url: 'https://myanmartools.org',
                label: 'Myanmar Tools',
                title: 'Visit Myanmar Tools website',
                iconName: 'logo-myanmartools',
                expanded: true
            },
            {
                url: 'https://www.facebook.com/DagonMetric',
                label: 'Facebook',
                title: 'Follow us on Facebook',
                iconName: 'logo-facebook'
            },
            {
                url: 'https://www.youtube.com/channel/UCbJLAOU-kG6vkBOU1TSM5Cw',
                label: 'YouTube',
                title: 'Subscribe us on YouTube',
                iconName: 'logo-youtube'
            },
            {
                url: 'https://twitter.com/myanmartools',
                label: 'Twitter',
                title: 'Follow us on Twitter',
                iconName: 'logo-twitter'
            },
            {
                url: 'https://medium.com/myanmartools',
                label: 'Medium',
                title: 'Follow us on Medium',
                iconName: 'logo-medium'
            },
            {
                url: 'https://github.com/myanmartools/unicode-code-points-lookup-web',
                label: 'GitHub',
                title: 'Get source code on GitHub',
                iconName: 'logo-github',
                expanded: true
            }
        ]
    }
};
