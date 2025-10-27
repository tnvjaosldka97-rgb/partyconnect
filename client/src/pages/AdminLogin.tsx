import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, User } from "lucide-react";
import { toast } from "sonner";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== Admin Login Debug ===');
    console.log('Form Data:', formData);
    console.log('Username:', formData.username);
    console.log('Password:', formData.password);
    console.log('Expected: onlyup1! / onlyup12!');
    setIsLoading(true);

    try {
      // Check credentials
      console.log('Checking credentials...');
      console.log('Username match:', formData.username === "onlyup1!");
      console.log('Password match:', formData.password === "onlyup12!");
      if (formData.username === "onlyup1!" && formData.password === "onlyup12!") {
        localStorage.setItem("adminLoggedIn", "true");
        
        toast.success("Login Successful!", {
          description: "Redirecting to admin dashboard.",
        });
        
        setTimeout(() => {
          setLocation("/admin");
        }, 1000);
      } else {
        toast.error("Login Failed", {
          description: "Invalid username or password.",
        });
      }
    } catch (error) {
      toast.error("Login Failed", {
        description: "An error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20 pb-20">
        <section className="py-20 relative overflow-hidden min-h-[80vh] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 opacity-30" />
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
          
          <div className="container relative z-10">
            <div className="max-w-md mx-auto">
              {/* Logo & Title */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl glass border border-primary/30 mb-6">
                  <Shield className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-3xl font-bold mb-2">
                  <span className="gradient-text">Admin Login</span>
                </h1>
                <p className="text-muted-foreground">
                  Access PartyBear Admin Dashboard
                </p>
              </div>

              {/* Login Form */}
              <div className="glass-strong rounded-3xl p-8 border border-white/10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="username" className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4" />
                      <span>Admin ID</span>
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="Enter admin username"
                      className="h-12 glass border-white/20"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password" className="flex items-center space-x-2 mb-2">
                      <Lock className="w-4 h-4" />
                      <span>Password</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter password"
                      className="h-12 glass border-white/20"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gradient-button h-12 rounded-xl text-base font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30">
                    <p className="text-sm text-yellow-400 font-medium flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Security Notice
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Admin access is restricted to authorized personnel only. 
                      Unauthorized access attempts will be logged and may result in legal action.
                    </p>
                  </div>
                </div>
              </div>

              {/* Back to Home */}
              <div className="text-center mt-6">
                <Button
                  variant="ghost"
                  onClick={() => setLocation("/")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

