// @flow
import Types from './types';

const types = new Types();

class DataObject {
    data: Object;
    constructor(componentData: Object, defaultData: Object, type: Types) {
        switch (type) {
        case types.COMPONENT:
            this.data = Object.assign({}, componentData, defaultData);
            break;
        case types.SUBCOMPONENT:
            this.data = componentData;
            break;
        }
    }
}

export default DataObject;
