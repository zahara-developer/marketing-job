import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, MessageSquareMore, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import RevealSection from '../components/RevealSection';
import { useAuth } from '../context/AuthContext';
import { fetchCommunityEndpoint } from '../data/communityApi';
import defaultCommunities from '../data/defaultCommunities';
import { communityIconMap } from '../data/communityMeta';

const fallbackCommunities = defaultCommunities;

function CommunityPage() {
  const { token, isAuthenticated } = useAuth();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });
  const [joiningSlug, setJoiningSlug] = useState('');

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const result = await fetchCommunityEndpoint(
          '',
          {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`
                }
              : {}
          },
          'Unable to load communities'
        );

        const normalizedCommunities = Array.isArray(result) ? result : [];

        setCommunities(normalizedCommunities.length ? normalizedCommunities : fallbackCommunities);
        setError('');
      } catch (fetchError) {
        setCommunities(fallbackCommunities);
        setError('Unable to load communities');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, [token]);

  const stats = useMemo(() => {
    const totalMembers = communities.reduce((sum, community) => sum + (community.memberCount || 0), 0);
    const totalDiscussions = communities.reduce((sum, community) => sum + (community.discussionCount || 0), 0);
    const joinedCount = communities.filter((community) => community.joined).length;

    return { totalMembers, totalDiscussions, joinedCount };
  }, [communities]);

  const handleJoin = async (communitySlug) => {
    if (!isAuthenticated) {
      setActionMessage({ type: 'error', text: 'Please log in to join the community.' });
      return;
    }

    try {
      setJoiningSlug(communitySlug);
      const result = await fetchCommunityEndpoint(
        `/${communitySlug}/join`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        },
        'Community action failed'
      );

      setCommunities((prev) =>
        prev.map((community) =>
          community.slug === communitySlug ? { ...community, ...result.community } : community
        )
      );
      setActionMessage({ type: 'success', text: result.message });
    } catch (_joinError) {
      setActionMessage({ type: 'error', text: 'Community action failed' });
    } finally {
      setJoiningSlug('');
    }
  };

  return (
    <>
      <RevealSection className="content-section">
        <div className="community-directory-shell">
          <div className="community-directory-header">
            <div className="community-directory-copy">
              <span className="section-eyebrow">Community</span>
              <h1>Marketing &amp; Sales Community</h1>
              <p>Connect, learn, and grow with people who are actively building careers in marketing and sales.</p>
            </div>
            <div className="community-directory-stats">
              <div className="community-directory-stat">
                <strong>{stats.totalMembers || 0}+</strong>
                <span>Members across communities</span>
              </div>
              <div className="community-directory-stat">
                <strong>{stats.totalDiscussions || 0}</strong>
                <span>Visible discussions</span>
              </div>
              <div className="community-directory-stat">
                <strong>{stats.joinedCount}</strong>
                <span>Your joined communities</span>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      <RevealSection className="content-section" delay={0.04}>
        <SectionHeader
          eyebrow="Discussion Topics"
          title="Explore real communities built around active career conversations."
          description="Join focused groups, open live discussions, and connect with professionals who share practical advice and feedback."
          align="center"
        />
        {loading ? <p className="status-text">Loading communities...</p> : null}
        {error ? <p className="status-text error-text">{error}</p> : null}
        {actionMessage.text ? <p className={`form-status ${actionMessage.type}`}>{actionMessage.text}</p> : null}
        {!loading && communities.length ? (
          <div id="community-directory" className="community-topic-grid community-directory-grid">
            {communities.map((community, index) => {
              const Icon = communityIconMap[community.iconKey] || Users;

              return (
                <article key={community.slug} className="community-card community-topic-card community-directory-card">
                  <div className="community-directory-card-top">
                    <div className="community-card-icon">
                      <Icon size={18} />
                    </div>
                    <span className="community-card-index">0{index + 1}</span>
                  </div>
                  <h3>{community.title}</h3>
                  <p>{community.shortDescription}</p>
                  <div className="community-directory-meta community-directory-badges">
                    <span>
                      <Users size={14} />
                      {community.memberCount} members
                    </span>
                    <span>
                      <MessageSquareMore size={14} />
                      {community.discussionCount || 0} discussions
                    </span>
                    <span>
                      <CheckCircle2 size={14} />
                      {community.joined ? 'Joined' : 'Open to join'}
                    </span>
                  </div>
                  <div className="community-directory-meta">
                    <span>{community.description}</span>
                  </div>
                  <div className="community-directory-topicline">
                    <span>{community.topicLine || community.bannerText || 'Peer guidance, role-specific threads, and practical community support.'}</span>
                  </div>
                  <div className="community-directory-actions">
                    <button
                      type="button"
                      className={`secondary-button ${community.joined ? 'is-joined' : ''}`}
                      onClick={() => handleJoin(community.slug)}
                      disabled={joiningSlug === community.slug || community.joined || Boolean(error)}
                    >
                      {community.joined ? 'Joined' : joiningSlug === community.slug ? 'Joining...' : 'Join Community'}
                    </button>
                    <Link
                      to={error ? '#' : `/community/${community.slug}`}
                      className="primary-button community-join-button"
                      onClick={(event) => {
                        if (error) {
                          event.preventDefault();
                          setActionMessage({
                            type: 'error',
                            text: 'Community is in fallback mode right now. Please try again after the backend reconnects.'
                          });
                        }
                      }}
                    >
                      Open Community
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
        {!loading && !communities.length && !error ? (
          <p className="status-text">No communities available yet.</p>
        ) : null}
        {!loading && error ? (
          <p className="status-text">Showing sample communities while the live API reconnects.</p>
        ) : null}
      </RevealSection>
    </>
  );
}

export default CommunityPage;
