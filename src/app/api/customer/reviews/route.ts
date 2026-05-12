import { NextResponse } from "next/server";

// In-memory storage for reviews (simulates database)
const reviewsStorage = new Map<string, any[]>();

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

// Initialize with default reviews
function getDefaultReviews(userId: string) {
  const today = new Date();
  const pastDate1 = new Date(today);
  pastDate1.setDate(today.getDate() - 3); // 3 days ago
  const pastDate2 = new Date(today);
  pastDate2.setDate(today.getDate() - 20); // 20 days ago
  
  return [
    {
      id: "review-1",
      customerId: userId,
      rating: 5,
      comment: "Excellent service! The team was professional and thorough.",
      createdAt: pastDate1.toISOString(),
      updatedAt: pastDate1.toISOString()
    },
    {
      id: "review-2",
      customerId: userId,
      rating: 4,
      comment: "Great experience overall. Very satisfied with the work done.",
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

    // Get reviews from storage or use defaults
    let reviews = reviewsStorage.get(user.id);
    if (!reviews) {
      reviews = getDefaultReviews(user.id);
      reviewsStorage.set(user.id, reviews);
    }

    console.log('GET Reviews - Returning:', reviews);
    
    return NextResponse.json({
      isSuccess: true,
      message: 'Customer reviews retrieved successfully',
      data: reviews,
      errorType: 'None'
    });

  } catch (error) {
    console.error('Customer reviews API error:', error);
    return NextResponse.json({
      isSuccess: false,
      message: 'Failed to retrieve customer reviews',
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
    console.log('POST Review - Request:', body);

    // Validate required fields
    if (!body.rating) {
      return NextResponse.json({
        isSuccess: false,
        message: 'Rating is required',
        data: null,
        errorType: 'ValidationError'
      }, { status: 400 });
    }

    // Get existing reviews or initialize
    let reviews = reviewsStorage.get(user.id);
    if (!reviews) {
      reviews = getDefaultReviews(user.id);
    }

    // Create new review
    const newReview = {
      id: `review-${Date.now()}`,
      customerId: user.id,
      rating: parseInt(body.rating) || 5,
      comment: body.comment || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to reviews array
    reviews.push(newReview);
    reviewsStorage.set(user.id, reviews);

    console.log('POST Review - Created:', newReview);
    console.log('POST Review - Total reviews:', reviews.length);
    
    return NextResponse.json({
      isSuccess: true,
      message: 'Review created successfully',
      data: newReview,
      errorType: 'None'
    });

  } catch (error) {
    console.error('Create review API error:', error);
    return NextResponse.json({
      isSuccess: false,
      message: 'Failed to create review',
      data: null,
      errorType: 'ServerError'
    }, { status: 500 });
  }
}
