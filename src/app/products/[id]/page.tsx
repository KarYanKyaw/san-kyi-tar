// app/products/[id]/page.tsx

import ProductDetail from "@/components/ecom/ProductDetail";
import { Backend_URL } from "@/lib/fetch";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Params {
  id: string;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = params;

  // Fetch product data from your backend
  const product = await fetch(`${Backend_URL}/ecommerce-products/${id}`).then(
    (res) => res.json()
  );

  if (!product) {
    notFound(); // Handle not found
  }

  return {
    title: `Boss Nation | ${product.name}`,
    description:
      product.description || `Details about Product ${product.productCode}`,
    keywords: [product.description, `Boss ${product.productCode}`],
    openGraph: {
      title: `Boss Nation | ${product.name}`,
      description: product.description || `Details about Product ${id}`,
      url: `https://bossnnationmyanmar/products/${product.name}`,
      images: [
        {
          url: product?.mediaUrls[0]?.url,
          width: 1920,
          height: 1080,
          alt: "Boss Nation",
        },
      ],
    },
  };
}

const ProductPage = ({ params }: { params: Params }) => {
  const { id } = params;

  // Fetch product data on the server side or client side
  return <ProductDetail id={id} />;
};

export default ProductPage;
