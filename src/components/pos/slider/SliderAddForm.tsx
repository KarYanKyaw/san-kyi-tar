import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { FilePond } from "react-filepond";

const SliderAddForm = ({
  remove,
  id,
  sorting,
  mobileImage,
  desktopImage,
  setImages,
  images,
  data,
}: {
  remove: (id: any) => void;
  id: any;
  sorting: number;
  mobileImage: any;
  desktopImage: any;
  setImages: any;
  images: any;
  data: any;
}) => {
  const handleDesktopFilesUpdate = (fileItems: any) => {
    if (fileItems.length > 0) {
      const validFiles = fileItems.map((fileItem: any) => ({
        file:
          fileItem.file instanceof File
            ? fileItem.file
            : (fileItem.file.file as File),
      }));
      setImages((prevImages: any) =>
        prevImages.map((el: any) =>
          el.id === id
            ? {
                ...el,
                desktopImage: validFiles,
              }
            : el
        )
      );
    } else {
      setImages((prevImages: any) =>
        prevImages.map((el: any) =>
          el.id === id
            ? {
                ...el,
                desktopImage: data?.data?.find((el: any) => el.id == id)
                  ?.desktopImage,
              }
            : el
        )
      );
    }
  };

  const handleMobileFilesUpdate = (fileItems: any) => {
    if (fileItems.length > 0) {
      const validFiles = fileItems.map((fileItem: any) => ({
        file:
          fileItem.file instanceof File
            ? fileItem.file
            : (fileItem.file.file as File),
      }));
      setImages((prevImages: any) =>
        prevImages.map((el: any) =>
          el.id === id
            ? {
                ...el,
                mobileImage: validFiles,
              }
            : el
        )
      );
    } else {
      setImages((prevImages: any) =>
        prevImages.map((el: any) =>
          el.id === id
            ? {
                ...el,
                mobileImage: data?.data?.find((el: any) => el.id == id)
                  ?.mobileImage,
              }
            : el
        )
      );
    }
  };

  return (
    <div className="group space-y-1.5">
      <div className="flex  h-[50px] justify-between">
        <p className="text-lg font-semibold">Place {sorting}</p>
        <div className="flex  duration-300 items-center gap-3">
          <Button
            className="hidden group-hover:block"
            onClick={() => remove(id)}
            size={"sm"}
            variant={"outline"}
          >
            <Trash2 color="red" />
          </Button>
          <div className="">
            <Select
              onValueChange={() => {
                const currentSorting = images.find(
                  (el: any) => el.id == id
                )?.sorting;
                const updatedImages = images.map((el: any) => {
                  if (el.id === id) {
                    return {
                      ...el,
                      sorting: 1,
                      sortingChanged: true,
                    };
                  } else if (el.sorting === 1) {
                    return {
                      ...el,
                      sorting: currentSorting,
                      sortingChanged: true,
                    };
                  } else {
                    return el;
                  }
                });

                setImages(
                  updatedImages.sort((a: any, b: any) => a.sorting - b.sorting)
                );
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Move To Top</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-5">
        <div className="space-y-0.5 col-span-7">
          <p className="font-light text-neutral-500 pb-1 text-sm">
            Add image for Desktop
          </p>
          <FilePond
            className="!bg-white !rounded-md"
            allowMultiple={false}
            onupdatefiles={handleDesktopFilesUpdate}
            allowDrop={true}
            server={null}
            instantUpload={false}
          />

          {desktopImage && (
            <>
              {typeof desktopImage === "string" ? (
                <Image
                  src={desktopImage}
                  alt="photo"
                  className="w-auto !h-[400px]"
                  width={400}
                  height={400}
                />
              ) : (
                desktopImage[0]?.file && (
                  <Image
                    src={URL.createObjectURL(desktopImage[0].file)}
                    alt="photo"
                    className="w-auto object-cover !h-[600px]"
                    width={400}
                    height={400}
                  />
                )
              )}
            </>
          )}
        </div>
        <div className="col-span-5">
          <p className="font-light text-neutral-500 pb-1 text-sm">
            Add image for Mobile
          </p>

          <FilePond
            className="!bg-white !rounded-md"
            allowDrop={true}
            maxFiles={1}
            server={null}
            instantUpload={false}
            allowMultiple={false}
            onupdatefiles={handleMobileFilesUpdate}
          />

          {mobileImage && (
            <>
              {typeof mobileImage === "string" ? (
                <Image
                  src={mobileImage}
                  alt="photo"
                  className="w-auto !h-[400px]"
                  width={400}
                  height={400}
                />
              ) : (
                mobileImage[0]?.file && (
                  <Image
                    src={URL.createObjectURL(mobileImage[0].file)}
                    alt="photo"
                    className="w-auto object-cover !h-[400px]"
                    width={400}
                    height={400}
                  />
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SliderAddForm;
