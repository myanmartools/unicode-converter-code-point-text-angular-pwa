import { AppConfig } from './app-config';

export const appSettings: AppConfig = {
    appVersion: '2.2.2',
    appName: 'Unicode Code Point Lookup',
    appDescription:
        'Unicode Code Point Lookup is a Unicode encode decode online tool to convert Unicode codepoint numbers to text and vice versa by DagonMetric Myanmar Tools.',
    baseUrl: 'https://unicode-code-point-lookup.myanmartools.org/',
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
            url: 'https://github.com/myanmartools/unicode-code-point-lookup-pwa',
            label: 'GitHub',
            title: 'Get source code on GitHub',
            iconName: 'logo-github',
            expanded: true
        }
    ]
};
