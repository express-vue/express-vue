import test from 'ava';
import {renderVueMixins} from '../../lib/utils';

test('it should render global mixins', t => {
    var mixin = {
        created: function () {
            var myOption = this.$options.myOption
            if (myOption) {
                console.log(myOption);
            }
        }
    }
    const mixinString = renderVueMixins([mixin]);
    const hasMixinString = mixinString.includes('Vue.mixin');

    t.is(hasMixinString, true);
})
