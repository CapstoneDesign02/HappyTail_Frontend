import { useState } from "react";
import Image from "next/image";

interface DropdownFilterProps {
  animals: string[];
  selected: string | null;
  onSelect: (name: string | null) => void;
}

export const DropdownFilter: React.FC<DropdownFilterProps> = ({
  animals,
  selected,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative pb-4">
      {/* 상단 선택창 */}
      <div
        className="flex items-center justify-between h-16 px-6 bg-white border border-black/30 rounded-[5px] cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="text-xl text-neutral-800 font-normal">
          {selected ?? "전체"}
        </div>

        {/* 노란 원 + 회전 삼각형 */}
        <div className="size-12 bg-amber-300 rounded-full flex items-center justify-center">
          <Image
            src="/img/icons/downTriangle.png"
            alt="Down arrow"
            width={24}
            height={24}
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-90" : "rotate-0"
            }`}
          />
        </div>
      </div>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute top-full w-full bg-white border border-gray-300 rounded shadow z-10">
          <ul className="divide-y divide-gray-200">
            <li
              onClick={() => {
                onSelect(null);
                setIsOpen(false);
              }}
              className="px-6 py-4 hover:bg-gray-100 cursor-pointer"
            >
              전체
            </li>
            {animals.map((name) => (
              <li
                key={name}
                onClick={() => {
                  onSelect(name);
                  setIsOpen(false);
                }}
                className="px-6 py-4 hover:bg-gray-100 cursor-pointer"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
