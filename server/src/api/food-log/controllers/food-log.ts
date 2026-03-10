/**
 * food-log controller
 */

import { factories } from '@strapi/strapi';

type PopulatedFoodLog = {
    id: number;
    users_permissions_user?: { id: number } | null;
};

export default factories.createCoreController('api::food-log.food-log', ({strapi}) => ({
    async create(ctx) {
        const user = ctx.state.user;

        if(!user) {
            return ctx.unauthorized('You must be logged in to log a food entry');
        }

        const body = ctx.request.body.data;
        body.users_permissions_user = user.id;

        const entry = await strapi.entityService.create('api::food-log.food-log', {
            data: body,
            populate: ['users_permissions_user']
        });

        return entry;
    },

    async find(ctx) {
        const user = ctx.state.user;

        if(!user) {
            return ctx.unauthorized('You must be logged in to view food logs');
        }

        const entries = await strapi.entityService.findMany('api::food-log.food-log', {
            filters: {
                users_permissions_user: user.id
            },
            populate: ['users_permissions_user']
        });

        return entries;
    },

    async findOne(ctx) {
        const user = ctx.state.user;
        const { id } = ctx.params;

        if(!user) {
            return ctx.unauthorized('You must be logged in to view food logs');
        }

        const entry = await strapi.entityService.findOne('api::food-log.food-log', id, {
            populate: ['users_permissions_user']
        }) as PopulatedFoodLog | null;

        if(!entry) {
            return ctx.notFound('Food log entry not found');
        }

        if(entry.users_permissions_user?.id !== user.id) {
            return ctx.unauthorized('You can only view your own food logs');
        }

        return entry;
    },

        async delete(ctx) {
        const user = ctx.state.user;
        const { id } = ctx.params;

        if(!user) {
            return ctx.unauthorized('You must be logged in to delete food logs');
        }

        const entry = await strapi.entityService.findOne('api::food-log.food-log', id, {
            populate: ['users_permissions_user']
        }) as PopulatedFoodLog | null;

        if(!entry) {
            return ctx.notFound('Food log entry not found');
        }

        if(entry.users_permissions_user?.id !== user.id) {
            return ctx.unauthorized('You can only delete your own food logs');
        }

        await strapi.entityService.delete('api::food-log.food-log', id);

        return { message: 'Food log entry deleted successfully' };
    }
}));
