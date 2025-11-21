import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Train, Car, Plane, Phone, Mail } from "lucide-react";
import { venueContent } from "@/data/venueContent";
import { siteConfig } from "@/data/siteConfig";

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
              {venueContent.venue.name}
            </CardTitle>
            <CardDescription className="text-base">
              {venueContent.venue.institution}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">Address</h3>
                <p className="text-muted-foreground">
                  {venueContent.venue.address.department}<br />
                  {venueContent.venue.address.institution}<br />
                  {venueContent.venue.address.street}<br />
                  {venueContent.venue.address.postalCode} {venueContent.venue.address.city}<br />
                  {venueContent.venue.address.country}
                </p>
              </div>

              <div className="aspect-video w-full rounded-lg overflow-hidden border">
                <iframe
                  src={venueContent.venue.mapEmbedUrl}
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
                {venueContent.travel.byTrain.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>{venueContent.travel.byTrain.description}</p>
              <ul className="space-y-2 text-sm">
                {venueContent.travel.byTrain.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Car className="h-5 w-5 text-primary" />
                {venueContent.travel.byCar.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>{venueContent.travel.byCar.description}</p>
              <ul className="space-y-2 text-sm">
                {venueContent.travel.byCar.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Plane className="h-5 w-5 text-primary" />
                {venueContent.travel.byAir.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>{venueContent.travel.byAir.description}</p>
              <ul className="space-y-2 text-sm">
                {venueContent.travel.byAir.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{instruction}</span>
                  </li>
                ))}
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
                  <a href={`mailto:${siteConfig.contact.email}`} className="text-primary hover:underline">
                    {siteConfig.contact.email}
                  </a>
                </div>
                <p className="text-xs">
                  Contact: {siteConfig.contact.name}<br />
                  {siteConfig.contact.department}<br />
                  {siteConfig.contact.institution}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-muted/30 border-0">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-3 text-foreground">{venueContent.accommodation.title}</h3>
            <p className="text-muted-foreground mb-4">
              {venueContent.accommodation.description}
            </p>
            <p className="text-sm text-muted-foreground">
              {venueContent.accommodation.note}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Venue;
