function CommunityMemberModal({
  open,
  profile,
  loading,
  connectStatus,
  connecting,
  isAuthenticated,
  onClose,
  onConnect
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="community-member-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="community-member-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Community member profile"
      >
        <button type="button" className="community-member-close" onClick={onClose} aria-label="Close profile panel">
          ×
        </button>

        {loading ? (
          <div className="community-member-loading">Loading profile...</div>
        ) : profile ? (
          <>
            <div className="community-member-hero">
              <div className="community-member-avatar">{profile.initials || '👤'}</div>
              <div>
                <h3>{profile.fullName}</h3>
                <p>{profile.roleInterested || 'Marketing & Sales Professional'}</p>
              </div>
            </div>

            <div className="community-member-info-list">
              {profile.experienceLevel ? (
                <div className="community-member-info-item">
                  <span>Experience</span>
                  <strong>{profile.experienceLevel}</strong>
                </div>
              ) : null}
              {profile.currentCompany ? (
                <div className="community-member-info-item">
                  <span>Company</span>
                  <strong>{profile.currentCompany}</strong>
                </div>
              ) : null}
              {profile.location ? (
                <div className="community-member-info-item">
                  <span>Location</span>
                  <strong>{profile.location}</strong>
                </div>
              ) : null}
            </div>

            {profile.bio ? (
              <div className="community-member-bio">
                <span>About</span>
                <p>{profile.bio}</p>
              </div>
            ) : null}

            {connectStatus ? <p className={`form-status ${connectStatus.type}`}>{connectStatus.text}</p> : null}

            {!profile.isCurrentUser ? (
              <div className="community-member-actions">
                <button
                  type="button"
                  className="primary-button"
                  onClick={onConnect}
                  disabled={!isAuthenticated || profile.connected || connecting}
                >
                  {!isAuthenticated
                    ? 'Log in to connect'
                    : profile.connected
                      ? 'Connected'
                      : connecting
                        ? 'Connecting...'
                        : 'Connect'}
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="community-member-loading">Unable to load this profile.</div>
        )}
      </div>
    </div>
  );
}

export default CommunityMemberModal;
