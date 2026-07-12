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
        gap: 24,
      }}
    >
      <div style={{ fontSize: 64, lineHeight: 1 }}>🪔</div>
      <h1
        style={{
          margin: 0,
          fontSize: 28,
        }}
      >
        Hey Isaac? Hi Genie!
      </h1>
      <Spinner />
    </div>
  );
}
