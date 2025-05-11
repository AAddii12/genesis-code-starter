
import { ReactNode } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type OnboardingCardProps = {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
};

const OnboardingCard = ({ title, children, footer }: OnboardingCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};

export default OnboardingCard;
