import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { addDays, isBefore, isAfter, isSameDay, startOfDay } from "date-fns";
import "react-day-picker/dist/style.css";
import { AvailableTime } from "../api/postAPI";

interface DateRange {
  setAvailableDates: React.Dispatch<React.SetStateAction<AvailableTime[]>>;
}

export function DateRangeSelector({ setAvailableDates }: DateRange) {
  const [ranges, setRanges] = useState<{ startDate: Date; endDate: Date }[]>(
    []
  );
  const [selectedStart, setSelectedStart] = useState<Date | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);

  const today = startOfDay(new Date());

  useEffect(() => {
    // 날짜를 ISO 8601 형식으로 변환
    const formattedRanges = ranges.map((range) => ({
      start_Date: range.startDate.toISOString().split("T")[0], // yyyy-MM-dd 형식
      end_Date: range.endDate.toISOString().split("T")[0], // yyyy-MM-dd 형식
    }));

    setAvailableDates(formattedRanges); // 부모 컴포넌트로 전달
  }, [ranges, setAvailableDates]);

  const handleDateClick = (date: Date) => {
    if (isBefore(date, today)) return;

    if (!selectedStart || selectedEnd) {
      setSelectedStart(date);
      setSelectedEnd(null);
    } else if (selectedStart && !selectedEnd) {
      let start = selectedStart;
      let end = date;

      if (isBefore(date, selectedStart)) {
        start = date;
        end = selectedStart;
      }

      const newRange = { startDate: start, endDate: end };

      setRanges((prev) => {
        const filteredRanges = prev.filter(
          (range) =>
            !(
              (isBefore(newRange.startDate, range.endDate) &&
                isAfter(newRange.endDate, range.startDate)) ||
              isSameDay(newRange.startDate, range.startDate) ||
              isSameDay(newRange.endDate, range.endDate)
            )
        );
        return [...filteredRanges, newRange];
      });

      setSelectedStart(null);
      setSelectedEnd(null);
    }
  };

  const handleDateRemove = (date: Date) => {
    setRanges((prevRanges) =>
      prevRanges.flatMap((range) => {
        if (
          isSameDay(date, range.startDate) &&
          isSameDay(date, range.endDate)
        ) {
          return [];
        }

        if (isSameDay(date, range.startDate)) {
          const newStart = addDays(range.startDate, 1);
          return isAfter(newStart, range.endDate)
            ? []
            : [{ startDate: newStart, endDate: range.endDate }];
        }

        if (isSameDay(date, range.endDate)) {
          const newEnd = addDays(range.endDate, -1);
          return isBefore(newEnd, range.startDate)
            ? []
            : [{ startDate: range.startDate, endDate: newEnd }];
        }

        if (isAfter(date, range.startDate) && isBefore(date, range.endDate)) {
          const beforeRange = {
            startDate: range.startDate,
            endDate: addDays(date, -1),
          };
          const afterRange = {
            startDate: addDays(date, 1),
            endDate: range.endDate,
          };
          const result = [];

          if (!isAfter(beforeRange.startDate, beforeRange.endDate)) {
            result.push(beforeRange);
          }
          if (!isAfter(afterRange.startDate, afterRange.endDate)) {
            result.push(afterRange);
          }

          return result;
        }

        return [range];
      })
    );
  };

  const isSelected = (date: Date) => {
    if (selectedStart && !selectedEnd && isSameDay(date, selectedStart)) {
      return true;
    }

    return ranges.some(
      (range) =>
        (isAfter(date, range.startDate) || isSameDay(date, range.startDate)) &&
        (isBefore(date, range.endDate) || isSameDay(date, range.endDate))
    );
  };

  return (
    <div className="w-full max-w-full p-4 text-xl margin-auto ml-8">
      <DayPicker
        disabled={{ before: today }}
        onDayClick={(date) => {
          if (isSelected(date)) {
            handleDateRemove(date);
          } else {
            handleDateClick(date);
          }
        }}
        modifiers={{ selected: isSelected }}
        modifiersClassNames={{
          today: "font-extrabold text-black",
          selected: "bg-amber-400 text-white rounded-full p-3",
        }}
        className="
          text-3xl 
          [&_.rdp-day]:w-16
          [&_.rdp-day]:h-16 
          [&_.rdp-day]:text-2xl 
          [&_.rdp-caption_label]:text-3xl 
          [&_.rdp-head_cell]:text-3xl
        "
      />
      <ul className="mt-4">
        {ranges.map((range, i) => (
          <li key={i} className="text-1xl mb-2 color-gray-700">
            {range.startDate.toLocaleDateString("ko-KR")} ~{" "}
            {range.endDate.toLocaleDateString("ko-KR")}
          </li>
        ))}
      </ul>
    </div>
  );
}
