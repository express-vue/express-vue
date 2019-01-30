import { createApp } from "./app"
        const store = window.__INITIAL_STATE__;
        const { app } = createApp(store ? store : {});
        app.$mount("#app")