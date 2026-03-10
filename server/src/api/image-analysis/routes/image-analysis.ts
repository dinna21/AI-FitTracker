export default {
    routes: [
        {
            method: 'POST',
            path: '/image-analysis',
            handler: 'api::image-analysis.image-analysis.analyze',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};