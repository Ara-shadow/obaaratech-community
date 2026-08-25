import api from "./axios";


// =====================================================
// TYPES
// =====================================================

export interface SellerPlan {

    id: string;

    name: string;

    price: number;

    duration: number;

    maxListings: number;

    imageLimit: number;

    featuredListing: boolean;

    prioritySearch: boolean;

    verifiedBadge: boolean;

    createdAt?: string;

}


export interface SellerSubscription {

    id: string;

    userId: string;

    planId: string;

    startDate: string;

    expiryDate: string;

    active: boolean;

    createdAt: string;

    updatedAt: string;

    plan: SellerPlan;

}


// =====================================================
// GET ALL SELLER PLANS
// =====================================================

export async function getSellerPlans(): Promise<SellerPlan[]> {

    const response =
        await api.get<{
            success: boolean;
            plans: SellerPlan[];
        }>("/plans");


    return response.data.plans;

}


// =====================================================
// GET MY CURRENT PLAN
// =====================================================

export async function getMySellerPlan(): Promise<SellerSubscription> {

    const response =
        await api.get<{
            success: boolean;
            plan: SellerSubscription;
        }>("/plans/me");


    return response.data.plan;

}


// =====================================================
// GET MY SUBSCRIPTION
// =====================================================

export async function getMySellerSubscription(): Promise<SellerSubscription | null> {

    const response =
        await api.get<{
            success: boolean;
            subscription: SellerSubscription | null;
        }>("/seller/subscription/me");


    return response.data.subscription;

}


// =====================================================
// SUBSCRIBE / UPGRADE
// =====================================================

export async function subscribeToSellerPlan(
    planId: string
): Promise<SellerSubscription> {

    const response =
        await api.post<{
            success: boolean;
            message: string;
            subscription: SellerSubscription;
        }>(
            "/seller/subscription",
            {
                planId
            }
        );


    return response.data.subscription;

}