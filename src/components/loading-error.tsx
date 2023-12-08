import { Button } from "./ui/button";

export const LoadingError = () => {
  return (
    <div className="flex flex-col gap-3 items-center py-3">
      <p className="text-sm text-muted-foreground text-center">
        Something went wrong
      </p>
      <Button variant="outline" onClick={() => window.location.reload()}>
        Refresh
      </Button>
    </div>
  );
};
