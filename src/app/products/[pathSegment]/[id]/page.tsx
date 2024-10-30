import ProductDetail from "@/components/ecom/ProductDetail";
import { Backend_URL } from "@/lib/fetch";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Params {
  pathSegment: string;
  id: string;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id, pathSegment } = params;

  // Fetch product data from your backend
  const product = await fetch(`${Backend_URL}/ecommerce-products/${id}`).then(
    (res) => res.json()
  );

  console.log(id);

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
      description:
        product.description || `Details about Product ${product.name}`,
      url: `https://bossnnationmyanmar/products/${pathSegment}/${product.name}`,
      images: [
        {
          url: product?.mediaUrls?.[0]?.url || "", // Access the first media URL safely
          width: 1920,
          height: 1080,
          alt: "Boss Nation",
        },
      ],
    },
  };
}

const ProductPage = ({ params }: { params: Params }) => {
  const { id, pathSegment } = params;

  // Pass both `id` and `pathSegment` to the ProductDetail component if needed
  return <ProductDetail id={id} pathSegment={pathSegment} />;
};

export default ProductPage;
