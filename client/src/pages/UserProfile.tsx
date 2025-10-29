import { useState, useEffect } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, User, Mail, Phone, MapPin, Calendar, Shield, PartyPopper, Clock, Users } from "lucide-react";
import { getHostByEmail, isHostApproved, getPartiesByHostEmail, type Party } from "@/lib/storage";

export default function UserProfile() {
  const [email, setEmail] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [hostInfo, setHostInfo] = useState<any>(null);
  const [hostedParties, setHostedParties] = useState<Party[]>([]);

  useEffect(() => {
    // Check if user is logged in - check both userEmail and hostEmail keys
    const userEmail = localStorage.getItem("userEmail") || localStorage.getItem("hostEmail") || "";
    setEmail(userEmail);

    // Check if user is an approved host
    if (userEmail) {
      const approved = isHostApproved(userEmail);
      
      if (approved) {
        const host = getHostByEmail(userEmail);
        
        if (host) {
          setIsHost(true);
          setHostInfo(host);
          
          // Get parties hosted by this user
          const parties = getPartiesByHostEmail(userEmail);
          setHostedParties(parties);
        }
      }
    }
  }, []);

  const userRole = isHost ? "Host" : "Client";
  const roleColor = isHost ? "text-primary" : "text-accent";
  const roleBgColor = isHost ? "bg-primary/10" : "bg-accent/10";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 sm:pt-24">
        <section className="py-12 sm:py-20">
          <div className="container max-w-4xl">
            {/* Header with PartyBear */}
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 rounded-full gradient-button flex items-center justify-center">
                  <img 
                    src="/party-bear.png" 
                    alt="PartyBear" 
                    className="w-24 h-24 object-contain"
                  />
                </div>
              </div>
              <h1 className="text-4xl font-bold gradient-text mb-4">User Profile</h1>
              <p className="text-muted-foreground">Manage your account information</p>
            </div>

            {/* Profile Card */}
            <div className="glass-strong rounded-3xl p-8 border border-white/10 space-y-6">
              {/* Role Badge */}
              <div className="flex justify-center">
                <div className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full ${roleBgColor} border border-white/10`}>
                  <Shield className={`w-5 h-5 ${roleColor}`} />
                  <span className={`text-lg font-semibold ${roleColor}`}>
                    {userRole}
                  </span>
                </div>
              </div>

              {/* User Information */}
              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-start space-x-4 p-4 rounded-xl glass">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm text-muted-foreground">Email</Label>
                    <p className="text-base font-medium">{email || "Not logged in"}</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                </div>

                {/* Role */}
                <div className="flex items-start space-x-4 p-4 rounded-xl glass">
                  <div className={`w-10 h-10 rounded-lg ${roleBgColor} flex items-center justify-center flex-shrink-0`}>
                    <User className={`w-5 h-5 ${roleColor}`} />
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm text-muted-foreground">Account Type</Label>
                    <p className={`text-base font-medium ${roleColor}`}>{userRole}</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                </div>

                {/* Host Information (if approved) */}
                {isHost && hostInfo && (
                  <>
                    <div className="flex items-start space-x-4 p-4 rounded-xl glass">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <Label className="text-sm text-muted-foreground">Full Name</Label>
                        <p className="text-base font-medium">{hostInfo.name || `${hostInfo.firstName || ''} ${hostInfo.lastName || ''}`.trim()}</p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    </div>

                    <div className="flex items-start space-x-4 p-4 rounded-xl glass">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <Label className="text-sm text-muted-foreground">Phone</Label>
                        <p className="text-base font-medium">{hostInfo.phone}</p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    </div>

                    <div className="flex items-start space-x-4 p-4 rounded-xl glass">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <Label className="text-sm text-muted-foreground">City</Label>
                        <p className="text-base font-medium">{hostInfo.city}</p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    </div>

                    <div className="flex items-start space-x-4 p-4 rounded-xl glass">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <Label className="text-sm text-muted-foreground">Hosting Experience</Label>
                        <p className="text-base font-medium">{hostInfo.experience}</p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    </div>
                  </>
                )}

                {/* Client Message */}
                {!isHost && (
                  <div className="p-6 rounded-xl glass border border-accent/30 bg-accent/5">
                    <p className="text-center text-muted-foreground">
                      Want to become a host?{" "}
                      <a href="/become-host" className="text-accent hover:text-accent/80 underline font-medium">
                        Apply now
                      </a>
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  variant="outline"
                  className="w-full glass border-white/20 hover:bg-white/10"
                  onClick={() => window.location.href = "/"}
                >
                  Back to Home
                </Button>
                {isHost && (
                  <Button
                    className="w-full gradient-button"
                    onClick={() => window.location.href = "/host/dashboard"}
                  >
                    Go to Host Dashboard
                  </Button>
                )}
              </div>
            </div>

            {/* Hosted Parties Section */}
            {isHost && hostedParties.length > 0 && (
              <div className="glass-strong rounded-3xl p-8 border border-white/10 mt-8">
                <div className="flex items-center space-x-3 mb-6">
                  <PartyPopper className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">My Hosted Parties</h2>
                  <Badge variant="secondary" className="ml-auto">
                    {hostedParties.length} {hostedParties.length === 1 ? 'Party' : 'Parties'}
                  </Badge>
                </div>
                
                <div className="grid gap-4">
                  {hostedParties.map((party) => (
                    <Link key={party.id} href={`/party/${party.id}`}>
                      <div className="glass rounded-xl p-6 border border-white/10 hover:border-primary/50 transition-all cursor-pointer group">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                              {party.title}
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {party.status && (
                                <Badge 
                                  variant={party.status === 'approved' ? 'default' : party.status === 'pending' ? 'secondary' : 'destructive'}
                                  className="text-xs"
                                >
                                  {party.status.charAt(0).toUpperCase() + party.status.slice(1)}
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {party.type}
                              </Badge>
                            </div>
                          </div>
                          {party.images && party.images.length > 0 && (
                            <img 
                              src={party.images[0]} 
                              alt={party.title}
                              className="w-24 h-24 object-cover rounded-lg ml-4"
                            />
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{party.date} at {party.time}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{party.city}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>{party.attendees}/{party.capacity} attendees</span>
                          </div>
                          <div className="flex items-center space-x-2 text-primary font-medium">
                            <span>${party.price}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

