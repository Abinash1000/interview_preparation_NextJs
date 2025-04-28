"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Form } from "@/components/ui/form";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { signIn, signUp } from "@/lib/actions/auth.action";
import { auth } from "@/firebase/client";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

// Define schema outside component to prevent recreation on each render
const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().min(3).email(),
    password: z.string().min(6),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const formSchema = authFormSchema(type);
  
  // Define your form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Handle page navigation loading state
  useEffect(() => {
    // Listen for route change start
    const handleRouteChangeStart = () => {
      setIsNavigating(true);
    };

    // Listen for route change complete
    const handleRouteChangeComplete = () => {
      setIsNavigating(false);
    };

    // Add event listeners for navigation
    window.addEventListener('beforeunload', handleRouteChangeStart);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('beforeunload', handleRouteChangeStart);
    };
  }, []);

  // Custom navigation handler for sign-in/sign-up links
  const handleNavigate = (path: string) => {
    setIsNavigating(true);
    router.push(path);
  };

  // Submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (type === "sign-in") {
        const {email, password} = values;
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredentials.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in failed!")
          return;
        }
        await signIn({
          email, idToken
        })
        toast.success("Sign in successful");
        router.push("/");
      } else {
        const { name, email, password } = values;
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password
        })
        if (!result?.success) {
          toast.error(result?.message)
          return
        }
        toast.success("Sign up successful, Please sign in");
        router.push("/sign-in");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  const isSignIn = type === "sign-in";
  
  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="Auth Form Logo" width={32} height={38} />
          <h2 className="text-primary-100">Interview Preparation</h2>
        </div>
        <h3 className="text-center">Pratice Job Interview With AI</h3>
        
        {/* Page-level loading indicator for form submission */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
            <div className=" bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-700" />
              <p className="mt-4 font-medium text-gray-700">
                {isSignIn ? "Signing in..." : "Creating your account..."}
              </p>
            </div>
          </div>
        )}
        
        {/* Navigation loading indicator */}
        {isNavigating && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-700" />
              <p className="mt-4 font-medium text-gray-700">
                Loading {isSignIn ? "sign up" : "sign in"} page...
              </p>
            </div>
          </div>
        )}
        
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                lable="Name"
                placeholder="Your Name"
              />
            )}
            <FormField
              control={form.control}
              name="email"
              lable="Email"
              placeholder="Your Email"
              type="email"
            />
            <FormField
              control={form.control}
              name="password"
              lable="Password"
              placeholder="Your Password"
              type="password"
            />
            <Button 
              className="btn w-full" 
              type="submit" 
              disabled={isLoading || isNavigating}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSignIn ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                isSignIn ? "Sign in" : "Create an Account"
              )}
            </Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn ? "No account yet" : "Have an account already?"}
          <button
            onClick={() => handleNavigate(!isSignIn ? "/sign-in" : "/sign-up")}
            className="font-bold text-user-primary ml-1 bg-transparent border-none cursor-pointer"
            disabled={isNavigating}
          >
            {isSignIn ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;