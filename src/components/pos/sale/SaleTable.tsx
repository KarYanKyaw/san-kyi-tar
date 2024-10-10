"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { MinusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  productName: string;
  price: number;
  quantity: number;
  discountByValue: number;
  cost: number;
  productCategory: string;
  productFitting: string;
  productType: string;
  gender: string;
  productSizing: string;
  discount: number;
}

interface SaleTableProps {
  data: Product[];
  setData: React.Dispatch<React.SetStateAction<Product[]>>;
}

const SaleTable: React.FC<SaleTableProps> = ({ data, setData }) => {
  const priceChange = (id: number, price: string) => {
    const priceValue = parseFloat(price);

    setData(
      data.map((el) =>
        el.id === id
          ? {
              ...el,
              price: priceValue,
              cost:
                el.discountByValue > 0
                  ? el.quantity * priceValue - el.discountByValue
                  : el.discount > 0
                  ? el.quantity * priceValue * (1 - el.discount / 100)
                  : el.quantity * priceValue,
            }
          : el
      )
    );
  };

  const discountChange = (id: number, discount: string) => {
    const discountValue = parseFloat(discount);
    setData(
      data.map((el) =>
        el.id === id
          ? {
              ...el,
              discountByValue: discountValue,
              discount: 0,
              cost:
                discountValue > 0
                  ? el.quantity * el.price - discountValue
                  : el.quantity * el.price,
            }
          : el
      )
    );
  };

  const discountPercentChange = (id: number, discount: string) => {
    const discountValue = parseFloat(discount);
    setData(
      data.map((el) =>
        el.id === id
          ? {
              ...el,
              discountByValue: 0,
              discount: discountValue,
              cost:
                discountValue > 0
                  ? el.quantity * el.price * (1 - discountValue / 100)
                  : el.quantity * el.price,
            }
          : el
      )
    );
  };

  const remove = (id: number) => () => {
    setData(data.filter((el) => el.id !== id));
  };

  return (
    <div className="lg:h-[200px] xl:h-[505px] z-[900] overflow-auto">
      <Table>
        <TableHeader className="hover:bg-white">
          <TableRow className="hover:bg-white bg-white">
            <TableHead>No</TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="text-end">Price</TableHead>
            <TableHead className="text-end">Quantity</TableHead>
            <TableHead className="text-end">Disc %</TableHead>
            <TableHead className="text-end">Disc</TableHead>
            <TableHead className="w-[100px] text-end">Cost</TableHead>
            <TableHead className=""></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length < 1 ? (
            <TableRow className="pointer-events-none bg-white">
              {Array(8)
                .fill(null)
                .map((_, index) => (
                  <TableCell className="pointer-events-none" key={index}>
                    <p className="py-3"></p>
                  </TableCell>
                ))}
            </TableRow>
          ) : (
            <>
              {data.map(
                (
                  {
                    productName,
                    price,
                    id,
                    quantity,
                    discountByValue,
                    cost,
                    gender,
                    productSizing,
                    discount,
                  },
                  index
                ) => (
                  <TableRow key={index} className=" bg-white hover:bg-white/35">
                    <TableCell>
                      <div className="flex justify-center items-center gap-3">
                        <Checkbox />
                        <span>{index + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex gap-1 items-start justify-center flex-col">
                          <p className="capitalize font-medium">
                            {productName}
                          </p>
                          <div className="flex items-center gap-1">
                            <div className="bg-muted/90 text-xs font-medium capitalize text-muted-foreground px-1.5 py-0.5 rounded-md">
                              {gender}
                            </div>
                            <div className="bg-muted/90 text-xs font-medium capitalize text-muted-foreground px-1.5 py-0.5 rounded-md">
                              {productSizing}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-end ">
                      <Input
                        value={price}
                        onChange={(e) => priceChange(id, e.target.value)}
                        min={1}
                        type="number"
                        className="text-end w-[90%] h-8"
                      />
                    </TableCell>
                    <TableCell className="text-end">
                      <div className="flex justify-end">
                        <p>{quantity}</p>
                      </div>
                    </TableCell>

                    <TableCell className="text-end">
                      <div className="flex justify-end">
                        <Input
                          value={discount}
                          onChange={(e) => {
                            discountPercentChange(id, e.target.value);
                          }}
                          min={0}
                          type="number"
                          className="text-end w-[70%] h-8"
                        />
                      </div>
                    </TableCell>

                    <TableCell className="text-end">
                      <div className="flex justify-end">
                        <Input
                          value={discountByValue}
                          onChange={(e) => {
                            discountChange(id, e.target.value);
                          }}
                          min={0}
                          type="number"
                          className="text-end w-[70%] h-8"
                        />
                      </div>
                    </TableCell>

                    <TableCell className="text-end">
                      <div className="flex justify-end">
                        {isNaN(cost) ? (
                          0
                        ) : (
                          <>
                            {new Intl.NumberFormat("ja-JP").format(
                              cost.toFixed(0) as never
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-end">
                      <Button onClick={remove(id)} variant="ghost" size="sm">
                        <MinusCircle />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SaleTable;
