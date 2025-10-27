import { Link } from 'wouter';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          
          <div className="prose prose-blue max-w-none">
            <p className="text-sm text-gray-600 mb-8">Last Updated: October 27, 2025</p>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      <strong>PartyBear is an intermediary platform only.</strong> We are not responsible for any issues, 
                      damages, or incidents that occur between hosts and guests. All legal responsibilities lie with the hosts and guests.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Platform Role</h2>
              <p className="text-gray-700 mb-4">
                PartyBear ("we," "us," or "the Platform") is an online marketplace that connects party hosts with guests. 
                We provide information services and connection tools only.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>PartyBear does not organize, host, operate, or manage any parties</li>
                <li>The Platform is not a party participant or attendee</li>
                <li>We do not guarantee the accuracy, safety, or legality of any party listings</li>
                <li>All parties are organized and hosted by independent third-party hosts</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Host Responsibilities</h2>
              <p className="text-gray-700 mb-4">
                As a host on PartyBear, you acknowledge and agree to the following:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Legal Compliance:</strong> You must comply with all local, state, and federal laws regarding alcohol service, noise ordinances, safety regulations, and zoning laws</li>
                <li><strong>Age Verification:</strong> You are solely responsible for preventing underage drinking and verifying that all guests are 21 years or older</li>
                <li><strong>Guest Safety:</strong> You must provide a safe environment and take reasonable precautions to prevent injuries</li>
                <li><strong>Insurance:</strong> We strongly recommend obtaining appropriate liability insurance (General Liability, Liquor Liability, Property Damage)</li>
                <li><strong>Full Liability:</strong> You accept all legal and financial responsibility for any incidents, injuries, damages, or violations that occur at your party</li>
                <li><strong>Indemnification:</strong> You agree to indemnify and hold harmless PartyBear from any claims, lawsuits, damages, or expenses arising from your party</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Guest Responsibilities</h2>
              <p className="text-gray-700 mb-4">
                As a guest on PartyBear, you acknowledge and agree to the following:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Voluntary Participation:</strong> Your attendance at any party is entirely voluntary and at your own risk</li>
                <li><strong>Age Requirement:</strong> You confirm that you are 21 years of age or older</li>
                <li><strong>Personal Responsibility:</strong> You are solely responsible for your own actions, safety, and well-being</li>
                <li><strong>No Drunk Driving:</strong> You must not drive under the influence of alcohol</li>
                <li><strong>Host Rules:</strong> You must comply with all rules set by the host</li>
                <li><strong>Assumption of Risk:</strong> You understand and accept all risks associated with attending parties, including but not limited to alcohol consumption, injuries, property damage, and interactions with other guests</li>
                <li><strong>Indemnification:</strong> You agree to indemnify and hold harmless PartyBear from any claims, lawsuits, damages, or expenses arising from your attendance</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Platform Disclaimer and Limitation of Liability</h2>
              
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <p className="text-sm font-medium text-red-800">
                  PARTYCONNECT IS NOT LIABLE FOR ANY INJURIES, DAMAGES, LOSSES, OR LEGAL ISSUES ARISING FROM PARTIES LISTED ON THE PLATFORM.
                </p>
              </div>

              <p className="text-gray-700 mb-4">
                To the fullest extent permitted by law:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>PartyBear provides the platform "AS IS" without any warranties or guarantees</li>
                <li>We do not verify, endorse, or guarantee the safety, legality, or quality of any party or host</li>
                <li>We are not responsible for the conduct, actions, or omissions of hosts or guests</li>
                <li>We are not liable for any injuries, deaths, property damage, or losses occurring at parties</li>
                <li>We are not responsible for alcohol-related incidents, including drunk driving, alcohol poisoning, or underage drinking</li>
                <li>We are not liable for any violations of law by hosts or guests</li>
                <li>All disputes between hosts and guests must be resolved directly between the parties</li>
                <li>Our total liability, if any, shall not exceed the amount of fees paid to PartyBear</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Direct Contract Between Host and Guest</h2>
              <p className="text-gray-700 mb-4">
                When a guest purchases a ticket to a party:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>A direct contractual relationship is formed between the host and the guest</li>
                <li>PartyBear is not a party to this contract</li>
                <li>PartyBear merely facilitates the connection and payment processing</li>
                <li>All obligations, responsibilities, and liabilities are between the host and guest only</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Safety Guidelines (Recommendations Only)</h2>
              <p className="text-gray-700 mb-4">
                We provide safety guidelines and best practices as recommendations only. These are not legal requirements, 
                and PartyBear is not responsible for enforcing them:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Verify guest ages to prevent underage drinking</li>
                <li>Monitor alcohol consumption to prevent over-intoxication</li>
                <li>Provide safe transportation options (rideshare, designated drivers)</li>
                <li>Have emergency contact information readily available</li>
                <li>Obtain appropriate insurance coverage</li>
                <li>Comply with local noise ordinances and regulations</li>
              </ul>
              <p className="text-gray-700 mt-4 italic">
                Note: These are suggestions only. Hosts are solely responsible for determining and implementing appropriate safety measures.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Prohibited Activities</h2>
              <p className="text-gray-700 mb-4">
                The following activities are strictly prohibited on the Platform:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Hosting or attending parties if under 21 years of age</li>
                <li>Serving alcohol to minors</li>
                <li>Illegal drug use or distribution</li>
                <li>Violence, harassment, or discrimination</li>
                <li>Fraud, misrepresentation, or deceptive practices</li>
                <li>Violations of local, state, or federal laws</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Violation of these terms may result in account suspension or termination. However, PartyBear is not 
                responsible for monitoring or enforcing compliance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Dispute Resolution</h2>
              <p className="text-gray-700 mb-4">
                Any disputes between hosts and guests must be resolved directly between the parties. PartyBear may 
                offer mediation services at its sole discretion, but is not obligated to do so.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Indemnification</h2>
              <p className="text-gray-700 mb-4">
                You agree to indemnify, defend, and hold harmless PartyBear, its officers, directors, employees, and 
                agents from and against any claims, liabilities, damages, losses, and expenses (including legal fees) 
                arising from:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Your use of the Platform</li>
                <li>Your hosting or attendance of parties</li>
                <li>Your violation of these Terms of Service</li>
                <li>Your violation of any laws or regulations</li>
                <li>Any injuries, damages, or losses caused by you</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Governing Law</h2>
              <p className="text-gray-700">
                These Terms of Service shall be governed by and construed in accordance with the laws of the State of Texas, 
                without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
              <p className="text-gray-700">
                PartyBear reserves the right to modify these Terms of Service at any time. Continued use of the Platform 
                constitutes acceptance of the updated terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
              <p className="text-gray-700">
                If you have questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-gray-700 mt-2">
                Email: legal@partyconnect.com<br />
                Address: Austin, Texas
              </p>
            </section>

            <div className="bg-gray-100 border-l-4 border-gray-400 p-4 mt-8">
              <p className="text-sm text-gray-700">
                <strong>By using PartyBear, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</strong>
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              to="/"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

