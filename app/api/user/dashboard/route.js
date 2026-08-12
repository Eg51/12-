// app/api/user/dashboard/route.js
import { NextResponse } from 'next/server';
import { getUserDashboard, getUpcomingBills, getRecentPaidBills } from '@/lib/db/dashdata';
import { verifyToken, extractToken } from '@/lib/security';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractToken(authHeader);
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const userId = decoded.id || decoded.userId;
    const dashboardData = await getUserDashboard(userId);
    
    if (!dashboardData) {
      return NextResponse.json(
        { success: false, error: 'Dashboard data not found' },
        { status: 404 }
      );
    }

    const upcomingBills = await getUpcomingBills(userId);
    const recentPaidBills = await getRecentPaidBills(userId, 5);

    const totalBills = dashboardData.bills?.length || 0;
    const paidBills = dashboardData.bills?.filter(b => b.status === 'paid').length || 0;
    const unpaidBills = dashboardData.bills?.filter(b => b.status === 'unpaid').length || 0;
    const overdueBills = dashboardData.bills?.filter(b => b.status === 'overdue').length || 0;
    const totalSpent = dashboardData.bills
      ?.filter(b => b.status === 'paid')
      .reduce((sum, b) => sum + (b.amount || 0), 0) || 0;

    return NextResponse.json({
      success: true,
      data: {
        totalBills,
        paidBills,
        unpaidBills,
        overdueBills,
        totalSpent,
        upcomingBills,
        recentTransactions: dashboardData.recentTransactions || [],
        paymentMethods: dashboardData.paymentMethods || [],
        preferences: dashboardData.preferences || {},
      },
    });

  } catch (error) {
    console.error('Error fetching user dashboard:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}