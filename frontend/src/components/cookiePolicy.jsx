import React from 'react';

export default function CookiePolicy() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded shadow p-6 space-y-6">
        <h1 className="text-2xl font-bold">COOKIE POLICY</h1>
        <p className="text-sm text-gray-600">
          <strong>Last Updated:</strong> 1 August 2025
        </p>

        {/* 1. Types of Cookies */}
        <section>
          <h2 className="font-medium mb-2">1. Types of Cookies</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Cookie Type</th>
                  <th className="px-3 py-2 text-left">Purpose</th>
                  <th className="px-3 py-2 text-left">Provider</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-3 py-2">Essential</td>
                  <td className="px-3 py-2">Site functionality</td>
                  <td className="px-3 py-2">TeraVince</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Analytics</td>
                  <td className="px-3 py-2">Traffic measurement</td>
                  <td className="px-3 py-2">Google Analytics (IP anonymized)</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Marketing</td>
                  <td className="px-3 py-2">Donation campaigns</td>
                  <td className="px-3 py-2">Facebook Pixel (opt-in only)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 2. Consent Management */}
        <section>
          <h2 className="font-medium mb-2">2. Consent Management</h2>
          <ul className="list-disc list-inside ml-4 space-y-1 text-sm text-gray-700">
            <li>
              <strong>First-time users:</strong> Non-essential cookies blocked until consent via Cookiebot banner.
            </li>
            <li>
              <strong>Withdrawal:</strong> Adjust settings anytime via Cookie Preferences.
            </li>
          </ul>
        </section>

        {/* 3. Third-Party Cookies */}
        <section>
          <h2 className="font-medium mb-2">3. Third-Party Cookies</h2>
          <ul className="list-disc list-inside ml-4 space-y-1 text-sm text-gray-700">
            <li>
              We use Google Analytics with IP anonymization (GDPR-compliant).
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
