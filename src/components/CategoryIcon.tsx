import React from "react";
import * as Icons from "lucide-react";

export function getIconComponent(iconName: string): React.ComponentType<any> {
  // Direct index access into the Icons namespace
  const IconComponent = (Icons as any)[iconName];
  if (!IconComponent) {
    return Icons.HelpCircle;
  }
  return IconComponent;
}

interface CategoryIconProps {
  name: string;
  className?: string;
}

export default function CategoryIcon({ name, className }: CategoryIconProps) {
  const Icon = getIconComponent(name);
  return <Icon className={className} />;
}
