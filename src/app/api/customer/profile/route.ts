import { NextResponse } from "next/server";

// In-memory storage for profile updates (simulates database)
// In production, this would be replaced with actual database calls
const profileStorage = new Map<string, any>();

// Helper function to extract user info from JWT token
function getUserFromToken(authHeader: string) {
  try {
    const token = authHeader.replace('Bearer ', '');
    
    // In production, you would decode and validate the JWT token
    return {
      id: "019e08d8-c212-7e4b-91e1-f7f0297a527d",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
    };
  } catch (error) {
    return null;
  }
}

// Initialize with default profile
function getDefaultProfile(userId: string, userName: string, userEmail: string) {
  return {
    id: userId,
    fullName: userName,
    email: userEmail,
    phone: "+1-555-0123",
    address: "123 Main Street, City, State 12345",
    createdAt: new Date().toISOString(),
    applicationUserId: userId
  };
}

export async function GET(request: Request) {
  try {
    // Get the current user from the token
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
    
    // Check if we have updated profile data in storage
    const storedProfile = profileStorage.get(user.id);
    
    const profileData = storedProfile || getDefaultProfile(user.id, user.name, user.email);
    
    console.log('GET Profile - Returning data:', profileData);
    
    return NextResponse.json({
      isSuccess: true,
      message: 'Customer profile retrieved successfully',
      data: profileData,
      errorType: 'None'
    });

  } catch (error) {
    console.error('Customer profile API error:', error);
    return NextResponse.json({
      isSuccess: false,
      message: 'Failed to retrieve customer profile',
      data: null,
      errorType: 'ServerError'
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // Get the current user from the token
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

    // Get the update data from request body
    const body = await request.json();
    console.log('PUT Profile - Update request:', body);

    // Validate required fields
    if (!body.fullName || !body.email) {
      return NextResponse.json({
        isSuccess: false,
        message: 'Full name and email are required',
        data: null,
        errorType: 'ValidationError'
      }, { status: 400 });
    }

    // Create updated profile object
    const updatedProfile = {
      id: user.id,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone || "",
      address: body.address || "",
      createdAt: new Date().toISOString(),
      applicationUserId: user.id
    };

    // Store the updated profile in memory
    profileStorage.set(user.id, updatedProfile);

    console.log('PUT Profile - Stored updated data:', updatedProfile);
    console.log('PUT Profile - Storage now contains:', Array.from(profileStorage.entries()));

    return NextResponse.json({
      isSuccess: true,
      message: 'Profile updated successfully',
      data: updatedProfile,
      errorType: 'None'
    });

  } catch (error) {
    console.error('Profile update API error:', error);
    return NextResponse.json({
      isSuccess: false,
      message: 'Failed to update profile',
      data: null,
      errorType: 'ServerError'
    }, { status: 500 });
  }
}