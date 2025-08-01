export default function TermsAndConditions() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded shadow p-6 space-y-6">
        <h1 className="text-2xl font-bold">TERMS &amp; CONDITIONS</h1>
        <p className="text-sm text-gray-600">
          <strong>Last Updated:</strong> 1 August 2025
        </p>

        <ol className="list-decimal list-inside space-y-6 text-sm text-gray-700">
          <li>
            {/* title as inline so marker stays on same line */}
            <span className="font-medium">Acceptance</span>
            <p className="mt-1">
              By using TeraVince’s website, you agree to these Terms. For Indonesian users, Bahasa Indonesia version prevails in legal disputes.
            </p>
          </li>

          <li>
            <span className="font-medium">Intellectual Property</span>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>All content (logos, reports, images) is protected under Indonesia’s Copyright Law (UU No. 28/2014).</li>
              <li>Redistribution requires written permission from TeraVince.</li>
            </ul>
          </li>

          <li>
            <span className="font-medium">Donations</span>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Donations are non-refundable unless a technical error occurs.</li>
              <li>Tax deductions may apply under Indonesian tax regulations (receipts provided).</li>
              <li>Data processing follows our Privacy Policy and UU PDP Article 21 (consent requirement).</li>
            </ul>
          </li>

          <li>
            <span className="font-medium">User Responsibilities</span>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>No illegal activities (e.g., fraud, harassment, IP violations).</li>
              <li>Dispute Resolution: Mediation first; unresolved disputes fall under Indonesian courts in Jakarta.</li>
            </ul>
          </li>

          <li>
            <span className="font-medium">Liability Limitation</span>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>TeraVince is not liable for indirect damages (e.g., third-party payment processor breaches).</li>
              <li>Not liable for service disruptions due to force majeure (e.g., natural disasters).</li>
            </ul>
          </li>

          <li>
            <span className="font-medium">Updates</span>
            <p className="mt-1">
              Changes notified via email or website banners. Continued use constitutes acceptance.
            </p>
          </li>
        </ol>
      </div>
    </div>
  );
}
