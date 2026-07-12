interface RelayStatusBadgeProps {
  lastDelivery: string | null;
}

export default function RelayStatusBadge({ lastDelivery }: RelayStatusBadgeProps) {
  if (!lastDelivery) {
    return (
      <span style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600 }}>
        ● Registered · no deliveries yet
      </span>
    );
  }

  const ago = Math.max(0, Date.now() - new Date(lastDelivery).getTime());
  const minutes = Math.floor(ago / 60_000);
  const hours = Math.floor(ago / 3_600_000);
  const label = hours >= 1 ? `${hours}h ago` : minutes < 1 ? 'just now' : `${minutes}m ago`;
  const healthy = ago < 24 * 60 * 60 * 1_000;

  return (
    <span style={{ fontSize: 11, color: healthy ? 'var(--success)' : 'var(--muted-foreground)', fontWeight: 600 }}>
      {healthy ? '✓' : '○'} Relay active · last delivery {label}
    </span>
  );
}
