import { NextResponse } from "next/server";

// In-memory storage for parts requests (simulates database)
const partsRequestsStorage = new Map<string, any[]>();

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

// Initialize with default parts requests
function getDefaultPartsRequests(userId: string) {
  const today = new Date();
  const pastDate1 = new Date(today);
  pastDate1.setDate(today.getDate() - 5); // 5 days ago
  const pastDate2 = new Date(today);
  pastDate2.setDate(today.getDate() - 12); // 12 days ago
  
  return [
    {
      id: "part-request-1",
      customerId: userId,
      partName: "Carbon Ceramic Brake Pads",
      quantity: 4,
      status: "Pending",
      createdAt: pastDate1.toISOString(),
      updatedAt: pastDate1.toISOString()
    },
    {
      id: "part-request-2",
      customerId: userId,
      partName: "Performance Air Filter",
      quantity: 1,
      status: "Fulfilled",
      createdAt: pastDate2.toISOString(),
      updatedAt: pastDate2.toISOString()
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

    // Get parts requests from storage or use defaults
    let partsRequests = partsRequestsStorage.get(user.id);
    if (!partsRequests) {
      partsRequests = getDefaultPartsRequests(user.id);
      partsRequestsStorage.set(user.id, partsRequests);
    }

    console.log('GET Parts Requests - Returning:', partsRequests);
    
    return NextResponse.json({
      isSuccess: true,
      message: 'Customer parts requests retrieved successfully',
      data: partsRequests,
      errorType: 'None'
    });

  } catch (error) {
    console.error('Customer parts requests API error:', error);
    return NextResponse.json({
      isSuccess: false,
      message: 'Failed to retrieve customer parts requests',
      data: [],
      errorType: 'ServerError'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({
        isSuccess: false,
        message: 'Authorization header required',
        data: null,
        errorType: 'Unauthorized'
      }, { status: 401 });
    }

    const user = getUserFromToken(authHeader);
    if (!user) {
      return NextResponse.json({
        isSuccess: false,
        message: 'Invalid token',
        data: null,
        errorType: 'Unauthorized'
      }, { status: 401 });
    }

    const body = await request.json();
    console.log('POST Parts Request - Request:', body);

    // Validate required fields
    if (!body.partName || !body.quantity) {
      return NextResponse.json({
        isSuccess: false,
        message: 'Part name and quantity are required',
        data: null,
        errorType: 'ValidationError'
      }, { status: 400 });
    }

    // Get existing parts requests or initialize
    let partsRequests = partsRequestsStorage.get(user.id);
    if (!partsRequests) {
      partsRequests = getDefaultPartsRequests(user.id);
    }

    // Create new parts request
    const newPartRequest = {
      id: `part-request-${Date.now()}`,
      customerId: user.id,
      partName: body.partName,
      quantity: parseInt(body.quantity) || 1,
      status: body.status || "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to parts requests array
    partsRequests.push(newPartRequest);
    partsRequestsStorage.set(user.id, partsRequests);

    console.log('POST Parts Request - Created:', newPartRequest);
    console.log('POST Parts Request - Total requests:', partsRequests.length);
    
    return NextResponse.json({
      isSuccess: true,
      message: 'Parts request created successfully',
      data: newPartRequest,
      errorType: 'None'
    });

  } catch (error) {
    console.error('Create parts request API error:', error);
    return NextResponse.json({
      isSuccess: false,
      message: 'Failed to create parts request',
      data: null,
      errorType: 'ServerError'
    }, { status: 500 });
  }
}
