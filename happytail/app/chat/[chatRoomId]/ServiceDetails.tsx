import React from 'react';
import Image from 'next/image';

interface ServiceDetailsProps {
  imageUrl: string;
  serviceName: string;
  dateRange: string;
}

const ServiceDetails = ({ imageUrl, serviceName, dateRange }: ServiceDetailsProps) => {
  return (
    <div className="flex items-center p-2 border-b border-gray-200 bg-white">
      <div className="relative w-16 h-16 mb-2">
        <Image
          src={imageUrl}
          alt={serviceName}
          fill
          className="rounded-lg object-cover"
        />
      </div>
      <div className="ml-4">
        <h2 className="text-lg font-medium">{serviceName}</h2>
        <p className="text-medium text-gray-500 mt-1">{dateRange}</p>
      </div>
    </div>
  );
};

export default ServiceDetails;
