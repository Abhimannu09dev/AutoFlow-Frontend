import { NextResponse } from "next/server";

// In-memory storage for vehicles (simulates database)
const vehiclesStorage = new Map<string, any[]>();

// Initialize with default vehicles
function getDefaultVehicles(userId: string) {
  const today = new Date();
  const pastDate1 = new Date(today);
  pastDate1.setDate(today.getDate() - 30); // 30 days ago
  const pastDate2 = new Date(today);
  pastDate2.setDate(today.getDate() - 60); // 60 days ago
  
  return [
    {
      id: "vehicle-1",
      vehicleNumber: "ABC123",
      brand: "Toyota",
      model: "Camry",
      year: 2020,
      mileage: 45000,
      color: "Silver",
      vin: "1HGBH41JXMN109186",
      userId: userId,
      createdAt: pastDate1.toISOString(),
      updatedAt: pastDate1.toISOString()
    },
    {
      id: "vehicle-2", 
      vehicleNumber: "XYZ789",
      brand: "Honda",
      model: "Civic",
      year: 2019,
      mileage: 32000,
      color: "Blue",
      vin: "2HGFC2F59JH123456",
      userId: userId,
      createdAt: pastDate2.toISOString(),
      updatedAt: pastDate2.toISOString()
    }
  ];
}

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

export async function GET(request: Request) {
  try {
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

    // Get vehicles from storage or use defaults
    let vehicles = vehiclesStorage.get(user.id);
    if (!vehicles) {
      vehicles = getDefaultVehicles(user.id);
      vehiclesStorage.set(user.id, vehicles);
    }

    console.log('GET Vehicles - Returning:', vehicles);
    
    return NextResponse.json({
      isSuccess: true,
      message: 'Customer vehicles retrieved successfully',
      data: vehicles,
      errorType: 'None'
    });

  } catch (error) {
    console.error('Customer vehicles API error:', error);
    return NextResponse.json({
      isSuccess: false,
      message: 'Failed to retrieve customer vehicles',
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
    console.log('POST Vehicle - Request:', body);

    // Validate required fields
    if (!body.brand || !body.model || !body.year) {
      return NextResponse.json({
        isSuccess: false,
        message: 'Brand, model, and year are required',
        data: null,
        errorType: 'ValidationError'
      }, { status: 400 });
    }

    // Get existing vehicles or initialize
    let vehicles = vehiclesStorage.get(user.id);
    if (!vehicles) {
      vehicles = getDefaultVehicles(user.id);
    }

    // Create new vehicle
    const newVehicle = {
      id: `vehicle-${Date.now()}`,
      vehicleNumber: body.vehicleNumber || `VEH${Date.now()}`,
      brand: body.brand,
      model: body.model,
      year: parseInt(body.year),
      mileage: parseInt(body.mileage) || 0,
      color: body.color || "",
      vin: body.vin || "",
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to vehicles array
    vehicles.push(newVehicle);
    vehiclesStorage.set(user.id, vehicles);

    console.log('POST Vehicle - Created:', newVehicle);
    console.log('POST Vehicle - Total vehicles:', vehicles.length);
    
    return NextResponse.json({
      isSuccess: true,
      message: 'Vehicle added successfully',
      data: newVehicle,
      errorType: 'None'
    });

  } catch (error) {
    console.error('Add vehicle API error:', error);
    return NextResponse.json({
      isSuccess: false,
      message: 'Failed to add vehicle',
      data: null,
      errorType: 'ServerError'
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
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
    console.log('PUT Vehicle - Request:', body);

    if (!body.id) {
      return NextResponse.json({
        isSuccess: false,
        message: 'Vehicle ID is required',
        data: null,
        errorType: 'ValidationError'
      }, { status: 400 });
    }

    // Get existing vehicles
    let vehicles = vehiclesStorage.get(user.id);
    if (!vehicles) {
      vehicles = getDefaultVehicles(user.id);
    }

    // Find and update vehicle
    const vehicleIndex = vehicles.findIndex(v => v.id === body.id);
    if (vehicleIndex === -1) {
      return NextResponse.json({
        isSuccess: false,
        message: 'Vehicle not found',
        data: null,
        errorType: 'NotFound'
      }, { status: 404 });
    }

    // Update vehicle
    const updatedVehicle = {
      ...vehicles[vehicleIndex],
      brand: body.brand || vehicles[vehicleIndex].brand,
      model: body.model || vehicles[vehicleIndex].model,
      year: body.year ? parseInt(body.year) : vehicles[vehicleIndex].year,
      mileage: body.mileage ? parseInt(body.mileage) : vehicles[vehicleIndex].mileage,
      color: body.color !== undefined ? body.color : vehicles[vehicleIndex].color,
      vin: body.vin !== undefined ? body.vin : vehicles[vehicleIndex].vin,
      vehicleNumber: body.vehicleNumber || vehicles[vehicleIndex].vehicleNumber,
      updatedAt: new Date().toISOString()
    };

    vehicles[vehicleIndex] = updatedVehicle;
    vehiclesStorage.set(user.id, vehicles);

    console.log('PUT Vehicle - Updated:', updatedVehicle);
    
    return NextResponse.json({
      isSuccess: true,
      message: 'Vehicle updated successfully',
      data: updatedVehicle,
      errorType: 'None'
    });

  } catch (error) {
    console.error('Update vehicle API error:', error);
    return NextResponse.json({
      isSuccess: false,
      message: 'Failed to update vehicle',
      data: null,
      errorType: 'ServerError'
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
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

    // Get vehicle ID from URL
    const url = new URL(request.url);
    const vehicleId = url.searchParams.get('id');

    console.log('DELETE Vehicle - ID:', vehicleId);

    if (!vehicleId) {
      return NextResponse.json({
        isSuccess: false,
        message: 'Vehicle ID is required',
        data: null,
        errorType: 'ValidationError'
      }, { status: 400 });
    }

    // Get existing vehicles
    let vehicles = vehiclesStorage.get(user.id);
    if (!vehicles) {
      vehicles = getDefaultVehicles(user.id);
    }

    // Find vehicle
    const vehicleIndex = vehicles.findIndex(v => v.id === vehicleId);
    if (vehicleIndex === -1) {
      return NextResponse.json({
        isSuccess: false,
        message: 'Vehicle not found',
        data: null,
        errorType: 'NotFound'
      }, { status: 404 });
    }

    // Remove vehicle
    const deletedVehicle = vehicles[vehicleIndex];
    vehicles.splice(vehicleIndex, 1);
    vehiclesStorage.set(user.id, vehicles);

    console.log('DELETE Vehicle - Deleted:', deletedVehicle);
    console.log('DELETE Vehicle - Remaining:', vehicles.length);
    
    return NextResponse.json({
      isSuccess: true,
      message: 'Vehicle deleted successfully',
      data: deletedVehicle,
      errorType: 'None'
    });

  } catch (error) {
    console.error('Delete vehicle API error:', error);
    return NextResponse.json({
      isSuccess: false,
      message: 'Failed to delete vehicle',
      data: null,
      errorType: 'ServerError'
    }, { status: 500 });
  }
}