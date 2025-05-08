import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { addDays, isBefore, isAfter, isSameDay } from "date-fns";
import "react-day-picker/dist/style.css";

export function DateRangeSelector() {
  const [ranges, setRanges] = useState<{ start: Date; end: Date }[]>([]);
  const [selectedStart, setSelectedStart] = useState<Date | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);

  useEffect(() => {
    console.log(exportRange(ranges));
  }, [ranges]);

  const handleDateClick = (date: Date) => {
    if (!selectedStart || selectedEnd) {
      // 시작 날짜가 없으면 시작 날짜 설정
      setSelectedStart(date);
      setSelectedEnd(null);
    } else if (selectedStart && !selectedEnd) {
      // 끝 날짜 설정
      setSelectedEnd(date);

      // 시작 날짜와 끝 날짜 사이의 모든 날짜를 선택된 날짜로 설정
      const newRange = { start: selectedStart, end: date };

      // 기존 범위와 겹치는지 확인 후 추가
      setRanges((prev) => {
        const filteredRanges = prev.filter(
          (range) =>
            !(
              (isBefore(newRange.start, range.end) &&
                isAfter(newRange.end, range.start)) ||
              isSameDay(newRange.start, range.start) ||
              isSameDay(newRange.end, range.end)
            )
        );

        return [...filteredRanges, newRange];
      });

      setSelectedStart(null);
      setSelectedEnd(null); // 범위 선택 후 초기화
    }
  };

  const exportRange = (ranges: { start: Date; end: Date }[]) => {
    return ranges.map((range) => ({
      startDate: range.start.toISOString().split("T")[0], // "YYYY-MM-DD" 형식으로 변환
      endDate: range.end.toISOString().split("T")[0], // "YYYY-MM-DD" 형식으로 변환
    }));
  };

  // 날짜 범위 내의 모든 날짜를 가져오는 함수
  const getDatesInRange = (start: Date, end: Date) => {
    const dates = [];
    let currentDate = start;
    while (isBefore(currentDate, end) || isSameDay(currentDate, end)) {
      dates.push(currentDate);
      currentDate = addDays(currentDate, 1);
    }
    return dates;
  };

  // 날짜 클릭 시 범위 삭제 (범위 분할)
  const handleDateRemove = (date: Date) => {
    setRanges((prevRanges) =>
      prevRanges.flatMap((range) => {
        if (isSameDay(date, range.start)) {
          // 시작 날짜를 클릭하면 범위에서 시작 날짜를 제거
          return range.end
            ? [{ start: addDays(range.start, 1), end: range.end }]
            : [];
        } else if (isSameDay(date, range.end)) {
          // 종료 날짜를 클릭하면 범위에서 종료 날짜를 제거
          return range.start
            ? [{ start: range.start, end: addDays(range.end, -1) }]
            : [];
        }
        return [range]; // 범위가 변경되지 않으면 그대로 반환
      })
    );
  };

  // 날짜가 선택되었는지 확인
  const isSelected = (date: Date) => {
    return ranges.some(
      (range) =>
        (isBefore(date, range.end) || isSameDay(date, range.end)) &&
        (isAfter(date, range.start) || isSameDay(date, range.start))
    );
  };

  return (
    <div className="w-full max-w-full p-4 text-xl margin-auto">
      <DayPicker
        selected={ranges.flatMap((range) =>
          getDatesInRange(range.start, range.end)
        )}
        onDayClick={(date) => {
          if (isSelected(date)) {
            handleDateRemove(date); // 이미 선택된 날짜를 클릭하면 해당 날짜 삭제
          } else {
            handleDateClick(date); // 날짜를 클릭하면 범위 설정
          }
        }}
        modifiers={{ selected: isSelected }}
        className="text-xl" // Tailwind CSS를 사용하여 글자 크기 조정
      />
      <ul>
        {ranges.map((range, i) => (
          <li key={i}>
            {range.start.toDateString()} ~ {range.end.toDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
