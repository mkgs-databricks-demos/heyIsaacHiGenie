import { Spinner } from '@databricks/appkit-ui/react';

export default function LoadingView() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--db-cream)',
        gap: 24,
      }}
    >
      <div style={{ fontSize: 64, lineHeight: 1 }}>🪔</div>
      <h1
        className="display-font"
        style={{
          margin: 0,
          fontSize: 28,
          color: 'var(--db-navy)',
          letterSpacing: '-0.5px',
        }}
      >
        <span style={{ color: 'var(--db-navy)' }}>Hey Isaac?</span>{' '}
        <span style={{ color: 'var(--db-red)' }}>Hi Genie!</span>
        <span className="sparkle"> ✦</span>
      </h1>
      <Spinner />
    </div>
  );
}
