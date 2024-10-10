"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Container from "@/components/Container.components";
import NavHeader from "@/components/pos/NavHeader";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

const TimeFilter = () => {
  const router = useRouter();
  const [date, setDate] = React.useState<DateRange | undefined>();

  const dateConverter = (date: any) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  };

  const handleSubmit = () => {
    if (date?.from && date?.to) {
      router.push(
        `/pos/app/time-filter/sale-report/start=${dateConverter(
          date.from
        )}&end=${dateConverter(date.to)}`
      );
    }
  };

  return (
    <Container>
      <div className=" space-y-4">
        <NavHeader
          parentPage="Time Filter"
          path="Sale Report"
          currentPage="Time Filter"
        />
        <div className=" flex gap-3 items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button onClick={handleSubmit}>
            <Search />
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default TimeFilter;
