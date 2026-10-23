import { createContext, useContext, useEffect } from 'react';

interface BreadcrumbContextValue {
  detailLabel?: string;
  setDetailLabel: (label?: string) => void;
}

export const BreadcrumbContext = createContext<BreadcrumbContextValue>({
  detailLabel: undefined,
  setDetailLabel: () => {},
});

export function useBreadcrumbDetailLabel(): string | undefined {
  return useContext(BreadcrumbContext).detailLabel;
}

export function useSetBreadcrumbDetailLabel(label?: string): void {
  const { setDetailLabel } = useContext(BreadcrumbContext);

  useEffect(() => {
    setDetailLabel(label);
    return () => {
      setDetailLabel(undefined);
    };
  }, [label, setDetailLabel]);
}
