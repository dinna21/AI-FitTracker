import { analyzeFood } from '../services/gemini';

export default {
    async analyze(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized('You must be logged in to use image analysis');
        }

        try {
            const { imageBase64, mimeType } = ctx.request.body as { imageBase64?: string; mimeType?: string };

            if (!imageBase64) {
                return ctx.badRequest('imageBase64 is required');
            }

            const result = await analyzeFood(imageBase64, mimeType ?? 'image/jpeg');
            return ctx.send({ result });
        } catch (err) {
            strapi.log.error('Gemini analysis failed:', err);
            return ctx.internalServerError('Image analysis failed');
        }
    },
};