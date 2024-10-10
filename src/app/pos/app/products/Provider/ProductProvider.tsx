"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

type ProductContextType = {
  addProductStages: {
    id: string;
    title: string;
    icon: JSX.Element;
    path: string;
    active: boolean;
  }[];
  navigateForward: (step: number) => void;
  navigateBackward: () => void;
  addProductFormData: AddProductFormData;
  setAddProductFormData: React.Dispatch<
    React.SetStateAction<AddProductFormData>
  >;
  editProductFormData: EditProductFormData;
  setEditProductFormData: React.Dispatch<
    React.SetStateAction<EditProductFormData>
  >;
  categoryData: any[];
  setCategoryData: React.Dispatch<React.SetStateAction<any[]>>;
  fittingData: any[];
  setFittingData: React.Dispatch<React.SetStateAction<any[]>>;
  editProductStages: {
    id: string;
    title: string;
    icon: JSX.Element;
    path: string;
    active: boolean;
  }[];
  swalProps: any;
  setSwalProps: any;
};

type AddProductFormData = {
  addTo: {
    eCommerce: boolean;
    pos: boolean;
  };
  name: string;
  productCode: string;
  description: string;
  gender: string;
  brand: number;
  product_type_id: number;
  product_category_id: number;
  product_fitting_id: number;
  image: { file: any }[];
  stock_price: number;
  sale_price: number;
  discount: number;
  profitInPercent: number;
  profitInDigit: number;
  productVariants: any[];
};

type EditProductFormData = {
  id: number;
  addTo: {
    eCommerce: boolean;
    pos: boolean;
  };
  name: string;
  productCode: string;
  description: string;
  gender: string;
  brand: number;
  productTypeId: number;
  productCategoryId: number;
  productFittingId: number;
  medias: { file: any }[];
  stockPrice: number;
  salePrice: number;
  discount: number;
  profitInPercent: number;
  profitInDigit: number;
  productVariants: any[];
};

