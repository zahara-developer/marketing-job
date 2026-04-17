function LoadingSkeletonGrid({ type = 'role', count = 6 }) {
  const items = Array.from({ length: count }, (_, index) => index);

  if (type === 'company') {
    return (
      <div className="company-grid skeleton-grid" aria-hidden="true">
        {items.map((item) => (
          <div key={item} className="company-item skeleton-card">
            <div className="skeleton-line skeleton-line-sm" />
            <div className="skeleton-line skeleton-line-md" />
            <div className="skeleton-line skeleton-line-lg" />
            <div className="skeleton-line skeleton-line-md" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="role-list roles-grid-page skeleton-grid" aria-hidden="true">
      {items.map((item) => (
        <div key={item} className="role-row role-card-page skeleton-card">
          <div className="skeleton-line skeleton-line-sm" />
          <div className="skeleton-line skeleton-line-md" />
          <div className="skeleton-line skeleton-line-lg" />
          <div className="skeleton-line skeleton-line-md" />
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeletonGrid;
