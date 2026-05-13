import React from 'react';
import { AuthUI } from './Auth';
import { MarketplacePage } from './Marketplace';
import { SellerDashboardView } from './SellerDashboard';
import { BuyerDashboardView } from './BuyerDashboard';
import { AdminDashboardView } from './AdminDashboard';

export const SellerDashboard = SellerDashboardView;
export const BuyerDashboard = BuyerDashboardView;
export const AdminDashboard = AdminDashboardView;

export const Marketplace = MarketplacePage;
export const Login = () => <AuthUI isLogin={true} />;
export const Register = () => <AuthUI isLogin={false} />;


