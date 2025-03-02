
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "@/lib/firebase";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { Fingerprint, Lock, Mail, User } from "lucide-react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await registerUser(email, password);
      // Could also save additional user information to Firestore here
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully",
      });
      navigate("/");
    } catch (error: any) {
      console.error("Registration error:", error);
      
      let errorMessage = "Registration failed. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered. Please use a different email.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format. Please check your email.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "Email/password authentication is not enabled. Please contact the administrator.";
      }
      
      toast({
        title: "Registration Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 mt-16">
        <div className="w-full max-w-md">
          <div className="glass-effect rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-primary/10">
                <Fingerprint className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mt-6 text-3xl font-bold tracking-tight">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Join 2FPay for secure biometric payment services
              </p>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full py-6"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>
              
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-primary hover:text-primary/80"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
