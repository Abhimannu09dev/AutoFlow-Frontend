import { NextResponse } from "next/server";

// In-memory storage for purchases (simulates database)
const purchasesStorage = new Map<string, any[]>();

// Helper function to extract user info from JWT token
function getUserFromToken(authHeader: string) {
  try {
    const token = authHeader.replace('Bearer ', '');
    return {
      id: "019e08d8-c212-7e4b-91e1-f7f0297a527d",
      name: "Sarah Johnson", 
      email: "sarah.johnson@example.com",
    };
  } catch (error) {
    return null;
  }
}

// Initialize with default purchases
function getDefaultPurchases(userId: string, userName: string) {
  const today = new Date();
  const recentDate1 = new Date(today);
  recentDate1.setDate(today.getDate() - 15); // 15 days ago
  const recentDate2 = new Date(today);
  recentDate2.setDate(today.getDate() - 30); // 30 days ago
  
  return [
    {
      id: "sale-1",
      customerId: userId,
      customerName: userName,
      staffId: "staff-1",
      saleDate: recentDate1.toISOString(),
      subTotal: 245.50,
      discountAmount: 24.55,
      totalAmount: 220.95,
      loyaltyDiscountApplied: true,
      paymentMethod: "Credit Card",
      status: "Completed",
      notes: "Oil change and filter replacement",
      createdAt: recentDate1.toISOString(),
      items: [
        {
          id: "item-1",
          partId: "part-1",
          partName: "Engine Oil Filter",
          quantity: 1,
          unitPrice: 25.99,
          subTotal: 25.99
        },
        {
          id: "item-2", 
          partId: "part-2",
          partName: "Synthetic Motor Oil (5L)",
          quantity: 1,
          unitPrice: 219.51,
          subTotal: 219.51
        }
      ]
    },
    {
      id: "sale-2",
      customerId: userId,
      customerName: userName,
      staffId: "staff-2",
      saleDate: recentDate2.toISOString(),
      subTotal: 89.99,
      discountAmount: 0,
      totalAmount: 89.99,
      loyaltyDiscountApplied: false,
      paymentMethod: "Cash",
      status: "Completed",
      notes: "Brake pad inspection",
      createdAt: recentDate2.toISOString(),
      items: [
        {
          id: "item-3",
          partId: "part-3", 
          partName: "Brake Inspection Service",
          quantity: 1,
          unitPrice: 89.99,
          subTotal: 89.99
        }
      ]
    }
  ];
}

export async function GET(request: Request) {
  try {
    // Get the current user from the token
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({
        isSuccess: false,
        message: 'Authorization header required',
        data: [],
        errorType: 'Unauthorized'
      }, { status: 401 });
    }

    const user = getUserFromToken(authHeader);
    if (!user) {
      return NextResponse.json({
        isSuccess: false,
        message: 'Invalid token',
        data: [],
        errorType: 'Unauthorized'
      }, { status: 401 });
    }

    // Get purchases from storage or use defaults
    let purchases = purchasesStorage.get(user.id);
    if (!purchases) {
      purchases = getDefaultPurchases(user.id, user.name);
      purchasesStorage.set(user.id, purchases);
    }

    console.log('GET Purchases - Returning:', purchases);
    
    return NextResponse.json({
      isSuccess: true,
      message: 'Customer purchases retrieved successfully',
      data: purchases,
      errorType: 'None'
    });

  } catch (error) {
    console.error('Customer purchases API error:', error);
    return NextResponse.json({
      isSuccess: false,
      message: 'Failed to retrieve customer purchases',
      data: [],
      errorType: 'ServerError'
    }, { status: 500 });
  }
}
