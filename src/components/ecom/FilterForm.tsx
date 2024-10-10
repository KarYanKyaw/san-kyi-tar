import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import useSWR from "swr";
import { Backend_URL, getFetch, getFetchForEcom } from "@/lib/fetch";
import FilterItem from "./FilterItem";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Checkbox } from "../ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

const FilterForm = ({ closeRef }: any) => {
  const [isClient, setIsClient] = useState(false);
  const [genders, setGenders] = useState<string[]>([]);
  const [brands, setBrands] = useState<(string | number)[]>([]);
  const [brandName, setBrandName] = useState<string[]>([]);
  const [type, setType] = useState<(string | number)[]>([]);
  const [size, setSize] = useState<(string | number)[]>([]);
  const [category, setCategory] = useState<(string | number)[]>([]);
  const [fitting, setFitting] = useState<(string | number)[]>([]);
  const [range, setRange] = useState([0, 0]);
  const [open, setOpen] = useState<number[]>([1, 2, 3, 4]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [fittingData, setFittingData] = useState<any[]>([]);
  const [sizeData, setSizeData] = useState([]);
  const [openSelect, setOpenSelect] = useState(false);
  const [openSelectFitting, setOpenSelectFitting] = useState(false);
  const [categoryName, setCategoryName] = useState<string[]>([]);
  const [typeName, setTypeName] = useState<string[]>([]);
  const [fittingName, setFittingName] = useState("");

  const router = useRouter();

  // Load saved filter values from localStorage
  useEffect(() => {
    const savedFilters = isClient && localStorage.getItem("filters");
    if (savedFilters) {
      const filters = JSON.parse(savedFilters);
      setGenders(filters.genders || []);
      setBrands(filters.brands || []);
      setType(filters.type || []);
      setRange(filters.range || [0, 0]);
      setBrandName(filters.brandName || []);
      setSize(filters.size || [1, 5]);
      setCategory(filters.category || [1, 5]);
      setCategoryName(filters.categoryName || []);
      setTypeName(filters.typeName || []);
      setFitting(filters.fitting || [1, 5]);
    }
  }, [isClient]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleGenderChange = (value: string) => {
    setGenders((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleBrandChange = (value: string | number) => {
    setBrands((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleSizesChange = (value: string | number) => {
    setSize((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleCategoryChange = (value: string | number) => {
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleFittingChange = (value: string | number) => {
    setFitting([value]);
  };

  const handleTypeChange = (value: string | number) => {
    // Update the selected types
    const updatedTypes = type.includes(value)
      ? type.filter((item) => item !== value)
      : [...type, value];

    setType(updatedTypes);

    // If no type is selected, log all categories, otherwise log the selected categories
    const selectedCategories =
      updatedTypes.length === 0
        ? typesData.data.flatMap((el: any) => el.productCategories) // Log all categories if no type is selected
        : typesData.data
            .filter((el: any) => updatedTypes.includes(el.id))
            .flatMap((el: any) => el.productCategories);

    setCategoryData(selectedCategories);
  };

  const getData = (url: string) => {
    return getFetchForEcom(url);
  };

  const { data: brandData, isLoading: brandLoading } = useSWR(
    `${Backend_URL}/product-brands/all`,
    getData
  );

  const { data: typesData, isLoading: typesLoading } = useSWR(
    `${Backend_URL}/product-types/alls`,
    getData
  );

  useEffect(() => {
    if (typesData) {
      setCategoryData(
        typesData?.data?.flatMap((el: any) => el.productCategories)
      );
    }

    if (category.length > 0) {
      setFittingData(
        typesData?.data
          ?.flatMap((el: any) => el.productCategories)
          .find((el: any) => el.id == category[0])?.productFittings
      );

      setFittingName(
        typesData?.data
          ?.flatMap((el: any) => el.productCategories)
          ?.flatMap((categoryEl: any) => categoryEl?.productFittings)
          ?.find((el: any) => el.id == fitting[0])?.name
      );

      setSizeData(
        typesData?.data
          ?.flatMap((el: any) => el.productCategories)
          ?.flatMap((categoryEl: any) => categoryEl?.productFittings)
          ?.find((el: any) => el.id == fitting[0])?.productSizings
      );
    }
  }, [typesData, category, categoryName]);

  // Function to handle input changes
  const handleInputChange = (index: number, value: string) => {
    const newRange = [...range];
    newRange[index] = value ? parseInt(value, 10) : 0;
    setRange(newRange);
  };

  const handleRangeChange = (value: any) => {
    setRange(value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // Save filter values to localStorage
    isClient &&
      localStorage.setItem(
        "filters",
        JSON.stringify({
          genders,
          brands,
          type,
          range,
          open,
          brandName,
          size,
          category,
          categoryName,
          fitting,
          typeName,
        })
      );

    // Create an array to hold the query parameters
    const queryParams = [];

    // Add selected genders to the query parameters
    if (genders.length > 0) {
      queryParams.push(`sortGender=${genders.join(",").toLowerCase()}`);
    }

    // Add selected brands to the query parameters
    if (brands.length > 0) {
      queryParams.push(`sortBrand=${brands.join(",")}`);
    }

    // Add selected types to the query parameters
    if (type.length > 0) {
      queryParams.push(`sortType=${type.join(",")}`);
    }

    if (category.length > 0) {
      queryParams.push(`sortCategory=${category.join(",")}`);
    }

    if (fitting.length > 0) {
      queryParams.push(`sortFitting=${size.join(",")}`);
    }

    if (size.length > 0) {
      queryParams.push(`sortSizing=${size.join(",")}`);
    }

    // Add range to the query parameters
    if (range[0] > 0 && range[1] > 0) {
      queryParams.push(`min=${range[0]}`);
      queryParams.push(`max=${range[1]}`);
    }

    const nameSegments = [
      ...(brandName.length > 0 ? [`${brandName.join(", ")}`] : []),
      ...(typeName.length > 0 ? [`${typeName.join(", ")}`] : []),
      ...(categoryName.length > 0 ? [`${categoryName.join(", ")}`] : []),
    ];

    const queryString =
      queryParams.length > 0 ? `/${queryParams.join("&")}` : "";

    // Add nameSegments to the URL if there are any
    const fullPath =
      nameSegments.length > 0
        ? `/products-filter${queryString}&page=1/${nameSegments.join("/")}`
        : `/products-filter${queryString}&page=1`;

    // Navigate to the constructed URL
    router.push(fullPath);
  };

  return (
    <form className=" h-[90%] relative overflow-hidden" onSubmit={handleSubmit}>
      <div className="space-y-4 h-[90%] overflow-auto">
        <div className="space-y-1.5">
          <div
            onClick={() => {
              if (open.includes(1)) {
                setOpen(open.filter((el) => el !== 1));
              } else {
                setOpen([...open, 1]);
              }
            }}
            className="flex justify-between"
          >
            <Label>Gender</Label>
            {open.includes(1) ? <ChevronDown /> : <ChevronUp />}
          </div>
          {open.includes(1) && (
            <div className="grid grid-cols-2 gap-3">
              <FilterItem
                run={handleGenderChange}
                name="Men"
                value="Men"
                isChecked={genders.includes("Men")}
              />
              <FilterItem
                run={handleGenderChange}
                name="Women"
                value="Women"
                isChecked={genders.includes("Women")}
              />
              <FilterItem
                run={handleGenderChange}
                name="Unisex"
                value="Unisex"
                isChecked={genders.includes("Unisex")}
              />
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <div
            onClick={() => {
              if (open.includes(2)) {
                setOpen(open.filter((el) => el !== 2));
              } else {
                setOpen([...open, 2]);
              }
            }}
            className="flex justify-between"
          >
            <Label>Brands</Label>
            {open.includes(2) ? <ChevronDown /> : <ChevronUp />}
          </div>
          {open.includes(2) && (
            <div className="grid grid-cols-2 gap-3">
              {!brandLoading &&
                brandData?.data?.map(
                  ({ id, name }: { id: number; name: string }) => (
                    <div
                      key={id}
                      className="flex items-center select-none space-x-2 bg-secondary p-3"
                    >
                      <Checkbox
                        id={name}
                        checked={brands.includes(id)}
                        onCheckedChange={() => {
                          handleBrandChange(id);
                          setBrandName((prev) =>
                            prev.includes(name)
                              ? prev.filter((item) => item !== name)
                              : [...prev, name]
                          );
                        }}
                      />
                      <label
                        htmlFor={name}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {name}
                      </label>
                    </div>
                  )
                )}
            </div>
          )}
        </div>

        {/* types */}

        <div className="space-y-1.5">
          <div
            onClick={() => {
              if (open.includes(3)) {
                setOpen(open.filter((el) => el !== 3));
              } else {
                setOpen([...open, 3]);
              }
            }}
            className="flex justify-between"
          >
            <Label>Product Types</Label>
            {open.includes(3) ? <ChevronDown /> : <ChevronUp />}
          </div>
          {open.includes(3) && (
            <div className="grid grid-cols-2 gap-3">
              {!typesLoading &&
                typesData.data?.map(
                  ({ id, name }: { id: number; name: string }) => (
                    <FilterItem
                      key={id}
                      run={() => {
                        handleTypeChange(id);
                        setTypeName((prev) =>
                          prev.includes(name)
                            ? prev.filter((item) => item !== name)
                            : [...prev, name]
                        );
                      }}
                      name={name}
                      value={id}
                      isChecked={type.includes(id)}
                    />
                  )
                )}
            </div>
          )}
        </div>

        {/* categories */}
        <div className="space-y-1.5">
          <div
            onClick={() => {
              if (open.includes(5)) {
                setOpen(open.filter((el) => el !== 5));
              } else {
                setOpen([...open, 5]);
              }
            }}
            className="flex justify-between"
          >
            <Label>Product Categories</Label>
            {open.includes(5) ? <ChevronDown /> : <ChevronUp />}
          </div>
          {open.includes(5) && (
            <div className=" w-full">
              <>
                {categoryData?.length > 0 && (
                  <div className=" space-y-1.5 basis-1/2">
                    {categoryData?.map(({ id, name }: any) => (
                      <div
                        key={id}
                        className="flex items-center select-none space-x-2 bg-secondary p-3"
                      >
                        <Checkbox
                          id={name}
                          checked={category.includes(id)}
                          onCheckedChange={() => {
                            handleCategoryChange(id);
                            setCategoryName((prev) =>
                              prev.includes(name)
                                ? prev.filter((item) => item !== name)
                                : [...prev, name]
                            );
                          }}
                        />
                        <label
                          htmlFor={name}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </>
            </div>
          )}
        </div>

        {/* fittings */}
        <div className="space-y-1.5">
          <div
            onClick={() => {
              if (open.includes(8)) {
                setOpen(open.filter((el) => el !== 8));
              } else {
                setOpen([...open, 8]);
              }
            }}
            className="flex justify-between"
          >
            <Label>Fittings</Label>
            {open.includes(8) ? <ChevronDown /> : <ChevronUp />}
          </div>
          {open.includes(8) && (
            <div className=" w-full">
              <Popover
                open={openSelectFitting}
                onOpenChange={setOpenSelectFitting}
              >
                <PopoverTrigger className=" w-full" asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between !rounded-md"
                  >
                    {fittingName ? fittingName : "Fittings"}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className=" w-full h-full p-0">
                  <Command defaultValue={fitting[0] as string}>
                    <CommandInput
                      placeholder="Search Fitting..."
                      className="h-9"
                    />
                    <CommandEmpty>No fitting found!</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {fittingData?.map(({ id, name }: any) => (
                          <CommandItem
                            className={cn(fitting[0] === id ? "bg-accent" : "")}
                            key={id}
                            value={name}
                            onSelect={() => {
                              const selectedFitting = fittingData.find(
                                (el: any) => el.id === id
                              );
                              setSizeData(
                                selectedFitting?.productSizings || []
                              );
                              setOpenSelectFitting(false);
                              setFittingName(selectedFitting?.name || ""); // Set categoryName properly
                              handleFittingChange(id);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                fitting.includes(id)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* sizes */}

        <div className="space-y-1.5">
          <div
            onClick={() => {
              if (open.includes(6)) {
                setOpen(open.filter((el) => el !== 6));
              } else {
                setOpen([...open, 6]);
              }
            }}
            className="flex justify-between"
          >
            <Label>Sizes</Label>
            {open.includes(6) ? <ChevronDown /> : <ChevronUp />}
          </div>
          {open.includes(6) && (
            <>
              {sizeData?.length > 0 && (
                <div className=" space-y-1.5 basis-1/2">
                  {sizeData?.map(({ id, name }: any) => (
                    <div
                      key={id}
                      className="flex items-center select-none space-x-2 bg-secondary p-3"
                    >
                      <Checkbox
                        id={name}
                        checked={size.includes(id)}
                        onCheckedChange={() => {
                          handleSizesChange(id);
                        }}
                      />
                      <label
                        htmlFor={name}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* <div className="space-y-1.5 ">
          <div
            onClick={() => {
              if (open.includes(4)) {
                setOpen(open.filter((el) => el !== 4));
              } else {
                setOpen([...open, 4]);
              }
            }}
            className="flex justify-between"
          >
            <Label>Prices</Label>
            {open.includes(4) ? <ChevronDown /> : <ChevronUp />}
          </div>
          {open.includes(4) && (
            <>
              <div className="flex gap-3 items-center">
                <Input
                  className="w-1/2"
                  value={range[0]}
                  onChange={(e) => handleInputChange(0, e.target.value)}
                  placeholder="Min"
                />
                <Input
                  className="w-1/2"
                  value={range[1]}
                  onChange={(e) => handleInputChange(1, e.target.value)}
                  placeholder="Max"
                />
              </div>
              <div className="pt-1.5 mx-2">
                <Slider
                  minStepsBetweenThumbs={1}
                  max={50000000}
                  min={50000}
                  step={1}
                  value={range}
                  onValueChange={handleRangeChange}
                  formatLabel={(value) => `${value}`}
                />
              </div>
            </>
          )}
        </div> */}

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() => {
              setGenders([]);
              setBrands([]);
              setBrandName([]);
              setType([]);
              setRange([50000, 0]);
              setSize([]);
              setCategory([]);
              setFitting([]);
              setSize([]);
              setSizeData([]);
              setFittingData([]);
              setCategoryData([]);
              setCategoryName([]);
              setFittingName("");
            }}
            className="  underline"
            variant={"link"}
          >
            Reset
          </Button>
        </div>
      </div>

      <div className=" absolute bottom-0 w-full  flex justify-between">
        <Button
          onClick={() => closeRef.current && closeRef.current.click()}
          type="button"
          variant="link"
        >
          Cancel
        </Button>
        <Button
          disabled={
            genders.length == 0 &&
            brands.length == 0 &&
            type.length == 0 &&
            range[1] == 0 &&
            size.length == 0 &&
            category.length == 0
          }
          type="submit"
          size="sm"
        >
          Save changes
        </Button>
      </div>
    </form>
  );
};

export default FilterForm;
