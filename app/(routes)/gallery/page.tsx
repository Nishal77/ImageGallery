'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Image Gallery</h1>
          <Button asChild>
            <Link href="/upload">Upload Image</Link>
          </Button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Placeholder for gallery items */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-square bg-gray-200 animate-pulse"></div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Image Title {item}</h3>
                <p className="text-sm text-gray-600">Uploaded by User {item}</p>
                <p className="text-xs text-gray-500 mt-2">2 days ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 