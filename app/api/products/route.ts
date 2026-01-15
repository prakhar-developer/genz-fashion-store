// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/lib/mongodb';
// import Product from '@/models/Product';
// import { generateSlug } from '@/lib/utils';

// // GET products with filtering, pagination, and sorting
// export async function GET(request: NextRequest) {
//   try {
//     await connectDB();

//     const searchParams = request.nextUrl.searchParams;
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = parseInt(searchParams.get('limit') || '12');
//     const skip = (page - 1) * limit;

//     // Build filter query
//     const filter: any = {};
    
//     const category = searchParams.get('category');
//     if (category) filter.category = category;

//     const brand = searchParams.get('brand');
//     if (brand) filter.brand = brand;

//     const minPrice = searchParams.get('minPrice');
//     const maxPrice = searchParams.get('maxPrice');
//     if (minPrice || maxPrice) {
//       filter.finalPrice = {};
//       if (minPrice) filter.finalPrice.$gte = parseFloat(minPrice);
//       if (maxPrice) filter.finalPrice.$lte = parseFloat(maxPrice);
//     }

//     const colors = searchParams.get('colors');
//     if (colors) {
//       filter.colors = { $in: colors.split(',') };
//     }

//     const sizes = searchParams.get('sizes');
//     if (sizes) {
//       filter.sizes = { $in: sizes.split(',') };
//     }

//     const search = searchParams.get('search');
//     if (search) {
//       filter.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } },
//         { brand: { $regex: search, $options: 'i' } },
//       ];
//     }

//     // Only show active products for public
//     if (!request.cookies.get('admin_session')) {
//       filter.isActive = true;
//     }

//     // Build sort query
//     const sort = searchParams.get('sort') || '-createdAt';
//     const sortQuery: any = {};
    
//     switch (sort) {
//       case 'price-asc':
//         sortQuery.finalPrice = 1;
//         break;
//       case 'price-desc':
//         sortQuery.finalPrice = -1;
//         break;
//       case 'name-asc':
//         sortQuery.name = 1;
//         break;
//       case 'name-desc':
//         sortQuery.name = -1;
//         break;
//       case 'popular':
//         sortQuery.views = -1;
//         break;
//       default:
//         sortQuery.createdAt = -1;
//     }

//     const [products, total] = await Promise.all([
//       Product.find(filter).sort(sortQuery).skip(skip).limit(limit).populate('category'),
//       Product.countDocuments(filter),
//     ]);

//     return NextResponse.json({
//       success: true,
//       data: products,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error('Get products error:', error);
//     return NextResponse.json(
//       { success: false, message: 'Failed to fetch products' },
//       { status: 500 }
//     );
//   }
// }

// // POST create new product
// export async function POST(request: NextRequest) {
//   try {
//     // Check admin authentication
//     const adminSession = request.cookies.get('admin_session');
//     if (!adminSession) {
//       return NextResponse.json(
//         { success: false, message: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     const body = await request.json();
//     const {
//       name,
//       description,
//       category,
//       brand,
//       price,
//       discount,
//       images,
//       colors,
//       sizes,
//       stock,
//     } = body;

//     await connectDB();

//     // Generate slug
//     const slug = generateSlug(name);

//     // Check if slug already exists
//     const existing = await Product.findOne({ slug });
//     if (existing) {
//       return NextResponse.json(
//         { success: false, message: 'Product with this name already exists' },
//         { status: 400 }
//       );
//     }

//     const product = await Product.create({
//       name,
//       slug,
//       description,
//       category,
//       brand,
//       price,
//       discount: discount || 0,
//       images: images || [],
//       colors: colors || [],
//       sizes: sizes || [],
//       stock: stock || 0,
//     });

//     return NextResponse.json(
//       { success: true, data: product },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('Create product error:', error);
//     return NextResponse.json(
//       { success: false, message: 'Failed to create product' },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category'; 
import { generateSlug } from '@/lib/utils';

// GET all products
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const category = searchParams.get('category');
    const isActive = searchParams.get('isActive');

    const filter:  any = {};
    if (category) filter.category = category;
    if (isActive !== null && isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, data: products });
  } catch (error:  any) {
    console.error('GET /api/products error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST create product
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const adminSession = request.cookies.get('admin_session');
    if (!adminSession) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    console.log('📦 Creating product with data:', body);

    const {
      name,
      slug,
      description,
      category,
      brand,
      price,
      discount = 0,
      images = [],
      colors = [],
      sizes = [],
      stock,
      isActive = true,
    } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Product name is required' },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category is required' },
        { status: 400 }
      );
    }

    if (!price || price <= 0) {
      return NextResponse.json(
        { success: false, message: 'Valid price is required' },
        { status: 400 }
      );
    }

    if (stock === undefined || stock < 0) {
      return NextResponse.json(
        { success: false, message: 'Valid stock quantity is required' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const finalSlug = slug || generateSlug(name);

    // Check if slug already exists
    const existing = await Product.findOne({ slug: finalSlug });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Product with this slug already exists' },
        { status: 400 }
      );
    }

    // ✅ Calculate finalPrice manually
    const calculatedDiscount = Math.max(0, Math.min(100, discount || 0));
    const finalPrice = calculatedDiscount > 0
      ? price - (price * calculatedDiscount) / 100
      : price;

    console.log('💰 Price calculation:', {
      price,
      discount:  calculatedDiscount,
      finalPrice,
    });

    // ✅ Create product with finalPrice
    const product = await Product.create({
      name: name.trim(),
      slug: finalSlug,
      description:  description?.trim() || '',
      category,
      brand:  brand?.trim() || 'Unknown',
      price: parseFloat(price),
      discount: calculatedDiscount,
      finalPrice, // ✅ Include finalPrice
      images: Array.isArray(images) ? images : [],
      colors: Array. isArray(colors) ? colors : [],
      sizes: Array.isArray(sizes) ? sizes : [],
      stock:  parseInt(stock),
      isActive:  isActive !== false,
    });

    console.log('✅ Product created:', product._id);

    return NextResponse.json(
      { success: true, data: product },
      { status:  201 }
    );
  } catch (error: any) {
    console.error('Create product error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Product with this slug already exists' },
        { status: 400 }
      );
    }

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
      { success: false, message: error.message || 'Failed to create product' },
      { status:  500 }
    );
  }
}