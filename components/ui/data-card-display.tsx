import React from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type IconType = React.ElementType | React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

export interface CardDisplayItem {
  id: string;
  title: string;
  value: string;
  description: string;
  icon?: IconType;
  actionLabel?: string;
  isDisabled?: boolean;
  onActionClick?: (id: string) => void;
}

export interface CardDisplayProps {
  items: CardDisplayItem[];
  className?: string;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ items, className }) => {
  if (!items || items.length === 0) {
    return <p className="text-center text-muted-foreground p-8">No display items configured.</p>;
  }

  return (
    <div
      className={cn(
        "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 md:p-6",
        className
      )}
      role="list"
    >
      {items.map((item) => (
        <Card
          key={item.id}
          className="flex flex-col h-full transition-shadow duration-200 hover:shadow-lg focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
          role="listitem"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium tracking-tight text-foreground">
              {item.title}
            </CardTitle>
            {item.icon && (
              <item.icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            )}
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="text-2xl font-bold mb-1 text-foreground">{item.value}</div>
            <CardDescription className="text-xs text-muted-foreground min-h-[1.5rem]">
              {item.description}
            </CardDescription>
          </CardContent>
          {item.actionLabel && (
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => item.onActionClick?.(item.id)}
                disabled={item.isDisabled}
                className="w-full text-sm font-semibold transition-colors duration-150 hover:bg-accent hover:text-accent-foreground"
                aria-label={`Action for ${item.title}: ${item.actionLabel}`}
              >
                {item.actionLabel}
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
};

export default CardDisplay;