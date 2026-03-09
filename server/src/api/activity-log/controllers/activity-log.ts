/**
 * activity-log controller
 */

import { factories } from '@strapi/strapi';

type PopulatedActivityLog = {
    id: number;
    users_permissions_user?: { id: number } | null;
};

export default factories.createCoreController('api::activity-log.activity-log', ({strapi}) => ({
    async create(ctx) {
        const user = ctx.state.user;

        if(!user) {
            return ctx.unauthorized('You must be logged in to log an activity');
        }

        const body = ctx.request.body.data;
        body.users_permissions_user = user.id;

        const entry = await strapi.entityService.create('api::activity-log.activity-log', {
            data: body,
            populate: ['users_permissions_user']
        });
        
        return entry;
    },

    async find(ctx) {
        const user = ctx.state.user;

        if(!user) {
            return ctx.unauthorized('You must be logged in to view activity logs');
        }

        const entries = await strapi.entityService.findMany('api::activity-log.activity-log', {
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
            return ctx.unauthorized('You must be logged in to view activity logs');
        }

        const entry = await strapi.entityService.findOne('api::activity-log.activity-log', id, {
            populate: ['users_permissions_user']
        }) as PopulatedActivityLog | null;

        if(!entry) {
            return ctx.notFound('Activity log entry not found');
        }

        if(entry.users_permissions_user?.id !== user.id) {
            return ctx.unauthorized('You can only view your own activity logs');
        }

        return entry;
    }
}));
