export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded shadow p-6 space-y-6">
        <h1 className="text-2xl font-bold">PRIVACY POLICY</h1>
        <p className="text-sm text-gray-600">
          <strong>Last Updated:</strong> 1 August 2025
        </p>

        <section className="space-y-4 text-sm text-gray-700">
          <h2 className="font-medium">1. Data Collected</h2>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Personal:</strong> Name, email, donation history (required for Indonesian tax compliance).</li>
            <li><strong>Sensitive:</strong> Health data (collected only with explicit consent, per UU PDP Article 26).</li>
            <li><strong>Automated:</strong> IP address, cookies (see Cookie Policy).</li>
          </ul>
        </section>

        <section className="overflow-x-auto">
          <h2 className="font-medium mb-2 text-sm text-gray-700">2. Purpose &amp; Legal Basis</h2>
          <table className="min-w-full table-auto text-sm text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Purpose</th>
                <th className="px-3 py-2 text-left">Legal Basis (GDPR)</th>
                <th className="px-3 py-2 text-left">UU PDP Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-3 py-2">Process donations</td>
                <td className="px-3 py-2">Contractual necessity</td>
                <td className="px-3 py-2">Article 21 (Consent)</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Send project updates</td>
                <td className="px-3 py-2">Legitimate interest</td>
                <td className="px-3 py-2">Article 22</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Tax compliance</td>
                <td className="px-3 py-2">Legal obligation</td>
                <td className="px-3 py-2">Article 23</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="space-y-4 text-sm text-gray-700">
          <h2 className="font-medium">3. Data Sharing</h2>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>EU Partners: Data transferred under GDPR Standard Contractual Clauses (SCCs).</li>
            <li>Subprocessors: Payment gateways ([Kumamoto Harada]), email providers ([admin@teravince-id.org]).</li>
          </ul>

          <h2 className="font-medium">4. Your Rights</h2>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Access/Deletion: Email requests to [admin@teravince-id.org].</li>
            <li>EU Donors: Right to erasure (GDPR Article 17).</li>
            <li>Indonesian Users: Complaints may be filed with Indonesia’s PDP Authority.</li>
          </ul>

          <h2 className="font-medium">5. Security &amp; Breach Notification</h2>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Encryption, access controls, and staff training implemented (UU PDP Article 42).</li>
            <li>Breaches: Notified to authorities/users within 72 hours (GDPR) or 3×24 hours (UU PDP).</li>
          </ul>

          <h2 className="font-medium">6. Retention</h2>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Donor data: 5 years (Indonesian tax law UU KUP Pasal 22).</li>
            <li>Beneficiary data: Anonymized post-project.</li>
          </ul>

          <h2 className="font-medium">7. Contact DPO</h2>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Email: [dpo@teravince.org] | Phone: [+62 8888 1234 99]</li>
            <li>Response time: 7 business days (UU PDP Article 41).</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
