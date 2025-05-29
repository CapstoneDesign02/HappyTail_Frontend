import { DayPicker } from "react-day-picker";
import { isSameDay, startOfDay } from "date-fns";
import "react-day-picker/dist/style.css";
import { AvailableTime } from "../api/postAPI";

interface DateRangeProps {
  availableDates: AvailableTime[];
}

export function AvailableDateSelector({ availableDates }: DateRangeProps) {
  const today = startOfDay(new Date());

  const parsedDates = availableDates.map((range) => ({
    startDate: new Date(range.start_Date),
    endDate: new Date(range.end_Date),
  }));

  const isAvailableDate = (date: Date) => {
    return parsedDates.some(
      (range) =>
        isSameDay(date, range.startDate) ||
        isSameDay(date, range.endDate) ||
        (date > range.startDate && date < range.endDate)
    );
  };

  return (
    <div className="w-full flex justify-center p-4">
      <DayPicker
        disabled={{ before: today }}
        modifiers={{ available: isAvailableDate }}
        modifiersClassNames={{
          available: "bg-amber-400 text-white rounded-full p-3",
          today: "font-extrabold text-black",
        }}
        className="
          text-3xl m-2
          [&_.rdp-day]:w-16
          [&_.rdp-day]:h-16 
          [&_.rdp-day]:text-2xl 
          [&_.rdp-caption_label]:text-3xl 
          [&_.rdp-head_cell]:text-3xl 
        "
      />
    </div>
  );
}
