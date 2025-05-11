import { useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { parseISO, isWithinInterval, isAfter, startOfDay } from "date-fns";
import "react-day-picker/dist/style.css";
import { AvailableTime } from "../../api/postAPI";

interface DateRangeProps {
  availableDates: AvailableTime[];
  onSelect: (range: { start: string; end: string } | null) => void;
}

export function AvailableRangeSelector({
  availableDates,
  onSelect,
}: DateRangeProps) {
  const [range, setRange] = useState<DateRange | undefined>();

  const today = startOfDay(new Date());

  // 문자열 날짜를 Date 객체로 변환
  const parsedRanges = availableDates.map(({ start_Date, end_Date }) => ({
    start: parseISO(start_Date),
    end: parseISO(end_Date),
  }));

  // 유저가 선택한 범위가 availableDates 중 하나 안에 완전히 포함되는지 확인
  const isFullyInsideAvailable = (range: DateRange) => {
    return parsedRanges.some(
      (available) =>
        isWithinInterval(range.from!, {
          start: available.start,
          end: available.end,
        }) &&
        isWithinInterval(range.to!, {
          start: available.start,
          end: available.end,
        })
    );
  };

  const handleSelect = (selected: DateRange | undefined) => {
    if (!selected?.from || !selected?.to) {
      setRange(selected);
      onSelect(null);
      return;
    }

    // from, to가 오늘 이후인지 확인
    if (isAfter(selected.from, today) && isAfter(selected.to, today)) {
      if (isFullyInsideAvailable(selected)) {
        setRange(selected);
        onSelect({
          start: selected.from.toISOString().split("T")[0],
          end: selected.to.toISOString().split("T")[0],
        });
        return;
      }
    }

    // 조건을 만족하지 못하면 선택 무효화
    setRange(undefined);
    onSelect(null);
  };

  // disabled 설정: 오늘 이전이거나 availableDates 범위에 포함되지 않으면 비활성화
  const isDisabled = (date: Date) => {
    if (!isAfter(date, today)) return true;
    return !parsedRanges.some((r) =>
      isWithinInterval(date, { start: r.start, end: r.end })
    );
  };

  return (
    <div className="p-4">
      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleSelect}
        disabled={isDisabled}
        modifiersClassNames={{
          selected: "bg-amber-700 text-white",
        }}
        showOutsideDays
      />
      {range?.from && range?.to && (
        <p className="mt-4 text-blue-700">
          선택된 날짜: {range.from.toDateString()} ~ {range.to.toDateString()}
        </p>
      )}
    </div>
  );
}
