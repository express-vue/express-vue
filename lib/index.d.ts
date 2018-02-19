
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

export {
    init
};
