import React from 'react';
import { DashboardLayout } from './SellerDashboard';
import { Shield, Users, Building, Activity, FileWarning, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const AdminDashboardView = () => {
  return (
    <DashboardLayout role="admin">
       <div className="mb-8">
        <h1 className="text-2xl font-bold text-earth-brown flex items-center gap-2">
          <Shield className="text-earth-terracotta" />
          Admin Portal
        </h1>
        <p className="text-earth-gray-dark">Platform overview and user moderation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { t: 'Total Users', v: '2,405', i: <Users /> },
          { t: 'Verified Sellers', v: '342', i: <Building /> },
          { t: 'Active Listings', v: '4,102', i: <Activity /> },
          { t: 'Pending Approvals', v: '12', i: <FileWarning className="text-earth-terracotta" /> },
        ].map((stat, i) => (
           <div key={i} className="bg-surface p-6 rounded-2xl border border-earth-sand/30 shadow-sm">
            <div className="text-earth-olive mb-3">{stat.i}</div>
            <h3 className="text-[10px] uppercase tracking-widest text-earth-gray-dark font-medium mb-1">{stat.t}</h3>
            <p className="text-2xl font-bold text-earth-brown">{stat.v}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface p-6 rounded-2xl border border-earth-sand/30 shadow-sm">
        <h2 className="text-xl font-bold text-earth-brown mb-6">Pending Seller Approvals</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-earth-sand text-sm text-earth-gray-dark">
                <th className="pb-3 font-medium">Company Name</th>
                <th className="pb-3 font-medium">Applicant</th>
                <th className="pb-3 font-medium">Document Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { c: 'Global Logistics Intl', n: 'Mark Thompson', s: 'Verified' },
                { c: 'Prime Manufacturing', n: 'Sarah Chen', s: 'Pending Review' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-earth-sand/30 hover:bg-earth-beige/30">
                  <td className="py-4 font-medium text-earth-brown">{row.c}</td>
                  <td className="py-4 text-earth-gray-dark">{row.n}</td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${row.s === 'Verified' ? 'bg-earth-olive/10 text-earth-olive' : 'bg-earth-sand text-earth-brown'}`}>
                      {row.s === 'Verified' && <CheckCircle size={12} />}
                      {row.s}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                       <Button size="sm" variant="outline" className="h-8 text-xs">Review</Button>
                       <Button size="sm" variant="primary" className="h-8 text-xs">Approve</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};
