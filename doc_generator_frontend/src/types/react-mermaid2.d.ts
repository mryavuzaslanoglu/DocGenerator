declare module 'react-mermaid2' {
  import { FC } from 'react';

  interface MermaidProps {
    chart: string;
    className?: string;
    config?: any;
  }

  const Mermaid: FC<MermaidProps>;
  export default Mermaid;
} 