const Provider = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const pathName = usePathname();

  const [path, setPath] = useState<number | undefined>(undefined);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [fittingData, setFittingData] = useState<any[]>([]);

  const [swalProps, setSwalProps] = useState({
    show: false,
    showConfirmButton: false,
  });

  useEffect(() => {
    const match = pathName.match(/\/(\d+)$/);

    if (match) {
      const number = parseInt(match[1]);
      setPath(number);
    } else {
      setPath(undefined);
    }
  }, [pathName]);

  // side bar steps
  const addProductStages = [
    {
      active: path !== undefined && path > 0,
      id: "information",
      title: "Information",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          className={`icon ${
            path !== undefined && path > 0 ? "fill-white/90" : " fill-primary"
          } `}
          viewBox="0 0 256 256"
        >
          <path d="M200,40H179.31L165.66,26.34h0A8,8,0,0,0,160,24H96a8,8,0,0,0-5.66,2.34h0L76.69,40H56A16,16,0,0,0,40,56V208a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40ZM128,65.58,111,40h34.1Zm33.24-21L168,51.31V104L138.57,78.56ZM88,51.31l6.76-6.75,22.67,34L88,104ZM56,56H72v48a15.85,15.85,0,0,0,9.21,14.49A16.1,16.1,0,0,0,88,120a15.89,15.89,0,0,0,10.2-3.73.52.52,0,0,0,.11-.1L120,97.48V208H56ZM200,208H136V97.48l21.65,18.7a.52.52,0,0,0,.11.1A15.89,15.89,0,0,0,168,120a16.1,16.1,0,0,0,6.83-1.54A15.85,15.85,0,0,0,184,104V56h16Z"></path>
        </svg>
      ),
      path: "/pos/app/products/add-new-product-step/1",
    },
    {
      active: path !== undefined && path > 1,
      id: "organize",
      title: "Organize",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 256 256"
          className={`icon ${
            path !== undefined && path > 1 ? "fill-white/90" : " fill-primary"
          } `}
        >
          <path d="M184,89.57V84c0-25.08-37.83-44-88-44S8,58.92,8,84v40c0,20.89,26.25,37.49,64,42.46V172c0,25.08,37.83,44,88,44s88-18.92,88-44V132C248,111.3,222.58,94.68,184,89.57ZM232,132c0,13.22-30.79,28-72,28-3.73,0-7.43-.13-11.08-.37C170.49,151.77,184,139,184,124V105.74C213.87,110.19,232,122.27,232,132ZM72,150.25V126.46A183.74,183.74,0,0,0,96,128a183.74,183.74,0,0,0,24-1.54v23.79A163,163,0,0,1,96,152,163,163,0,0,1,72,150.25Zm96-40.32V124c0,8.39-12.41,17.4-32,22.87V123.5C148.91,120.37,159.84,115.71,168,109.93ZM96,56c41.21,0,72,14.78,72,28s-30.79,28-72,28S24,97.22,24,84,54.79,56,96,56ZM24,124V109.93c8.16,5.78,19.09,10.44,32,13.57v23.37C36.41,141.4,24,132.39,24,124Zm64,48v-4.17c2.63.1,5.29.17,8,.17,3.88,0,7.67-.13,11.39-.35A121.92,121.92,0,0,0,120,171.41v23.46C100.41,189.4,88,180.39,88,172Zm48,26.25V174.4a179.48,179.48,0,0,0,24,1.6,183.74,183.74,0,0,0,24-1.54v23.79a165.45,165.45,0,0,1-48,0Zm64-3.38V171.5c12.91-3.13,23.84-7.79,32-13.57V172C232,180.39,219.59,189.4,200,194.87Z"></path>
        </svg>
      ),
      path: "/pos/app/products/add-new-product-step/2",
    },
    {
      active: path !== undefined && path > 2,
      id: "media",
      title: "Media",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          className={`icon ${
            path !== undefined && path > 2 ? "fill-white/90" : " fill-primary"
          } `}
          viewBox="0 0 256 256"
        >
          <path d="M216,40H72A16,16,0,0,0,56,56V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V184h16a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM72,56H216v62.75l-10.07-10.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L72,109.37ZM184,200H40V88H56v80a16,16,0,0,0,16,16H184Zm32-32H72V132l36-36,49.66,49.66a8,8,0,0,0,11.31,0L194.63,120,216,141.38V168ZM160,84a12,12,0,1,1,12,12A12,12,0,0,1,160,84Z"></path>
        </svg>
      ),
      path: "/pos/app/products/add-new-product-step/3",
    },
    {
      active: path !== undefined && path > 3,
      id: "prizing",
      title: "Prizing",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 256 256"
          className={`icon ${
            path !== undefined && path > 3 ? "fill-white/90" : " fill-primary"
          } `}
        >
          <path d="M184,89.57V84c0-25.08-37.83-44-88-44S8,58.92,8,84v40c0,20.89,26.25,37.49,64,42.46V172c0,25.08,37.83,44,88,44s88-18.92,88-44V132C248,111.3,222.58,94.68,184,89.57ZM232,132c0,13.22-30.79,28-72,28-3.73,0-7.43-.13-11.08-.37C170.49,151.77,184,139,184,124V105.74C213.87,110.19,232,122.27,232,132ZM72,150.25V126.46A183.74,183.74,0,0,0,96,128a183.74,183.74,0,0,0,24-1.54v23.79A163,163,0,0,1,96,152,163,163,0,0,1,72,150.25Zm96-40.32V124c0,8.39-12.41,17.4-32,22.87V123.5C148.91,120.37,159.84,115.71,168,109.93ZM96,56c41.21,0,72,14.78,72,28s-30.79,28-72,28S24,97.22,24,84,54.79,56,96,56ZM24,124V109.93c8.16,5.78,19.09,10.44,32,13.57v23.37C36.41,141.4,24,132.39,24,124Zm64,48v-4.17c2.63.1,5.29.17,8,.17,3.88,0,7.67-.13,11.39-.35A121.92,121.92,0,0,0,120,171.41v23.46C100.41,189.4,88,180.39,88,172Zm48,26.25V174.4a179.48,179.48,0,0,0,24,1.6,183.74,183.74,0,0,0,24-1.54v23.79a165.45,165.45,0,0,1-48,0Zm64-3.38V171.5c12.91-3.13,23.84-7.79,32-13.57V172C232,180.39,219.59,189.4,200,194.87Z"></path>
        </svg>
      ),
      path: "/pos/app/products/add-new-product-step/4",
    },
    {
      active: path !== undefined && path > 4,
      id: "variants",
      title: "Variants",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          className={`icon ${
            path !== undefined && path > 4 ? "fill-white/90" : " fill-primary"
          } `}
          viewBox="0 0 256 256"
        >
          <path d="M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63Zm-96,96L48,132.69V48h84.69L232,147.31ZM96,84A12,12,0,1,1,84,72,12,12,0,0,1,96,84Z"></path>
        </svg>
      ),
      path: "/pos/app/products/add-new-product-step/5",
    },
    {
      active: path !== undefined && path > 5,
      id: "confirmation",
      title: "confirmation",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          className={`icon ${
            path !== undefined && path > 5 ? "fill-white/90" : " fill-primary"
          } `}
          viewBox="0 0 256 256"
        >
          <path d="M243.28,68.24l-24-23.56a16,16,0,0,0-22.59,0L104,136.23l-36.69-35.6a16,16,0,0,0-22.58.05l-24,24a16,16,0,0,0,0,22.61l71.62,72a16,16,0,0,0,22.63,0L243.33,90.91A16,16,0,0,0,243.28,68.24ZM103.62,208,32,136l24-24a.6.6,0,0,1,.08.08l42.35,41.09a8,8,0,0,0,11.19,0L208.06,56,232,79.6Z"></path>
        </svg>
      ),
      path: "/pos/app/products/add-new-product-step/6",
    },
  ];

  const editProductStages = [
    {
      active: path !== undefined && path > 0,
      id: "information",
      title: "Information",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          className={`icon ${
            path !== undefined && path > 0 ? "fill-white/90" : " fill-primary"
          } `}
          viewBox="0 0 256 256"
        >
          <path d="M200,40H179.31L165.66,26.34h0A8,8,0,0,0,160,24H96a8,8,0,0,0-5.66,2.34h0L76.69,40H56A16,16,0,0,0,40,56V208a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40ZM128,65.58,111,40h34.1Zm33.24-21L168,51.31V104L138.57,78.56ZM88,51.31l6.76-6.75,22.67,34L88,104ZM56,56H72v48a15.85,15.85,0,0,0,9.21,14.49A16.1,16.1,0,0,0,88,120a15.89,15.89,0,0,0,10.2-3.73.52.52,0,0,0,.11-.1L120,97.48V208H56ZM200,208H136V97.48l21.65,18.7a.52.52,0,0,0,.11.1A15.89,15.89,0,0,0,168,120a16.1,16.1,0,0,0,6.83-1.54A15.85,15.85,0,0,0,184,104V56h16Z"></path>
        </svg>
      ),
      path: "/pos/app/products/edit-product-step/1",
    },
    {
      active: path !== undefined && path > 1,
      id: "organize",
      title: "Organize",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 256 256"
          className={`icon ${
            path !== undefined && path > 1 ? "fill-white/90" : " fill-primary"
          } `}
        >
          <path d="M184,89.57V84c0-25.08-37.83-44-88-44S8,58.92,8,84v40c0,20.89,26.25,37.49,64,42.46V172c0,25.08,37.83,44,88,44s88-18.92,88-44V132C248,111.3,222.58,94.68,184,89.57ZM232,132c0,13.22-30.79,28-72,28-3.73,0-7.43-.13-11.08-.37C170.49,151.77,184,139,184,124V105.74C213.87,110.19,232,122.27,232,132ZM72,150.25V126.46A183.74,183.74,0,0,0,96,128a183.74,183.74,0,0,0,24-1.54v23.79A163,163,0,0,1,96,152,163,163,0,0,1,72,150.25Zm96-40.32V124c0,8.39-12.41,17.4-32,22.87V123.5C148.91,120.37,159.84,115.71,168,109.93ZM96,56c41.21,0,72,14.78,72,28s-30.79,28-72,28S24,97.22,24,84,54.79,56,96,56ZM24,124V109.93c8.16,5.78,19.09,10.44,32,13.57v23.37C36.41,141.4,24,132.39,24,124Zm64,48v-4.17c2.63.1,5.29.17,8,.17,3.88,0,7.67-.13,11.39-.35A121.92,121.92,0,0,0,120,171.41v23.46C100.41,189.4,88,180.39,88,172Zm48,26.25V174.4a179.48,179.48,0,0,0,24,1.6,183.74,183.74,0,0,0,24-1.54v23.79a165.45,165.45,0,0,1-48,0Zm64-3.38V171.5c12.91-3.13,23.84-7.79,32-13.57V172C232,180.39,219.59,189.4,200,194.87Z"></path>
        </svg>
      ),
      path: "/pos/app/products/edit-product-step/2",
    },
    {
      active: path !== undefined && path > 2,
      id: "media",
      title: "Media",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          className={`icon ${
            path !== undefined && path > 2 ? "fill-white/90" : " fill-primary"
          } `}
          viewBox="0 0 256 256"
        >
          <path d="M216,40H72A16,16,0,0,0,56,56V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V184h16a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM72,56H216v62.75l-10.07-10.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L72,109.37ZM184,200H40V88H56v80a16,16,0,0,0,16,16H184Zm32-32H72V132l36-36,49.66,49.66a8,8,0,0,0,11.31,0L194.63,120,216,141.38V168ZM160,84a12,12,0,1,1,12,12A12,12,0,0,1,160,84Z"></path>
        </svg>
      ),
      path: "/pos/app/products/edit-product-step/3",
    },
    {
      active: path !== undefined && path > 3,
      id: "prizing",
      title: "Prizing",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 256 256"
          className={`icon ${
            path !== undefined && path > 3 ? "fill-white/90" : " fill-primary"
          } `}
        >
          <path d="M184,89.57V84c0-25.08-37.83-44-88-44S8,58.92,8,84v40c0,20.89,26.25,37.49,64,42.46V172c0,25.08,37.83,44,88,44s88-18.92,88-44V132C248,111.3,222.58,94.68,184,89.57ZM232,132c0,13.22-30.79,28-72,28-3.73,0-7.43-.13-11.08-.37C170.49,151.77,184,139,184,124V105.74C213.87,110.19,232,122.27,232,132ZM72,150.25V126.46A183.74,183.74,0,0,0,96,128a183.74,183.74,0,0,0,24-1.54v23.79A163,163,0,0,1,96,152,163,163,0,0,1,72,150.25Zm96-40.32V124c0,8.39-12.41,17.4-32,22.87V123.5C148.91,120.37,159.84,115.71,168,109.93ZM96,56c41.21,0,72,14.78,72,28s-30.79,28-72,28S24,97.22,24,84,54.79,56,96,56ZM24,124V109.93c8.16,5.78,19.09,10.44,32,13.57v23.37C36.41,141.4,24,132.39,24,124Zm64,48v-4.17c2.63.1,5.29.17,8,.17,3.88,0,7.67-.13,11.39-.35A121.92,121.92,0,0,0,120,171.41v23.46C100.41,189.4,88,180.39,88,172Zm48,26.25V174.4a179.48,179.48,0,0,0,24,1.6,183.74,183.74,0,0,0,24-1.54v23.79a165.45,165.45,0,0,1-48,0Zm64-3.38V171.5c12.91-3.13,23.84-7.79,32-13.57V172C232,180.39,219.59,189.4,200,194.87Z"></path>
        </svg>
      ),
      path: "/pos/app/products/edit-product-step/4",
    },
    {
      active: path !== undefined && path > 4,
      id: "variants",
      title: "Variants",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          className={`icon ${
            path !== undefined && path > 4 ? "fill-white/90" : " fill-primary"
          } `}
          viewBox="0 0 256 256"
        >
          <path d="M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63Zm-96,96L48,132.69V48h84.69L232,147.31ZM96,84A12,12,0,1,1,84,72,12,12,0,0,1,96,84Z"></path>
        </svg>
      ),
      path: "/pos/app/products/edit-product-step/5",
    },
  ];

  // add form data

  const [addProductFormData, setAddProductFormData] =
    useState<AddProductFormData>({
      addTo: {
        eCommerce: true,
        pos: true,
      },
      name: "",
      description: "",
      gender: "",
      brand: Number(""),
      productCode: "",
      product_type_id: Number(""),
      product_category_id: Number(""),
      product_fitting_id: Number(""),
      image: [],
      stock_price: 0,
      sale_price: 0,
      discount: 0,
      profitInPercent: 0,
      profitInDigit: 0,
      productVariants: [],
    });

  const [editProductFormData, setEditProductFormData] =
    useState<EditProductFormData>({
      id: parseInt(""),
      addTo: {
        eCommerce: false,
        pos: true,
      },
      name: "",
      description: "",
      gender: "",
      brand: parseInt(""),
      productCode: "",
      productTypeId: parseInt(""),
      productCategoryId: parseInt(""),
      productFittingId: parseInt(""),
      medias: [],
      stockPrice: 0,
      salePrice: 0,
      discount: 0,
      profitInPercent: 0,
      profitInDigit: 0,
      productVariants: [],
    });

  const navigateForward = (step: number) => {
    router.push(`/pos/app/products/add-new-product-step/${step}`);
  };

  const navigateBackward = () => {
    router.back();
  };

  const contextValue: ProductContextType = {
    addProductStages,
    navigateForward,
    navigateBackward,
    addProductFormData,
    setAddProductFormData,
    categoryData,
    setCategoryData,
    fittingData,
    setFittingData,
    editProductStages,
    editProductFormData,
    setEditProductFormData,
    swalProps,
    setSwalProps,
  };
  return <Provider.Provider value={contextValue}>{children}</Provider.Provider>;
};

export const useProductProvider = () => {
  const context = useContext(Provider);
  if (!context) {
    throw new Error("useProductProvider must be used within a ProductProvider");
  }

  return context;
};
