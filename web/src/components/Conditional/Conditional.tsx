import { ComponentType } from "react";

export type ConditionalProps = {
  visible?: boolean;
};

/**
 * Utility component wrapper to allow setting visible status as a prop,
 * while maintaining prop typings
 */
export function Conditional<P extends object>(
  Component: ComponentType<P>
): React.FC<P & ConditionalProps> {
  return function ({ visible = false, ...props }: ConditionalProps) {
    if (!visible) return null;
    return <Component {...(props as P)} />;
  };
}
