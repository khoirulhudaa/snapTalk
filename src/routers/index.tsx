import React, { lazy } from "react";

const Auth = lazy(() => import('../pages/auth'))
const Homepage = lazy(() => import('../pages/homepage'))
const Profile = lazy(() => import('../pages/profile'))
const ProfileGroup = lazy(() => import('../pages/profileGroup'))

interface routerProps {
    path: string,
    component: React.FC<{}>,
    exact: boolean
}

const Routers: routerProps[] = [
    {
        path: '/',
        component: Auth,
        exact: true
    },
    {
        path: '/chat',
        component: Homepage,
        exact: false
    },
    {
        path: '/profile/:number_telephone',
        component: Profile,
        exact: false
    },
    {
        path: '/profileGroup/:group_id',
        component: ProfileGroup,
        exact: false
    },
]

export default Routers

