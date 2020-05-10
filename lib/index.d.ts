import * as express from 'express';

interface VueOptionsType {
    title?: String,
    head?: {
        scripts: Object[],
        metas: Object[],
        styles: Object[]
    }
    template?: Object
}

declare function init(options?: VueOptionsType): Function;

declare function use(expressApp : express.Express, options?: VueOptionsType): Promise<express.Express>;

export {
    init,
    use,
};
