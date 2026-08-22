"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Edit, Pause, CheckCircle, Trash2, BarChart3, Clock, Eye, ArrowUpDown } from "lucide-react";

interface Listing {
  id: string;
  title: string;
  price: string;
  priceType: string;
  status: "active" | "sold" | "draft" | "archived";
  category: string;
  city: string;
  created_at: string;
  views: number;
  is_featured: boolean;
  images: string[];
}

const statusConfig = {
  active: { label: "Active", color: "bg-green-100 text-green-700", icon: CheckCircle },
  sold: { label: "Sold", color: "bg-blue-100 text-blue-700", icon: CheckCircle },
  draft: { label: "Draft", color: "bg-gray-100 text-gray-500", icon: Clock },
  archived: { label: "Archived", color: "bg-purple-100 text-purple-700", icon: Clock },
};

export default function DashboardContent({ listings }: { listings: Listing[] }) {
  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  const sortedListings = [...listings].sort((a, b) => {
    const aVal = a[sortField as keyof Listing];
    const bVal = b[sortField as keyof Listing];
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortOrder === "asc"
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Your Ads</h2>
        <div className="flex items-center gap-3">
          <select
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-");
              setSortField(field);
              setSortOrder(order);
            }}
            className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="created_at-desc">Newest first</option>
            <option value="created_at-asc">Oldest first</option>
            <option value="views-desc">Most viewed</option>
            <option value="views-asc">Least viewed</option>
          </select>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center">
            <BarChart3 className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No ads yet</h3>
          <p className="text-gray-500 mb-6">Start selling by posting your first ad</p>
          <Link
            href="/post"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Post Your First Ad
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer">
                    Listing
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-center py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="text-center py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-center py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Views</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedListings.map((listing) => {
                const status = statusConfig[listing.status];
                const StatusIcon = status.icon;
                return (
                  <tr key={listing.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <Link href={`/listing/${listing.id}`} className="flex items-center gap-4 group">
                        <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                          {listing.images?.[0] ? (
                            <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          ) : (
                            <BarChart3 className="w-6 h-6 text-gray-300 m-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 group-hover:text-amber-600 transition-colors">{listing.title}</p>
                          <p className="text-sm text-gray-500 truncate">{listing.category} • {listing.city}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Posted {new Date(listing.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <p className="font-semibold text-amber-600">{listing.price}</p>
                      <p className="text-xs text-gray-500">{listing.priceType}</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                      </span>
                      {listing.is_featured && (
                        <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{listing.views}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors" title="Feature">
                          <BarChart3 className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-xl bg-gray-100 text-red-600 hover:bg-red-50 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}