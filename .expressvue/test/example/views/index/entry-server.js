import { createApp } from "./app"
        export default context => {
            return new Promise((resolve, reject) => {
                const { app } = createApp(context);

                resolve(app);
            });
        };