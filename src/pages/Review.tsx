import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Review = () => (
  <div className="container max-w-3xl py-12 space-y-6">
    <h1 className="text-3xl font-bold">Reviewer dashboard</h1>
    <Card>
      <CardHeader>
        <CardTitle>Your assignments</CardTitle>
        <CardDescription>Blinded abstracts assigned to you will appear here.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">Coming soon.</CardContent>
    </Card>
  </div>
);

export default Review;
