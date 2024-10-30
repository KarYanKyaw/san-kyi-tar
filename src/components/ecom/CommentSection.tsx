import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import useSWR from "swr";
import { Backend_URL, getFetchForEcom } from "@/lib/fetch";
import useSWRMutation from "swr/mutation";

// Define the response shape for your post request
interface PostCommentResponse {
  status: boolean;
  message?: string;
  data?: any;
}

const CommentSection = ({
  isUser,
  openRef,
  postData,
  productId,
  deleteData,
  customerId,
}: {
  isUser: boolean;
  openRef: any;
  postData: (
    url: string,
    { arg }: { arg: any }
  ) => Promise<PostCommentResponse>;
  productId: number;
  deleteData: (url: string) => any;
  customerId: number | undefined;
}) => {
  const [text, setText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isClient, setIsClient] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [deleteId, setDeleteId] = useState<null | number>(null);
  const [editId, setEditId] = useState({
    status: false,
    id: "",
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getData = (url: string) => {
    return getFetchForEcom(url);
  };

  const { data, error, mutate } = useSWR(
    `${Backend_URL}/comments/product/${productId}`,
    getData
  );

  const getSingleData = async (url: string) => {
    try {
      const token = isClient && localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const options: RequestInit = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }

      return data;
    } catch (error: any) {
      console.error("Fetch API Error:", error.message);
      throw new Error(error.message || "An error occurred");
    }
  };

  const { data: singleData, mutate: editMutate } = useSWR(
    editId.status ? `${Backend_URL}/comments/${editId.id}` : null,
    getSingleData,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryInterval: 5000,
      dedupingInterval: 0,
    }
  );

  useEffect(() => {
    if (singleData) {
      setText(singleData.content);
      inputRef.current && inputRef.current?.focus();
    }
  }, [singleData]);

  const {
    data: addData,
    error: addError,
    trigger: postComment,
  } = useSWRMutation(`${Backend_URL}/comments`, postData);

  const { trigger: deleteItem } = useSWRMutation(
    deleteId !== null ? `${Backend_URL}/comments/${deleteId}` : null,
    deleteData
  );

  const patchComment = async (url: string, { arg }: { arg: any }) => {
    try {
      const token = isClient && localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const options: RequestInit = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(arg),
      };
      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }
      return response;
    } catch (error: any) {
      console.error("Fetch API Error:", error.message);
      throw new Error(error.message || "An error occurred");
    }
  };

  const {
    data: editCommentData,
    error: editCommentError,
    trigger: editComment,
  } = useSWRMutation(
    editId.status ? `${Backend_URL}/comments/${editId.id}` : null,
    patchComment
  );

  const [replyId, setReplyId] = useState<null | number>(null);

  const { error: replyError, trigger: reply } = useSWRMutation(
    replyId !== null ? `${Backend_URL}/comments` : null,
    postData
  );

  console.log(data);

  const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);

    const intervals: { label: string; seconds: number }[] = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hr", seconds: 3600 },
      { label: "min", seconds: 60 },
    ];

    for (let i = 0; i < intervals.length; i++) {
      const interval = Math.floor(seconds / intervals[i].seconds);
      if (interval >= 1) {
        return `${interval} ${intervals[i].label}${
          interval > 1 ? "s" : ""
        } ago`;
      }
    }

    return "just now";
  };

  return (
    <div className="my-12 space-y-4">
      <p className="text-2xl font-semibold">Customer Reviews</p>
      <Textarea
        rows={1}
        value={text}
        ref={inputRef}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a review"
        className="w-full lg:w-1/3"
        onFocus={() => {
          if (!isUser) {
            openRef.current.click();
          }
        }}
      />

      {text?.length > 0 && (
        <div className="flex justify-end lg:w-1/3 w-full">
          <Button
            onClick={async () => {
              const res = editId.status
                ? await editComment({ content: text })
                : await postComment({
                    content: text,
                    productId: productId,
                  });

              if (res?.status) {
                setText("");
                setEditId({
                  status: false,
                  id: "",
                });
                mutate();
              }
            }}
          >
            Done
          </Button>
        </div>
      )}
      <div className="w-full lg:w-1/2 my-6">
        {data?.data.filter(
          (el: any) => el.status == "APPROVED" || el.customer.id == customerId
        ).length === 0 ? (
          <p className="font-medium">Be the first one to give a review!</p>
        ) : (
          <p className="font-medium">All Reviews</p>
        )}

        {data?.data
          .filter(
            (el: any) =>
              // el.parentId == null &&
              el.status == "APPROVED" || el.customer.id == customerId
          )
          .map(
            ({
              id: parentId,
              content,
              replies,
              customer: { name, id: customerIds },
              createdAt,
            }: any) => (
              <div
                key={parentId}
                className="border mt-3 space-y-0.5 border-neutral-400 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{name}</p>
                  {customerIds == customerId && (
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <DotsVerticalIcon />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() =>
                            setEditId({
                              status: true,
                              id: parentId,
                            })
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={async () => {
                            await setDeleteId(parentId);
                            const res = await deleteItem();

                            if (res) {
                              mutate();
                            }
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <p className="text-sm font-light">{content}</p>
                <div className=" flex gap-1 items-center">
                  <p className=" text-xs">{timeAgo(createdAt)}</p>
                  <Button
                    variant={"link"}
                    size={"sm"}
                    className=" !text-xs"
                    onClick={() => {
                      setReplyId(parentId);
                    }}
                  >
                    Reply
                  </Button>
                </div>
                {replies.length > 0 && (
                  <>
                    {replies.map(
                      (
                        {
                          content,
                          customer: { name, id: replyCustomerId },
                          id,
                          shopCreated,
                          parentId,
                          createdAt,
                          status,
                        }: any,
                        index: any
                      ) => (
                        <React.Fragment key={index}>
                          {(status == "APPROVED" ||
                            replyCustomerId == customerId) && (
                            <div key={index} className=" pt-3 space-y-0.5">
                              <div className=" flex justify-between items-center">
                                <p className="font-medium">{name}</p>
                                {!shopCreated && replyCustomerId == customerId && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger>
                                      <DotsVerticalIcon />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          setEditId({
                                            status: true,
                                            id,
                                          })
                                        }
                                      >
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={async () => {
                                          await setDeleteId(id);
                                          const res = await deleteItem();

                                          if (res) {
                                            mutate();
                                          }
                                        }}
                                      >
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                              </div>
                              <p className="text-sm font-light">{content}</p>
                              <div className=" flex gap-1 items-center">
                                <p className=" text-xs">{timeAgo(createdAt)}</p>

                                <Button
                                  variant={"link"}
                                  size={"sm"}
                                  className=" !text-xs"
                                  onClick={() => {
                                    setReplyId(parentId);
                                  }}
                                >
                                  Reply
                                </Button>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      )
                    )}
                  </>
                )}

                <div className=" mt-2">
                  {replyId !== null && replyId == parentId && (
                    <Textarea
                      rows={1}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a review"
                      className="w-full lg:w-2/3"
                    />
                  )}

                  {replyText.length > 0 && (
                    <div className=" flex justify-end mt-3 lg:w-2/3">
                      <Button
                        onClick={async () => {
                          const res = editId.status
                            ? await editComment({ content: text })
                            : await reply({
                                content: replyText,
                                productId: productId,
                                parentId: parentId,
                              });

                          if (res?.status) {
                            setReplyText("");
                            setReplyId(null);
                            mutate();
                          }
                        }}
                      >
                        Done
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )
          )}
      </div>
    </div>
  );
};

export default CommentSection;
