export function scanPorts(params: {
  hosts: string[];
  ports: number[];
  settings?: {
    chunkSize?: number;
    bindDelay?: number;
    closeDelay?: number;
    timeout?: number;
    log?: boolean;
  };
}): Promise<{
  opened: Record<string, number[]>;
  closed: Record<string, number[]>;
}>;

export function compressPorts(ports: number[]): string;
export function sleep(ms: number): Promise<void>;
export function checkPort(
  host: string,
  port: number,
  timeout?: number
): Promise<boolean>;
