import { getServerUser } from '@/lib/server-auth';
import { redirect } from 'next/navigation';

const API_URL = process.env.API_URL || "http://localhost:5000"

interface FetchSellerProductsParams {
  sellerId: string;
  page?: number;
  limit?: number;
}

async function fetchSellerProducts({ sellerId, page = 1, limit = 10 }: FetchSellerProductsParams) {
  try {
    const response = await fetch(
      `${API_URL}/api/products/seller-products?page=${page}&limit=${limit}`,
      {
        credentials: "include",
        method: "GET",
        cache: "no-store",

      }
    );

    console.log(response)

    if (!response.ok) {
      throw new Error(`Failed to fetch seller products: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch seller products');
    }

    return {
      products: data.data.products,
      pagination: data.data.pagination,
    };
  } catch (error) {
    console.error('Error fetching seller products:', error);
    throw error;
  }
}

interface SearchParams {
  page?: string;
  limit?: string;
}

export default async function SellerProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getServerUser();

  if (!user || user.role !== 'seller') {
    redirect('/');
  }

  try {
    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    const limit = searchParams.limit ? parseInt(searchParams.limit) : 10;

    const { products, pagination } = await fetchSellerProducts({
      sellerId: user.id,
      page,
      limit,
    });

    if (!products) {
      return (
        <div className="p-8">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">No Products Found</h2>
            <p className="text-gray-600">Start adding products to your store.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Products</h1>
          <button
            onClick={() => {/* Add product logic */ }}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Add New Product
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <div
              key={product.id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square relative">
                <img
                  src={product.primaryImage || '/placeholder.png'}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-2 right-2">
                  {product.status === 'draft' && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      Draft
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold">${product.price}</span>
                  <span className="text-sm text-gray-500">
                    Stock: {product.stockQuantity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="mt-8 flex justify-center items-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <a
                key={i + 1}
                href={`?page=${i + 1}`}
                className={`px-4 py-2 rounded ${pagination.page === i + 1
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
                  }`}
              >
                {i + 1}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2 text-red-600">Error</h2>
          <p className="text-gray-600">
            Failed to load products. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}