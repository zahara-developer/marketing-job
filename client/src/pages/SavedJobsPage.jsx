import PageHero from '../components/PageHero';
import SectionHeader from '../components/SectionHeader';
import RevealSection from '../components/RevealSection';
import RoleList from '../components/RoleList';
import { imageSources } from '../assets/images/imageSources';
import useSiteData from '../hooks/useSiteData';
import useSavedJobs from '../hooks/useSavedJobs';

function SavedJobsPage() {
  const { roles, loading } = useSiteData();
  const { savedJobs } = useSavedJobs();

  const savedRoleItems = roles.filter((role) => savedJobs.includes(role._id || role.title));

  return (
    <>
      <PageHero
        eyebrow="Saved jobs"
        title="Your bookmarked roles, ready when you are."
        description="Keep promising opportunities in one place so you can return, compare, and apply with more confidence."
        image={imageSources.about}
        imageAlt="Saved job shortlist and candidate planning"
      />

      <RevealSection className="content-section">
        <SectionHeader
          eyebrow="Bookmarks"
          title="Roles you wanted to revisit."
          description="A tidy shortlist of the opportunities you saved across the platform."
        />
        {loading ? <p className="status-text">Loading saved jobs...</p> : null}
        {!loading && savedRoleItems.length ? <RoleList roles={savedRoleItems} /> : null}
        {!loading && !savedRoleItems.length ? <p className="status-text">No bookmarked jobs yet. Save a few roles to build your shortlist.</p> : null}
      </RevealSection>
    </>
  );
}

export default SavedJobsPage;
