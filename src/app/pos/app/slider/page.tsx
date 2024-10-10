"use client";

import Container from "@/components/Container.components";
import NavHeader from "@/components/pos/NavHeader";
import SliderAddForm from "@/components/pos/slider/SliderAddForm";
import { Button } from "@/components/ui/button";
import {
  Backend_URL,
  deleteFetch,
  deleteSingleFetch,
  editProductFetch,
  editSliderFetch,
  getFetch,
  postFetch,
  postMediaFetch,
} from "@/lib/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Form, useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { z } from "zod";

const SliderPage = () => {
  const [images, setImages] = useState<any[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editId2, setEditId2] = useState<number | null>(null);

  const getData = (url: string) => {
    return getFetch(url);
  };

  const deleteData = (url: string) => {
    return deleteSingleFetch(url);
  };

  const postFetcher = (url: string, { arg }: { arg: any }) => {
    return postMediaFetch(url, arg);
  };

  const editFetcher = (url: string, { arg }: { arg: any }) => {
    return editSliderFetch(url, arg);
  };

  const { data, isLoading, mutate } = useSWR(
    `${Backend_URL}/api/v1/sliders`,
    getData
  );

  const { data: dropData, trigger: drop } = useSWRMutation(
    deleteId !== null ? `${Backend_URL}/api/v1/sliders/${deleteId}` : null,
    deleteData
  );

  const { trigger: add, error: addError } = useSWRMutation(
    `${Backend_URL}/api/v1/sliders`,
    postFetcher
  );

  const {
    trigger: edit,
    error: editError,
    data: editData,
  } = useSWRMutation(`${Backend_URL}/api/v1/sliders/${editId}`, editFetcher);

  const {
    trigger: edit2,
    error: editError2,
    data: editData2,
  } = useSWRMutation(`${Backend_URL}/api/v1/sliders/${editId2}`, editFetcher);

  useEffect(() => {
    if (data) {
      setImages(data?.data.sort((a: any, b: any) => a.sorting - b.sorting));
    }
  }, [data]);

  const addPhoto = async () => {
    const data = images.filter((el) => el.toBeUploaded);
    if (data.length > 0) {
      const formData = new FormData();

      data.map((el) => {
        if (el.desktopImage) {
          formData.append("desktopImage", el.desktopImage[0].file);
        }
        if (el.mobileImage) {
          formData.append("mobileImage", el.mobileImage[0].file);
        }
        formData.append("sorting", el.sorting);
      });

      const res = await add(formData);
      if (res) {
        setImages([]);
        mutate();
      }
    } else {
      return;
    }
  };

  const remove = async (id: any) => {
    if (data?.data.some((el: any) => el.id == id)) {
      await setDeleteId(id);
      await drop();
      mutate();
    } else {
      setImages(images.filter((el) => el.id !== id));
    }
  };

  const editPhoto = async () => {
    const data = images
      .filter((el) => !el?.toBeUploaded)
      .filter(
        (el) =>
          typeof el.desktopImage !== "string" ||
          typeof el.mobileImage !== "string" ||
          el?.sortingChanged
      );

    const dataWithoutSortingChanged = data.filter(
      (el: any) => !el?.sortingChanged
    );

    const dataWithSortingChanged = data.filter((el: any) => el?.sortingChanged);

    if (data.length > 0) {
      const formData = new FormData();
      if (dataWithoutSortingChanged.length > 0) {
        await setEditId(data[0]?.id);
        if (typeof dataWithoutSortingChanged[0].desktopImage !== "string") {
          formData.append(
            "desktopImage",
            dataWithoutSortingChanged[0].desktopImage[0].file
          );
        }

        if (typeof dataWithoutSortingChanged[0].mobileImage !== "string") {
          formData.append(
            "mobileImage",
            dataWithoutSortingChanged[0].mobileImage[0].file
          );
        }
        const res = await edit(formData);
        if (res) {
          setImages([]);
          mutate();
          setEditId(null);
        }
      }
      if (dataWithSortingChanged.length > 0) {
        await setEditId(dataWithSortingChanged[0]?.id);
        await setEditId2(dataWithSortingChanged[1]?.id);

        const formData2 = new FormData();

        formData.append("sorting", dataWithSortingChanged[0].sorting);
        formData2.append("sorting", dataWithSortingChanged[1].sorting);

        const res = await edit(formData);
        const res2 = await edit2(formData2);

        if (res && res2) {
          setImages([]);
          mutate();
          setEditId(null);
          return;
        }
      }
    } else {
      return;
    }
  };

  return (
    <Container>
      <div className=" space-y-4">
        <NavHeader parentPage="Slider" path="Ecommerce " currentPage="Slider" />
        {addError && (
          <p className=" text-red-500 text-sm">{addError?.message}</p>
        )}
        {editError && (
          <p className=" text-red-500 text-sm">{editError?.message}</p>
        )}
        <div className=" flex justify-between border-b pb-3 items-center">
          <div className=" space-y-0.5 ">
            <p className=" text-xl font-bold">Upload Photo</p>
            <p className=" text-sm font-semibold text-neutral-500">
              Banner Photos for your Ecommerce
            </p>
          </div>
          <Button
            onClick={() => {
              editPhoto();
              addPhoto();
            }}
            className=""
          >
            Save
          </Button>
        </div>
        <div className=" space-y-4">
          {images?.length > 0 && (
            <>
              {images?.map(
                (
                  { sorting, id, desktopImage, mobileImage }: any,
                  index: number
                ) => (
                  <SliderAddForm
                    key={index}
                    data={data}
                    id={id}
                    images={images}
                    setImages={setImages}
                    sorting={sorting}
                    remove={remove}
                    desktopImage={desktopImage}
                    mobileImage={mobileImage}
                  />
                )
              )}
            </>
          )}
          <Button
            onClick={() =>
              setImages([
                ...images,
                {
                  id: Date.now(),
                  sorting: images[images.length - 1]?.sorting + 1 || 1,
                  desktopImage: "",
                  mobileImage: "",
                  toBeUploaded: true,
                },
              ])
            }
          >
            <ImagePlus /> <span className=" ms-1">Add New Photo</span>
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default SliderPage;
