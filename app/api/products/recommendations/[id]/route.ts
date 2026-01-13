import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { getSimilarProducts, getCompleteTheLook } from '@/utils/recommendations';

// GET product recommendations
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Get all active products
    const allProducts = await Product.find({ isActive: true });

    // Get all categories for mapping
    const categories = await Category.find();
    const categoryMap: Record<string, string> = {};
    categories.forEach((cat) => {
      categoryMap[cat._id.toString()] = cat.name;
    });

    // Get similar products
    const similar = getSimilarProducts(product, allProducts, 6);

    // Get complete the look products
    const completeTheLook = getCompleteTheLook(product, allProducts, categoryMap, 4);

    return NextResponse.json({
      success: true,
      data: {
        similar,
        completeTheLook,
      },
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}
