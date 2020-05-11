import * as express from 'express';

interface VueOptionsType {
    pagesPath: string;
    head?: {
        title?: string;
        scripts?: { src: string; charset?: string }[];
        metas?: any[];
        styles?: { style: string; type?: string }[];
        structuredData: any;
    };
    template?: {
        html?: { start: string; end: string };
        body?: { start: string; end: string };
        template?: { start: string; end: string };
    };
    data?: any;
    webpack?: any;
    vue?: any
    baseUrl?: string
}

interface VueResponse extends express.Response {
    renderVue(view: string, data?: object, callback?: (err: Error, html: string) => void): void;
    renderVue(view: string, callback?: (err: Error, html: string) => void): void;
}

declare function init(options?: VueOptionsType): Function;

declare function use(expressApp : express.Express, options?: VueOptionsType): Promise<express.Express>;

export {
    init,
    use,
    VueOptionsType,
    VueResponse
};
