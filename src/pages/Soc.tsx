import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Soc = () => (
  <div className="container max-w-3xl py-12 space-y-6">
    <h1 className="text-3xl font-bold">SOC dashboard</h1>
    <Card>
      <CardHeader>
        <CardTitle>Submissions overview</CardTitle>
        <CardDescription>Assign reviewers, aggregate scores, and issue decisions.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">Coming soon.</CardContent>
    </Card>
  </div>
);

export default Soc;
