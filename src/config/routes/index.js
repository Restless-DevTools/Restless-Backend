import express from 'express';
import GroupsRoutes from './GroupsRoutes';
import AuthRoutes from './AuthRoutes';
import TeamsRoutes from './TeamsRoutes';
import UsersRoutes from './UsersRoutes';
import CollectionsRoutes from './CollectionsRoutes';
import SnippetsRoutes from './SnippetsRoutes';

const router = express();

// group routes
router.route(GroupsRoutes(router));

// team routes
router.route(TeamsRoutes(router));

// user routes
router.route(UsersRoutes(router));

// collection routes
router.route(CollectionsRoutes(router));

// auth routes
router.route(AuthRoutes(router));

// snippet routes
router.route(SnippetsRoutes(router));

export default router;
