import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// GET all orders
export async function GET(request: NextRequest) {
  try {
    const adminSession = request.cookies.get('admin_session');
    if (!adminSession) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status:  401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '100');

    const filter: any = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, data: orders });
  } catch (error:  any) {
    console.error('GET /api/orders error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST create order
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    console.log('📦 Creating order with data:', body);

    const {
      customerName,
      email,
      phone,
      address,
      products,
      totalAmount,
      paymentMethod,
      paymentScreenshot,
      notes,
    } = body;

    // Validation
    if (!customerName || ! customerName.trim()) {
      return NextResponse.json(
        { success: false, message: 'Customer name is required' },
        { status: 400 }
      );
    }

    if (!phone || ! phone.trim()) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required' },
        { status: 400 }
      );
    }

    if (!address || !address.street || !address.city || !address.state || !address.pincode) {
      return NextResponse.json(
        { success: false, message: 'Complete address is required' },
        { status: 400 }
      );
    }

    if (!products || ! Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { success: false, message: 'At least one product is required' },
        { status: 400 }
      );
    }

    if (! totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Valid total amount is required' },
        { status: 400 }
      );
    }

    if (!paymentMethod || !['cod', 'online']. includes(paymentMethod)) {
      return NextResponse.json(
        { success: false, message:  'Valid payment method is required' },
        { status: 400 }
      );
    }

    // ✅ Generate orderNumber manually
    const orderNumber = generateOrderNumber();

    console.log('🔢 Generated order number:', orderNumber);

    // ✅ Create order with orderNumber
    const order = await Order.create({
      orderNumber, // ✅ Include orderNumber
      customerName:  customerName.trim(),
      email:  email?. trim(),
      phone: phone.trim(),
      address: {
        street: address.street. trim(),
        city: address. city.trim(),
        state: address.state.trim(),
        pincode: address.pincode. trim(),
      },
      products:  products.map((p: any) => ({
        productId: p.productId,
        name: p.name,
        price: parseFloat(p.price),
        quantity: parseInt(p.quantity),
        color: p.color,
        size: p.size,
        image: p.image,
      })),
      totalAmount: parseFloat(totalAmount),
      paymentMethod,
      paymentScreenshot:  paymentScreenshot || null,
      status: paymentMethod === 'cod' ?  'pending' : 'pending',
      notes:  notes?. trim(),
    });

    console.log('✅ Order created:', order. orderNumber);

    return NextResponse.json(
      { 
        success: true, 
        data: order,
        message: `Order ${order.orderNumber} created successfully` 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create order error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors)
        .map((err: any) => err.message)
        .join(', ');
      return NextResponse.json(
        { success: false, message: messages },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}