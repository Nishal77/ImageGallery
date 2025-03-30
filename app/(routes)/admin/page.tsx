'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Image Management Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Image Management</h2>
            <p className="text-gray-600 mb-4">Manage and moderate uploaded images</p>
            <Button asChild>
              <Link href="/admin/images">Manage Images</Link>
            </Button>
          </div>

          {/* User Management Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <p className="text-gray-600 mb-4">View and manage user accounts</p>
            <Button asChild>
              <Link href="/admin/users">Manage Users</Link>
            </Button>
          </div>

          {/* Analytics Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Analytics</h2>
            <p className="text-gray-600 mb-4">View platform statistics and insights</p>
            <Button asChild>
              <Link href="/admin/analytics">View Analytics</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 