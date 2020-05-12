import * as express from 'express';
import * as http from 'http';

interface VueOptions {
    pagesPath: string;
    head?: {
        title?: string;
        scripts?: {
            src?: string;
            charset?: string;
            srcContents?: string;
            type?: string;
            async?: boolean;
            defer?: boolean;
        }[];
        metas?: any[];
        styles?: { style?: string; src?: string; type?: string }[];
        structuredData?: any;
    };
    template?: {
        html?: { start: string; end: string };
        body?: { start: string; end: string };
        template?: { start: string; end: string };
    };
    data?: any;
    webpack?: any;
    vue?: { app: any; server: any; client: any };
    baseUrl?: string;
}

type ResponseVueOptions = Pick<VueOptions, 'head' | 'data' | 'template'>;

declare module 'express-serve-static-core' {
    interface Response<ResBody = any> extends http.ServerResponse, Express.Response {
      renderVue(view: string, data: ResBody, vueOptions?: ResponseVueOptions): void;
    }
}

declare function init(options?: VueOptions): Function;

declare function use(expressApp : express.Express, options?: VueOptions): Promise<express.Express>;

export {
    init,
    use,
    VueOptions,
    ResponseVueOptions
};