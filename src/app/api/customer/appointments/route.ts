import { NextResponse } from "next/server";

// In-memory storage for appointments (simulates database)
const appointmentsStorage = new Map<string, any[]>();

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

// Initialize with default appointments
function getDefaultAppointments(userId: string) {
  const today = new Date();
  const futureDate1 = new Date(today);
  futureDate1.setDate(today.getDate() + 7); // 7 days from now
  const futureDate2 = new Date(today);
  futureDate2.setDate(today.getDate() + 14); // 14 days from now
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - 10); // 10 days ago
  
  return [
    {
      id: "appointment-1",
      customerId: userId,
      date: futureDate1.toISOString().split('T')[0],
      time: "10:00:00",
      status: "Scheduled",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "appointment-2",
      customerId: userId,
      date: futureDate2.toISOString().split('T')[0],
      time: "14:30:00", 
      status: "Scheduled",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "appointment-3",
      customerId: userId,
      date: pastDate.toISOString().split('T')[0],
      time: "09:00:00", 
      status: "Completed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
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

    // Get appointments from storage or use defaults
    let appointments = appointmentsStorage.get(user.id);
    if (!appointments) {
      appointments = getDefaultAppointments(user.id);
      appointmentsStorage.set(user.id, appointments);
    }

    console.log('GET Appointments - Returning:', appointments);
    
    return NextResponse.json({
      isSuccess: true,
      message: 'Customer appointments retrieved successfully',
      data: appointments,
      errorType: 'None'
    });

  } catch (error) {
    console.error('Customer appointments API error:', error);
    return NextResponse.json({
      isSuccess: false,
      message: 'Failed to retrieve customer appointments',
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
    console.log('POST Appointment - Request:', body);

    // Validate required fields
    if (!body.date || !body.time) {
      return NextResponse.json({
        isSuccess: false,
        message: 'Date and time are required',
        data: null,
        errorType: 'ValidationError'
      }, { status: 400 });
    }

    // Get existing appointments or initialize
    let appointments = appointmentsStorage.get(user.id);
    if (!appointments) {
      appointments = getDefaultAppointments(user.id);
    }

    // Create new appointment
    const newAppointment = {
      id: `appointment-${Date.now()}`,
      customerId: user.id,
      date: body.date,
      time: body.time,
      status: body.status || "Scheduled",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to appointments array
    appointments.push(newAppointment);
    appointmentsStorage.set(user.id, appointments);

    console.log('POST Appointment - Created:', newAppointment);
    console.log('POST Appointment - Total appointments:', appointments.length);
    
    return NextResponse.json({
      isSuccess: true,
      message: 'Appointment created successfully',
      data: newAppointment,
      errorType: 'None'
    });

  } catch (error) {
    console.error('Create appointment API error:', error);
    return NextResponse.json({
      isSuccess: false,
      message: 'Failed to create appointment',
      data: null,
      errorType: 'ServerError'
    }, { status: 500 });
  }
}