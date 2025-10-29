import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, Mail, HelpCircle } from "lucide-react";
import { getHostByEmail } from "@/lib/storage";

export default function HostRejected() {
  const [, setLocation] = useLocation();
  const [hostInfo, setHostInfo] = useState<any>(null);

  useEffect(() => {
    const email = localStorage.getItem("hostEmail") || "";
    if (email) {
      const host = getHostByEmail(email);
      if (host && host.status === "rejected") {
        setHostInfo(host);
      } else {
        // If not rejected, redirect to home
        setLocation("/");
      }
    } else {
      setLocation("/");
    }
  }, [setLocation]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 sm:pt-24">
        <section className="py-12 sm:py-20">
          <div className="container max-w-3xl">
            {/* Icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500/30 mb-6">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                Application Not Approved
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Thank you for your interest in becoming a PartyBear host. Unfortunately, your application has not been approved at this time.
              </p>
            </div>

            {/* Rejection Reason */}
            {hostInfo?.rejectionReason && (
              <div className="glass-strong rounded-2xl p-6 sm:p-8 border border-red-500/20 mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  Rejection Reason
                </h2>
                
                <p className="text-muted-foreground leading-relaxed">
                  {hostInfo.rejectionReason}
                </p>
              </div>
            )}

            {/* Rejection Details */}
            <div className="glass-strong rounded-2xl p-6 sm:p-8 border border-white/10 mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                Common Reasons for Rejection
              </h2>
              
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>Application did not meet our current hosting requirements</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  <span>The venue or location may not be suitable for our platform</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Incomplete or insufficient information in your application</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  <span>We may have reached capacity in your area</span>
                </li>
              </ul>
            </div>

            {/* Next Steps */}
            <div className="glass rounded-2xl p-6 sm:p-8 border border-white/10 mb-8">
              <h2 className="text-xl font-semibold mb-4">What You Can Do</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-semibold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Review Your Application</h3>
                    <p className="text-sm text-muted-foreground">
                      Consider what information might have been missing or could be improved
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-semibold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Contact Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Reach out to our team for specific feedback on your application
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-semibold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Reapply in the Future</h3>
                    <p className="text-sm text-muted-foreground">
                      You're welcome to submit a new application after addressing any concerns
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="glass-strong rounded-2xl p-6 border border-primary/20 mb-8">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you have questions about your application or would like feedback, please contact our support team.
                  </p>
                  <Button
                    variant="outline"
                    className="glass border-primary/30 hover:bg-primary/10"
                    onClick={() => window.location.href = "mailto:support@partybear.com"}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                className="glass border-white/20 hover:bg-white/10 rounded-xl"
                onClick={() => setLocation("/")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              
              <Button
                size="lg"
                className="gradient-button rounded-xl"
                onClick={() => setLocation("/become-host")}
              >
                Submit New Application
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

