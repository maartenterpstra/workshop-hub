import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, AlertCircle } from "lucide-react";

const Registration = () => {
  return (
    <div className="py-16 px-4">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Registration</h1>
          <p className="text-xl text-muted-foreground">
            Register for the Deep Learning in Radiotherapy Workshop 2025
          </p>
        </div>

        <Alert className="mb-8 border-primary/50 bg-primary/5">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-base">
            <strong className="text-foreground">Registration Deadline:</strong> Sunday, March 2, 2025
          </AlertDescription>
        </Alert>

        <Card className="shadow-card border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              Event Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-muted-foreground">
              <div className="flex flex-col sm:flex-row sm:gap-12">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">Educational Workshop</h3>
                  <p className="text-sm">Monday, March 17, 2025</p>
                  <p className="text-sm">Department of Radiotherapy</p>
                  <p className="text-sm">UMC Utrecht, The Netherlands</p>
                </div>
                <div className="flex-1 mt-4 sm:mt-0">
                  <h3 className="font-semibold text-foreground mb-2">Scientific Symposium</h3>
                  <p className="text-sm">Tuesday, March 18, 2025</p>
                  <p className="text-sm">Department of Radiotherapy</p>
                  <p className="text-sm">UMC Utrecht, The Netherlands</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm">
                  <strong className="text-foreground">Target Audience:</strong> Medical physicists in radiotherapy, 
                  researchers, clinical physicists, and professionals interested in deep learning applications in healthcare.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle>Registration Form</CardTitle>
            <CardDescription>
              Please complete the form below to register for the workshop
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-muted/30 rounded-lg p-8 flex items-center justify-center min-h-[600px]">
              <div className="text-center">
                <iframe
                  src="https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?embedded=true"
                  width="100%"
                  height="800"
                  frameBorder="0"
                  marginHeight={0}
                  marginWidth={0}
                  className="w-full"
                  title="Registration Form"
                >
                  Loading…
                </iframe>
                <p className="text-sm text-muted-foreground mt-4">
                  If the form doesn't load, please refresh the page or contact{" "}
                  <a href="mailto:M.Maspero@umcutrecht.nl" className="text-primary hover:underline">
                    M.Maspero@umcutrecht.nl
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert className="mt-8">
          <AlertDescription>
            <strong>Important:</strong> After registering, you will receive a confirmation email. 
            Please check your spam folder if you don't receive it within 24 hours. For any questions, 
            contact Matteo Maspero at{" "}
            <a href="mailto:M.Maspero@umcutrecht.nl" className="text-primary hover:underline">
              M.Maspero@umcutrecht.nl
            </a>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default Registration;
