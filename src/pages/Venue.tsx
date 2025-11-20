import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Train, Car, Plane, Phone, Mail } from "lucide-react";

const Venue = () => {
  return (
    <div className="py-16 px-4">
      <div className="container max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Venue</h1>
          <p className="text-xl text-muted-foreground">
            Location and travel information
          </p>
        </div>

        <Card className="shadow-card border-0 mb-8">
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              Department of Radiotherapy, UMC Utrecht
            </CardTitle>
            <CardDescription className="text-base">
              University Medical Center Utrecht, The Netherlands
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">Address</h3>
                <p className="text-muted-foreground">
                  Department of Radiotherapy<br />
                  University Medical Center Utrecht<br />
                  Heidelberglaan 100<br />
                  3584 CX Utrecht<br />
                  The Netherlands
                </p>
              </div>

              <div className="aspect-video w-full rounded-lg overflow-hidden border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2451.4721857567835!2d5.170832376929935!3d52.08574967197068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c66851fbe3a2f5%3A0x7c1c6b3f8f6b3c7a!2sUMC%20Utrecht!5e0!3m2!1sen!2snl!4v1234567890123!5m2!1sen!2snl"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="UMC Utrecht Location"
                ></iframe>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Train className="h-5 w-5 text-primary" />
                By Train
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                Utrecht is well-connected by train to major Dutch cities. From Utrecht Central Station:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Take bus line 12 towards "De Uithof" (direction Science Park)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Get off at "UMC Utrecht" stop (approximately 15 minutes)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Buses run every 10 minutes during weekdays</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Car className="h-5 w-5 text-primary" />
                By Car
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                UMC Utrecht is easily accessible by car from all major highways:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>From A27: Take exit "Utrecht-Noord/De Uithof"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Follow signs to "UMC Utrecht"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Parking available on-site (paid parking)</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Plane className="h-5 w-5 text-primary" />
                By Air
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                Amsterdam Airport Schiphol is the nearest international airport:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Direct train from Schiphol to Utrecht CS (approximately 30 minutes)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Trains run every 10-15 minutes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Then follow train directions above</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>For directions or venue-related questions:</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href="mailto:M.Maspero@umcutrecht.nl" className="text-primary hover:underline">
                    M.Maspero@umcutrecht.nl
                  </a>
                </div>
                <p className="text-xs">
                  Contact: Matteo Maspero<br />
                  Department of Radiotherapy<br />
                  UMC Utrecht
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-muted/30 border-0">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-3 text-foreground">Accommodation</h3>
            <p className="text-muted-foreground mb-4">
              Utrecht offers a variety of accommodation options. We recommend booking early, especially 
              during the conference dates. Hotels in Utrecht city center are approximately 15-20 minutes 
              from UMC Utrecht by public transport.
            </p>
            <p className="text-sm text-muted-foreground">
              Popular areas: Utrecht City Center, Utrecht Science Park, near Utrecht Central Station
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Venue;
